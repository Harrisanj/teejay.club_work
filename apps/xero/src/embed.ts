import { randomUUID } from "crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Browser, Device, Page } from "puppeteer";
import { z } from "zod";

import { s3 } from "./s3";
import { Theme } from "./themes";

type Source = {
  media: string;
  size: {
    width: number;
    height: number;
  };
  uuid: string;
};

type EmbedConfig<S extends z.ZodTypeAny = z.ZodTypeAny> = {
  schema: S;
  selector: string;
  themes: Theme[];
  devices: Device[];
  buildURL(input: z.TypeOf<S>, theme: Theme): URL;
  transformPage?(page: Page): Promise<void>;
};

export function buildConfig<S extends z.ZodTypeAny>(
  config: EmbedConfig<S>
): EmbedConfig<S> {
  return config;
}

type QueueItem<S extends z.ZodTypeAny = z.ZodTypeAny> = {
  input: z.TypeOf<S>;
  resolve(sources: Source[]): void;
  reject(error: unknown): void;
};

export class Embed<S extends z.ZodTypeAny = z.ZodTypeAny> {
  constructor(
    private readonly browser: Browser,
    private readonly config: EmbedConfig<S>
  ) {
    this.loop();
  }

  private page?: Page;

  private queue: QueueItem[] = [];

  async handle(input: z.TypeOf<S>) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        input,
        resolve,
        reject,
      });
    });
  }

  matches(input: unknown): input is z.TypeOf<S> {
    return this.config.schema.safeParse(input).success;
  }

  private async loop() {
    const item = this.queue.shift();

    if (!item) {
      setTimeout(() => this.loop(), 250);
      return;
    }

    const { input, resolve, reject } = item;

    try {
      this.page?.close();
      this.page = await this.browser.newPage();

      const sources: Source[] = [];

      for (const theme of this.config.themes) {
        const url = await this.config.buildURL(input, theme);

        for (const device of this.config.devices) {
          await this.page.emulate(device);

          await this.page.evaluateOnNewDocument(() => {
            window.addEventListener("load", () => {
              const meta = document.createElement("meta");
              meta.setAttribute("name", "viewport");
              meta.setAttribute(
                "content",
                "width=device-width, initial-scale=1.0"
              );
              document.head.append(meta);
            });
          });

          await this.page.goto(url.toString(), { waitUntil: "networkidle0" });
          // await new Promise((resolve) => setTimeout(resolve, 250));
          await this.config.transformPage?.(this.page);

          const element = await this.page.$(this.config.selector);

          if (!element) {
            throw new Error(`The ${this.config.selector} is invalid.`);
          }

          const size = await element.evaluate((element) => ({
            width: element.clientWidth,
            height: element.clientHeight,
          }));

          const mediaQueries = [`(prefers-color-scheme: ${theme})`];
          if (this.config.devices.length > 1 && device.name === "desktop") {
            mediaQueries.push("(min-width: 640px)");
          }
          const media = mediaQueries.join(" and ");

          const screenshot = await element.screenshot({
            type: "webp",
            encoding: "binary",
            omitBackground: true,
            captureBeyondViewport: false,
          });

          const uuid = randomUUID();

          const searchParams = new URLSearchParams();
          searchParams.set("type", input.type);
          searchParams.set("payload", input.payload);

          const command = new PutObjectCommand({
            Bucket: "embeds",
            Key: `${uuid}.webp`,
            Body: screenshot,
            Tagging: searchParams.toString(),
          });

          await s3.send(command);

          sources.push({ media, size, uuid });
        }
      }

      resolve(sources);
    } catch (error) {
      reject(error);
    }

    setTimeout(() => this.loop(), 0);
  }
}

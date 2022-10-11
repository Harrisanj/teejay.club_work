import { Browser, launch } from "puppeteer";

import { telegramConfig, twitterConfig, redditConfig } from "./configs";
import { Embed } from "./embed";

export class Xero {
  private embeds: Embed[];

  private constructor(private readonly browser: Browser) {
    this.embeds = [
      new Embed(browser, telegramConfig),
      new Embed(browser, twitterConfig),
      new Embed(browser, redditConfig),
    ];
  }

  public static async start() {
    const browser = await launch({
      args: ["--no-sandbox"],
    });
    return new Xero(browser);
  }

  public async stop() {
    await this.browser.close();
  }

  public handle(input: unknown) {
    for (const handler of this.embeds) {
      if (!handler.matches(input)) {
        continue;
      }
      return handler.handle(input);
    }
    throw new Error("Invalid input.");
  }
}

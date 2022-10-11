import { z } from "zod";

import { DEVICES } from "../devices";
import { buildConfig } from "../embed";
import { THEMES } from "../themes";

export const telegramConfig = buildConfig({
  schema: z.object({
    type: z.literal("telegram"),
    payload: z.string().regex(/^.+\/\d+$/),
  }),

  selector: ".tgme_widget_message_bubble",

  themes: THEMES,

  devices: DEVICES,

  buildURL(input, theme) {
    const url = new URL("https://t.me");
    url.pathname = input.payload;
    url.searchParams.set("embed", "1");
    url.searchParams.set("userpic", "false");
    url.searchParams.set("dark", theme === "dark" ? "1" : "0");
    return url;
  },

  async transformPage(page) {
    await page.evaluate(() => {
      const bubble = document.querySelector<HTMLDivElement>(
        ".tgme_widget_message_bubble"
      );
      if (bubble) {
        bubble.style.marginLeft = "0";
        bubble.style.borderRadius = "10px";
      }

      const bubbleTail = document.querySelector<HTMLDivElement>(
        ".tgme_widget_message_bubble_tail"
      );
      if (bubbleTail) {
        bubbleTail.style.display = "none";
      }
    });
  },
});

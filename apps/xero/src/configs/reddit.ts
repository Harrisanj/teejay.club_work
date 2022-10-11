import { z } from "zod";

import { DEVICES } from "../devices";
import { buildConfig } from "../embed";
import { THEMES } from "../themes";

export const redditConfig = buildConfig({
  schema: z.object({
    type: z.literal("reddit"),
    payload: z.string().regex(/^\/r\/.+\/comments\/.+\/.+\/$/),
  }),

  selector: "body > div",

  themes: THEMES,

  devices: DEVICES.filter((d) => d.name === "desktop"),

  buildURL({ payload }, theme): URL {
    const url = new URL("https://www.redditmedia.com");
    url.pathname = payload;
    url.searchParams.set("embed", "true");
    url.searchParams.set("theme", theme);
    return url;
  },

  async transformPage(page): Promise<void> {
    await page.evaluate(() => {
      const div = document.createElement("div");
      Array.from(document.body.childNodes).forEach((n) => div.appendChild(n));
      document.body.appendChild(div);
      div.className = document.body.className;
      document.body.className = "";

      const isDark = document.location.search.includes("theme=dark");

      const style = div.style;
      style.position = "relative";
      style.maxWidth = `500px`;
      const borderColor = isDark ? "#333639" : "#cfd9de";
      style.border = `1px solid ${borderColor}`;
      style.borderRadius = "10px";
      style.overflow = "hidden";

      const embedElement =
        document.querySelector<HTMLDivElement>(".reddit-embed");
      if (embedElement) {
        embedElement.style.backgroundColor = "transparent";
      }
    });
  },
});

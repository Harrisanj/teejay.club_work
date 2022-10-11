import { z } from "zod";

import { DEVICES } from "../devices";
import { buildConfig } from "../embed";
import { THEMES } from "../themes";

export const twitterConfig = buildConfig({
  schema: z.object({
    type: z.literal("twitter"),
    payload: z.string().regex(/^\d+$/),
  }),

  selector: "div:has(> article)",

  themes: THEMES,

  devices: DEVICES,

  buildURL({ payload }, theme): URL {
    const url = new URL("https://platform.twitter.com/embed/Tweet.html");
    url.searchParams.set("id", payload);
    url.searchParams.set("lang", "ru");
    url.searchParams.set("theme", theme);
    return url;
  },

  async transformPage(page): Promise<void> {
    await page.evaluate(() => {
      const article = document.querySelector("article");

      if (!article) {
        return;
      }

      function getElementByXPath(path: string) {
        return document.evaluate(
          path,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue as Element | null;
      }

      getElementByXPath("//span[text() = 'Начать читать']/../..")?.remove();

      getElementByXPath(
        "//a[@aria-label = 'Информация о рекламе в Твиттере и конфиденциальность']/*[name() = 'svg']"
      )?.remove();

      getElementByXPath("//span[text() = 'Ответить']/../../..")?.remove();

      getElementByXPath(
        "//span[starts-with(text(), 'Читать ') and contains(text(), 'ответ')]/../../../.."
      )?.remove();
    });
  },
});

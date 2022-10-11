import { Device } from "puppeteer";

export const DEVICES: Device[] = [
  {
    name: "desktop",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
    viewport: {
      width: 1024,
      height: 640,
      deviceScaleFactor: 3,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
    },
  },
  {
    name: "mobile",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    viewport: {
      width: 320,
      height: 568,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false,
    },
  },
];

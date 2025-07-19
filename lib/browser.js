const { chromium } = require("playwright");

const USERDATA_FOLDER = "./userdata";
const CONTEXT_CONFIG = {
    headless: false, // true ha nem akarod látni a böngészőt
    ignoreHTTPSErrors: true,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    javaScriptEnabled: true,
    locale: "hu-HU",
    timezoneId: "Europe/Budapest",
    permissions: ["geolocation"],
    geolocation: { latitude: 47.4979, longitude: 19.0402 }, // Budapest
  };

async function launchBrowser() {
  context = await chromium.launchPersistentContext(
    USERDATA_FOLDER,
    CONTEXT_CONFIG
  );

  // WebDriver detektálás elkerülése (optionális trükk)
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  return await context.newPage();
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

module.exports = {
  launchBrowser,
  closeBrowser
};

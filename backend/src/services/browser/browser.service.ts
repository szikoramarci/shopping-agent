import { BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

import path from 'path';

const USERDATA_FOLDER = path.resolve(__dirname, '..', 'userdata');

const CONTEXT_CONFIG = {  
  headless: false,
  ignoreHTTPSErrors: true,
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  viewport: { width: 1250, height: 750 },
  deviceScaleFactor: 1,
  javaScriptEnabled: true,
  locale: 'hu-HU',
  languages: [
    "hu-HU",
    "hu",
    "en-US",
    "en"
  ],
  timezoneId: 'Europe/Budapest',
  permissions: ['geolocation', 'notifications'],
  geolocation: { latitude: 47.4979, longitude: 19.0402 },
};

let context: BrowserContext | null = null;
let page: Page | null = null;

export async function launchBrowser(): Promise<Page> {
  if (!context) {
    chromium.use(stealth())
    context = await chromium.launchPersistentContext(USERDATA_FOLDER, CONTEXT_CONFIG);

    await context.addInitScript(() => {
      // navigator.webdriver = false
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      const originalQuery = window.navigator.permissions.query;
      // @ts-ignore
      window.navigator.permissions.query = (parameters: any) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: 'prompt' })
          : originalQuery(parameters);

      Object.defineProperty(navigator, 'languages', {
        get: () => ['hu-HU', 'hu', 'en-US', 'en'],
      });

      // chrome.runtime teljesebb spoof
      Object.defineProperty(window, 'chrome', {
        get: () => ({
          runtime: {
            // működőnek tűnő dummy metódusok
            connect: () => ({ postMessage: () => { }, on: { disconnect: () => { }, message: () => { } } }),
            sendMessage: () => { },
          },
        }),
      });

      if ('userAgentData' in navigator) {
        Object.defineProperty(navigator, 'userAgentData', {
          get: () => ({
            brands: [{ brand: 'Chromium', version: '139' }],
            mobile: false,
            platform: 'Windows',
          }),
        });
      }

    });


  }

  if (!page) {
    page = await context.newPage();
  }

  return page;
}

export async function closeBrowser(): Promise<void> {
  if (context) {
    await context.close();
    context = null;
    page = null;
  }
}

export function getActivePage(): Page | null {
  return page;
}

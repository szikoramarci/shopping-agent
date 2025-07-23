import { chromium, BrowserContext, Page } from 'playwright';
import path from 'path';

const USERDATA_FOLDER = path.resolve(__dirname, '..', 'userdata');

const CONTEXT_CONFIG = {
  headless: false,
  ignoreHTTPSErrors: true,
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  javaScriptEnabled: true,
  locale: 'hu-HU',
  timezoneId: 'Europe/Budapest',
  permissions: ['geolocation'],
  geolocation: { latitude: 47.4979, longitude: 19.0402 },
};

let context: BrowserContext | null = null;
let page: Page | null = null;

export async function launchBrowser(): Promise<Page> {
  if (!context) {
    context = await chromium.launchPersistentContext(USERDATA_FOLDER, CONTEXT_CONFIG);

    // WebDriver detekció kiiktatása
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
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

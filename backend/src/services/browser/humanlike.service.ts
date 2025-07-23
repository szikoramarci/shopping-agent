import { Page } from 'playwright';

/**
 * Várakozás emberi ritmusban (pl. gépelés vagy kattintás előtt/után)
 */
export function humanLikeDelay(min = 300, max = 800): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((res) => setTimeout(res, delay));
}

/**
 * Emberi kattintás szimulálása egy elemre
 */
export async function humanClick(page: Page, selector: string): Promise<void> {
  const el = page.locator(selector);
  const box = await el.boundingBox();

  if (!box) {
    throw new Error(`Nem található elem a megadott szelektorral: ${selector}`);
  }

  const x = box.x + Math.random() * box.width;
  const y = box.y + Math.random() * box.height;

  await page.mouse.move(x, y, { steps: 50 });
  await humanLikeDelay(200, 1000);
  await page.mouse.down();
  await humanLikeDelay(100, 200);
  await page.mouse.up();
}

/**
 * Emberi gépelés szimulálása
 */
export async function humanType(page: Page, selector: string, text: string): Promise<void> {
  await humanClick(page, selector);
  await humanLikeDelay(100, 200);
  for (const char of text) {
    await page.keyboard.type(char);
    await humanLikeDelay(50, 150);
  }
}

export async function humanClearInput(page: Page, selector: string, length: number): Promise<void> {
  await humanClick(page, selector);  
  await humanLikeDelay(100, 200);
  const randomNumber = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  const steps = length + randomNumber;
  for(let i = 0; i < steps; i++) {    
    await page.keyboard.press('Backspace');
    await humanLikeDelay(100, 300);
  }
}

export async function humanSubmit(page: Page): Promise<void> {  
  await humanLikeDelay(100, 200);
  await page.keyboard.press('Enter');
}
import { Page } from 'playwright';
import dotenv from 'dotenv';
import { Product } from '../../models/product.model';
import { Requirement } from '../../models/requirement.model';

dotenv.config();

const BASE_URL = `${process.env.BASE_URL}`;

/**
 * Termékek keresése a webáruházban
 */
export async function searchProducts(page: Page, requirement: Requirement): Promise<Product[]> {
  const url = `${BASE_URL}/search?query=${encodeURIComponent(requirement.product)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('[data-testid^="imageContainer"]');

  const results: Product[] = await page.$$eval('li[data-testid]', (items) => {
    return items.map((item) => {
      const nameEl = item.querySelector('h2 a');
      const priceContainer = item.querySelector('[class*="price"]');
      const priceEl = priceContainer?.querySelector('p');
      const unitPriceEl = priceContainer?.querySelector('p:nth-of-type(2)');
      return {
        id: item.getAttribute('data-testid') || "",
        name: nameEl?.textContent?.trim() || "",
        price: priceEl?.textContent?.trim() || "",
        unitPrice: unitPriceEl?.textContent?.trim() || "",
        url: nameEl?.getAttribute('href') || "",
      };
    });
  });

  return results;
}

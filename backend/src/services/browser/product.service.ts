import { Page } from 'playwright';
import dotenv from 'dotenv';
import { Product } from '../../models/product.model';
import { Requirement } from '../../models/requirement.model';
import { humanClearInput, humanClick, humanLikeDelay, humanSubmit, humanType } from './humanlike.service';
import { Recommendation } from '../../models/recommendation.model';

dotenv.config();

const BASE_URL = `${process.env.BASE_URL}`;

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

export async function addRecommendationToCart(page: Page, recommendation: Recommendation) {
    const requiredAmount = recommendation.amount;
    const inputSelector = 'input#quantity-controls-' + recommendation.id;    
    const currentValue = await page.$eval(inputSelector, (el) => (el as HTMLInputElement).value);
    console.log(recommendation, currentValue)
    
   /* await humanLikeDelay(200, 500);
    await humanClearInput(page, inputSelector, currentValue.length);
    await humanType(page, inputSelector, requiredAmount.toString());
    await humanLikeDelay(200, 400);
    await humanSubmit(page);*/
     await page.fill(inputSelector, requiredAmount.toString());    
     await humanSubmit(page);
}

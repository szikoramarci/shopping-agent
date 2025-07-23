import { Page } from 'playwright';
import dotenv from 'dotenv';
import { humanClick, humanLikeDelay, humanType } from './humanlike.service';

dotenv.config();

const LOGIN_URL = `${process.env.LOGIN_URL}`;
const LOGIN_EMAIL = `${process.env.LOGIN_EMAIL}`;
const LOGIN_PASSWORD = `${process.env.LOGIN_PASSWORD}`;

/**
 * Belépés az oldalra (ha még nem vagyunk bejelentkezve)
 */
export async function login(page: Page): Promise<void> {
    if (await isLoggedIn(page)) return;

    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await humanLikeDelay(500, 1000);

    await humanType(page, 'input[type="email"]', LOGIN_EMAIL);
    await humanType(page, 'input[type="password"]', LOGIN_PASSWORD);
    await humanClick(page, 'button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    const loggedIn = await isLoggedIn(page);
    if (!loggedIn) {
        throw new Error('❌ Login failed.');
    }

    await humanLikeDelay(500, 1000);
}

/**
 * Ellenőrzi, hogy be vagyunk-e jelentkezve
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await humanLikeDelay(500, 1000);

    const logoutLink = page.locator('a[href*="logout"]');
    const count = await logoutLink.count();

    return count > 0;
}

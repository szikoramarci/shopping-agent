const { humanLikeDelay, humanType, humanClick } = require("./human");
require('dotenv').config();

const LOGIN_URL = `${process.env.LOGIN_URL}`;
const LOGIN_EMAIL = `${process.env.LOGIN_EMAIL}`;
const LOGIN_PASSWORD = `${process.env.LOGIN_PASSWORD}`;

async function login(page) {
  await page.goto(`${LOGIN_URL}`, { waitUntil: "domcontentloaded" });
  await humanLikeDelay(500, 1000);

  await humanType(page, 'input[type="email"]', LOGIN_EMAIL);
  await humanType(page, 'input[type="password"]', LOGIN_PASSWORD);
  await humanClick(page, 'button[type="submit"]');

  await page.waitForNavigation({ waitUntil: "networkidle" });

  const loggedIn = await isLoggedIn(page);
  if (!loggedIn) {
    throw new Error("❌ Login failed.");
  }

  await humanLikeDelay(500, 1000);
}

async function isLoggedIn(page) {
  await page.goto(`${LOGIN_URL}`, { waitUntil: "domcontentloaded" });
  await humanLikeDelay(500, 1000);
  const logoutLink = await page.locator('a[href*="logout"]');  
  return await logoutLink.count() > 0;
}

module.exports = {
  isLoggedIn,
  login,
};

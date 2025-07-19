const { humanLikeDelay, humanType, humanClick } = require("./human");

const LOGIN_URL = "https://www.tesco.hu/account/login/hu-HU";

async function login(page, email, password) {
  await page.goto(`${LOGIN_URL}`, { waitUntil: "domcontentloaded" });
  await humanLikeDelay(500, 1000);

  await humanType(page, 'input[type="email"]', email);
  await humanType(page, 'input[type="password"]', password);
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

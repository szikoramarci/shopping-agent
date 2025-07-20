require('dotenv').config();

const BASE_URL = `${process.env.BASE_URL}`;

async function searchProducts(page, query) {
  await page.goto(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector('[data-testid^="imageContainer"]');

  const results = await page.$$eval("li[data-testid]", (items) => {
    return items.map((item) => {
      const nameEl = item.querySelector("h2 a");
      const priceContainer = item.querySelector('[class*="price"]');
      const priceEl = priceContainer?.querySelector("p");
      const unitPriceEl = priceContainer?.querySelector("p:nth-of-type(2)");
      return {
        id: item.getAttribute("data-testid"),
        name: nameEl?.innerText.trim() || null,
        price: priceEl?.innerText.trim() || null,
        unitPrice: unitPriceEl?.innerText.trim() || null,
        url: nameEl?.getAttribute("href") || null,
      };
    });
  });

  return results;
}

module.exports = {
  searchProducts,
};

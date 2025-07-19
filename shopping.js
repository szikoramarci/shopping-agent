const { isLoggedIn, login } = require("./lib/auth.js");
const { launchBrowser } = require("./lib/browser.js");
const { dialogLoop } = require("./lib/dialog.js");
const { searchProducts } = require("./lib/tesco.js");
const { selectPerfectProduct } = require("./lib/agent.js");

const email = "simabeats@gmail.com";
const password = "m13DPaxnBygEdpM8WhNH";

(async () => {
  const page = await launchBrowser();
  const loggedIn = await isLoggedIn(page);
  if (!loggedIn) {
    await login(page, email, password);
  }

  await dialogLoop(async (list) => {
    await list.forEach(async (requirement) => {
      const products = await searchProducts(page, requirement.product);
      const sortedProducts = await selectPerfectProduct(requirement, products);
      sortedProducts.forEach((product) => {
        const originalProduct = products.find((p) => p.id === product.id);
        console.log({
          id: product.id,
          name: originalProduct.name,
          price: originalProduct.price,
          unitPrice: originalProduct.unitPrice,
          url: originalProduct.url,
          amount: product.amount,
          unit: product.unit,
          score: product.score,
          reason: product.reason,
        });
      });
    });
  });
})();

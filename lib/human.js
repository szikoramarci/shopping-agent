function humanLikeDelay(min = 300, max = 800) {
  const delay = min + Math.random() * (max - min);
  return new Promise((res) => setTimeout(res, delay));
}

async function humanType(page, selector, text) {
  await humanClick(page, selector);
  await humanLikeDelay(100, 200);
  for (const char of text) {
    await page.keyboard.type(char);
    await humanLikeDelay(50, 150);
  }
}

async function humanClick(page, selector) {
  const el = await page.locator(selector);
  const box = await el.boundingBox();
  const x = box.x + Math.random() * box.width;
  const y = box.y + Math.random() * box.height;

  await page.mouse.move(x, y, { steps: 50 });
  await humanLikeDelay(200, 1000);
  await page.mouse.down();
  await humanLikeDelay(100, 200);
  await page.mouse.up();
}

module.exports = {
  humanLikeDelay,
  humanType,
  humanClick,
};

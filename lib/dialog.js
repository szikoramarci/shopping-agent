const readline = require("readline");
const { parseShoppingList } = require("./agent.js");

async function promptInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function summarizeList(list) {
  return list
    .map((item) => `${item.amount} ${item.unit} ${item.product}`)
    .join(", ");
}

async function dialogLoop(callback) {
  while (true) {
    const userText = await promptInput("✍️ Írd be a rendelésed: ");
    if (!userText) continue;

    try {
      const list = await parseShoppingList(userText);
      const summary = summarizeList(list);
      const confirm = await promptInput(
        `🤖 Ezeket értettem: ${summary}. Mehet így? (i/n): `
      );

      if (confirm.toLowerCase() === "i") {        
        await callback(list);
        console.log("✅ Rögzítve:", list);
      } else {
        console.log("🔁 Oké, próbáld újra.");
      }
    } catch (err) {
      console.error("❌ Hiba az értelmezésnél:", err.message);
    }
  }
}

module.exports = {
    dialogLoop
};
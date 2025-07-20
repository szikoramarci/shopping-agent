const fs = require("fs");
const path = require("path");
require('dotenv').config();

const OPENROUTER_API_KEY = `${process.env.OPENROUTER_API_KEY}`;
const OPENROUTER_AGENT_REFERER = `${process.env.OPENROUTER_AGENT_REFERER}`;

const AI_MODEL = `google/gemini-2.0-flash-001`;

const SHOPPING_LIST_PROMPT_FILE = "shopping-list-system-prompt.txt";
const SELECT_PRODUCT_PROMPT_FILE = "select-product-system-prompt.txt";

async function callOpenRouter(systemPrompt, userPrompt) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": `${OPENROUTER_AGENT_REFERER}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.choices[0].message.content;
}

async function parseShoppingList(inputText) {
  const systemPrompt = loadPrompt(SHOPPING_LIST_PROMPT_FILE);

  try {
    const rawOutput = await callOpenRouter(systemPrompt, inputText);
    console.log("LLM válasz:", rawOutput);
    return cleanLLMJson(rawOutput);
  } catch (err) {
    console.error(
      "❌ JSON parse hiba vagy LLM válaszértelmezés hiba:",
      err.message
    );
  }
}

async function selectPerfectProduct(requirement, products) {
    const systemPrompt = loadPrompt(SELECT_PRODUCT_PROMPT_FILE);
    const inputText = `REQUIREMENT: ${JSON.stringify(requirement)}. PRODUCTS: ${JSON.stringify(products)}.`;
  
    try {
      const rawOutput = await callOpenRouter(systemPrompt, inputText);
      console.log("LLM válasz:", rawOutput);
      return cleanLLMJson(rawOutput);
    } catch (err) {
      console.error(
        "❌ JSON parse hiba vagy LLM válaszértelmezés hiba:",
        err.message
      );
    }
  }
  

function loadPrompt(filename) {
  const fullPath = path.join(__dirname, "..", "prompts", filename);
  return fs.readFileSync(fullPath, "utf-8").trim();
}

function cleanLLMJson(raw) {
    const cleaned = raw
      .replace(/^\s*```json\s*/i, "")
      .replace(/^\s*json\s*/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
  
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("❌ JSON parse error:", e.message);
      throw new Error("Nem sikerült JSON-ná alakítani a választ.");
    }
  }

module.exports = {
  parseShoppingList,
  selectPerfectProduct
};

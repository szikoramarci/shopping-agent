import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Requirement } from '../../models/requirement.model';
import { Product } from '../../models/product.model';
import { Recommendation } from '../../models/recommendation.model';
dotenv.config();

const OPENROUTER_API_KEY = `${process.env.OPENROUTER_API_KEY}`;
const OPENROUTER_AGENT_REFERER = `${process.env.OPENROUTER_AGENT_REFERER}`;
const AI_MODEL = `google/gemini-2.0-flash-001`;

const SHOPPING_LIST_PROMPT_FILE = "shopping-list-system-prompt.txt";
const SELECT_PRODUCT_PROMPT_FILE = "select-product-system-prompt.txt";

export async function parseShoppingList(inputText: string): Promise<Requirement[]> {
  const systemPrompt = loadPrompt(SHOPPING_LIST_PROMPT_FILE);
  const rawOutput = await callOpenRouter(systemPrompt, inputText);
  console.log("LLM válasz:", rawOutput);
  return cleanLLMJson(rawOutput);
}

export async function generateRecommendations(requirement: Requirement, products: Product[]): Promise<Recommendation[]> {
  const systemPrompt = loadPrompt(SELECT_PRODUCT_PROMPT_FILE);
  const inputText = `REQUIREMENT: ${JSON.stringify(requirement)}. PRODUCTS: ${JSON.stringify(products)}.`;
  const rawOutput = await callOpenRouter(systemPrompt, inputText);
  console.log("LLM válasz:", rawOutput);
  return cleanLLMJson(rawOutput);
}

function loadPrompt(filename: string): string {
  const fullPath = path.join(__dirname, ".", "prompts", filename);
  return fs.readFileSync(fullPath, "utf-8").trim();
}

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": `${OPENROUTER_AGENT_REFERER}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const data = await response.json();  
  console.log("OpenRouter válasz:", data);
  return data.choices[0].message.content;
}

function cleanLLMJson(raw: string): any {
  const cleaned = raw
    .replace(/^\s*```json\s*/i, "")
    .replace(/^\s*json\s*/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e: any) {
    console.error("❌ JSON parse error:", e.message);
    throw new Error("Nem sikerült JSON-ná alakítani a választ.");
  }
}

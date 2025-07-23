import { Requirement } from "../../models/requirement.model";
import { selectPerfectProduct } from "../ai/ai.service";
import { addToCart } from "../browser/cart.service";

const queue: Requirement[] = [];
let isProcessing = false;

export function addToQueue(requirements: Requirement[]) {
  queue.push(...requirements);
  if (!isProcessing) {
    processNext();
  }
}

async function processNext() {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const current = queue.shift() as Requirement;
  try {
    console.log('📦 Feldolgozás megkezdve:', current);    
    await addToCart(current);
    console.log('✅ Feldolgozás kész:', current);
  } catch (error) {
    console.error('❌ Hiba a feldolgozás során:', error);
  } finally {
    processNext();
  }
}
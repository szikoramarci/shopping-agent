import { Requirement } from "../../models/requirement.model";
import { selectPerfectProduct } from "../ai/ai.service";
import { login } from "./auth.service";
import { launchBrowser } from "./browser.service";
import { searchProducts } from "./product.service";

export async function addToCart(requirement: Requirement) {
    const page = await launchBrowser();
    await login(page);
    
    const products = await searchProducts(page, requirement);
    const perfectProduct = await selectPerfectProduct(requirement, products);
    console.log(perfectProduct)
}
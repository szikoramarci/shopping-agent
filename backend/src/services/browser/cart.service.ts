import { Requirement } from "../../models/requirement.model";
import { generateRecommendations } from "../ai/ai.service";
import { login } from "./auth.service";
import { launchBrowser } from "./browser.service";
import { addRecommendationToCart, searchProducts } from "./product.service";

export async function addToCart(requirement: Requirement) {
    const page = await launchBrowser();
    await login(page);
    
    const products = await searchProducts(page, requirement);
    const recommendations = await generateRecommendations(requirement, products);
    if (recommendations && recommendations.length > 0) {
        await addRecommendationToCart(page, recommendations[0])
    }
}
import { QueueItem } from "../../models/queue.item.model";
import { Requirement } from "../../models/requirement.model";
import { generateRecommendations } from "../ai/ai.service";
import { login } from "./auth.service";
import { launchBrowser } from "./browser.service";
import { addRecommendationToCart, searchProducts } from "./product.service";

export async function addToCart(queueItem: QueueItem) {
    const page = await launchBrowser();
    await login(page);
    
    const products = await searchProducts(page, queueItem.requirement);
    const recommendations = await generateRecommendations(queueItem.requirement, products);
    if (recommendations && recommendations.length > 0) {
        queueItem.recommendation = recommendations[0];
        queueItem.product = products.find(product => product.id === recommendations[0].id);
        await addRecommendationToCart(page, recommendations[0])
    }
}
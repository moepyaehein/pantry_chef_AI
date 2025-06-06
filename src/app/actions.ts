'use server';

import { suggestRecipe as suggestRecipeFlow, type SuggestRecipeInput, type SuggestRecipeOutput } from '@/ai/flows/suggest-recipe';
import { suggestSubstitution as suggestSubstitutionFlow, type SuggestSubstitutionInput, type SuggestSubstitutionOutput } from '@/ai/flows/suggest-substitution';

export async function getRecipeSuggestionAction(input: SuggestRecipeInput): Promise<SuggestRecipeOutput> {
  try {
    const recipe = await suggestRecipeFlow(input);
    if (!recipe.dishName || !recipe.description || !recipe.ingredientsNeeded || !recipe.instructions) {
      // recipeImageUri is optional, so not checked here
      throw new Error("AI failed to generate a complete recipe text. Please try again.");
    }
    return recipe;
  } catch (error) {
    console.error("Error in getRecipeSuggestionAction:", error);
    // It's better to rethrow the original error if it's an Error instance or provide a more generic message
    throw new Error(error instanceof Error ? error.message : "Failed to get recipe suggestion due to an unknown error.");
  }
}

export async function getSubstitutionSuggestionAction(input: SuggestSubstitutionInput): Promise<SuggestSubstitutionOutput> {
  try {
    const substitution = await suggestSubstitutionFlow(input);
     if (!substitution.suggestedSubstitution || !substitution.reason) {
      throw new Error("AI failed to generate a complete substitution. Please try again.");
    }
    return substitution;
  } catch (error) {
    console.error("Error in getSubstitutionSuggestionAction:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get substitution suggestion due to an unknown error.");
  }
}

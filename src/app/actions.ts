'use server';

import { suggestRecipe as suggestRecipeFlow, type SuggestRecipeInput, type SuggestRecipeOutput } from '@/ai/flows/suggest-recipe';
import { suggestSubstitution as suggestSubstitutionFlow, type SuggestSubstitutionInput, type SuggestSubstitutionOutput } from '@/ai/flows/suggest-substitution';
import type { Recipe } from '@/types';

export async function getRecipeSuggestionAction(input: SuggestRecipeInput): Promise<Recipe> {
  try {
    const recipeDetails = await suggestRecipeFlow(input);
    if (!recipeDetails.dishName || !recipeDetails.description || !recipeDetails.ingredientsNeeded || !recipeDetails.instructions) {
      // recipeImageUri is optional, so not checked here
      throw new Error("AI failed to generate a complete recipe text. Please try again.");
    }
    // Add a simple unique ID for client-side management
    const recipeWithId: Recipe = { 
      ...recipeDetails, 
      id: `${recipeDetails.dishName.replace(/\s+/g, '-')}-${Date.now()}` 
    };
    return recipeWithId;
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

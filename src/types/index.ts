import type { SuggestRecipeOutput as GenkitRecipeOutput } from '@/ai/flows/suggest-recipe';
import type { SuggestSubstitutionOutput as GenkitSubstitutionOutput } from '@/ai/flows/suggest-substitution';

export interface Recipe extends GenkitRecipeOutput {
  id: string; // Add an id for local storage and list keys
  recipeImageUri?: string; // Ensure this property is part of the type
}

export interface Substitution extends GenkitSubstitutionOutput {}

export interface CookingTip {
  id: string;
  title: string;
  description: string;
  category?: string;
  icon?: React.ElementType;
}

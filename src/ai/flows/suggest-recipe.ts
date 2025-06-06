// src/ai/flows/suggest-recipe.ts
'use server';
/**
 * @fileOverview A recipe suggestion AI agent based on user-provided ingredients.
 *
 * - suggestRecipe - A function that suggests a recipe based on available ingredients.
 * - SuggestRecipeInput - The input type for the suggestRecipe function.
 * - SuggestRecipeOutput - The return type for the suggestRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateRecipeImage, type GenerateRecipeImageInput } from './generate-recipe-image-flow';

const SuggestRecipeInputSchema = z.object({
  userIngredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has available.'),
});
export type SuggestRecipeInput = z.infer<typeof SuggestRecipeInputSchema>;

const SuggestRecipeOutputSchema = z.object({
  dishName: z.string().describe('The name of the suggested dish.'),
  description: z.string().describe('A short description of the dish.'),
  ingredientsNeeded: z
    .string()
    .describe('A list of ingredients needed for the recipe, including substitutions if needed.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the dish.'),
  recipeImageUri: z.string().optional().describe("A data URI of a generated image for the recipe. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type SuggestRecipeOutput = z.infer<typeof SuggestRecipeOutputSchema>;

export async function suggestRecipe(input: SuggestRecipeInput): Promise<SuggestRecipeOutput> {
  return suggestRecipeFlow(input);
}

const recipePrompt = ai.definePrompt({
  name: 'suggestRecipePrompt',
  input: {schema: SuggestRecipeInputSchema},
  // Output schema here defines the text part of the recipe. Image URI will be added later.
  output: {schema: z.object({
    dishName: SuggestRecipeOutputSchema.shape.dishName,
    description: SuggestRecipeOutputSchema.shape.description,
    ingredientsNeeded: SuggestRecipeOutputSchema.shape.ingredientsNeeded,
    instructions: SuggestRecipeOutputSchema.shape.instructions,
  })},
  prompt: `You are a helpful and creative cooking assistant. The user will input a list of ingredients they currently have. Your job is to recommend a dish they can cook using mostly those ingredients. Provide the name of the dish, a short description, and a simple recipe. Avoid suggesting dishes that require too many ingredients the user doesn't have.

If a key ingredient is missing, suggest a close substitute. Be creative but realistic.

Input (User's ingredients): {{{userIngredients}}}

Output format:
- Dish Name:
- Description:
- Ingredients Needed (with substitutions if needed):
- Step-by-step Instructions:`,
});

const suggestRecipeFlow = ai.defineFlow(
  {
    name: 'suggestRecipeFlow',
    inputSchema: SuggestRecipeInputSchema,
    outputSchema: SuggestRecipeOutputSchema,
  },
  async (input) => {
    const {output: recipeDetails} = await recipePrompt(input);

    if (!recipeDetails) {
      throw new Error('Failed to generate recipe details.');
    }

    let imageUri: string | undefined = undefined;
    if (recipeDetails.dishName && recipeDetails.description) {
      try {
        const imageInput: GenerateRecipeImageInput = {
          dishName: recipeDetails.dishName,
          description: recipeDetails.description,
        };
        const imageOutput = await generateRecipeImage(imageInput);
        imageUri = imageOutput.imageDataUri;
      } catch (err) {
        console.error("Image generation failed, proceeding without image.", err);
        // imageUri will remain undefined
      }
    }
    
    return {
      ...recipeDetails,
      recipeImageUri: imageUri,
    };
  }
);

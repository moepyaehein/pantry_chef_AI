'use server';
/**
 * @fileOverview A Genkit flow for generating images of recipes.
 *
 * - generateRecipeImage - A function that generates an image for a given dish.
 * - GenerateRecipeImageInput - The input type for the generateRecipeImage function.
 * - GenerateRecipeImageOutput - The return type for the generateRecipeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeImageInputSchema = z.object({
  dishName: z.string().describe('The name of the dish.'),
  description: z.string().describe('A short description of the dish to help visualize it.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageDataUri: z.string().optional().describe("A data URI of the generated image for the recipe. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

export async function generateRecipeImage(input: GenerateRecipeImageInput): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

const generateRecipeImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: `Generate a vibrant and appetizing image of a dish called "${input.dishName}". The dish is described as: "${input.description}". Focus on a clean, well-lit presentation suitable for a recipe card.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
           safetySettings: [ // Add safety settings to be less restrictive for food images
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        },
      });
      
      if (media?.url) {
        return { imageDataUri: media.url };
      }
      return { imageDataUri: undefined };
    } catch (error) {
      console.error('Error generating recipe image:', error);
      return { imageDataUri: undefined }; // Return undefined on error
    }
  }
);

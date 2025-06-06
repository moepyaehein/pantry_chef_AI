'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting ingredient substitutions.
 *
 * - suggestSubstitution - A function that takes a missing ingredient and suggests a substitute.
 * - SuggestSubstitutionInput - The input type for the suggestSubstitution function.
 * - SuggestSubstitutionOutput - The return type for the suggestSubstitution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSubstitutionInputSchema = z.object({
  missingIngredient: z.string().describe('The ingredient that needs a substitute.'),
  availableIngredients: z.array(z.string()).optional().describe('A list of ingredients the user has available.')
});
export type SuggestSubstitutionInput = z.infer<typeof SuggestSubstitutionInputSchema>;

const SuggestSubstitutionOutputSchema = z.object({
  suggestedSubstitution: z.string().describe('A suggested substitute for the missing ingredient.'),
  reason: z.string().describe('The reasoning behind the suggested substitution.'),
});
export type SuggestSubstitutionOutput = z.infer<typeof SuggestSubstitutionOutputSchema>;

export async function suggestSubstitution(input: SuggestSubstitutionInput): Promise<SuggestSubstitutionOutput> {
  return suggestSubstitutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSubstitutionPrompt',
  input: {schema: SuggestSubstitutionInputSchema},
  output: {schema: SuggestSubstitutionOutputSchema},
  prompt: `You are a helpful cooking assistant. A user is missing the ingredient "{{missingIngredient}}". Suggest a suitable substitute ingredient. Consider the user's available ingredients: {{#if availableIngredients}}{{#each availableIngredients}}{{{this}}}, {{/each}}{{else}}None{{/if}}. Provide a brief reason for your suggestion.

Output format:
{
  "suggestedSubstitution": "suggested substitute",
  "reason": "why it is a good substitute"
}
`,
});

const suggestSubstitutionFlow = ai.defineFlow(
  {
    name: 'suggestSubstitutionFlow',
    inputSchema: SuggestSubstitutionInputSchema,
    outputSchema: SuggestSubstitutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

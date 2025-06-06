
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle, ChefHat, HelpCircle, Replace } from 'lucide-react';
import { RecipeCard } from '@/components/pantry-chef/RecipeCard';
import type { Recipe as RecipeType, Substitution as SubstitutionType } from '@/types';
import { getRecipeSuggestionAction, getSubstitutionSuggestionAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { useSavedRecipes } from '@/hooks/useSavedRecipes';

const recipeFormSchema = z.object({
  userIngredients: z.string().min(3, { message: "Please list at least one ingredient." }),
});
type RecipeFormData = z.infer<typeof recipeFormSchema>;

const substitutionFormSchema = z.object({
  missingIngredient: z.string().min(2, { message: "Missing ingredient name is too short." }),
  availableIngredients: z.string().optional(),
});
type SubstitutionFormData = z.infer<typeof substitutionFormSchema>;

export default function HomePage() {
  const { toast } = useToast();
  const { addRecipe, removeRecipe, isRecipeSaved } = useSavedRecipes();

  const [suggestedRecipe, setSuggestedRecipe] = useState<RecipeType | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  const [substitution, setSubstitution] = useState<SubstitutionType | null>(null);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const recipeForm = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: { userIngredients: "" },
  });

  const substitutionForm = useForm<SubstitutionFormData>({
    resolver: zodResolver(substitutionFormSchema),
    defaultValues: { missingIngredient: "", availableIngredients: "" },
  });

  const handleRecipeSubmit: SubmitHandler<RecipeFormData> = async (data) => {
    setIsRecipeLoading(true);
    setRecipeError(null);
    setSuggestedRecipe(null);
    try {
      const result = await getRecipeSuggestionAction(data);
      setSuggestedRecipe(result); // result already includes an ID from the action
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setRecipeError(errorMessage);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsRecipeLoading(false);
    }
  };

  const handleSubstitutionSubmit: SubmitHandler<SubstitutionFormData> = async (data) => {
    setIsSubLoading(true);
    setSubError(null);
    setSubstitution(null);
    try {
      const result = await getSubstitutionSuggestionAction({
        missingIngredient: data.missingIngredient,
        availableIngredients: data.availableIngredients?.split(',').map(s => s.trim()).filter(Boolean) || [],
      });
      setSubstitution(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      setSubError(errorMessage);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsSubLoading(false);
    }
  };

  const handleSaveToggle = (recipe: RecipeType) => {
    if (isRecipeSaved(recipe.id)) {
      removeRecipe(recipe.id);
      toast({ title: "Recipe Unsaved", description: `${recipe.dishName} removed from your saved recipes.` });
    } else {
      addRecipe(recipe);
      toast({ title: "Recipe Saved!", description: `${recipe.dishName} added to your saved recipes.` });
    }
    // Force re-render of the recipe card to update the save icon
    setSuggestedRecipe(prev => prev ? {...prev} : null); 
  };

  return (
    <div className="space-y-12 md:space-y-16">
      <header className="text-center py-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl text-primary mb-4">
          AI chef by Moe
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your pantry staples into delightful dishes. Enter your ingredients and let our AI chef inspire your next meal!
        </p>
      </header>

      <section id="recipe-suggestion">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2"><ChefHat size={32} /> Suggest a Recipe</CardTitle>
            <CardDescription>Tell us what ingredients you have, and we'll suggest a recipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...recipeForm}>
              <form onSubmit={recipeForm.handleSubmit(handleRecipeSubmit)} className="space-y-6">
                <FormField
                  control={recipeForm.control}
                  name="userIngredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Your Ingredients</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., chicken breast, broccoli, soy sauce, rice"
                          className="min-h-[120px] text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isRecipeLoading} className="w-full sm:w-auto text-base py-3 px-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isRecipeLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Get Recipe Suggestion
                </Button>
              </form>
            </Form>

            {recipeError && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{recipeError}</AlertDescription>
              </Alert>
            )}
            {suggestedRecipe && !isRecipeLoading && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-2xl font-headline mb-4">Voila! Here's a suggestion:</h3>
                <RecipeCard 
                  recipe={suggestedRecipe} 
                  isSaved={isRecipeSaved(suggestedRecipe.id)}
                  onSaveToggle={handleSaveToggle}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="ingredient-substitution">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2"><Replace size={32} /> Find a Substitute</CardTitle>
            <CardDescription>Missing an ingredient for a recipe? We can suggest a substitute.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...substitutionForm}>
              <form onSubmit={substitutionForm.handleSubmit(handleSubstitutionSubmit)} className="space-y-6">
                <FormField
                  control={substitutionForm.control}
                  name="missingIngredient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Missing Ingredient</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., butter, flour, lemon" className="text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={substitutionForm.control}
                  name="availableIngredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Other Ingredients You Have (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., olive oil, cornstarch, lime (comma-separated)" className="text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubLoading} className="w-full sm:w-auto text-base py-3 px-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isSubLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <HelpCircle className="mr-2 h-5 w-5" />}
                  Suggest Substitute
                </Button>
              </form>
            </Form>

            {subError && (
              <Alert variant="destructive" className="mt-6">
                 <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{subError}</AlertDescription>
              </Alert>
            )}
            {substitution && !isSubLoading && (
              <Alert className="mt-6 border-primary bg-primary/5">
                 <Sparkles className="h-5 w-5 text-primary" />
                <AlertTitle className="text-xl text-primary font-headline">Substitution Suggestion</AlertTitle>
                <AlertDescription className="text-base text-foreground space-y-2 mt-2">
                  <p><strong>Substitute:</strong> {substitution.suggestedSubstitution}</p>
                  <p><strong>Reason:</strong> {substitution.reason}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


"use client";

import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { RecipeCard } from '@/components/pantry-chef/RecipeCard';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Inbox } from 'lucide-react';
import Link from 'next/link';
import type { Recipe } from '@/types';

export default function SavedRecipesPage() {
  const { savedRecipes, removeRecipe, isRecipeSaved, isLoading } = useSavedRecipes();
  const { toast } = useToast();

  const handleToggleSave = (recipe: Recipe) => {
    // On this page, toggle means remove if it's saved.
    // If by some chance it's not "isSaved" (though it should be, to be in this list),
    // this function would effectively do nothing or could be adapted to save it again.
    // For simplicity, we assume if it's on this page, 'toggling' it off means removing.
    if (isRecipeSaved(recipe.id)) {
      removeRecipe(recipe.id);
      toast({ title: "Recipe Removed", description: `${recipe.dishName} has been removed from your saved recipes.` });
    }
    // No "else" needed as recipes are added from the main page.
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl">Loading your saved recipes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center py-6">
        <h1 className="font-headline text-4xl sm:text-5xl text-primary">Your Saved Recipes</h1>
        <p className="text-lg text-muted-foreground mt-2">
          All your favorited culinary creations, ready for your next cooking adventure.
        </p>
      </header>

      {savedRecipes.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg shadow-md">
          <Inbox size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline mb-2">No Saved Recipes Yet</h2>
          <p className="text-muted-foreground mb-6">
            Looks like your recipe book is empty. Go find some delicious recipes to save!
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/">Find Recipes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {savedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={true} // Recipes on this page are inherently saved
              onSaveToggle={handleToggleSave} // This will effectively act as "unsave"
              className="transform hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
}

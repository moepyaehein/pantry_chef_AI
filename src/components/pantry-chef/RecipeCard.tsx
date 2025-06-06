// src/components/pantry-chef/RecipeCard.tsx
"use client";

import type { Recipe } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Utensils, ListChecks, CookingPot, Trash2, BookmarkPlus, BookmarkMinus, AlertCircle, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';


interface RecipeCardProps {
  recipe: Recipe;
  isSaved?: boolean;
  onSaveToggle?: (recipe: Recipe) => void;
  onRemove?: (recipeId: string) => void;
  className?: string;
}

const parseMultilineString = (text: string): string[] => {
  if (!text) return [];
  return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};

export function RecipeCard({ recipe, isSaved, onSaveToggle, onRemove, className }: RecipeCardProps) {
  const ingredientsList = parseMultilineString(recipe.ingredientsNeeded);
  const instructionsList = parseMultilineString(recipe.instructions);
  const [imageError, setImageError] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(recipe.id);

  useEffect(() => {
    // Reset imageError when the recipe (specifically its image URI or ID) changes
    if (recipe.id !== currentRecipeId) {
      setImageError(false);
      setCurrentRecipeId(recipe.id);
    }
  }, [recipe.id, recipe.recipeImageUri, currentRecipeId]);

  const placeholderImage = "https://placehold.co/600x300.png";
  const imageSrc = recipe.recipeImageUri && !imageError ? recipe.recipeImageUri : placeholderImage;
  const showFallbackIcon = imageError || (!recipe.recipeImageUri && imageSrc === placeholderImage);

  return (
    <Card className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <CardTitle className="font-headline text-2xl text-primary mb-1 flex items-center gap-2">
              <CookingPot size={28} className="inline-block" /> {recipe.dishName}
            </CardTitle>
            <CardDescription className="font-body text-base">{recipe.description}</CardDescription>
          </div>
          <div className="flex-shrink-0 ml-2">
            {onSaveToggle && (
              <Button variant="ghost" size="icon" onClick={() => onSaveToggle(recipe)} aria-label={isSaved ? "Unsave recipe" : "Save recipe"}>
                {isSaved ? <BookmarkMinus className="text-accent h-6 w-6" /> : <BookmarkPlus className="h-6 w-6" />}
              </Button>
            )}
            {onRemove && (
              <Button variant="ghost" size="icon" onClick={() => onRemove(recipe.id)} aria-label="Remove recipe">
                <Trash2 className="text-destructive h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6 aspect-[2/1] w-full rounded-md overflow-hidden bg-muted flex items-center justify-center relative">
          <Image
            src={imageSrc}
            alt={`Image of ${recipe.dishName}`}
            data-ai-hint={recipe.recipeImageUri ? "generated dish" : "food placeholder"}
            width={600}
            height={300}
            className="object-cover w-full h-full"
            onError={() => {
              if (recipe.recipeImageUri) { // Only set error if it was trying to load a generated image
                setImageError(true);
              }
            }}
            priority={!!recipe.recipeImageUri} // Prioritize loading generated images
          />
           {showFallbackIcon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <ImageOff size={48} className="text-slate-400" />
            </div>
          )}
        </div>

        <Accordion type="single" collapsible defaultValue="ingredients" className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger className="text-lg font-headline hover:text-accent transition-colors">
              <div className="flex items-center gap-2">
                <Utensils size={20} /> Ingredients
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {ingredientsList.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 font-body text-sm">
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                 <p className="text-muted-foreground font-body text-sm flex items-center gap-2"><AlertCircle size={16} /> No ingredients listed.</p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger className="text-lg font-headline hover:text-accent transition-colors">
              <div className="flex items-center gap-2">
                <ListChecks size={20} /> Instructions
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {instructionsList.length > 0 ? (
                <ol className="list-decimal pl-5 space-y-2 font-body text-sm">
                  {instructionsList.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground font-body text-sm flex items-center gap-2"><AlertCircle size={16} /> No instructions provided.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      { (onSaveToggle || onRemove) && <CardFooter className="pt-4 mt-auto" /> /* Added mt-auto and pt-4 for spacing */}
    </Card>
  );
}

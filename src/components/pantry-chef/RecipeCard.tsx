"use client";

import type { Recipe } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Utensils, ListChecks, CookingPot, Trash2, BookmarkPlus, BookmarkMinus, AlertCircle } from 'lucide-react';
import Image from 'next/image';

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

  return (
    <Card className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl text-primary mb-1 flex items-center gap-2">
              <CookingPot size={28} className="inline-block" /> {recipe.dishName}
            </CardTitle>
            <CardDescription className="font-body text-base">{recipe.description}</CardDescription>
          </div>
          {onSaveToggle && (
            <Button variant="ghost" size="icon" onClick={() => onSaveToggle(recipe)} aria-label={isSaved ? "Unsave recipe" : "Save recipe"}>
              {isSaved ? <BookmarkMinus className="text-accent" /> : <BookmarkPlus />}
            </Button>
          )}
          {onRemove && (
            <Button variant="ghost" size="icon" onClick={() => onRemove(recipe.id)} aria-label="Remove recipe">
              <Trash2 className="text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Image
            src={`https://placehold.co/600x300.png`}
            alt={`Image of ${recipe.dishName}`}
            data-ai-hint="cooked dish"
            width={600}
            height={300}
            className="rounded-md object-cover w-full"
          />
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
      { (onSaveToggle || onRemove) && <CardFooter />}
    </Card>
  );
}

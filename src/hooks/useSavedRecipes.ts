"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '@/types';

const LOCAL_STORAGE_KEY = 'pantryChef_savedRecipes';

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRecipes = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedRecipes) {
          setSavedRecipes(JSON.parse(storedRecipes));
        }
      } catch (error) {
        console.error("Error loading saved recipes from localStorage:", error);
        // Optionally clear corrupted data
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedRecipes));
      } catch (error) {
        console.error("Error saving recipes to localStorage:", error);
      }
    }
  }, [savedRecipes, isLoaded]);

  const addRecipe = useCallback((recipe: Recipe) => {
    setSavedRecipes((prevRecipes) => {
      if (prevRecipes.find(r => r.id === recipe.id)) {
        return prevRecipes; // Already saved
      }
      return [...prevRecipes, recipe];
    });
  }, []);

  const removeRecipe = useCallback((recipeId: string) => {
    setSavedRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeId));
  }, []);

  const isRecipeSaved = useCallback((recipeId: string) => {
    return savedRecipes.some(recipe => recipe.id === recipeId);
  }, [savedRecipes]);

  return { savedRecipes, addRecipe, removeRecipe, isRecipeSaved, isLoading: !isLoaded };
}

import { TipCard } from '@/components/pantry-chef/TipCard';
import type { CookingTip } from '@/types';
import { UtensilsCrossed, Vegan, Scale, ThermometerSnowflake, Clock, Flame } from 'lucide-react';

const cookingTips: CookingTip[] = [
  {
    id: '1',
    title: 'Mise en Place',
    description: 'French for "everything in its place." Prepare and measure all your ingredients before you start cooking. This makes the cooking process smoother and more enjoyable.',
    category: 'Preparation',
    icon: UtensilsCrossed,
  },
  {
    id: '2',
    title: 'Taste As You Go',
    description: 'Always taste your food during the cooking process (when safe to do so) and adjust seasonings as needed. This is key to well-flavored dishes.',
    category: 'Seasoning',
    icon: Vegan, // Representing flavor/tasting
  },
  {
    id: '3',
    title: 'Don\'t Overcrowd the Pan',
    description: 'When searing or frying, give your ingredients space in the pan. Overcrowding lowers the temperature and leads to steaming instead of browning.',
    category: 'Technique',
    icon: Flame,
  },
  {
    id: '4',
    title: 'Rest Your Meat',
    description: 'Allow cooked meat, especially larger cuts, to rest for 5-15 minutes before slicing. This allows the juices to redistribute, resulting in more tender and flavorful meat.',
    category: 'Meat Preparation',
    icon: Clock,
  },
  {
    id: '5',
    title: 'Read the Whole Recipe First',
    description: 'Before you start cooking, read the entire recipe from start to finish. This helps you understand the flow and avoid surprises.',
    category: 'Preparation',
  },
  {
    id: '6',
    title: 'Use Sharp Knives',
    description: 'A sharp knife is safer and more efficient than a dull one. It requires less pressure, reducing the risk of slips, and makes prep work much easier.',
    category: 'Tools',
  },
   {
    id: '7',
    title: 'Salt Your Pasta Water',
    description: 'Generously salt your pasta water – it should taste like the sea. This is your primary chance to season the pasta itself.',
    category: 'Pasta',
    icon: Scale,
  },
  {
    id: '8',
    title: 'Properly Preheat Your Oven/Pan',
    description: 'Ensure your oven or pan is at the correct temperature before adding food. This is crucial for even cooking and achieving desired textures.',
    category: 'Technique',
    icon: ThermometerSnowflake,
  },
];

export default function CookingTipsPage() {
  return (
    <div className="space-y-8">
      <header className="text-center py-6">
        <h1 className="font-headline text-4xl sm:text-5xl text-primary">Cooking Tips & Tricks</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Sharpen your culinary skills with these helpful hints from seasoned chefs.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cookingTips.map(tip => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </div>
  );
}

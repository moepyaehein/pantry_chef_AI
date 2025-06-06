import type { CookingTip } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface TipCardProps {
  tip: CookingTip;
}

export function TipCard({ tip }: TipCardProps) {
  const IconComponent = tip.icon || Lightbulb;
  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <IconComponent size={28} className="text-accent" />
          <CardTitle className="font-headline text-xl text-primary">{tip.title}</CardTitle>
        </div>
        {tip.category && (
          <CardDescription className="text-xs text-muted-foreground pt-1">Category: {tip.category}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="font-body text-sm leading-relaxed">{tip.description}</p>
      </CardContent>
    </Card>
  );
}

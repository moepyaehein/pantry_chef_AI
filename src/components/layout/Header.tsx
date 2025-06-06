import Link from 'next/link';
import { ChefHat, Home, Bookmark, Lightbulb, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/saved-recipes', label: 'Saved Recipes', icon: Bookmark },
  { href: '/cooking-tips', label: 'Cooking Tips', icon: Lightbulb },
];

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ChefHat size={32} />
          <span className="font-headline text-2xl font-semibold">AI Chef By Moe</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href} className="flex items-center gap-2 text-foreground hover:text-accent-foreground hover:bg-accent transition-colors px-3 py-2 rounded-md">
                <item.icon size={18} />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-card">
              <nav className="flex flex-col gap-4 pt-8">
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" asChild className="w-full justify-start">
                    <Link href={item.href} className="flex items-center gap-3 text-lg p-3">
                      <item.icon size={22} />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

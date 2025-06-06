export function Footer() {
  return (
    <footer className="bg-card border-t py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Pantry Chef AI. All rights reserved.</p>
        <p className="text-sm mt-1">Discover culinary delights with AI.</p>
      </div>
    </footer>
  );
}

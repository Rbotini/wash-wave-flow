import { ReactNode } from 'react';
import { Car, Droplets } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-clean">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Car className="h-8 w-8" />
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">AquaWash Pro</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão de Lava-Jato</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {title && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
            <div className="h-1 w-24 bg-gradient-water rounded-full"></div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
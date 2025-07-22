import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Droplets, Sparkles } from 'lucide-react';

interface WashProgressProps {
  washType: {
    name: string;
    duration: number; // em minutos
    price: number;
  };
  customerName: string;
  carInfo: string;
  onComplete: (finalPrice: number) => void;
}

export const WashProgress = ({ washType, customerName, carInfo, onComplete }: WashProgressProps) => {
  const [timeRemaining, setTimeRemaining] = useState(washType.duration * 60); // converter para segundos
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        setProgress(((washType.duration * 60 - timeRemaining) / (washType.duration * 60)) * 100);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setIsCompleted(true);
      setProgress(100);
    }
  }, [timeRemaining, isCompleted, washType.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWashStage = () => {
    if (progress < 25) return 'Molhando o veículo';
    if (progress < 50) return 'Aplicando sabão';
    if (progress < 75) return 'Esfregando e limpando';
    if (progress < 100) return 'Enxaguando';
    return 'Lavagem concluída!';
  };

  const CarAnimation = () => (
    <div className="relative w-64 h-32 mx-auto mb-8">
      {/* Carro base */}
      <svg
        viewBox="0 0 400 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Corpo do carro */}
        <rect x="50" y="120" width="300" height="60" rx="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
        
        {/* Teto do carro */}
        <rect x="100" y="80" width="200" height="50" rx="15" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
        
        {/* Rodas */}
        <circle cx="120" cy="180" r="20" fill="#374151" stroke="#1f2937" strokeWidth="2"/>
        <circle cx="280" cy="180" r="20" fill="#374151" stroke="#1f2937" strokeWidth="2"/>
        <circle cx="120" cy="180" r="10" fill="#6b7280"/>
        <circle cx="280" cy="180" r="10" fill="#6b7280"/>
        
        {/* Janelas */}
        <rect x="110" y="90" width="70" height="30" rx="5" fill="#93c5fd" opacity="0.7"/>
        <rect x="220" y="90" width="70" height="30" rx="5" fill="#93c5fd" opacity="0.7"/>
        
        {/* Faróis */}
        <circle cx="340" cy="140" r="8" fill="#fbbf24"/>
        <circle cx="340" cy="160" r="8" fill="#ef4444"/>
        
        {/* Animação da água preenchendo */}
        <rect 
          x="50" 
          y="120" 
          width="300" 
          height="60" 
          rx="10" 
          fill="url(#waterGradient)"
          className="animate-water-fill"
          style={{
            animationDuration: `${washType.duration * 60}s`,
            clipPath: `polygon(0 100%, ${progress}% 100%, ${progress}% 0%, 0 0%)`
          }}
          opacity="0.6"
        />
        
        {/* Bolhas de sabão */}
        {progress > 20 && (
          <>
            <circle cx="150" cy="100" r="4" fill="#ffffff" opacity="0.8" className="animate-bubble-float" style={{animationDelay: '0s'}}/>
            <circle cx="200" cy="110" r="3" fill="#ffffff" opacity="0.8" className="animate-bubble-float" style={{animationDelay: '0.5s'}}/>
            <circle cx="250" cy="95" r="5" fill="#ffffff" opacity="0.8" className="animate-bubble-float" style={{animationDelay: '1s'}}/>
            <circle cx="180" cy="85" r="3" fill="#ffffff" opacity="0.8" className="animate-bubble-float" style={{animationDelay: '1.5s'}}/>
          </>
        )}
        
        {/* Gradiente da água */}
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Efeito de brilho quando completo */}
      {isCompleted && (
        <div className="absolute inset-0 animate-pulse">
          <Sparkles className="absolute top-4 left-4 h-6 w-6 text-yellow-400" />
          <Sparkles className="absolute top-8 right-8 h-4 w-4 text-yellow-300" />
          <Sparkles className="absolute bottom-4 left-16 h-5 w-5 text-yellow-500" />
        </div>
      )}
    </div>
  );

  if (isCompleted) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
            Lavagem Concluída!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <CarAnimation />
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">Cliente: {customerName}</p>
            <p className="text-muted-foreground">{carInfo}</p>
            <p className="text-sm text-muted-foreground">Tipo: {washType.name}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-700">
              Total: R$ {washType.price.toFixed(2)}
            </p>
          </div>
          
          <Button 
            onClick={() => onComplete(washType.price)}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Finalizar Atendimento
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center text-primary">
          <Droplets className="h-6 w-6" />
          Lavagem em Andamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">{customerName}</p>
          <p className="text-muted-foreground">{carInfo}</p>
          <p className="text-sm text-muted-foreground">{washType.name}</p>
        </div>
        
        <CarAnimation />
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-mono font-bold text-primary">
              <Clock className="h-6 w-6" />
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{getWashStage()}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-progress-shimmer opacity-20"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">
            Valor: R$ {washType.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
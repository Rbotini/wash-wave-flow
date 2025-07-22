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
    <div className="relative w-80 h-48 mx-auto mb-8">
      <svg
        viewBox="0 0 500 250"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sombra do carro */}
        <ellipse cx="250" cy="220" rx="180" ry="15" fill="hsl(var(--muted))" opacity="0.3"/>
        
        {/* Corpo principal do carro - sedã moderno */}
        <path 
          d="M80 160 Q75 140 90 135 L140 130 Q160 125 180 130 L320 130 Q340 125 360 130 L410 135 Q425 140 420 160 L420 190 Q425 200 410 200 L385 200 Q380 210 365 210 L355 210 Q340 210 335 200 L165 200 Q160 210 145 210 L135 210 Q120 210 115 200 L90 200 Q75 200 80 190 Z" 
          fill="hsl(var(--card))" 
          stroke="hsl(var(--border))" 
          strokeWidth="2"
        />
        
        {/* Teto do carro */}
        <path 
          d="M120 160 Q115 140 130 135 L150 130 Q170 125 190 130 L310 130 Q330 125 350 130 L370 135 Q385 140 380 160 L380 150 Q385 140 370 135 L350 130 Q330 125 310 130 L190 130 Q170 125 150 130 L130 135 Q115 140 120 150 Z"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />
        
        {/* Janela traseira */}
        <path 
          d="M130 155 Q125 145 140 140 L170 135 Q180 135 185 140 L185 155 Q180 160 170 160 L140 160 Q130 160 130 155 Z"
          fill="hsl(200 50% 85%)"
          opacity="0.8"
        />
        
        {/* Janela dianteira */}
        <path 
          d="M315 155 Q320 145 330 140 Q340 135 350 135 L370 140 Q375 145 370 155 Q375 160 370 160 L330 160 Q320 160 315 155 Z"
          fill="hsl(200 50% 85%)"
          opacity="0.8"
        />
        
        {/* Portas */}
        <line x1="200" y1="135" x2="205" y2="195" stroke="hsl(var(--border))" strokeWidth="1"/>
        <line x1="295" y1="135" x2="300" y2="195" stroke="hsl(var(--border))" strokeWidth="1"/>
        
        {/* Rodas */}
        <circle cx="140" cy="195" r="25" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--border))" strokeWidth="2"/>
        <circle cx="360" cy="195" r="25" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--border))" strokeWidth="2"/>
        <circle cx="140" cy="195" r="15" fill="hsl(var(--foreground))"/>
        <circle cx="360" cy="195" r="15" fill="hsl(var(--foreground))"/>
        <circle cx="140" cy="195" r="8" fill="hsl(var(--muted))"/>
        <circle cx="360" cy="195" r="8" fill="hsl(var(--muted))"/>
        
        {/* Faróis */}
        <ellipse cx="415" cy="155" rx="8" ry="12" fill="hsl(45 100% 70%)" opacity="0.9"/>
        <ellipse cx="415" cy="175" rx="6" ry="8" fill="hsl(0 80% 60%)" opacity="0.8"/>
        
        {/* Grade frontal */}
        <rect x="405" y="148" width="15" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.7"/>
        <rect x="405" y="158" width="15" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.7"/>
        <rect x="405" y="168" width="15" height="4" rx="2" fill="hsl(var(--muted-foreground))" opacity="0.7"/>
        
        {/* Efeito de água preenchendo o carro */}
        <defs>
          <clipPath id="carShape">
            <path d="M80 160 Q75 140 90 135 L140 130 Q160 125 180 130 L320 130 Q340 125 360 130 L410 135 Q425 140 420 160 L420 190 Q425 200 410 200 L385 200 Q380 210 365 210 L355 210 Q340 210 335 200 L165 200 Q160 210 145 210 L135 210 Q120 210 115 200 L90 200 Q75 200 80 190 Z"/>
          </clipPath>
          
          <linearGradient id="waterFillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--water-medium))" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="hsl(var(--water-light))" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="hsl(195 100% 90%)" stopOpacity="0.4"/>
          </linearGradient>
          
          <pattern id="waterWaves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 5 20 10 T40 10" stroke="hsl(var(--water-medium))" strokeWidth="1" fill="none" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Preenchimento de água animado */}
        <rect 
          x="80" 
          y="135" 
          width="340" 
          height="80" 
          fill="url(#waterFillGradient)"
          clipPath="url(#carShape)"
          style={{
            transform: `translateY(${80 - (progress * 0.8)}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Ondas de água */}
        {progress > 10 && (
          <rect 
            x="80" 
            y="135" 
            width="340" 
            height="80" 
            fill="url(#waterWaves)"
            clipPath="url(#carShape)"
            className="animate-pulse"
            style={{
              transform: `translateY(${80 - (progress * 0.8)}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        )}
        
        {/* Bolhas de sabão animadas */}
        {progress > 20 && (
          <g className="animate-bounce">
            <circle cx="160" cy="120" r="5" fill="hsl(var(--foam))" opacity="0.9" className="animate-pulse" style={{animationDelay: '0s'}}/>
            <circle cx="220" cy="110" r="4" fill="hsl(var(--foam))" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
            <circle cx="280" cy="115" r="6" fill="hsl(var(--foam))" opacity="0.9" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
            <circle cx="320" cy="105" r="3" fill="hsl(var(--foam))" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.9s'}}/>
            <circle cx="190" cy="100" r="4" fill="hsl(var(--foam))" opacity="0.8" className="animate-pulse" style={{animationDelay: '1.2s'}}/>
          </g>
        )}
        
        {/* Efeitos de espuma quando lavando */}
        {progress > 40 && progress < 80 && (
          <g>
            <circle cx="140" cy="125" r="8" fill="hsl(var(--soap))" opacity="0.7" className="animate-ping" style={{animationDuration: '2s'}}/>
            <circle cx="250" cy="120" r="10" fill="hsl(var(--soap))" opacity="0.6" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}/>
            <circle cx="350" cy="130" r="7" fill="hsl(var(--soap))" opacity="0.8" className="animate-ping" style={{animationDuration: '2.2s', animationDelay: '1s'}}/>
          </g>
        )}
        
        {/* Brilho final quando completo */}
        {isCompleted && (
          <g className="animate-pulse">
            <circle cx="250" cy="160" r="100" fill="hsl(45 100% 80%)" opacity="0.3" className="animate-ping"/>
            <circle cx="250" cy="160" r="80" fill="hsl(45 100% 85%)" opacity="0.2" className="animate-ping" style={{animationDelay: '0.5s'}}/>
          </g>
        )}
      </svg>
      
      {/* Efeitos de brilho quando completo */}
      {isCompleted && (
        <div className="absolute inset-0">
          <Sparkles className="absolute top-6 left-8 h-6 w-6 text-yellow-400 animate-bounce" style={{animationDelay: '0s'}} />
          <Sparkles className="absolute top-12 right-12 h-5 w-5 text-yellow-300 animate-bounce" style={{animationDelay: '0.3s'}} />
          <Sparkles className="absolute bottom-8 left-20 h-4 w-4 text-yellow-500 animate-bounce" style={{animationDelay: '0.6s'}} />
          <Sparkles className="absolute top-16 left-1/2 h-5 w-5 text-yellow-400 animate-bounce" style={{animationDelay: '0.9s'}} />
          <Sparkles className="absolute bottom-12 right-16 h-6 w-6 text-yellow-300 animate-bounce" style={{animationDelay: '1.2s'}} />
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
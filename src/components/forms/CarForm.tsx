import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, Hash, Palette } from 'lucide-react';

interface CarData {
  id?: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
}

interface CarFormProps {
  onSubmit: (car: CarData) => void;
  initialData?: CarData;
}

const CAR_BRANDS = [
  'Chevrolet', 'Volkswagen', 'Fiat', 'Ford', 'Honda', 'Toyota', 'Hyundai',
  'Renault', 'Nissan', 'Peugeot', 'Citroën', 'Jeep', 'BMW', 'Mercedes-Benz',
  'Audi', 'Mitsubishi', 'Kia', 'Suzuki', 'Outro'
];

const CAR_COLORS = [
  'Branco', 'Preto', 'Prata', 'Cinza', 'Azul', 'Vermelho', 'Verde',
  'Amarelo', 'Bege', 'Marrom', 'Laranja', 'Rosa', 'Roxo', 'Dourado'
];

export const CarForm = ({ onSubmit, initialData }: CarFormProps) => {
  const [formData, setFormData] = useState<CarData>({
    plate: initialData?.plate || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    color: initialData?.color || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPlate = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    if (cleaned.length <= 7) {
      // Formato antigo: AAA-0000
      return cleaned.replace(/^([A-Z]{0,3})([0-9]{0,4})/, (match, letters, numbers) => {
        if (letters && numbers) {
          return `${letters}-${numbers}`;
        }
        return letters || numbers || '';
      });
    }
    
    // Formato Mercosul: AAA0A00
    return cleaned.replace(/^([A-Z]{0,3})([0-9])([A-Z])([0-9]{0,2})/, '$1$2$3$4');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.plate.trim()) {
      newErrors.plate = 'Placa é obrigatória';
    } else {
      const plateClean = formData.plate.replace(/[^A-Z0-9]/gi, '');
      if (plateClean.length < 7) {
        newErrors.plate = 'Placa deve ter formato válido';
      }
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Modelo é obrigatório';
    }
    
    if (!formData.color.trim()) {
      newErrors.color = 'Cor é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        id: initialData?.id || Date.now().toString(),
      });
    }
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value);
    setFormData(prev => ({ ...prev, plate: formatted }));
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-gradient-to-br from-card to-water-light/20">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-water-medium to-water-dark rounded-t-lg text-white">
        <CardTitle className="flex items-center gap-3 justify-center text-xl font-bold">
          <div className="p-2 bg-white/20 rounded-full">
            <Plus className="h-6 w-6" />
          </div>
          Novo Veículo
        </CardTitle>
        <p className="text-white/90 text-sm mt-2">Registre um novo veículo no sistema</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="plate" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-water-medium/10 rounded">
                <Hash className="h-4 w-4 text-water-medium" />
              </div>
              Placa *
            </Label>
            <Input
              id="plate"
              type="text"
              value={formData.plate}
              onChange={handlePlateChange}
              className={`h-12 bg-background border-border focus:border-primary transition-colors font-mono text-center tracking-wider ${errors.plate ? 'border-destructive' : ''}`}
              placeholder="ABC-1234 ou ABC1A23"
              maxLength={8}
            />
            {errors.plate && <p className="text-sm text-destructive mt-1">{errors.plate}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="brand" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-primary/10 rounded">
                <Car className="h-4 w-4 text-primary" />
              </div>
              Marca *
            </Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
              <SelectTrigger className={`h-12 bg-background border-border focus:border-primary transition-colors ${errors.brand ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Selecione a marca do veículo" />
              </SelectTrigger>
              <SelectContent>
                {CAR_BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brand && <p className="text-sm text-destructive mt-1">{errors.brand}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="model" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-accent/30 rounded">
                <Car className="h-4 w-4 text-accent-foreground" />
              </div>
              Modelo *
            </Label>
            <Input
              id="model"
              type="text"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              className={`h-12 bg-background border-border focus:border-primary transition-colors ${errors.model ? 'border-destructive' : ''}`}
              placeholder="Ex: Civic, Corolla, Gol, Onix"
            />
            {errors.model && <p className="text-sm text-destructive mt-1">{errors.model}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="color" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-secondary/50 rounded">
                <Palette className="h-4 w-4 text-secondary-foreground" />
              </div>
              Cor *
            </Label>
            <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
              <SelectTrigger className={`h-12 bg-background border-border focus:border-primary transition-colors ${errors.color ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Selecione a cor do veículo" />
              </SelectTrigger>
              <SelectContent>
                {CAR_COLORS.map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{
                          backgroundColor: 
                            color === 'Branco' ? '#ffffff' :
                            color === 'Preto' ? '#000000' :
                            color === 'Prata' ? '#c0c0c0' :
                            color === 'Cinza' ? '#808080' :
                            color === 'Azul' ? '#0066cc' :
                            color === 'Vermelho' ? '#cc0000' :
                            color === 'Verde' ? '#008000' :
                            color === 'Amarelo' ? '#ffff00' :
                            color === 'Bege' ? '#f5f5dc' :
                            color === 'Marrom' ? '#a0522d' :
                            color === 'Laranja' ? '#ff8c00' :
                            color === 'Rosa' ? '#ffc0cb' :
                            color === 'Roxo' ? '#800080' :
                            color === 'Dourado' ? '#ffd700' : '#cccccc'
                        }}
                      />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.color && <p className="text-sm text-destructive mt-1">{errors.color}</p>}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-water-medium to-water-dark hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Veículo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
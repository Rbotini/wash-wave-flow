import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';

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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center text-primary">
          <Car className="h-5 w-5" />
          Cadastro de Veículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plate" className="text-foreground">Placa *</Label>
            <Input
              id="plate"
              type="text"
              value={formData.plate}
              onChange={handlePlateChange}
              className={errors.plate ? 'border-destructive' : ''}
              placeholder="ABC-1234 ou ABC1A23"
              maxLength={8}
            />
            {errors.plate && <p className="text-sm text-destructive">{errors.plate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand" className="text-foreground">Marca *</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
              <SelectTrigger className={errors.brand ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione a marca" />
              </SelectTrigger>
              <SelectContent>
                {CAR_BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-foreground">Modelo *</Label>
            <Input
              id="model"
              type="text"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              className={errors.model ? 'border-destructive' : ''}
              placeholder="Ex: Civic, Corolla, Gol"
            />
            {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-foreground">Cor *</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
              <SelectTrigger className={errors.color ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione a cor" />
              </SelectTrigger>
              <SelectContent>
                {CAR_COLORS.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-water hover:opacity-90 transition-opacity"
          >
            Cadastrar Veículo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
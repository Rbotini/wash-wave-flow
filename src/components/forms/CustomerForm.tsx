import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, UserPlus } from 'lucide-react';

interface Customer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
}

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  initialData?: Customer;
}

export const CustomerForm = ({ onSubmit, initialData }: CustomerFormProps) => {
  const [formData, setFormData] = useState<Customer>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-gradient-to-br from-card to-accent/20">
      <CardHeader className="text-center pb-6 bg-gradient-water rounded-t-lg text-white">
        <CardTitle className="flex items-center gap-3 justify-center text-xl font-bold">
          <div className="p-2 bg-white/20 rounded-full">
            <UserPlus className="h-6 w-6" />
          </div>
          Novo Cliente
        </CardTitle>
        <p className="text-white/90 text-sm mt-2">Preencha os dados para cadastrar um novo cliente</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-primary/10 rounded">
                <User className="h-4 w-4 text-primary" />
              </div>
              Nome Completo *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`h-12 bg-background border-border focus:border-primary transition-colors ${errors.name ? 'border-destructive' : ''}`}
              placeholder="Digite o nome completo do cliente"
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-water-medium/10 rounded">
                <Phone className="h-4 w-4 text-water-medium" />
              </div>
              Telefone *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`h-12 pl-10 bg-background border-border focus:border-primary transition-colors ${errors.phone ? 'border-destructive' : ''}`}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="p-1 bg-accent/30 rounded">
                <Mail className="h-4 w-4 text-accent-foreground" />
              </div>
              E-mail (opcional)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`h-12 pl-10 bg-background border-border focus:border-primary transition-colors ${errors.email ? 'border-destructive' : ''}`}
                placeholder="email@exemplo.com"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-water hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Cadastrar Cliente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { CarForm } from '@/components/forms/CarForm';
import { WashProgress } from '@/components/WashProgress';
import { DailySummary, addDailyWashRecord } from '@/components/DailySummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Car, Play, ArrowLeft, Sparkles, Clock, DollarSign } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface CarData {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
}

interface WashType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em minutos
}

type Step = 'menu' | 'customer' | 'car' | 'wash-type' | 'progress';

const WASH_TYPES: WashType[] = [
  {
    id: '1',
    name: 'Lavagem Simples',
    description: 'Lavagem externa básica com sabão e água',
    price: 15.00,
    duration: 15
  },
  {
    id: '2',
    name: 'Lavagem Completa',
    description: 'Lavagem externa + interna + pneus + rodas',
    price: 25.00,
    duration: 30
  },
  {
    id: '3',
    name: 'Lavagem Premium',
    description: 'Completa + enceramento + aspiração detalhada',
    price: 45.00,
    duration: 45
  }
];

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState<Step>('menu');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cars, setCars] = useState<CarData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(null);
  const { toast } = useToast();

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('carwash-customers');
    const savedCars = localStorage.getItem('carwash-cars');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleCustomerSubmit = (customer: Customer) => {
    const updatedCustomers = [...customers, customer];
    setCustomers(updatedCustomers);
    saveToStorage('carwash-customers', updatedCustomers);
    
    toast({
      title: "Cliente cadastrado!",
      description: `${customer.name} foi adicionado com sucesso.`,
    });
    
    setCurrentStep('menu');
  };

  const handleCarSubmit = (car: CarData) => {
    const updatedCars = [...cars, car];
    setCars(updatedCars);
    saveToStorage('carwash-cars', updatedCars);
    
    toast({
      title: "Veículo cadastrado!",
      description: `${car.brand} ${car.model} (${car.plate}) foi adicionado.`,
    });
    
    setCurrentStep('menu');
  };

  const startWash = () => {
    if (!selectedCustomer || !selectedCar || !selectedWashType) {
      toast({
        title: "Dados incompletos",
        description: "Selecione cliente, veículo e tipo de lavagem.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentStep('progress');
  };

  const handleWashComplete = (finalPrice: number) => {
    toast({
      title: "Lavagem concluída!",
      description: `Serviço finalizado. Total: R$ ${finalPrice.toFixed(2)}`,
    });
    
    // Adicionar registro ao resumo diário
    if (selectedCustomer && selectedCar && selectedWashType) {
      addDailyWashRecord({
        customerName: selectedCustomer.name,
        carInfo: `${selectedCar.brand} ${selectedCar.model} (${selectedCar.plate})`,
        washType: selectedWashType.name,
        price: finalPrice
      });
    }
    
    // Resetar seleções
    setSelectedCustomer(null);
    setSelectedCar(null);
    setSelectedWashType(null);
    setCurrentStep('menu');
  };

  const renderMenu = () => (
    <div className="space-y-8">
      {/* Resumo Diário */}
      <DailySummary />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentStep('customer')}>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-primary mx-auto" />
            <CardTitle>Cadastrar Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Adicionar novo cliente ao sistema
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentStep('car')}>
          <CardHeader className="text-center">
            <Car className="h-12 w-12 text-primary mx-auto" />
            <CardTitle>Cadastrar Veículo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Registrar novo veículo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Sparkles className="h-12 w-12 text-water-medium mx-auto" />
            <CardTitle>Tipos de Lavagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {WASH_TYPES.map((wash) => (
                <div key={wash.id} className="flex justify-between text-sm">
                  <span>{wash.name}</span>
                  <Badge variant="secondary">R$ {wash.price.toFixed(2)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto" />
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Clientes: {customers.length}</p>
            <p className="text-sm text-muted-foreground">Veículos: {cars.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Novo Atendimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Iniciar Novo Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select value={selectedCustomer?.id || ''} onValueChange={(value) => {
                const customer = customers.find(c => c.id === value);
                setSelectedCustomer(customer || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Veículo</label>
              <Select value={selectedCar?.id || ''} onValueChange={(value) => {
                const car = cars.find(c => c.id === value);
                setSelectedCar(car || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.plate} - {car.brand} {car.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Lavagem</label>
              <Select value={selectedWashType?.id || ''} onValueChange={(value) => {
                const washType = WASH_TYPES.find(w => w.id === value);
                setSelectedWashType(washType || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {WASH_TYPES.map((wash) => (
                    <SelectItem key={wash.id} value={wash.id}>
                      {wash.name} - R$ {wash.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCustomer && selectedCar && selectedWashType && (
            <div className="bg-accent/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-accent-foreground">Resumo do Atendimento</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Cliente:</p>
                  <p>{selectedCustomer.name}</p>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="font-medium">Veículo:</p>
                  <p>{selectedCar.brand} {selectedCar.model}</p>
                  <p>{selectedCar.plate} - {selectedCar.color}</p>
                </div>
                <div>
                  <p className="font-medium">Serviço:</p>
                  <p>{selectedWashType.name}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedWashType.duration} min</span>
                    <span>•</span>
                    <span>R$ {selectedWashType.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={startWash}
            disabled={!selectedCustomer || !selectedCar || !selectedWashType}
            className="w-full bg-gradient-water hover:opacity-90"
            size="lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Iniciar Lavagem
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackButton = () => (
    <Button 
      variant="outline" 
      onClick={() => setCurrentStep('menu')}
      className="mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar ao Menu
    </Button>
  );

  return (
    <Layout title="Dashboard do Lava-Jato">
      {currentStep === 'menu' && renderMenu()}
      
      {currentStep === 'customer' && (
        <div>
          {renderBackButton()}
          <CustomerForm onSubmit={handleCustomerSubmit} />
        </div>
      )}
      
      {currentStep === 'car' && (
        <div>
          {renderBackButton()}
          <CarForm onSubmit={handleCarSubmit} />
        </div>
      )}
      
      {currentStep === 'progress' && selectedCustomer && selectedCar && selectedWashType && (
        <div>
          <WashProgress
            washType={selectedWashType}
            customerName={selectedCustomer.name}
            carInfo={`${selectedCar.brand} ${selectedCar.model} (${selectedCar.plate})`}
            onComplete={handleWashComplete}
          />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
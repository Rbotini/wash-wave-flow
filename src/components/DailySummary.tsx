import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Car, TrendingUp, Clock } from 'lucide-react';

interface WashRecord {
  id: string;
  customerName: string;
  carInfo: string;
  washType: string;
  price: number;
  timestamp: string;
}

export const DailySummary = () => {
  const [todayWashes, setTodayWashes] = useState<WashRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Carregar registros do localStorage
    const savedWashes = localStorage.getItem('carwash-daily-records');
    if (savedWashes) {
      const allWashes = JSON.parse(savedWashes);
      const today = new Date().toDateString();
      const todayRecords = allWashes.filter((wash: WashRecord) => 
        new Date(wash.timestamp).toDateString() === today
      );
      
      setTodayWashes(todayRecords);
      setTotalRevenue(todayRecords.reduce((sum: number, wash: WashRecord) => sum + wash.price, 0));
    }
  }, []);

  // Função para adicionar nova lavagem (será chamada do Dashboard)
  const addWashRecord = (record: Omit<WashRecord, 'id' | 'timestamp'>) => {
    const newRecord: WashRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    const savedWashes = localStorage.getItem('carwash-daily-records');
    const allWashes = savedWashes ? JSON.parse(savedWashes) : [];
    const updatedWashes = [...allWashes, newRecord];
    
    localStorage.setItem('carwash-daily-records', JSON.stringify(updatedWashes));
    
    // Atualizar estado se for do dia atual
    const today = new Date().toDateString();
    if (new Date(newRecord.timestamp).toDateString() === today) {
      setTodayWashes(prev => [...prev, newRecord]);
      setTotalRevenue(prev => prev + newRecord.price);
    }
  };

  const averagePrice = todayWashes.length > 0 ? totalRevenue / todayWashes.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-water-light to-water-medium text-water-dark">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Carros Lavados Hoje</CardTitle>
          <Car className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayWashes.length}</div>
          <p className="text-xs opacity-80">
            {todayWashes.length > 0 ? 'Lavagens realizadas' : 'Nenhuma lavagem hoje'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-100 to-green-200 text-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
          <DollarSign className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          <p className="text-xs opacity-80">
            Receita do dia atual
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {averagePrice.toFixed(2)}</div>
          <p className="text-xs opacity-80">
            Valor médio por lavagem
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Último Atendimento</CardTitle>
          <Clock className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {todayWashes.length > 0 
              ? new Date(todayWashes[todayWashes.length - 1].timestamp).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : '--:--'
            }
          </div>
          <p className="text-xs opacity-80">
            {todayWashes.length > 0 ? 'Última lavagem' : 'Nenhuma hoje'}
          </p>
        </CardContent>
      </Card>

      {todayWashes.length > 0 && (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Resumo das Lavagens de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {todayWashes.slice(-5).reverse().map((wash) => (
                <div key={wash.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{wash.customerName}</p>
                    <p className="text-xs text-muted-foreground">{wash.carInfo}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {wash.washType}
                    </Badge>
                    <p className="text-sm font-bold text-green-600">
                      R$ {wash.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    {new Date(wash.timestamp).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Exportar função para adicionar registro
export const addDailyWashRecord = (record: Omit<WashRecord, 'id' | 'timestamp'>) => {
  const newRecord: WashRecord = {
    ...record,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };

  const savedWashes = localStorage.getItem('carwash-daily-records');
  const allWashes = savedWashes ? JSON.parse(savedWashes) : [];
  const updatedWashes = [...allWashes, newRecord];
  
  localStorage.setItem('carwash-daily-records', JSON.stringify(updatedWashes));
};
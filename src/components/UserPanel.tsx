import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, LogOut, ShoppingCart, Users, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface UserPanelProps {
  onNavigate: (page: string, data?: any) => void;
}

const matches = [
  {
    id: 1,
    home: 'Once Caldas',
    away: 'Atlético Nacional',
    date: '2025-11-05',
    time: '20:00',
    competition: 'Liga BetPlay',
  },
  {
    id: 2,
    home: 'Once Caldas',
    away: 'Millonarios FC',
    date: '2025-11-12',
    time: '18:30',
    competition: 'Liga BetPlay',
  },
  {
    id: 3,
    home: 'Once Caldas',
    away: 'América de Cali',
    date: '2025-11-19',
    time: '16:00',
    competition: 'Copa Colombia',
  },
];

const stadiumSections = [
  { id: 1, name: 'Occidental', capacity: 6000, available: 4200, price: 45000, color: 'bg-blue-600' },
  { id: 2, name: 'Oriental', capacity: 6000, available: 3800, price: 45000, color: 'bg-blue-500' },
  { id: 3, name: 'Norte', capacity: 4000, available: 2100, price: 35000, color: 'bg-green-600' },
  { id: 4, name: 'Sur', capacity: 4000, available: 1900, price: 35000, color: 'bg-green-500' },
];

export function UserPanel({ onNavigate }: UserPanelProps) {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [showStadiumMap, setShowStadiumMap] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const handleBuyTicket = () => {
    if (selectedMatch && selectedSection) {
      const match = matches.find(m => m.id === selectedMatch);
      const section = stadiumSections.find(s => s.id === selectedSection);
      
      onNavigate('confirmation', {
        match,
        section,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">OC</span>
              </div>
              <div>
                <h1 className="text-xl text-blue-900">Panel de Usuario</h1>
                <p className="text-sm text-gray-600">Bienvenido, Aficionado</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('home')}
              className="border-blue-700 text-blue-700 hover:bg-blue-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Matches */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl text-blue-900 mb-4">Partidos Disponibles</h2>
              <p className="text-gray-600 mb-6">Selecciona un partido para ver las gradas disponibles</p>
            </div>

            <div className="space-y-4">
              {matches.map((match) => (
                <Card 
                  key={match.id}
                  className={`cursor-pointer transition-all ${
                    selectedMatch === match.id 
                      ? 'border-4 border-blue-700 shadow-lg' 
                      : 'border-2 border-gray-200 hover:border-blue-400'
                  }`}
                  onClick={() => {
                    setSelectedMatch(match.id);
                    setShowStadiumMap(true);
                    setSelectedSection(null);
                  }}
                >
                  <CardHeader className="bg-gradient-to-r from-blue-700 to-green-600 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 bg-white text-blue-700">{match.competition}</Badge>
                        <CardTitle className="text-white text-xl">
                          {match.home} vs {match.away}
                        </CardTitle>
                      </div>
                      {selectedMatch === match.id && (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-600">✓</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-700" />
                        <span className="text-sm">{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-sm">{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Palogrande</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Stadium Map */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-700">
              <CardHeader className="bg-blue-700 text-white">
                <CardTitle>Mapa del Estadio</CardTitle>
                <CardDescription className="text-blue-100">
                  Selecciona tu grada preferida
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!showStadiumMap ? (
                  <div className="text-center py-12 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Selecciona un partido para ver el mapa de gradas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Stadium Visual */}
                    <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 mb-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-4 py-2 bg-white rounded-lg text-sm text-gray-700">
                          Norte
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-20 text-center">
                          <div className="inline-block px-2 py-6 bg-white rounded-lg text-sm text-gray-700 transform -rotate-90">
                            Occidental
                          </div>
                        </div>
                        
                        <div className="flex-1 mx-4">
                          <div className="aspect-video bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center border-4 border-white">
                            <span className="text-white text-sm">Campo de Juego</span>
                          </div>
                        </div>
                        
                        <div className="w-20 text-center">
                          <div className="inline-block px-2 py-6 bg-white rounded-lg text-sm text-gray-700 transform rotate-90">
                            Oriental
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="inline-block px-4 py-2 bg-white rounded-lg text-sm text-gray-700">
                          Sur
                        </div>
                      </div>
                    </div>

                    {/* Sections List */}
                    <div className="space-y-3">
                      {stadiumSections.map((section) => (
                        <Card
                          key={section.id}
                          className={`cursor-pointer transition-all ${
                            selectedSection === section.id
                              ? 'border-2 border-green-600 shadow-md'
                              : 'border border-gray-300 hover:border-green-400'
                          }`}
                          onClick={() => setSelectedSection(section.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded ${section.color}`} />
                                <span className="text-blue-900">{section.name}</span>
                              </div>
                              {selectedSection === section.id && (
                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Users className="h-3 w-3" />
                                <span>{section.available}/{section.capacity}</span>
                              </div>
                              <span className="text-green-700">${section.price.toLocaleString()}</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`${section.color} h-1.5 rounded-full`}
                                style={{ width: `${(section.available / section.capacity) * 100}%` }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Buy Button */}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      disabled={!selectedSection}
                      onClick={handleBuyTicket}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Comprar Boleta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

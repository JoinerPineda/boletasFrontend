import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatDateTime } from '../utils/normalize';
import { apiFetch } from '../api';
import { normalizeMatches } from '../utils/normalize';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data: any = await apiFetch('/api/matches');
        const normalized = normalizeMatches(data);
        // Sort by date and get only the next 3 matches
        const sorted = normalized
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);
        setMatches(sorted);
      } catch (err) {
        console.error('Error loading matches', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">OC</span>
              </div>
              <div>
                <h1 className="text-blue-900">Sistema de Administración de Boletas</h1>
                <p className="text-sm text-green-700">Once Caldas - Estadio Palogrande</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onNavigate('auth')}
                className="border-blue-700 text-blue-700 hover:bg-blue-50"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => onNavigate('auth')}
                className="bg-green-600 hover:bg-green-700"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdGFkaXVtJTIwY3Jvd2R8ZW58MXx8fHwxNzYxNjIzODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Estadio Palogrande"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h2 className="text-5xl mb-4">Bienvenido al Palogrande</h2>
            <p className="text-xl mb-6">
              Compra tus boletas de manera fácil y segura. Apoya al Once Caldas en cada partido.
            </p>
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5" />
              <span>Manizales, Caldas - Colombia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Partidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl text-blue-900 mb-2">Próximos Partidos</h2>
            <p className="text-gray-600">Selecciona el partido y compra tus boletas</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando partidos...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay partidos disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-blue-700">
                <CardHeader className="bg-gradient-to-r from-blue-700 to-green-600 text-white">
                  <Badge className="w-fit mb-2 bg-white text-blue-700">{match.competition}</Badge>
                  <CardTitle className="text-white">
                    {match.home} vs {match.away}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="h-5 w-5 text-blue-700" />
                      <span>{formatDateTime(match.date, match.time)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>Estadio Palogrande, Manizales</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="h-5 w-5 text-blue-700" />
                      <span>{(match.capacity - match.ticketsSold).toLocaleString()} boletas disponibles</span>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Disponibilidad</span>
                        <span className="text-blue-700">
                          {Math.round(((match.capacity - match.ticketsSold) / match.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                          style={{ width: `${((match.capacity - match.ticketsSold) / match.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      onClick={() => onNavigate('auth')}
                    >
                      Comprar Boletas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Info del Estadio */}
      <section className="bg-white py-12 border-t-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-2xl text-blue-900">20,000</h3>
              <p className="text-gray-600">Capacidad Total</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl text-blue-900">4 Gradas</h3>
              <p className="text-gray-600">Occidental, Oriental, Norte, Sur</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-2xl text-blue-900">15+ Partidos</h3>
              <p className="text-gray-600">Por Temporada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Once Caldas - Sistema de Administración de Boletas</p>
          <p className="text-sm text-blue-300 mt-2">Estadio Palogrande, Manizales, Caldas</p>
        </div>
      </footer>
    </div>
  );
}

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CheckCircle2, 
  Download, 
  Calendar, 
  MapPin, 
  Clock, 
  User,
  Home,
  Ticket
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatDateTime } from '../utils/normalize';

interface ConfirmationProps {
  onNavigate: (page: string) => void;
  purchaseData?: {
    match: any;
    section: any;
    purchase?: any;
  };
}

export function Confirmation({ onNavigate, purchaseData }: ConfirmationProps) {
  if (!purchaseData) {
    return null;
  }

  const { match, section, purchase } = purchaseData;
  const ticketCode = purchase?.tickets?.[0]?.code || `OC-${match.id}${section.id}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const purchaseDate = new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">OC</span>
              </div>
              <div>
                <h1 className="text-xl text-blue-900">Confirmación de Compra</h1>
                <p className="text-sm text-gray-600">Once Caldas - Estadio Palogrande</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('home')}
              className="border-blue-700 text-blue-700 hover:bg-blue-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl text-blue-900 mb-2">¡Compra Exitosa!</h2>
          <p className="text-gray-600 text-lg">
            Tu boleta ha sido generada correctamente
          </p>
        </div>

        {/* Ticket Card */}
        <Card className="border-4 border-blue-700 shadow-2xl overflow-hidden">
          {/* Card Header with Team Colors */}
          <div className="bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-900 text-2xl">OC</span>
                </div>
                <div>
                  <h3 className="text-2xl">Once Caldas</h3>
                  <p className="text-blue-100">Estadio Palogrande</p>
                </div>
              </div>
              <Badge className="bg-white text-blue-700 text-sm px-4 py-2">
                {match.competition}
              </Badge>
            </div>
            
            <div className="text-center py-4">
              <h4 className="text-3xl mb-2">
                {match.home} vs {match.away}
              </h4>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm text-gray-500 mb-4">Detalles del Partido</h5>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-700 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha y Hora</p>
                        <p className="text-blue-900">{formatDateTime(match.date, match.time)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Ubicación</p>
                        <p className="text-blue-900">Grada {section.name}</p>
                        <p className="text-sm text-gray-600">Estadio Palogrande, Manizales</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Ticket className="h-5 w-5 text-blue-700 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Código de Boleta</p>
                        <p className="text-blue-900 font-mono">{ticketCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <h5 className="text-sm text-gray-500 mb-4">Información de Compra</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grada</span>
                      <span className="text-blue-900">{section.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio</span>
                      <span className="text-blue-900">${section.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de compra</span>
                      <span className="text-blue-900 text-sm">{purchaseDate}</span>
                    </div>
                    <div className="pt-2 border-t-2 border-gray-200 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-900">Total</span>
                        <span className="text-2xl text-green-700">
                          ${section.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-lg border-4 border-blue-700 shadow-lg">
                  <div className="bg-gradient-to-br from-blue-700 to-green-600 p-1 rounded-lg">
                    <div className="bg-white p-4 rounded-md">
                      {/* QR Code Placeholder - Using SVG pattern */}
                      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                        <rect width="200" height="200" fill="white"/>
                        
                        {/* Corner squares */}
                        <rect x="10" y="10" width="50" height="50" fill="black"/>
                        <rect x="20" y="20" width="30" height="30" fill="white"/>
                        <rect x="140" y="10" width="50" height="50" fill="black"/>
                        <rect x="150" y="20" width="30" height="30" fill="white"/>
                        <rect x="10" y="140" width="50" height="50" fill="black"/>
                        <rect x="20" y="150" width="30" height="30" fill="white"/>
                        
                        {/* Random QR pattern */}
                        {Array.from({ length: 100 }).map((_, i) => {
                          const x = 10 + (i % 10) * 18;
                          const y = 70 + Math.floor(i / 10) * 8;
                          const show = Math.random() > 0.5;
                          return show ? <rect key={i} x={x} y={y} width="8" height="8" fill="black"/> : null;
                        })}
                        
                        {/* Center logo area */}
                        <circle cx="100" cy="100" r="20" fill="white"/>
                        <circle cx="100" cy="100" r="18" fill="#1e40af"/>
                        <text x="100" y="107" textAnchor="middle" fill="white" fontSize="16">OC</text>
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Escanea este código en la entrada del estadio
                  </p>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={async () => {
                      try {
                        if (!purchase) return alert('No hay información de compra');
                        const res = await fetch(`http://localhost:4000${purchase.downloadUrl}`, {
                          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                        });
                        if (!res.ok) return alert('Error al descargar');
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${purchase.purchaseId}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        alert('Error descargando PDF');
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Boleta (PDF)
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-blue-700 text-blue-700 hover:bg-blue-50"
                    onClick={() => onNavigate('user')}
                  >
                    Comprar Otra Boleta
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mt-8 border-2 border-yellow-400 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900 text-lg">Información Importante</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-yellow-900">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Presenta tu código QR al ingresar al estadio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Las puertas abren 2 horas antes del partido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>No se permiten reembolsos una vez comprada la boleta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Guarda una copia de tu boleta en formato digital y físico</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Stadium Image */}
        <div className="mt-8 rounded-lg overflow-hidden shadow-xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1551384732-fb4f003640e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzYxNjE0NDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Afición Once Caldas"
            className="w-full h-64 object-cover"
          />
          <div className="bg-gradient-to-r from-blue-700 to-green-600 text-white p-4 text-center">
            <p className="text-lg">¡Nos vemos en el Palogrande! 🏟️⚽</p>
          </div>
        </div>
      </div>
    </div>
  );
}

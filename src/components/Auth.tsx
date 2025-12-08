import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onNavigate: (page: string, userType?: string) => void;
}

export function Auth({ onNavigate }: AuthProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = (userType: string) => {
    if (loginEmail && loginPassword) {
      onNavigate(userType === 'admin' ? 'admin' : 'user', userType);
    }
  };

  const handleRegister = () => {
    if (registerName && registerEmail && registerPassword && registerPassword === registerConfirmPassword) {
      onNavigate('user', 'user');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1651043421470-88b023bb9636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc2MTY4NzQxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Estadio Palogrande"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-green-900/95" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="text-white space-y-6 hidden md:block">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-900 text-3xl">OC</span>
                </div>
                <div>
                  <h1 className="text-4xl">Once Caldas</h1>
                  <p className="text-blue-200">Estadio Palogrande</p>
                </div>
              </div>
              
              <h2 className="text-3xl">
                Sistema de Administración de Boletas
              </h2>
              <p className="text-xl text-blue-100">
                Accede a tu cuenta para comprar boletas y disfrutar de los mejores partidos en el Palogrande.
              </p>
              
              <div className="space-y-4 pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <div>
                    <p>Compra rápida y segura</p>
                    <p className="text-sm text-blue-200">Completa tu compra en minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <div>
                    <p>Boletas digitales con QR</p>
                    <p className="text-sm text-blue-200">Acceso directo al estadio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white">✓</span>
                  </div>
                  <div>
                    <p>Selección de ubicación</p>
                    <p className="text-sm text-blue-200">Escoge tu grada favorita</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <Card className="shadow-2xl border-4 border-blue-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Bienvenido</CardTitle>
                <CardDescription>Inicia sesión o crea una cuenta nueva</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="register">Registrarse</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Correo Electrónico</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button
                        className="w-full bg-blue-700 hover:bg-blue-800"
                        onClick={() => handleLogin('user')}
                      >
                        <UserCircle2 className="mr-2 h-4 w-4" />
                        Ingresar como Usuario
                      </Button>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleLogin('admin')}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Ingresar como Administrador
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nombre Completo</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Correo Electrónico</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Confirmar Contraseña</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      onClick={handleRegister}
                    >
                      Crear Cuenta
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

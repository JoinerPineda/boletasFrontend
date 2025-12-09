import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { normalizeMatches, normalizeMatch } from '../utils/normalize';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  LogOut, 
  PlusCircle, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Shuffle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedNewTeam, setSelectedNewTeam] = useState<any | null>(null);
  const [selectedEditingTeam, setSelectedEditingTeam] = useState<any | null>(null);
  const [newMatchSelection, setNewMatchSelection] = useState<string>('');
  const [newMatchOther, setNewMatchOther] = useState<string>('');
  const [editingMatchSelection, setEditingMatchSelection] = useState<string>('');
  const [editingMatchOther, setEditingMatchOther] = useState<string>('');
  const [simulationResults, setSimulationResults] = useState<any[]>([]);
  const [showNewMatchDialog, setShowNewMatchDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState<any>(null);
  
  const [newMatch, setNewMatch] = useState({
    away: '',
    date: '',
    time: '',
    competition: '',
  });

  const handleCreateMatch = () => {
    const awayValue = newMatchSelection === '__other' ? newMatchOther : newMatchSelection || newMatch.away;
    if (!awayValue || !newMatch.date || !newMatch.time || !newMatch.competition) return;

    (async () => {
      try {
        const payload = { ...newMatch, away: awayValue };
        const created: any = await apiFetch('/api/matches', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMatches([...matches, normalizeMatch(created)]);
        setNewMatch({ away: '', date: '', time: '', competition: '' });
        setNewMatchSelection('');
        setNewMatchOther('');
        setSelectedNewTeam(null);
        setShowNewMatchDialog(false);
      } catch (err: any) {
        alert(err?.body?.error || 'Error creando partido');
      }
    })();
  };

  const handleEditMatch = (match: any) => {
    setEditingMatch({ ...match });
    // set selected editing team if teams already loaded
    const found = teams.find(t => t.name === match.away) || null;
    setSelectedEditingTeam(found);
    if (found) {
      setEditingMatchSelection(found.name);
      setEditingMatchOther('');
    } else {
      setEditingMatchSelection('__other');
      setEditingMatchOther(match.away || '');
    }
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    const awayValue = editingMatchSelection === '__other' ? editingMatchOther : editingMatchSelection || editingMatch.away;
    if (!awayValue || !editingMatch.date || !editingMatch.time || !editingMatch.competition) {
      alert('Por favor completa todos los campos');
      return;
    }

    (async () => {
      try {
        const payload = { 
          away: awayValue,
          date: editingMatch.date,
          time: editingMatch.time,
          competition: editingMatch.competition,
          status: editingMatch.status,
        };
        const updated: any = await apiFetch(`/api/matches/${editingMatch.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setMatches(matches.map(m => m.id === editingMatch.id ? normalizeMatch(updated) : m));
        setEditingMatch(null);
        setEditingMatchSelection('');
        setEditingMatchOther('');
        setSelectedEditingTeam(null);
        setShowEditDialog(false);
      } catch (err: any) {
        alert(err?.body?.error || 'Error editando partido');
      }
    })();
  };

  const handleDeleteMatch = (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este partido?')) return;
    (async () => {
      try {
        await apiFetch(`/api/matches/${id}`, { method: 'DELETE' });
        setMatches(matches.filter(m => m.id !== id));
      } catch (err: any) {
        alert(err?.body?.error || 'Error eliminando partido');
      }
    })();
  };

  const handleSimulateMatch = (matchId: number) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      const homeGoals = Math.floor(Math.random() * 5);
      const awayGoals = Math.floor(Math.random() * 4);
      const attendance = Math.floor(Math.random() * 8000) + 12000;
      
      setSimulationResults([
        ...simulationResults,
        {
          matchId,
          match: `${match.home} vs ${match.away}`,
          homeGoals,
          awayGoals,
          attendance,
          date: new Date().toLocaleString('es-CO'),
        }
      ]);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data: any = await apiFetch('/api/matches');
        setMatches(normalizeMatches(data));
      } catch (err) {
        console.error('Error loading matches', err);
      }
    })();
  }, []);

  // If teams load after opening edit dialog, try to reconcile the selection
  useEffect(() => {
    if (!editingMatch) return;
    const found = teams.find(t => t.name === editingMatch.away) || null;
    if (found) {
      setSelectedEditingTeam(found);
      setEditingMatchSelection(found.name);
      setEditingMatchOther('');
    }
  }, [teams]);

  // Load Colombian teams from TheSportsDB for the visitor select
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?s=Soccer&c=Colombia');
        const json = await res.json();
        if (json && json.teams) {
          // Filter out female teams and national/select teams (e.g., Colombia U20, Colombia Women)
          const filtered = json.teams.filter((t: any) => {
            const name = (t.strTeam || '').toLowerCase();
            const gender = (t.strGender || '').toLowerCase();
            if (gender === 'female') return false;
            // exclude selections/national teams and youth teams
            if (name.includes('colombia')) return false;
            if (name.includes('selecci') || name.includes('selection')) return false;
            if (name.includes('women') || name.includes('femen')) return false;
            // exclude youth teams like u17, u20, u23
            if (/\bu\d{1,2}\b/.test(name)) return false;
            return true;
          });

          const mapped = filtered.map((t: any) => ({
            name: t.strTeam,
            badge: t.strTeamBadge,
            stadium: t.strStadium,
            formed: t.intFormedYear,
          }));
          setTeams(mapped);
        }
      } catch (err) {
        console.error('Error fetching teams from TheSportsDB', err);
      }
    })();
  }, []);

  const totalRevenue = matches.reduce((sum, m) => sum + parseInt(m.revenue), 0);
  const totalTickets = matches.reduce((sum, m) => sum + m.ticketsSold, 0);
  const averageAttendance = matches.length > 0 ? Math.round(totalTickets / matches.length) : 0;
  const formattedTotalRevenue = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(totalRevenue);

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
                <h1 className="text-xl text-blue-900">Panel de Administrador</h1>
                <p className="text-sm text-gray-600">Sistema de Gestión - Once Caldas</p>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-900">
                {formattedTotalRevenue}
              </div>
              <p className="text-xs text-gray-500 mt-1">Temporada 2025</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Boletas Vendidas</CardTitle>
              <Users className="h-4 w-4 text-blue-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-900">
                {totalTickets.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">En {matches.length} partidos</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Asistencia Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-900">
                {averageAttendance.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Por partido</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="matches">Gestión de Partidos</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="simulation">Simulación</TabsTrigger>
          </TabsList>

          {/* Matches Management */}
          <TabsContent value="matches" className="space-y-6">
            <Card className="border-2 border-blue-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-900">Partidos Programados</CardTitle>
                    <CardDescription>Crear, modificar o cancelar partidos</CardDescription>
                  </div>
                  <Dialog open={showNewMatchDialog} onOpenChange={setShowNewMatchDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Partido
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Partido</DialogTitle>
                        <DialogDescription>
                          Ingresa los datos del partido
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Equipo Visitante</Label>
                          <div className="flex items-center gap-3">
                            <select
                              value={newMatchSelection}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewMatchSelection(val);
                                if (val === '__other') {
                                  setSelectedNewTeam(null);
                                  setNewMatchOther('');
                                  setNewMatch({ ...newMatch, away: '' });
                                } else {
                                  const found = teams.find(t => t.name === val) || null;
                                  setSelectedNewTeam(found);
                                  setNewMatch({ ...newMatch, away: val });
                                  setNewMatchOther('');
                                }
                              }}
                              className="w-full px-3 py-2 border rounded-md text-sm"
                            >
                              <option value="">Selecciona un equipo visitante</option>
                              {teams.map((t) => (
                                <option key={t.name} value={t.name}>{t.name}</option>
                              ))}
                              <option value="__other">Otro</option>
                            </select>
                            {selectedNewTeam && (
                              <img src={selectedNewTeam.badge} alt={selectedNewTeam.name} className="w-10 h-10 object-contain" />
                            )}
                          </div>
                          {selectedNewTeam && (
                            <p className="text-xs text-gray-500 mt-2">{selectedNewTeam.stadium} • Fundado: {selectedNewTeam.formed || '—'}</p>
                          )}
                          {newMatchSelection === '__other' && (
                            <div className="mt-2">
                              <Input
                                placeholder="Nombre del equipo visitante"
                                value={newMatchOther}
                                onChange={(e) => {
                                  setNewMatchOther(e.target.value);
                                  setNewMatch({ ...newMatch, away: e.target.value });
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha</Label>
                          <Input
                            type="date"
                            value={newMatch.date}
                            onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Hora</Label>
                          <Input
                            type="time"
                            value={newMatch.time}
                            onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Competición</Label>
                          <select
                            value={newMatch.competition}
                            onChange={(e) => setNewMatch({ ...newMatch, competition: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="">Selecciona una competición</option>
                            <option value="Liga BetPlay">Liga BetPlay</option>
                            <option value="Copa BetPlay">Copa BetPlay</option>
                            <option value="Superliga BetPlay">Superliga BetPlay</option>
                            <option value="Copa Libertadores">Copa Libertadores</option>
                            <option value="Copa Sudamericana">Copa Sudamericana</option>
                            <option value="Recopa Sudamericana">Recopa Sudamericana</option>
                          </select>
                        </div>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleCreateMatch}
                        >
                          Crear Partido
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Competición</TableHead>
                      <TableHead>Boletas</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell>
                          {match.home} vs {match.away}
                        </TableCell>
                        <TableCell>
                          {match.formattedDateTime}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-700 text-blue-700">
                            {match.competition}
                          </Badge>
                        </TableCell>
                        <TableCell>{match.ticketsSold.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            maximumFractionDigits: 0,
                          }).format(match.revenue)}
                        </TableCell>
                        <TableCell>
                          {match.status === 'active' ? (
                            <Badge className="bg-green-600 text-white border-0">
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="border-0">
                              Inactivo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-700"
                              onClick={() => handleEditMatch(match)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => handleDeleteMatch(match.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="border-2 border-blue-700">
              <CardHeader>
                <CardTitle className="text-blue-900">Reporte de Ventas y Asistencia</CardTitle>
                <CardDescription>Estadísticas detalladas por partido</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Boletas Vendidas</TableHead>
                      <TableHead>% Ocupación</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Promedio/Boleta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match) => {
                      const occupancy = ((match.ticketsSold / 28000) * 100).toFixed(1);
                      const avgPrice = match.ticketsSold > 0 
                        ? Math.round(match.revenue / match.ticketsSold / 100)
                        : 0;
                      
                      return (
                        <TableRow key={match.id}>
                          <TableCell className="text-blue-900">
                            {match.home} vs {match.away}
                          </TableCell>
                          <TableCell>{match.date}</TableCell>
                          <TableCell>{match.ticketsSold.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                                  style={{ width: `${occupancy}%` }}
                                />
                              </div>
                              <span className="text-sm">{occupancy}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-green-700">
                            {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              maximumFractionDigits: 0,
                            }).format(match.revenue)}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              maximumFractionDigits: 0,
                            }).format(avgPrice * 100)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulation */}
          <TabsContent value="simulation" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-blue-900">Simulación de Partidos</CardTitle>
                  <CardDescription>Simula resultados aleatorios para pruebas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matches.map((match) => (
                    <div 
                      key={match.id} 
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                    >
                      <div>
                        <p className="text-blue-900">{match.home} vs {match.away}</p>
                        <p className="text-sm text-gray-500">{match.date}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleSimulateMatch(match.id)}
                      >
                        <Shuffle className="mr-2 h-4 w-4" />
                        Simular
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 border-green-700">
                <CardHeader>
                  <CardTitle className="text-blue-900">Resultados de Simulación</CardTitle>
                  <CardDescription>Últimos resultados generados</CardDescription>
                </CardHeader>
                <CardContent>
                  {simulationResults.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No hay simulaciones aún</p>
                      <p className="text-sm">Simula un partido para ver resultados</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {simulationResults.slice(-5).reverse().map((result, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200"
                        >
                          <p className="text-blue-900 mb-2">{result.match}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl text-green-700">
                              {result.homeGoals} - {result.awayGoals}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Asistencia</p>
                              <p className="text-blue-900">{result.attendance.toLocaleString()}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{result.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Match Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Partido</DialogTitle>
            <DialogDescription>
              Modifica los datos del partido o cambia su estado
            </DialogDescription>
          </DialogHeader>
          {editingMatch && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Equipo Visitante</Label>
                <div className="flex items-center gap-3">
                  <select
                    value={editingMatchSelection}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingMatchSelection(val);
                      if (val === '__other') {
                        setSelectedEditingTeam(null);
                        setEditingMatchOther(editingMatch.away || '');
                        setEditingMatch({ ...editingMatch, away: '' });
                      } else {
                        const found = teams.find(t => t.name === val) || null;
                        setSelectedEditingTeam(found);
                        setEditingMatch({ ...editingMatch, away: val });
                        setEditingMatchOther('');
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">Selecciona un equipo visitante</option>
                    {teams.map((t) => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                    <option value="__other">Otro</option>
                  </select>
                  {selectedEditingTeam && (
                    <img src={selectedEditingTeam.badge} alt={selectedEditingTeam.name} className="w-10 h-10 object-contain" />
                  )}
                </div>
                {selectedEditingTeam && (
                  <p className="text-xs text-gray-500 mt-2">{selectedEditingTeam.stadium} • Fundado: {selectedEditingTeam.formed || '—'}</p>
                )}
                {editingMatchSelection === '__other' && (
                  <div className="mt-2">
                    <Input
                      placeholder="Nombre del equipo visitante"
                      value={editingMatchOther}
                      onChange={(e) => {
                        setEditingMatchOther(e.target.value);
                        setEditingMatch({ ...editingMatch, away: e.target.value });
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={editingMatch.date}
                  onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={editingMatch.time}
                  onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Competición</Label>
                <select
                  value={editingMatch.competition}
                  onChange={(e) => setEditingMatch({ ...editingMatch, competition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">Selecciona una competición</option>
                  <option value="Liga BetPlay">Liga BetPlay</option>
                  <option value="Copa BetPlay">Copa BetPlay</option>
                  <option value="Superliga BetPlay">Superliga BetPlay</option>
                  <option value="Copa Libertadores">Copa Libertadores</option>
                  <option value="Copa Sudamericana">Copa Sudamericana</option>
                  <option value="Recopa Sudamericana">Recopa Sudamericana</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex gap-2">
                  <Button
                    className={`flex-1 ${editingMatch.status === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-2 border-green-600 text-green-600 hover:bg-green-50'}`}
                    variant={editingMatch.status === 'active' ? 'default' : 'outline'}
                    onClick={() => setEditingMatch({ ...editingMatch, status: 'active' })}
                  >
                    Activo
                  </Button>
                  <Button
                    className={`flex-1 ${editingMatch.status === 'inactive' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-2 border-red-600 text-red-600 hover:bg-red-50'}`}
                    variant={editingMatch.status === 'inactive' ? 'default' : 'outline'}
                    onClick={() => setEditingMatch({ ...editingMatch, status: 'inactive' })}
                  >
                    Inactivo
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveEdit}
                >
                  Guardar Cambios
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingMatch(null);
                    setShowEditDialog(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

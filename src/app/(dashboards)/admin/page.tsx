"use client"
import * as React from "react"
import { mockStats, chartData, mockReports, mockAgents, mockVehicles } from "@/lib/mockData"
import { FileText, Activity, Users, Truck, BrainCircuit, CheckCircle2, Clock, TrendingUp, TrendingDown, AlertTriangle, Zap, MapPin, Radio, Fuel } from "lucide-react"
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAppStore } from "@/lib/store"

const COLORS = ['#16A34A', '#2563EB', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B']

const statusColor: Record<string, string> = {
  'En attente': 'bg-amber-500',
  'Validé': 'bg-blue-500',
  'Assigné': 'bg-violet-500',
  'En cours': 'bg-sky-500',
  'Complété': 'bg-green-500',
  'Rejeté': 'bg-red-500',
}

function MetricCard({ label, value, sub, trend, color, icon: Icon, delay = 0 }: {
  label: string; value: string | number; sub?: string; trend?: number
  color: string; icon: React.ElementType; delay?: number
}) {
  const up = trend !== undefined && trend >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="overflow-hidden relative">
        <div className={`absolute inset-0 opacity-[0.06] ${color}`} />
        <CardContent className="p-5 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-15`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {trend !== undefined && (
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-black tracking-tight">{value}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AgentStatusDot({ status }: { status: string }) {
  const cls = status === 'En mission' ? 'bg-green-500' : status === 'Disponible' ? 'bg-blue-500' : 'bg-gray-400'
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${cls} ${status === 'En mission' ? 'animate-pulse' : ''}`} />
  )
}

export default function AdminDashboard() {
  const { signalements } = useAppStore()
  const urgent = signalements.filter(r => r.priorite === 'critique' && r.statut !== 'resolu' && r.statut !== 'ferme' && r.statut !== 'rejete')
  const radialData = [
    { name: 'Taux', value: mockStats.successRate, fill: '#16A34A' },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Opérations en direct</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground mt-1 text-sm">Douala Métropole · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        {/* <div className="hidden md:flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-4 py-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-lg font-black text-green-700">{mockStats.todayCompleted}</p>
            <p className="text-xs text-green-600 font-medium">collectes aujourd'hui</p>
          </div>
        </div> */}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Signalements totaux" value={signalements?.length} trend={12.5} color="bg-primary" icon={FileText} delay={0} />
        <MetricCard label="Agents actifs" value={`${mockStats.activeAgents}`} sub="sur 52 disponibles" color="bg-blue-600" icon={Users} delay={0.05} />
        <MetricCard label="Validation IA" value={`${mockStats.aiValidationRate}%`} trend={2.1} color="bg-violet-600" icon={BrainCircuit} delay={0.1} />
        <MetricCard label="Temps moyen" value={`${mockStats.avgResponseTime}h`} trend={-4} color="bg-amber-500" icon={Clock} delay={0.15} />
      </div>

      {/* Main Content — 3 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Area Chart — takes 2 cols */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Évolution des signalements (2024)</CardTitle>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">+18% vs N-1</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.monthlyReports} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "10px", border: "1px solid hsl(var(--border))", boxShadow: "0 8px 32px rgb(0 0 0 / 0.12)" }}
                      itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                      labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: 12, marginBottom: 4 }}
                    />
                    <Area type="monotone" dataKey="reports" stroke="#16A34A" strokeWidth={2.5} fillOpacity={1} fill="url(#grad1)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completion radial + donut */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Taux de complétion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative h-[150px] w-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'hsl(var(--muted))' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{mockStats.successRate}%</span>
                    <span className="text-xs text-muted-foreground font-medium">succès</span>
                  </div>
                </div>

                <div className="w-full mt-4 space-y-2">
                  {chartData.completionRate.map((d) => (
                    <div key={d.day} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">{d.day}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.rate}%` }} />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right">{d.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        {/* District Hotspots */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Points noirs (Arrondissements)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.districts} layout="vertical" margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} width={55} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14}>
                      {chartData.districts.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Type breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Répartition par type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-[130px] w-[130px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData.wasteTypes} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {chartData.wasteTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {chartData.wasteTypes.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-foreground truncate flex-1">{entry.name}</span>
                      <span className="text-xs font-bold text-muted-foreground">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Urgent */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-sm h-full border-destructive/30 overflow-hidden flex flex-col">
            <div className="h-1 bg-destructive w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> Urgences ({urgent.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 overflow-y-auto">
              {urgent.map((r) => (
                <Link key={r.id} href={`/admin/signalements/${r.id}`}>
                  <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">{r.categorie}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive text-white shrink-0">{r.priorite}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{r.adresse}</p>
                  </div>
                </Link>
              ))}
              {urgent.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                  <p className="text-sm font-medium">Aucune urgence</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Third row: agents + vehicles + AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Agent Status */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" /> Agents
                </CardTitle>
                <Link href="/admin/agents">
                  <span className="text-xs text-primary font-semibold hover:underline">Voir tout →</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{agent.name}</p>
                    <div className="flex items-center gap-1.5">
                      <AgentStatusDot status={agent.status} />
                      <span className="text-xs text-muted-foreground">{agent.status}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{agent.completedMissions} ✓</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Fleet */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> Flotte
                </CardTitle>
                <Link href="/admin/vehicules">
                  <span className="text-xs text-primary font-semibold hover:underline">Voir tout →</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockVehicles.map((v) => {
                const fuelColor = v.fuelLevel > 50 ? 'bg-green-500' : v.fuelLevel > 20 ? 'bg-amber-500' : 'bg-red-500'
                const statusBg = v.status === 'En service' ? 'bg-green-100 text-green-700' : v.status === 'Disponible' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                return (
                  <div key={v.id} className="p-2.5 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="font-semibold text-sm">{v.registration}</span>
                        <span className="text-xs text-muted-foreground ml-2">{v.type}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusBg}`}>{v.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-3 h-3 text-muted-foreground shrink-0" />
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${fuelColor}`} style={{ width: `${v.fuelLevel}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{v.fuelLevel}%</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommandations */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Card className="shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5">
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="w-5 h-5 text-white" />
                <span className="text-white font-bold">Suggestions IA</span>
              </div>
              <p className="text-violet-200 text-xs">3 actions prioritaires détectées</p>
            </div>
            <CardContent className="p-0 flex-1">
              <div className="divide-y text-sm">
                {[
                  { icon: TrendingUp, text: "Renforcer la collecte 3ème Arr.", sub: "Pic +15% depuis 48h", color: "text-orange-500" },
                  { icon: Truck, text: "Maintenance préventive VEH-002", sub: "Prochaine révision dans 3 jours", color: "text-blue-500" },
                  { icon: Zap, text: "Optimiser tournée Sud-Ouest", sub: "Économie estimée : 2,4h agent/jour", color: "text-green-600" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className={`mt-0.5 shrink-0 ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
                <Link href="/admin/validation-ia">
                  <div className="p-4 text-center text-primary font-semibold text-sm hover:bg-muted/40 transition-colors cursor-pointer">
                    Voir toutes les recommandations →
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
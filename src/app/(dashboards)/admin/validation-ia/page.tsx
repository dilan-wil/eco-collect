"use client"
import * as React from "react"
import { mockReports } from "@/lib/mockData"
import { KpiCard } from "@/components/ui/KpiCard"
import { BrainCircuit, Eye, Target, Zap, ShieldCheck } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, LineChart, Line } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ValidationIA() {
  const data = [
    { range: "95-100%", count: 1240 },
    { range: "90-95%", count: 3200 },
    { range: "80-90%", count: 4100 },
    { range: "70-80%", count: 2150 },
    { range: "50-70%", count: 850 },
    { range: "< 50%", count: 120 },
  ]

  const recentAnalyzed = mockReports.filter(r => r.aiConfidence > 0).slice(0, 8)

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Validation IA</h1>
        <p className="text-muted-foreground mt-1">Performances et monitoring du modèle de vision artificielle.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Images Analysées" value="11,660" icon={Eye} className="border-primary/20 bg-primary/5" />
        <KpiCard title="Précision Détection" value="94.2%" icon={Target} />
        <KpiCard title="Temps Moyen/Image" value="1.2s" icon={Zap} />
        <KpiCard title="Validations Auto." value="8,745" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Distribution des scores de confiance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#16A34A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-500/20">
          <CardHeader className="bg-blue-500/5 pb-4 border-b border-blue-500/10">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> Apprentissage Continu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Nouveau modèle v2.4 prêt</span>
                <span className="text-muted-foreground">+2.1% Précision</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Déployer en production</Button>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Axes d'amélioration</h4>
              <div className="flex justify-between items-center text-sm">
                <span>Déchets organiques de nuit</span>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">64% Confiance</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Gravats partiellement couverts</span>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">71% Confiance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold tracking-tight mb-4">Flux d'analyse récent</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentAnalyzed.map((report) => (
          <div key={report.id} className="border rounded-xl bg-card overflow-hidden group">
            <div className="h-32 bg-muted relative flex items-center justify-center">
               <span className="font-bold text-muted-foreground/30 text-2xl uppercase">{report.wasteType}</span>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <Badge variant="secondary" className="bg-white/90 text-black border-0">{report.aiConfidence}% IA</Badge>
               </div>
            </div>
            <div className="p-3 text-sm">
              <p className="font-semibold truncate mb-1">{report.aiObjects.join(', ')}</p>
              <p className="text-xs text-muted-foreground truncate">ID: {report.id}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
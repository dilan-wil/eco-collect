"use client"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapComponent } from "@/components/ui/MapComponent"
import { BrainCircuit, Layers } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function Clustering() {
  const clusters = [
    { id: "C1", name: "Cluster Hyper-Centre", density: "Critique", reports: 27, color: "#EF4444", coords: [45.7640, 4.8357] },
    { id: "C2", name: "Cluster Part-Dieu", density: "Élevé", reports: 15, color: "#F59E0B", coords: [45.7606, 4.8595] },
    { id: "C3", name: "Cluster Tête d'Or", density: "Moyen", reports: 6, color: "#3B82F6", coords: [45.7788, 4.8532] }
  ]

  const pieData = clusters.map(c => ({ name: c.name, value: c.reports, color: c.color }))

  const mapMarkers = clusters.map(c => ({
    id: c.id,
    lat: c.coords[0],
    lng: c.coords[1],
    color: c.color,
    popup: <div className="font-bold">{c.name}</div>
  }))

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Layers className="w-8 h-8 text-primary" /> Clustering K-Means
        </h1>
        <p className="text-muted-foreground mt-1">Analyse spatiale algorithmique pour l'optimisation des tournées.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm h-[500px]">
             {/* Note: In a real app we'd draw circles around these markers using react-leaflet Circle */}
            <MapComponent markers={mapMarkers} height="100%" zoom={13} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <Card key={cluster.id} className="border-t-4 shadow-sm" style={{ borderTopColor: cluster.color }}>
                <CardContent className="p-5">
                  <h3 className="font-bold mb-1">{cluster.name}</h3>
                  <p className="text-2xl font-black mb-3">{cluster.reports} <span className="text-sm font-normal text-muted-foreground">dépôts</span></p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted">{cluster.density}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> Synthèse IA
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Le modèle a identifié 3 zones de forte concentration de déchets plastiques et cartons. Il est recommandé de déployer un camion benne grande capacité sur le Cluster C1 dans les 4 prochaines heures.
              </p>
              
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
"use client"
import * as React from "react"
import { MapComponent } from "@/components/ui/MapComponent"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Layers, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function CarteAdmin() {
  const navigate = useRouter()
  const { signalements } = useAppStore()
  const mapMarkers = signalements.map(r => ({
    id: r.id,
    lat: r.latitude ?? 4,
    lng: r.longitude ?? 9,
    color: r.statut === 'resolu' ? '#16A34A' : r.statut === 'nouveau' ? '#F59E0B' : r.priorite === 'critique' ? '#EF4444' : '#3B82F6',
    popup: (
      <div className="p-2 min-w-[200px]">
        <div className="flex justify-between items-start mb-2">
          <p className="font-bold text-sm">{r.categorie}</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium">{r.statut}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{r.adresse}</p>
        <button onClick={() => navigate.push(`/admin/signalements/${r.id}`)} className="w-full py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded hover:bg-primary/20 transition-colors">
          Voir détails
        </button>
      </div>
    )
  }))

  return (
    <>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        <div className="mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Map</h1>
            <p className="text-muted-foreground mt-1">Vue géographique en temps réel des dépôts et interventions.</p>
          </div>
        </div>

        <div className="flex-1 relative rounded-xl overflow-hidden border shadow-sm flex">
          {/* Map Layer */}
          <div className="flex-1 h-full">
            <MapComponent markers={mapMarkers} height="100%" className="border-0 rounded-none rounded-l-xl" />
          </div>

          {/* Map Sidebar Overlay */}
          <div className="w-80 bg-card border-l h-full flex flex-col z-[1000] shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.05)]">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-bold flex items-center gap-2"><Filter className="w-4 h-4" /> Filtres de Carte</h3>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Légende / Statuts</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-amber-500 ring-2 ring-background shadow-sm"></div>
                    <span>En attente ({signalements.filter(r => r.statut === 'nouveau').length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-background shadow-sm"></div>
                    <span>Assigné / En cours ({signalements.filter(r => r.statut === 'en_cours').length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 ring-2 ring-background shadow-sm"></div>
                    <span>Complété ({signalements.filter(r => r.statut === 'resolu').length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-background shadow-sm"></div>
                    <span className="font-medium">Priorité Critique</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Calques IA</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg border bg-primary/5 cursor-pointer">
                    <input type="checkbox" className="rounded text-primary" defaultChecked />
                    <span className="text-sm font-medium flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary" /> Zones de densité (Heatmap)</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <input type="checkbox" className="rounded text-primary" />
                    <span className="text-sm flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Clusters d'optimisation</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
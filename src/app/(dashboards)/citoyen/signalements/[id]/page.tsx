"use client"
import * as React from "react"
import { mockReports } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Timeline, TimelineEvent } from "@/components/ui/Timeline"
import { AIResultCard } from "@/components/ui/AIResultCard"
import { MapComponent } from "@/components/ui/MapComponent"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Calendar, Box, AlertCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function SignalementDetail() {
  const navigate = useRouter()
  const params = useParams()
  const id = params.id
  
  const report = mockReports.find(r => r.id === id) || mockReports[0] // fallback for prototype

  // Generate timeline based on status
  const events: TimelineEvent[] = [
    {
      id: "1",
      title: "Signalement soumis",
      description: "Vous avez signalé ce dépôt.",
      date: new Date(report.createdAt).toLocaleString('fr-FR'),
      status: 'completed',
      type: 'submit'
    }
  ]

  if (report.aiConfidence > 0) {
    events.push({
      id: "2",
      title: "Validation IA",
      description: "L'IA a confirmé le type et le volume.",
      date: new Date(new Date(report.createdAt).getTime() + 1000 * 60 * 5).toLocaleString('fr-FR'),
      status: 'completed',
      type: 'ai'
    })
  }

  if (['Assigné', 'En cours', 'Complété'].includes(report.status)) {
    events.push({
      id: "3",
      title: "Mission assignée",
      description: "Une équipe a été désignée pour la collecte.",
      date: new Date(report.updatedAt).toLocaleString('fr-FR'),
      status: report.status === 'Assigné' ? 'current' : 'completed',
      type: 'assign'
    })
  } else if (report.status === 'En attente') {
    events.push({
      id: "3",
      title: "En attente d'assignation",
      date: "Bientôt",
      status: 'pending',
      type: 'assign'
    })
  }

  if (['En cours', 'Complété'].includes(report.status)) {
    events.push({
      id: "4",
      title: "Collecte en cours",
      description: "L'équipe est sur les lieux.",
      date: new Date(report.updatedAt).toLocaleString('fr-FR'),
      status: report.status === 'En cours' ? 'current' : 'completed',
      type: 'collect'
    })
  }

  if (report.status === 'Complété') {
    events.push({
      id: "5",
      title: "Mission terminée",
      description: "Le site a été nettoyé avec succès.",
      date: new Date(new Date(report.updatedAt).getTime() + 1000 * 60 * 45).toLocaleString('fr-FR'),
      status: 'completed',
      type: 'complete'
    })
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate.push('/citoyen/mes-signalements')} className="mb-4 text-muted-foreground -ml-4 hover:bg-transparent hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Signalement {report.id}</h1>
              <StatusBadge status={report.status} />
            </div>
            <div className="flex items-center text-muted-foreground gap-4 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(report.createdAt).toLocaleDateString('fr-FR')}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {report.district}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border overflow-hidden bg-card">
            <div className={`h-64 flex items-center justify-center opacity-80 ${
              report.wasteType === 'Plastique' ? 'bg-blue-100' : 
              report.wasteType === 'Organique' ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {/* Photo placeholder */}
              <div className="text-center">
                <Box className="w-16 h-16 mx-auto mb-2 text-current opacity-50" />
                <p className="font-bold text-xl uppercase tracking-widest opacity-50">{report.wasteType}</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{report.description || "Aucune description fournie."}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Type</p>
                  <p className="font-semibold">{report.wasteType}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Volume estimé</p>
                  <p className="font-semibold">{report.volume}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Priorité</p>
                  <p className={`font-semibold flex items-center gap-1.5 ${report.priority === 'Critique' ? 'text-destructive' : ''}`}>
                    {report.priority === 'Critique' && <AlertCircle className="w-3.5 h-3.5" />}
                    {report.priority}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight mb-4">Analyse IA</h3>
            <AIResultCard 
              confidence={report.aiConfidence}
              objects={report.aiObjects}
              accumulationLevel={report.accumulationLevel}
              estimatedTime="45 min"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight mb-4">Localisation</h3>
            <MapComponent 
              markers={[{ id: report.id, lat: report.lat, lng: report.lng, color: '#16A34A' }]}
              center={[report.lat, report.lng]}
              zoom={15}
            />
            <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {report.address}
            </p>
          </div>
        </div>

        <div>
          <div className="bg-card border rounded-2xl p-6 sticky top-24 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-6">Suivi du dossier</h3>
            <Timeline events={events} />
          </div>
        </div>
      </div>
    </>
  )
}
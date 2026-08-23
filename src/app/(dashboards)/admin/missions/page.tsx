"use client"

import * as React from "react"
import { missionsApi } from "@/lib/api"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, Truck, MoreHorizontal, Loader2 } from "lucide-react"
import { Mission, MissionStatut } from "@/lib/types" // or wherever your types are

export default function Missions() {
  const [missions, setMissions] = React.useState<Mission[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Charger les missions au montage
  React.useEffect(() => {
    loadMissions()
  }, [])

  const loadMissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await missionsApi.getAll()
      // Filtrer pour n'avoir que les missions actives (planifiee, en_cours, en_retard)
      const activeMissions = data?.filter((m: Mission) => 
        ['planifiee', 'en_cours', 'en_retard'].includes(m.statut)
      ) || []
      setMissions(activeMissions)
    } catch (err) {
      console.error("Erreur lors du chargement des missions:", err)
      setError("Impossible de charger les missions. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les missions par recherche
  const filteredMissions = React.useMemo(() => {
    if (!searchQuery.trim()) return missions
    
    const query = searchQuery.toLowerCase()
    return missions.filter(mission => 
      mission.description?.toLowerCase().includes(query) ||
      mission.reference?.toLowerCase().includes(query) ||
      mission.agent?.nom_complet?.toLowerCase().includes(query) ||
      mission.signalement?.adresse?.toLowerCase().includes(query) ||
      mission.signalement?.ville?.toLowerCase().includes(query) ||
      mission.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }, [missions, searchQuery])

  // Fonction pour obtenir le statut affiché
  const getDisplayStatus = (statut: MissionStatut): 'Assigné' | 'En cours' | 'Complété' => {
    switch (statut) {
      case 'planifiee':
        return 'Assigné'
      case 'en_cours':
        return 'En cours'
      case 'en_retard':
        return 'En cours'
      case 'terminee':
        return 'Complété'
      default:
        return 'Assigné'
    }
  }

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut: MissionStatut) => {
    switch (statut) {
      case 'planifiee':
        return 'bg-amber-500'
      case 'en_cours':
        return 'bg-blue-500'
      case 'en_retard':
        return 'bg-red-500'
      case 'terminee':
        return 'bg-green-500'
      case 'annulee':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Fonction pour formater la date
  const formatDate = (date: Date | null) => {
    if (!date) return 'Non définie'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'critique':
        return 'bg-red-100 text-red-700'
      case 'haute':
        return 'bg-orange-100 text-orange-700'
      case 'normale':
        return 'bg-blue-100 text-blue-700'
      case 'basse':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Fonction pour obtenir le libellé du type de mission
  const getMissionTypeLabel = (type: string | null) => {
    if (!type) return null
    const labels: Record<string, string> = {
      'collecte': 'Collecte',
      'inspection': 'Inspection',
      'maintenance': 'Maintenance',
      'urgente': 'Urgente'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadMissions}>Réessayer</Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Missions de Collecte</h1>
          <p className="text-muted-foreground mt-1">
            Suivi des interventions sur le terrain. {missions.length} mission(s) active(s)
          </p>
        </div>
        <Button className="shrink-0">Nouvelle tournée</Button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par adresse, agent ou référence..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune mission active trouvée</p>
          {searchQuery && <p className="text-sm mt-2">Essayez de modifier votre recherche</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => {
            const agent = mission.agent
            const signalement = mission.signalement
            
            return (
              <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-1.5 w-full ${getStatusColor(mission.statut)}`}></div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <StatusBadge status={getDisplayStatus(mission.statut)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-bold truncate">{mission.reference || 'Mission'}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(mission.priorite)}`}>
                      {mission.priorite || 'normale'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">
                    {signalement?.adresse || 
                     signalement?.ville || 
                     mission.description || 
                     'Adresse non spécifiée'}
                  </p>
                  
                  <div className="space-y-3 text-sm border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Truck className="w-4 h-4" /> Équipe
                      </span>
                      <span className="font-medium">{agent?.nom_complet || 'En attente'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Début
                      </span>
                      <span className="font-medium">{formatDate(mission.date_debut)}</span>
                    </div>
                    {mission.date_fin_prevue && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Fin prévue
                        </span>
                        <span className="font-medium">{formatDate(mission.date_fin_prevue)}</span>
                      </div>
                    )}
                    {mission.type_mission && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> Type
                        </span>
                        <span className="font-medium">{getMissionTypeLabel(mission.type_mission)}</span>
                      </div>
                    )}
                    {mission.signalement?.categorie && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> Catégorie
                        </span>
                        <span className="font-medium">{mission.signalement.categorie}</span>
                      </div>
                    )}
                    {mission.tags && mission.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {mission.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {mission.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{mission.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

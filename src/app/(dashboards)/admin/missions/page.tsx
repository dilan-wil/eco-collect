import * as React from "react"
import { mockReports, mockAgents } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/form-elements"
import { Search, MapPin, Clock, Truck, MoreHorizontal } from "lucide-react"

export default function Missions() {
  const missions = mockReports.filter(r => ['Assigné', 'En cours', 'Complété'].includes(r.status))
  
  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Missions de Collecte</h1>
          <p className="text-muted-foreground mt-1">Suivi des interventions sur le terrain.</p>
        </div>
        <Button className="shrink-0">Nouvelle tournée</Button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher par adresse ou agent..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map(mission => {
          const agent = mission.agentId ? mockAgents.find(a => a.id === mission.agentId) : null
          return (
            <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-1.5 w-full ${mission.status === 'Complété' ? 'bg-green-500' : mission.status === 'En cours' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <StatusBadge status={mission.status} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="font-bold mb-1 truncate">{mission.wasteType}</h3>
                <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">{mission.address}</p>
                
                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Truck className="w-4 h-4" /> Équipe
                    </span>
                    <span className="font-medium">{agent ? agent.name : 'En attente'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Estimé
                    </span>
                    <span className="font-medium">45 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Distance
                    </span>
                    <span className="font-medium">1.2 km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
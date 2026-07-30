import * as React from "react"
import { Phone, Mail, Award, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "./card"
import { StatusBadge } from "./StatusBadge"
import { Button } from "./button"

export function AgentCard({ agent }: { agent: any }) {
  const isAvailable = agent.status === "Disponible"
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all group">
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-inner relative">
                {agent.name.split(' ').map((n: string) => n[0]).join('')}
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-background rounded-full ${
                  isAvailable ? 'bg-green-500' : 
                  agent.status === "En mission" ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{agent.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-foreground">{agent.rating}</span>/5
                </div>
              </div>
            </div>
            <StatusBadge status={agent.status} />
          </div>
          
          <div className="space-y-2 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {agent.phone}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="truncate">{agent.email}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 py-3 border-t">
            <div className="text-center">
              <div className="flex justify-center items-center gap-1 text-muted-foreground mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider">Missions</span>
              </div>
              <p className="font-bold text-lg">{agent.completedMissions}</p>
            </div>
            <div className="text-center border-l">
              <div className="flex justify-center items-center gap-1 text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider">Moyenne</span>
              </div>
              <p className="font-bold text-lg">42m</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-muted/50 border-t flex gap-2">
          <Button variant={isAvailable ? "default" : "outline"} className="w-full text-sm h-9">
            Assigner
          </Button>
          <Button variant="outline" className="w-full text-sm h-9">
            Profil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
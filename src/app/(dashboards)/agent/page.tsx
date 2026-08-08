"use client"
import * as React from "react"
import { mockReports, mockVehicles } from "@/lib/mockData"
import { MapComponent } from "@/components/ui/MapComponent"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  MapPin, Navigation, CheckCircle2, Clock, Truck,
  Fuel, ChevronRight, AlertTriangle, Play, Star
} from "lucide-react"
import { Mission } from "@/lib/types"
import { missionsApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

const priorityColor: Record<string, string> = {
  Critique: 'bg-red-100 text-red-700 border-red-200',
  Haute:    'bg-orange-100 text-orange-700 border-orange-200',
  Normale:  'bg-blue-100 text-blue-700 border-blue-200',
  Basse:    'bg-gray-100 text-gray-600 border-gray-200',
}

const stopColor = (status: string) => {
  if (status === 'Complété') return 'bg-green-500'
  if (status === 'En cours') return 'bg-blue-500 animate-pulse'
  return 'bg-amber-400'
}

export default function AgentDashboard() {
  const { user } = useAuth()
  const [missions, setMissions] = React.useState<Mission[]>([])
  const completed  = missions.filter(r => r.statut === 'terminee').length
  const inProgress = missions.filter(r => r.statut === 'en_cours').length
  const remaining  = missions.length - completed
  const progress   = Math.round((completed / missions.length) * 100)

  const vehicle = missions[0]?.vehicule

  const mapMarkers = missions.map(r => ({
    id: r.id,
    lat: r.signalement?.latitude ?? 4,
    lng: r.signalement?.longitude ?? 9,
    color: r.statut === 'terminee' ? '#22C55E' : r.statut === 'en_cours' ? '#3B82F6' : '#F59E0B'
  }))

  React.useEffect(() => {
    if(!user) return
    const getMissions = async () => {
      const { data } = await missionsApi.getByAgent(user.id)
      setMissions(data)
    }
    getMissions()
  }, [user])

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-3xl font-black tracking-tight">Ma Tournée</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-amber-700">4.8</span>
        </div>
      </div>

      {/* Progress + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Big progress card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sm:col-span-1"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-emerald-500 p-5 text-white">
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-2">Progression</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-black">{progress}%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between text-xs opacity-80 mt-1.5">
                <span>{completed} complétées</span>
                <span>{remaining} restantes</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mini stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sm:col-span-2 grid grid-cols-3 gap-3"
        >
          {[
            { label: "Missions", value: missions.length, icon: CheckCircle2, color: 'text-primary' },
            { label: "En cours",  value: inProgress,           icon: Play,          color: 'text-blue-500' },
            { label: "Distance",  value: "14 km",              icon: Navigation,    color: 'text-violet-500' },
            { label: "Durée est.", value: "~3h",               icon: Clock,         color: 'text-amber-500' },
            { label: "Score jour", value: "96%",              icon: Star,          color: 'text-green-600' },
            { label: "Alertes",   value: missions.filter(r => r.signalement?.priorite === 'critique').length, icon: AlertTriangle, color: 'text-red-500' },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold leading-tight">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Vehicle banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{vehicle?.type} · {vehicle?.immatriculation}</p>
                <p className="text-xs text-muted-foreground">{vehicle?.capacite} · Maintenance : {vehicle?.statut_maintenance}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Fuel className="w-4 h-4 text-muted-foreground" />
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${vehicle && vehicle?.niveau_carburant > 50 ? 'bg-green-500' : vehicle && vehicle?.niveau_carburant > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${vehicle?.niveau_carburant}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{vehicle?.niveau_carburant}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Stop list */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Arrêts du jour</h2>
            <Link href="/agent/missions">
              <span className="text-xs text-primary font-semibold hover:underline">Tout voir →</span>
            </Link>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-border" />

            <div className="space-y-3">
              {missions.map((mission, idx) => {
                const isDone = mission.statut === 'terminee'
                const isCurrent = mission.statut === 'en_cours'

                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <div className={`flex gap-4 ${isDone ? 'opacity-60' : ''}`}>
                      {/* Stop number */}
                      <div className="relative z-10 shrink-0 flex flex-col items-center pt-3">
                        <div className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center font-black text-sm
                          ${isDone ? 'border-green-500 bg-green-50 text-green-700'
                            : isCurrent ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200'
                            : 'border-border bg-card text-muted-foreground'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                      </div>

                      {/* Card */}
                      <Card className={`flex-1 overflow-hidden transition-all ${isCurrent ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'} ${isDone ? 'bg-muted/30' : ''}`}>
                        <div className={`h-1 w-full ${stopColor(mission.statut)}`} />
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm">{mission.signalement?.categorie}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${priorityColor[mission.signalement?.priorite ?? "basse"]}`}>
                                  {mission.signalement?.priorite}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                                    EN COURS
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{mission.signalement?.adresse}</span>
                              </p>
                            </div>
                            <StatusBadge status={mission.statut} />
                          </div>

                          {!isDone && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="h-7 text-xs flex-1">
                                <Link href={`/agent/mission/${mission.id}`}>Détails <ChevronRight className="w-3 h-3 ml-0.5" /></Link>
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                <Navigation className="w-3 h-3" /> GPS
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-4">Carte de la tournée</h2>
            <div className="rounded-2xl border shadow-sm overflow-hidden h-[340px] lg:h-[520px]">
              <MapComponent markers={mapMarkers} height="100%" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Complété</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> En cours</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> À faire</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
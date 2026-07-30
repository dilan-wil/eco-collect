"use client"
import * as React from "react"
import { mockReports, mockAgents } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Search, Filter, MapPin, Clock, AlertTriangle,
  ChevronRight, CheckCircle2, Loader2, Navigation
} from "lucide-react"

const STATUS_TABS = ['Toutes', 'Assigné', 'En cours', 'Complété']

const priorityColor: Record<string, string> = {
  Critique: 'bg-red-100   text-red-700   border-red-200',
  Haute:    'bg-amber-100 text-amber-700  border-amber-200',
  Normale:  'bg-blue-50   text-blue-600   border-blue-200',
  Basse:    'bg-slate-100 text-slate-600  border-slate-200',
}

export default function AgentMissions() {
  const allMissions = mockReports.filter(r => ['Assigné', 'En cours', 'Complété'].includes(r.status))
  const [tab, setTab] = React.useState('Toutes')
  const [search, setSearch] = React.useState('')

  const filtered = allMissions.filter(m => {
    if (tab !== 'Toutes' && m.status !== tab) return false
    if (search && !m.address.toLowerCase().includes(search.toLowerCase()) && !m.wasteType.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    Toutes: allMissions.length,
    Assigné: allMissions.filter(m => m.status === 'Assigné').length,
    'En cours': allMissions.filter(m => m.status === 'En cours').length,
    Complété: allMissions.filter(m => m.status === 'Complété').length,
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Missions</h1>
          <p className="text-muted-foreground mt-1">Historique et suivi de toutes vos interventions.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          {[
            { label: 'En cours', value: counts['En cours'], color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Complétées', value: counts.Complété, color: 'bg-green-50 text-green-700 border-green-200' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl px-4 py-2 text-center ${s.color}`}>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par adresse ou type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap border transition-colors
                ${tab === t ? 'bg-primary text-white border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}>
              {t} <span className="opacity-60 ml-0.5">({counts[t as keyof typeof counts] ?? filtered.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mission list */}
      <div className="space-y-3">
        {filtered.map((mission, i) => {
          const isActive = mission.status === 'En cours'
          const isDone = mission.status === 'Complété'
          return (
            <motion.div key={mission.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className={`bg-card border rounded-2xl overflow-hidden transition-shadow hover:shadow-md ${isActive ? 'border-blue-300 ring-1 ring-blue-200' : ''}`}>
                {/* Priority stripe */}
                <div className={`h-1 w-full ${isDone ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-amber-400'}`} />
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5
                      ${isDone ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-amber-100'}`}>
                      {isDone
                        ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                        : isActive
                        ? <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        : <Navigation className="w-5 h-5 text-amber-600" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm">{mission.id}</span>
                        <StatusBadge status={mission.status} />
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColor[mission.priority]}`}>
                          {mission.priority === 'Critique' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                          {mission.priority}
                        </span>
                      </div>
                      <p className="font-semibold">{mission.wasteType} — {mission.volume}</p>
                      <p className="text-sm text-muted-foreground flex items-start gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{mission.address}</span>
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 45 min
                      </p>
                      {!isDone && (
                        <Link href={`/agent/mission/${mission.id}`}>
                          <Button size="sm" variant={isActive ? 'default' : 'outline'} className="gap-1">
                            {isActive ? 'Continuer' : 'Détails'} <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune mission trouvée</p>
          </div>
        )}
      </div>
    </>
  )
}
"use client"
import * as React from "react"
import { mockReports } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Search, Plus, BrainCircuit, MapPin, Calendar, Package } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const wasteIcon: Record<string, { bg: string; text: string; label: string }> = {
  Plastique:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'PLA' },
  Organique:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'ORG' },
  Construction: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'CON' },
  Électronique: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'ELE' },
  Ménager:      { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'MEN' },
  Dangereux:    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'DAN' },
}

const priorityDot: Record<string, string> = {
  Critique: 'bg-red-500',
  Haute:    'bg-orange-500',
  Normale:  'bg-blue-400',
  Basse:    'bg-gray-400',
}

const tabStatusMap: Record<string, string | null> = {
  'Tous': null,
  'En attente': 'En attente',
  'En cours': 'En cours',
  'Complétés': 'Complété',
  'Rejetés': 'Rejeté',
}

const tabs = Object.keys(tabStatusMap)

export default function MesSignalements() {
  const myReports = mockReports.filter(r => r.citizenId === "CIT-001")
  const [filter, setFilter] = React.useState('Tous')
  const [search, setSearch]   = React.useState('')

  const filteredReports = myReports.filter(r => {
    const mapped = tabStatusMap[filter]
    if (mapped && r.status !== mapped) return false
    const q = search.toLowerCase()
    if (q && !r.address.toLowerCase().includes(q) && !r.wasteType.toLowerCase().includes(q)) return false
    return true
  })

  const countFor = (tab: string) => {
    const mapped = tabStatusMap[tab]
    if (!mapped) return myReports.length
    return myReports.filter(r => r.status === mapped).length
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Mes Signalements</h1>
          <p className="text-muted-foreground text-sm mt-1">{myReports.length} contributions · suivez l'avancement en temps réel</p>
        </div>
        <Button className="shrink-0">
          <Link href="/citoyen/nouveau-signalement">
            <Plus className="w-4 h-4 mr-2" /> Nouveau
          </Link>
        </Button>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-hide flex-1">
          {tabs.map(tab => {
            const count = countFor(tab)
            const active = filter === tab
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                  active ? 'bg-white/25 text-white' : 'bg-muted text-muted-foreground'
                }`}>{count}</span>
              </button>
            )
          })}
        </div>
        <div className="relative shrink-0 sm:w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 bg-card h-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards grid */}
      <AnimatePresence mode="popLayout">
        {filteredReports.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Search className="w-7 h-7" />
            </div>
            <p className="font-semibold text-lg text-foreground">Aucun signalement trouvé</p>
            <p className="text-sm mt-1">Essayez un autre filtre ou modifiez votre recherche</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredReports.map((report, i) => {
              const meta = wasteIcon[report.wasteType] ?? { bg: 'bg-gray-100', text: 'text-gray-700', label: '?' }
              const date = new Date(report.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

              return (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/citoyen/signalement/${report.id}`}>
                    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer h-full flex flex-col">
                      {/* Top accent */}
                      <div className={`h-1 w-full ${priorityDot[report.priority].replace('bg-', 'bg-')}`} />

                      <div className="p-4 flex flex-col flex-1">
                        {/* Icon + type + status */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${meta.bg} ${meta.text} shrink-0`}>
                              {meta.label}
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-tight">{report.wasteType}</p>
                              <p className="text-[11px] text-muted-foreground font-medium">{report.volume}</p>
                            </div>
                          </div>
                          <StatusBadge status={report.status} />
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-1.5 mb-3 flex-1">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground line-clamp-2">{report.address}</p>
                        </div>

                        {/* Footer row */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {report.aiConfidence > 0 && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                <BrainCircuit className="w-3 h-3" />
                                {report.aiConfidence}%
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Package className="w-3 h-3" />
                              {report.accumulationLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover CTA */}
                      <div className="px-4 pb-4 hidden group-hover:block">
                        <div className="w-full h-8 rounded-lg bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-all">
                          <Eye className="w-3.5 h-3.5" /> Voir les détails
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
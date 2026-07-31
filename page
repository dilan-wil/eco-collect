import * as React from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { useParams, useRouter } from "next/navigation"
import { useMissionStore } from "@/lib/missionStore"
import { mockAgents, mockVehicles } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { MapComponent } from "@/components/ui/MapComponent"
import { AssignModal } from "@/components/ui/AssignModal"
import { motion } from "framer-motion"
import { toast } from "sonner"

import {
  ArrowLeft, MapPin, User, Truck, BrainCircuit, Clock,
  CheckCircle2, XCircle, AlertTriangle, Star, Fuel,
  Navigation, RotateCcw, Calendar, Flag, Package, Zap
} from "lucide-react"

const CITIZEN_PHOTOS = [
  'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
]

const priorityBadge: Record<string, string> = {
  Critique: 'bg-red-100 text-red-700 border-red-200',
  Haute:    'bg-orange-100 text-orange-700 border-orange-200',
  Normale:  'bg-blue-50 text-blue-700 border-blue-200',
  Basse:    'bg-slate-100 text-slate-600 border-slate-200',
}

const STATUS_TIMELINE = [
  { status: 'En attente', label: 'Signalé',  icon: Flag },
  { status: 'Validé',     label: 'Validé',   icon: CheckCircle2 },
  { status: 'Assigné',    label: 'Assigné',  icon: User },
  { status: 'En cours',   label: 'En cours', icon: Navigation },
  { status: 'Complété',   label: 'Terminé',  icon: CheckCircle2 },
]

const STATUS_ORDER = ['En attente', 'Validé', 'Assigné', 'En cours', 'Complété']

export default function AdminMissionDetail() {
  const navigate = useRouter()
  const params = useParams()
  const { reports, validateReport, rejectReport, unassignReport } = useMissionStore()

  const report = reports.find(r => r.id === params.id as string)
  const [showAssign, setShowAssign] = React.useState(false)
  const [showReject, setShowReject] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState('')

  if (!report) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p className="font-semibold text-lg">Mission introuvable</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate.push('/admin/missions')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux missions
          </Button>
        </div>
      </AppLayout>
    )
  }

  const agent   = report.agentId   ? mockAgents.find(a => a.id === report.agentId)   : null
  const vehicle = report.vehicleId ? mockVehicles.find(v => v.id === report.vehicleId) : null
  const citizenPhoto = CITIZEN_PHOTOS[Math.abs(report.id.charCodeAt(4)) % CITIZEN_PHOTOS.length]
  const currentStep  = STATUS_ORDER.indexOf(report.status)

  const handleValidate = () => {
    validateReport(report.id)
    toast.success('Signalement validé — prêt à être assigné')
  }
  const handleRejectConfirm = () => {
    rejectReport(report.id, rejectReason || 'Rejeté par l\'administrateur')
    toast('Signalement rejeté')
    setShowReject(false)
    setRejectReason('')
  }
  const handleUnassign = () => {
    unassignReport(report.id)
    toast('Mission désassignée — retournée au pool')
  }

  return (
    <>
      {/* Back */}
      <button
        onClick={() => setLocation('/admin/missions')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux missions
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-black">{report.id}</h1>
            <StatusBadge status={report.status} />
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${priorityBadge[report.priority]}`}>
              {report.priority === 'Critique' && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
              {report.priority}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{report.wasteType} · {report.volume} · {report.district}</p>
        </div>

        {/* Admin actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {report.status === 'En attente' && (
            <>
              <Button className="gap-1.5" onClick={handleValidate}>
                <CheckCircle2 className="w-4 h-4" /> Valider
              </Button>
              <Button variant="destructive" className="gap-1.5" onClick={() => setShowReject(true)}>
                <XCircle className="w-4 h-4" /> Rejeter
              </Button>
            </>
          )}
          {report.status === 'Validé' && (
            <Button className="gap-1.5" onClick={() => setShowAssign(true)}>
              <User className="w-4 h-4" /> Assigner un agent
            </Button>
          )}
          {report.status === 'Assigné' && (
            <Button variant="outline" className="gap-1.5 text-muted-foreground" onClick={handleUnassign}>
              <RotateCcw className="w-4 h-4" /> Réassigner
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Status timeline */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card border rounded-2xl p-5">
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5">Progression</h2>
              <div className="flex items-center gap-0">
                {STATUS_TIMELINE.map((step, i) => {
                  if (report.status === 'Rejeté') {
                    const isRejected = step.status === 'En attente'
                    return (
                      <React.Fragment key={step.status}>
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRejected ? 'bg-red-500' : 'bg-muted'}`}>
                            {isRejected ? <XCircle className="w-4 h-4 text-white" /> : <step.icon className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <span className={`text-[10px] font-semibold text-center leading-tight ${isRejected ? 'text-red-600' : 'text-muted-foreground'}`}>
                            {isRejected ? 'Rejeté' : step.label}
                          </span>
                        </div>
                        {i < STATUS_TIMELINE.length - 1 && <div className="h-px flex-1 bg-muted mb-5" />}
                      </React.Fragment>
                    )
                  }
                  const done    = i < currentStep
                  const current = i === currentStep
                  return (
                    <React.Fragment key={step.status}>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          done    ? 'bg-primary text-primary-foreground' :
                          current ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                                    'bg-muted text-muted-foreground'
                        }`}>
                          <step.icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-semibold text-center leading-tight w-14 ${current ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < STATUS_TIMELINE.length - 1 && (
                        <div className={`h-0.5 flex-1 mb-5 transition-all ${done ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
              {report.status === 'Rejeté' && report.rejectReason && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                  <span className="font-semibold">Motif : </span>{report.rejectReason}
                </div>
              )}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <MapComponent
                markers={[{ id: report.id, lat: report.lat, lng: report.lng, color: '#16A34A' }]}
                height="260px"
                center={[report.lat, report.lng]}
                zoom={16}
              />
            </div>
          </motion.div>

          {/* Citizen photo */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Photo du citoyen</h2>
            <div className="rounded-2xl overflow-hidden border shadow-sm relative">
              <img src={citizenPhoto} alt="Signalement" className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-2">
                {report.aiObjects.map(obj => (
                  <span key={obj} className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">{obj}</span>
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" /> IA {report.aiConfidence}%
              </div>
            </div>
          </motion.div>

          {/* Description */}
          {report.description && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <div className="bg-muted/40 border rounded-xl p-4 text-sm">
                <p className="font-bold mb-1">Notes du citoyen</p>
                <p className="text-muted-foreground leading-relaxed">{report.description}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Details grid */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
            <div className="bg-card border rounded-2xl p-5">
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Détails</h2>
              <div className="space-y-3 text-sm">
                {[
                  { icon: MapPin,    label: 'Adresse',        value: report.address },
                  { icon: Flag,      label: 'Type',           value: report.wasteType },
                  { icon: Package,   label: 'Volume',         value: report.volume },
                  { icon: AlertTriangle, label: 'Priorité',   value: report.priority },
                  { icon: BrainCircuit, label: 'Confiance IA', value: `${report.aiConfidence}%` },
                  { icon: Calendar,  label: 'Signalé le',     value: new Date(report.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                  { icon: Clock,     label: 'Mis à jour',     value: new Date(report.updatedAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Agent card */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
            <div className="bg-card border rounded-2xl p-5">
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Agent Assigné</h2>
              {agent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-base shrink-0">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.zone}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold">{agent.rating}</span>
                        <span className="text-xs text-muted-foreground">· {agent.completedMissions} missions</span>
                      </div>
                    </div>
                  </div>
                  <a href={`tel:${agent.phone}`} className="block">
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                      📞 {agent.phone}
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-40" />
                  <p className="text-sm text-muted-foreground mb-3">Aucun agent assigné</p>
                  {report.status === 'Validé' && (
                    <Button size="sm" className="w-full" onClick={() => setShowAssign(true)}>
                      Assigner un agent
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Vehicle card */}
          {vehicle && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 }}>
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Véhicule</h2>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{vehicle.registration}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.type} · {vehicle.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold">{vehicle.fuelLevel}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Assign modal */}
      {showAssign && (
        <AssignModal report={report} onClose={() => setShowAssign(false)} />
      )}

      {/* Reject modal */}
      {showReject && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowReject(false) }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-3xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold">Rejeter le signalement</h3>
                <p className="text-xs text-muted-foreground">{report.id}</p>
              </div>
            </div>
            <label className="text-sm font-semibold block mb-2">Motif du rejet</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Photo floue, doublon, hors zone…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowReject(false)}>Annuler</Button>
              <Button variant="destructive" className="flex-1" onClick={handleRejectConfirm}>Confirmer</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

"use client"
import * as React from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { mockReports } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { MapComponent } from "@/components/ui/MapComponent"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  ArrowLeft, MapPin, Navigation, CheckCircle2, AlertTriangle,
  Camera, Clock, Zap, Trash2, Upload, PlayCircle, Flag, Phone
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"

/* ── mock citizen photo placeholder ── */
const CITIZEN_PHOTOS = [
  'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
]

export default function MissionDetail() {
  const navigate = useRouter()
  const params = useParams()
  const id = params.id

  const [report, setReport] = React.useState(mockReports.find(r => r.id === id) || mockReports[1])
  const [cleanPhoto, setCleanPhoto] = React.useState<string | null>(null)
  const [dragOver, setDragOver] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const citizenPhoto = CITIZEN_PHOTOS[Math.abs(report.id.charCodeAt(4)) % CITIZEN_PHOTOS.length]

  const mapMarkers = [{ id: report.id, lat: report.lat, lng: report.lng, color: '#3B82F6' }]

  const handleStart = () => {
    setReport(r => ({ ...r, status: 'En cours' }))
    toast.success('Mission démarrée — bonne intervention !')
  }

  const handleComplete = () => {
    if (!cleanPhoto) { toast.error('Prenez une photo du site nettoyé avant de valider'); return }
    setReport(r => ({ ...r, status: 'Complété' }))
    toast.success('Mission terminée ! +30 points gagnés 🎉')
    setTimeout(() => navigate.push('/agent/dashboard'), 1800)
  }

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setCleanPhoto(URL.createObjectURL(file))
    toast.success('Photo ajoutée')
  }

  const priorityBadge: Record<string, string> = {
    Critique: 'bg-red-100 text-red-700 border-red-200',
    Haute:    'bg-amber-100 text-amber-700 border-amber-200',
    Normale:  'bg-blue-50 text-blue-700 border-blue-200',
    Basse:    'bg-slate-100 text-slate-600 border-slate-200',
  }

  return (
    <AppLayout>
      {/* Back + title */}
      <div className="mb-6">
        <button onClick={() => navigate.push('/agent/dashboard')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à la tournée
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-bold">Mission {report.id}</h1>
              <StatusBadge status={report.status} />
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityBadge[report.priority]}`}>
                {report.priority === 'Critique' && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
                {report.priority}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{report.wasteType} · Volume {report.volume}</p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <Navigation className="w-4 h-4" /> Naviguer
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {/* ── MAP (top, full width) ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border shadow-sm">
          <MapComponent markers={mapMarkers} height="280px" center={[report.lat, report.lng]} zoom={16} />
        </motion.div>

        {/* ── Location card ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-card border rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold">{report.address}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{report.district}</p>
            <p className="text-xs font-mono text-muted-foreground">{report.lat.toFixed(5)}, {report.lng.toFixed(5)}</p>
          </div>
          <a href={`https://maps.google.com/?q=${report.lat},${report.lng}`} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1 shrink-0">
              <Navigation className="w-3.5 h-3.5" /> Y aller
            </Button>
          </a>
        </motion.div>

        {/* ── Citizen photo ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Photo du citoyen
          </h2>
          <div className="rounded-2xl overflow-hidden border shadow-sm relative">
            <img src={citizenPhoto} alt="Photo signalement" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-2">
              {report.aiObjects.map(obj => (
                <span key={obj} className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
                  {obj}
                </span>
              ))}
            </div>
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" /> IA : {report.aiConfidence}%
            </div>
          </div>
        </motion.div>

        {/* ── Mission details grid ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Trash2,  label: 'Type',      value: report.wasteType },
              { icon: Flag,    label: 'Priorité',  value: report.priority },
              { icon: Zap,     label: 'Volume',    value: report.volume },
              { icon: Clock,   label: 'Estimé',    value: '45 min' },
            ].map(item => (
              <div key={item.label} className="bg-card border rounded-xl p-3 text-center">
                <item.icon className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                <p className="font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Description ── */}
        {report.description && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-muted/50 border rounded-xl p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Notes du citoyen</p>
            {report.description}
          </motion.div>
        )}

        {/* ── Clean photo upload (only when en cours) ── */}
        <AnimatePresence>
          {report.status === 'En cours' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.22 }}>
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Photo après nettoyage
              </h2>
              {cleanPhoto ? (
                <div className="rounded-2xl overflow-hidden border relative">
                  <img src={cleanPhoto} alt="Après nettoyage" className="w-full h-48 object-cover" />
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Photo ajoutée
                  </div>
                  <button onClick={() => setCleanPhoto(null)} className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">Changer</button>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f) }}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all
                    ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'}`}>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Prendre une photo du site nettoyé</p>
                    <p className="text-xs text-muted-foreground mt-1">Glissez ou cliquez pour sélectionner</p>
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileChange(f) }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Action buttons ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="pb-4">
          {report.status === 'Assigné' && (
            <Button className="w-full h-13 text-base gap-2 rounded-xl py-4 shadow-lg shadow-primary/20" onClick={handleStart}>
              <PlayCircle className="w-5 h-5" /> Démarrer l'intervention
            </Button>
          )}

          {report.status === 'En cours' && (
            <div className="space-y-3">
              <Button onClick={handleComplete}
                className="w-full h-13 py-4 text-base gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                <CheckCircle2 className="w-5 h-5" /> Marquer comme terminée
              </Button>
              <Button variant="outline" className="w-full gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" /> Contacter le superviseur
              </Button>
            </div>
          )}

          {report.status === 'Complété' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 flex items-center gap-3 text-green-800 dark:text-green-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold">Mission accomplie !</p>
                <p className="text-sm opacity-80">Cette mission a été complétée avec succès.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  )
}
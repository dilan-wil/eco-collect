"use client"
import * as React from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Moon, Sun, Bell, User, Shield, Truck, Star, Award,
  Camera, CheckCircle2, MapPin, Phone, Mail, Lock,
  TrendingUp, Users, BarChart3, Edit3, Save
} from "lucide-react"
import { getInitials } from "@/lib/get-initials"

/* ─── shared sub-components ─────────────────────────────── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${on ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function Field({ label, type = 'text', defaultValue, icon: Icon }: any) {
  const [editing, setEditing] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-background transition-colors ${editing ? 'border-primary ring-1 ring-primary/20' : 'border-input'}`}>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
        <input type={type} value={value} readOnly={!editing}
          onChange={e => setValue(e.target.value)}
          className="flex-1 text-sm bg-transparent focus:outline-none" />
        <button onClick={() => { if (editing) toast.success('Modifié'); setEditing(e => !e) }}
          className="text-muted-foreground hover:text-primary transition-colors">
          {editing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function NotifRow({ label, desc }: { label: string; desc: string }) {
  const [on, setOn] = React.useState(true)
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <Toggle on={on} onToggle={() => setOn(v => !v)} />
    </div>
  )
}

/* ─── role-specific panels ───────────────────────────────── */
function CitoyenProfile({ darkMode, setDarkMode }: any) {
  const { user } = useAppStore()
  const stats = [
    { value: '12', label: 'Signalements', icon: Camera, color: 'bg-primary/10 text-primary' },
    { value: '9',  label: 'Collectés',    icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
    { value: '420', label: 'Points',      icon: Star, color: 'bg-amber-100 text-amber-700' },
  ]
  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <s.icon className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-primary" />
          <div>
            <p className="font-bold text-sm">Gardien Vert</p>
            <p className="text-xs text-muted-foreground">180 pts pour le prochain niveau</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Progression</p>
          <div className="w-24 bg-muted rounded-full h-2">
            <div className="w-[70%] h-2 bg-primary rounded-full" />
          </div>
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> Informations personnelles</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Nom complet" defaultValue="Jean Dupont" icon={User} />
          <Field label="Adresse e-mail" type="email" defaultValue="jean.dupont@example.com" icon={Mail} />
          <Field label="Téléphone" defaultValue="06 12 34 56 78" icon={Phone} />
          <Field label="Adresse" defaultValue="15 rue de la Paix, 69001 Lyon" icon={MapPin} />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle></CardHeader>
        <CardContent>
          <NotifRow label="Statut de signalement" desc="Quand vos signalements avancent" />
          <NotifRow label="Collecte effectuée" desc="Confirmation après nettoyage" />
          <NotifRow label="Nouveaux points" desc="Quand vous gagnez des points" />
        </CardContent>
      </Card>
      <DarkModeCard darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  )
}

function AdminProfile({ darkMode, setDarkMode }: any) {
  const stats = [
    { value: '12 450', label: 'Signalements traités', icon: BarChart3, color: 'bg-primary/10 text-primary' },
    { value: '45',     label: 'Agents actifs',         icon: Users,    color: 'bg-blue-100 text-blue-700' },
    { value: '93%',    label: 'Taux de succès',        icon: TrendingUp, color: 'bg-green-100 text-green-700' },
  ]
  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <s.icon className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xl font-black">{s.value}</p>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600" /> Compte Administrateur</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Nom complet" defaultValue="Admin Lyon Métropole" icon={User} />
          <Field label="E-mail officiel" type="email" defaultValue="admin@lyon-metropole.fr" icon={Mail} />
          <Field label="Organisation" defaultValue="Métropole de Lyon - Propreté" icon={MapPin} />
          <Field label="Identifiant admin" defaultValue="ADM-001" icon={Shield} />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Lock className="w-4 h-4" /> Accès & Sécurité</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {['Gestion des signalements','Gestion des agents','Gestion de la flotte','Accès aux analytiques','Validation IA','Administration système'].map(p => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{p}
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2 gap-2"><Lock className="w-4 h-4" /> Changer le mot de passe</Button>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Alertes</CardTitle></CardHeader>
        <CardContent>
          <NotifRow label="Signalements critiques" desc="Urgences en temps réel" />
          <NotifRow label="Agents indisponibles" desc="Alerte de sous-effectif" />
          <NotifRow label="Rapports hebdomadaires" desc="Résumé chaque lundi" />
        </CardContent>
      </Card>
      <DarkModeCard darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  )
}

function AgentProfile({ darkMode, setDarkMode }: any) {
  const stats = [
    { value: '142', label: 'Missions complétées', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
    { value: '4.8', label: 'Note / 5',            icon: Star,         color: 'bg-amber-100 text-amber-700' },
    { value: '42m', label: 'Durée moy.',          icon: TrendingUp,   color: 'bg-blue-100 text-blue-700' },
  ]
  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <s.icon className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xl font-black">{s.value}</p>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> Mes informations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Nom complet" defaultValue="Jean Dupont" icon={User} />
          <Field label="E-mail" type="email" defaultValue="j.dupont@ecocollect.fr" icon={Mail} />
          <Field label="Téléphone" defaultValue="06 12 34 56 78" icon={Phone} />
          <Field label="Matricule" defaultValue="AGT-001" icon={Shield} />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Truck className="w-4 h-4 text-blue-600" /> Véhicule assigné</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { label: 'Immatriculation', value: 'AB-123-CD' },
            { label: 'Type',            value: 'Camion Benne' },
            { label: 'Capacité',        value: '12 m³' },
            { label: 'Carburant',       value: '75%', color: 'text-green-600 font-semibold' },
            { label: 'Maintenance',     value: 'À jour', color: 'text-green-600 font-semibold' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between border-b pb-2 last:border-0">
              <span className="text-muted-foreground">{row.label}</span>
              <span className={row.color ?? 'font-medium'}>{row.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle></CardHeader>
        <CardContent>
          <NotifRow label="Nouvelle mission assignée" desc="Alerte immédiate" />
          <NotifRow label="Changement d'itinéraire" desc="Optimisation en temps réel" />
          <NotifRow label="Fin de journée" desc="Résumé de la tournée" />
        </CardContent>
      </Card>
      <DarkModeCard darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  )
}

function DarkModeCard({ darkMode, setDarkMode }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-sm">
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          Mode sombre
        </div>
        <Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
      </CardContent>
    </Card>
  )
}

/* ─── avatars per role ───────────────────────────────────── */
const PROFILES = {
  CITOYEN: { name: 'Jean Dupont',       initials: 'JD', title: 'Citoyen Actif',         subtitle: 'Gardien Vert 🌿',  gradient: 'from-primary to-secondary' },
  ADMIN:   { name: 'Admin Lyon Métr.',  initials: 'AD', title: 'Administrateur',         subtitle: 'Accès complet 🔐', gradient: 'from-blue-500 to-violet-600' },
  AGENT:   { name: 'Jean Dupont',       initials: 'JD', title: 'Agent de Collecte',      subtitle: 'Note: ⭐ 4.8/5',   gradient: 'from-emerald-500 to-teal-600' },
}

export default function Profil() {
  const { role, darkMode, setDarkMode } = useAppStore()
  const p = PROFILES[role]
  const { user } = useAppStore()

  return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>

        {/* Avatar card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className={`h-28 bg-gradient-to-br ${p.gradient}`} />
            <CardContent className="px-6 pb-6 pt-0">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-black text-2xl ring-4 ring-background shadow-lg shrink-0`}>
                  {getInitials(user?.nom_complet)}
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-bold">{user?.nom_complet}</h2>
                  <p className="text-sm text-muted-foreground">{user?.role}</p>
                  <p className="text-sm font-medium text-primary">{p.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role-specific content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {role === 'CITOYEN' && <CitoyenProfile darkMode={darkMode} setDarkMode={setDarkMode} />}
          {role === 'ADMIN'   && <AdminProfile   darkMode={darkMode} setDarkMode={setDarkMode} />}
          {role === 'AGENT'   && <AgentProfile   darkMode={darkMode} setDarkMode={setDarkMode} />}
        </motion.div>
      </div>
  )
}
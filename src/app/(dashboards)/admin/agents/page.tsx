"use client"
import * as React from "react"
import { mockAgents } from "@/lib/mockData"
import { AgentCard } from "@/components/ui/AgentCard"
import { Input } from "@/components/ui/form-elements"
import { Search, Filter, Users, Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  status: string
  completedMissions: number
  organizationId: string
  rating: number
}

export default function Agents() {
  const [agents, setAgents] = React.useState<Agent[]>(mockAgents)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('Tous')
  const [showModal, setShowModal] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const [form, setForm] = React.useState({
    firstName: '', lastName: '', email: '', phone: '',
    status: 'Disponible', organizationId: 'ORG-001',
  })
  const [formErrors, setFormErrors] = React.useState<Partial<typeof form>>({})

  const filteredAgents = agents.filter(a => {
    if (statusFilter !== 'Tous' && a.status !== statusFilter) return false
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFormErrors(p => ({ ...p, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.firstName.trim()) e.firstName = 'Requis'
    if (!form.lastName.trim()) e.lastName = 'Requis'
    if (!form.email) e.email = 'Requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail invalide'
    if (!form.phone.trim()) e.phone = 'Requis'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    const newAgent: Agent = {
      id: `AGT-${String(agents.length + 1).padStart(3, '0')}`,
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      status: form.status,
      completedMissions: 0,
      organizationId: form.organizationId,
      rating: 5.0,
    }
    setAgents(prev => [...prev, newAgent])
    setSaving(false)
    setShowModal(false)
    setForm({ firstName: '', lastName: '', email: '', phone: '', status: 'Disponible', organizationId: 'ORG-001' })
    toast.success(`Agent ${newAgent.name} ajouté avec succès`)
  }

  const closeModal = () => { setShowModal(false); setFormErrors({}) }

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents de Collecte</h1>
          <p className="text-muted-foreground mt-1">Gérez vos effectifs et suivez leurs performances.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border px-4 py-2 rounded-lg shadow-sm">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">{agents.length}</span>
            <span className="text-muted-foreground text-sm">Agents totaux</span>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 rounded-lg">
            <Plus className="w-4 h-4" /> Nouvel agent
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un agent..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-r pr-3 shrink-0">
            <Filter className="w-4 h-4" /> Statut
          </div>
          {['Tous', 'Disponible', 'En mission', 'Indisponible'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === f
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Add Agent Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h2 className="text-xl font-bold">Nouvel agent</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Ajouter un agent de collecte à l'équipe</p>
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Prénom" error={formErrors.firstName}>
                      <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Jean"
                        className={fieldClass(!!formErrors.firstName)} />
                    </Field>
                    <Field label="Nom" error={formErrors.lastName}>
                      <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Dupont"
                        className={fieldClass(!!formErrors.lastName)} />
                    </Field>
                  </div>

                  <Field label="E-mail professionnel" error={formErrors.email}>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="j.dupont@ecocollect.fr"
                      className={fieldClass(!!formErrors.email)} />
                  </Field>

                  <Field label="Téléphone" error={formErrors.phone}>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="06 12 34 56 78"
                      className={fieldClass(!!formErrors.phone)} />
                  </Field>

                  <Field label="Statut initial">
                    <select value={form.status} onChange={set('status')} className={fieldClass(false)}>
                      <option value="Disponible">Disponible</option>
                      <option value="Indisponible">Indisponible</option>
                    </select>
                  </Field>

                  <Field label="Organisation">
                    <select value={form.organizationId} onChange={set('organizationId')} className={fieldClass(false)}>
                      <option value="ORG-001">EcoCollect Lyon Centre</option>
                      <option value="ORG-002">EcoCollect Lyon Est</option>
                      <option value="ORG-003">EcoCollect Lyon Ouest</option>
                    </select>
                  </Field>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>Annuler</Button>
                    <Button type="submit" className="flex-1" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter l\'agent'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${hasError ? 'border-destructive' : 'border-input'}`
}
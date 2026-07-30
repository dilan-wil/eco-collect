"use client"
import * as React from "react"
import { mockVehicles } from "@/lib/mockData"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Truck, Fuel, Wrench, Plus, X, Loader2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Vehicle {
  id: string
  registration: string
  type: string
  capacity: string
  fuelLevel: number
  status: string
  maintenanceStatus: string
  lastMaintenance: string
  currentAssignment?: string
}

export default function Vehicules() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(mockVehicles)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('Tous')
  const [showModal, setShowModal] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const [form, setForm] = React.useState({
    registration: '', type: 'Camion Benne', capacity: '',
    fuelLevel: '100', status: 'Disponible',
  })
  const [formErrors, setFormErrors] = React.useState<Partial<typeof form>>({})

  const filtered = vehicles.filter(v => {
    if (statusFilter !== 'Tous' && v.status !== statusFilter) return false
    if (search && !v.registration.toLowerCase().includes(search.toLowerCase()) && !v.type.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFormErrors(p => ({ ...p, [field]: undefined }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.registration.trim()) e.registration = 'Requis'
    else if (!/^[A-Z]{2}-\d{3}-[A-Z]{2}$/.test(form.registration.toUpperCase())) e.registration = 'Format: AB-123-CD'
    if (!form.capacity.trim()) e.capacity = 'Requis'
    const fuel = parseInt(form.fuelLevel)
    if (isNaN(fuel) || fuel < 0 || fuel > 100) e.fuelLevel = 'Entre 0 et 100'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    const newVehicle: Vehicle = {
      id: `VEH-${String(vehicles.length + 1).padStart(3, '0')}`,
      registration: form.registration.toUpperCase(),
      type: form.type,
      capacity: form.capacity.includes('m') ? form.capacity : `${form.capacity}m³`,
      fuelLevel: parseInt(form.fuelLevel),
      status: form.status,
      maintenanceStatus: 'À jour',
      lastMaintenance: new Date().toISOString().split('T')[0],
    }
    setVehicles(prev => [...prev, newVehicle])
    setSaving(false)
    setShowModal(false)
    setForm({ registration: '', type: 'Camion Benne', capacity: '', fuelLevel: '100', status: 'Disponible' })
    toast.success(`Véhicule ${newVehicle.registration} ajouté à la flotte`)
  }

  const closeModal = () => { setShowModal(false); setFormErrors({}) }

  const statusColor = (status: string) =>
    status === 'Disponible' ? 'bg-green-500' : status === 'En service' ? 'bg-blue-500' : 'bg-destructive'
  const statusText = (status: string) =>
    status === 'Disponible' ? 'text-green-600' : status === 'En service' ? 'text-blue-600' : 'text-destructive'

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flotte de Véhicules</h1>
          <p className="text-muted-foreground mt-1">Supervision de la flotte, capacités et maintenance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border px-4 py-2 rounded-lg shadow-sm">
            <Truck className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">{vehicles.length}</span>
            <span className="text-muted-foreground text-sm">Véhicules</span>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 rounded-lg">
            <Plus className="w-4 h-4" /> Nouveau véhicule
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher par immatriculation ou type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-r pr-3 shrink-0">
            <Filter className="w-4 h-4" /> Statut
          </div>
          {['Tous', 'Disponible', 'En service', 'En maintenance'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 w-full ${statusColor(vehicle.status)}`} />
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-0.5">{vehicle.registration}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-4 text-sm mt-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" /> Carburant</span>
                    <span className="font-medium">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-muted-foreground">Capacité</span>
                  <span className="font-semibold">{vehicle.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <span className={`font-medium ${statusText(vehicle.status)}`}>{vehicle.status}</span>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-xs uppercase">Maintenance</span>
                  </div>
                  <p className={`text-xs ${vehicle.maintenanceStatus === 'À jour' ? 'text-green-600' : 'text-amber-600'}`}>
                    {vehicle.maintenanceStatus} (Dernière: {new Date(vehicle.lastMaintenance).toLocaleDateString('fr-FR')})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40" onClick={closeModal} />
            <motion.div key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h2 className="text-xl font-bold">Nouveau véhicule</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Ajouter un véhicule à la flotte</p>
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="p-6 space-y-4">
                  <Field label="Immatriculation" error={formErrors.registration}>
                    <input type="text" value={form.registration} onChange={set('registration')}
                      placeholder="AB-123-CD" className={fieldClass(!!formErrors.registration)} />
                  </Field>

                  <Field label="Type de véhicule">
                    <select value={form.type} onChange={set('type')} className={fieldClass(false)}>
                      <option>Camion Benne</option>
                      <option>Fourgonnette</option>
                      <option>Camion Grue</option>
                      <option>Utilitaire Léger</option>
                      <option>Camion Compacteur</option>
                    </select>
                  </Field>

                  <Field label="Capacité (m³)" error={formErrors.capacity}>
                    <input type="text" value={form.capacity} onChange={set('capacity')}
                      placeholder="ex: 12" className={fieldClass(!!formErrors.capacity)} />
                  </Field>

                  <Field label="Niveau de carburant (%)" error={formErrors.fuelLevel}>
                    <input type="number" min="0" max="100" value={form.fuelLevel} onChange={set('fuelLevel')}
                      className={fieldClass(!!formErrors.fuelLevel)} />
                  </Field>

                  <Field label="Statut">
                    <select value={form.status} onChange={set('status')} className={fieldClass(false)}>
                      <option value="Disponible">Disponible</option>
                      <option value="En maintenance">En maintenance</option>
                    </select>
                  </Field>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>Annuler</Button>
                    <Button type="submit" className="flex-1" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter le véhicule'}
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
"use client"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Login() {
  const navigate = useRouter()
  const { setRole } = useAppStore()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})

  // Demo accounts
  const accounts = [
    { email: "citoyen@ecocollect.fr", password: "demo1234", role: "citoyen" as const, label: "Citoyen" },
    { email: "admin@ecocollect.fr", password: "demo1234", role: "admin" as const, label: "Administrateur" },
    { email: "agent@ecocollect.fr", password: "demo1234", role: "agent" as const, label: "Agent" },
  ]

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = "L'adresse e-mail est requise"
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Adresse e-mail invalide"
    if (!password) e.password = "Le mot de passe est requis"
    else if (password.length < 6) e.password = "Minimum 6 caractères"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const match = accounts.find(a => a.email === email && a.password === password)
    if (match) {
      setRole(match.role)
      toast.success(`Connexion réussie ! Bienvenue, ${match.label}.`)
      navigate.push(`/${match.role}`)
    } else {
      setErrors({ password: "E-mail ou mot de passe incorrect" })
      toast.error("Identifiants incorrects")
    }
    setLoading(false)
  }

  const loginAs = async (acc: typeof accounts[0]) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setRole(acc.role)
    toast.success(`Connexion rapide en tant que ${acc.label}`)
    navigate.push(`/${acc.role}/`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center px-6 md:px-12 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">EcoCollect<span className="text-primary">.ai</span></span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Bon retour !</h1>
              <p className="text-muted-foreground">Connectez-vous à votre espace EcoCollect AI</p>
            </div>

            {/* Form card */}
            <div className="bg-card border rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Adresse e-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                      placeholder="vous@exemple.fr"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? 'border-destructive' : 'border-input'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.password ? 'border-destructive' : 'border-input'}`}
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-xs text-primary hover:underline">Mot de passe oublié ?</button>
                </div>

                <Button type="submit" className="w-full rounded-lg h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Se connecter <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-center text-muted-foreground mb-3">Accès rapide (démo)</p>
                <div className="grid grid-cols-3 gap-2">
                  {accounts.map(acc => (
                    <button
                      key={acc.role}
                      onClick={() => loginAs(acc)}
                      disabled={loading}
                      className="py-2 px-3 text-xs font-medium rounded-lg border border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-colors text-center disabled:opacity-50"
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">Créer un compte</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
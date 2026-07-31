"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Role, useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { userApi } from "@/lib/api"
import Image from "next/image"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

type Errors = Partial<Record<keyof FormData, string>>

export default function Register() {
  const navigate = useRouter()
  const { setRole } = useAppStore()
  const { signUp, user } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>({})
  const [form, setForm] = React.useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "", acceptTerms: false
  })

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: value }))
    setErrors(p => ({ ...p, [field]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.firstName.trim()) e.firstName = "Requis"
    if (!form.lastName.trim()) e.lastName = "Requis"
    if (!form.email) e.email = "Requis"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail invalide"
    if (form.phone && !/^[0-9\s\+\-]{8,15}$/.test(form.phone)) e.phone = "Numéro invalide"
    if (!form.password) e.password = "Requis"
    else if (form.password.length < 8) e.password = "Minimum 8 caractères"
    if (!form.confirmPassword) e.confirmPassword = "Requis"
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Les mots de passe ne correspondent pas"
    if (!form.acceptTerms) e.acceptTerms = "Vous devez accepter les conditions"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signUp(form.email, form.password, {
        fullName: `${form.firstName} ${form.lastName}`,
        role: 'CITOYEN',
        phone: form.phone,
      });
      await userApi.create({
        email: form.email,
        nom_complet: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        role: 'CITOYEN',
      });
      toast.success("Account created successfully!");
    setDone(true)
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  const goToDashboard = () => {
    setRole(`${(user?.user_metadata?.role) as Role}`)
    toast.success(`Bienvenue, ${form.firstName} ! Votre compte citoyen est prêt.`)
    navigate.push(`/${(user?.user_metadata?.role).toLowerCase()}/`)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-16 flex items-center px-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ecoLogo.png"
              width={150}
              height={100}
              alt="EcoKamer Logo"
            />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Compte créé !</h2>
            <p className="text-muted-foreground mb-8">
              Bienvenue, <strong>{form.firstName}</strong> ! Votre compte citoyen EcoKamer AI est prêt.
            </p>
            <Button onClick={goToDashboard} className="rounded-full px-8 h-11">
              Accéder à mon espace <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 flex items-center px-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">EcoKamer<span className="text-primary">.ai</span></span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Créer un compte</h1>
              <p className="text-muted-foreground">Rejoignez la communauté EcoKamer AI et aidez à garder Douala propre</p>
            </div>

            <div className="bg-card border rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Prénom</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={set('firstName')}
                        placeholder="Christian"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.firstName ? 'border-destructive' : 'border-input'}`}
                      />
                    </div>
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Nom</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={set('lastName')}
                      placeholder="Talla"
                      className={`w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.lastName ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Adresse e-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="christian.talla@exemple.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? 'border-destructive' : 'border-input'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span></label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="699999999"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.phone ? 'border-destructive' : 'border-input'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Minimum 8 caractères"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.password ? 'border-destructive' : 'border-input'}`}
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      placeholder="Répéter le mot de passe"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.confirmPassword ? 'border-destructive' : 'border-input'}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div className="space-y-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={set('acceptTerms')}
                      className="mt-0.5 w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      J'accepte les <button type="button" className="text-primary hover:underline">conditions d'utilisation</button> et la{" "}
                      <button type="button" className="text-primary hover:underline">politique de confidentialité</button>
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-xs text-destructive pl-7">{errors.acceptTerms}</p>}
                </div>

                <Button type="submit" className="w-full rounded-lg h-11 mt-2" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Créer mon compte <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Déjà inscrit ?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
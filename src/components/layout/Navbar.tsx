import * as React from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { Bell, Search, Menu, ChevronDown, X } from "lucide-react"
import { Button } from "../ui/button"

export function Navbar() {
  const { role, setRole, setSidebarOpen, sidebarOpen } = useAppStore()
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const roleLabel = role === 'citoyen' ? 'Citoyen' : role === 'admin' ? 'Administrateur' : 'Agent'
  const initials = role === 'citoyen' ? 'JD' : role === 'admin' ? 'AD' : 'AG'

  return (
    <header className="h-16 glass sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 w-full transition-all border-b border-border/40">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Ouvrir le menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full bg-muted/50 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
          />
        </div>
      </div>

      {/* Right: role switcher + notifications + avatar */}
      <div className="flex items-center gap-2 md:gap-3">

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </Button>
        </Link>

        <Link href="/profil">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm cursor-pointer ring-2 ring-background shadow-sm hover:opacity-90 transition-opacity">
            {initials}
          </div>
        </Link>
      </div>
    </header>
  )
}
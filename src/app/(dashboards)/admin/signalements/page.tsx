import * as React from "react"
import { mockReports } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SignalementsAdmin() {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('Tous')

  // Map display labels → internal status values
  const filterMap: Record<string, string | null> = {
    'Tous': null,
    'En attente': 'En attente',
    'Validés': 'Validé',
    'Assignés': 'Assigné',
    'Critique': '__priority__',
  }
  
  const filteredReports = mockReports.filter(r => {
    const mapped = filterMap[statusFilter]
    if (mapped === '__priority__' && r.priority !== 'Critique') return false
    if (mapped && mapped !== '__priority__' && r.status !== mapped) return false
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.address.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Signalements</h1>
        <p className="text-muted-foreground mt-1">Liste complète des dépôts sauvages signalés.</p>
      </div>

      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par ID ou adresse..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-r pr-3 shrink-0">
            <Filter className="w-4 h-4" /> Filtres
          </div>
          {['Tous', 'En attente', 'Validés', 'Assignés', 'Critique'].map(f => (
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

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto -mx-0">
          <table className="w-full min-w-[780px] text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-4 cursor-pointer hover:text-foreground">
                  <div className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Localisation</th>
                <th className="px-4 py-4">Type / Volume</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Analyse IA</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-4 font-mono text-xs">{report.id}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(report.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground max-w-[200px] truncate">{report.address}</p>
                    <p className="text-xs text-muted-foreground">{report.district}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{report.wasteType}</p>
                    <p className="text-xs text-muted-foreground">{report.volume}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={report.status} />
                      {report.priority === 'Critique' && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 shadow-none">Critique</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {report.aiConfidence > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <span className={`w-2 h-2 rounded-full ${report.aiConfidence > 90 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          {report.aiConfidence}% Confiance
                        </div>
                        <span className="text-[10px] text-muted-foreground">{report.aiObjects[0]}...</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">En attente</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {report.status === 'Validé' && (
                        <Button size="sm" variant="default" className="h-8">Assigner</Button>
                      )}
                      <Link href={`/admin/signalement/${report.id}`}>
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
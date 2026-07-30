import * as React from "react"
import { Badge } from "./badge"

export function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" = "default"

  switch (status.toLowerCase()) {
    case 'complété':
    case 'validé':
      variant = 'success'
      break
    case 'en cours':
    case 'assigné':
      variant = 'info'
      break
    case 'en attente':
      variant = 'warning'
      break
    case 'rejeté':
    case 'critique':
      variant = 'destructive'
      break
    default:
      variant = 'secondary'
  }

  return <Badge variant={variant}>{status}</Badge>
}
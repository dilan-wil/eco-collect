import * as React from "react"
import { CheckCircle2, Clock, MapPin, Truck, AlertTriangle } from "lucide-react"

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: string
  status: 'completed' | 'current' | 'pending' | 'error'
  type: 'submit' | 'ai' | 'assign' | 'collect' | 'complete' | 'reject'
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const getIcon = (type: string, status: string) => {
    if (status === 'error') return <AlertTriangle className="w-5 h-5 text-destructive" />
    
    switch (type) {
      case 'submit': return <MapPin className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-muted-foreground'}`} />
      case 'ai': return <CheckCircle2 className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-muted-foreground'}`} />
      case 'assign': return <Truck className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-muted-foreground'}`} />
      case 'collect': return <Clock className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-muted-foreground'}`} />
      case 'complete': return <CheckCircle2 className={`w-4 h-4 ${status === 'completed' ? 'text-white' : 'text-muted-foreground'}`} />
      default: return <div className="w-2 h-2 rounded-full bg-current" />
    }
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {events.map((event, index) => (
        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
            event.status === 'completed' ? 'bg-primary' : 
            event.status === 'current' ? 'bg-blue-500' :
            event.status === 'error' ? 'bg-destructive' : 'bg-muted'
          }`}>
            {getIcon(event.type, event.status)}
          </div>
          
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`font-semibold text-sm ${event.status === 'current' ? 'text-primary' : ''}`}>
                {event.title}
              </h4>
              <time className="text-xs font-medium text-muted-foreground">{event.date}</time>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
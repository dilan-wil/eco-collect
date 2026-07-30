import * as React from "react"
import { ShieldCheck, BrainCircuit, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "./card"
import { Progress } from "./progress"
import { motion } from "framer-motion"

interface AIResultCardProps {
  confidence: number
  objects: string[]
  accumulationLevel: string
  decision?: string
  reason?: string
  estimatedTime?: string
  compact?: boolean
}

export function AIResultCard({ 
  confidence, 
  objects, 
  accumulationLevel, 
  decision, 
  reason, 
  estimatedTime,
  compact = false 
}: AIResultCardProps) {
  
  return (
    <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <BrainCircuit className="w-32 h-32 text-primary" />
      </div>
      
      <CardContent className={`relative z-10 ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-primary">Analyse IA</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Indice de confiance</span>
              <span className="font-bold">{confidence}%</span>
            </div>
            {/* Progress bar fake implementation for simplicity if radix not installed properly, else use it */}
            <div className="w-full bg-background rounded-full h-2 overflow-hidden border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-full ${confidence > 90 ? 'bg-green-500' : confidence > 70 ? 'bg-amber-500' : 'bg-red-500'}`} 
              />
            </div>
          </div>

          <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
            <div className="bg-background rounded-lg p-3 border shadow-sm">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Niveau d'accumulation</span>
              <span className={`font-semibold flex items-center gap-1.5 ${
                accumulationLevel === 'Élevé' ? 'text-destructive' : 
                accumulationLevel === 'Moyen' ? 'text-amber-500' : 'text-green-600'
              }`}>
                {accumulationLevel === 'Élevé' && <AlertTriangle className="w-4 h-4" />}
                {accumulationLevel === 'Moyen' && <AlertTriangle className="w-4 h-4" />}
                {accumulationLevel === 'Faible' && <CheckCircle2 className="w-4 h-4" />}
                {accumulationLevel}
              </span>
            </div>
            
            {estimatedTime && (
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Temps estimé</span>
                <span className="font-semibold">{estimatedTime}</span>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Objets détectés</span>
            <div className="flex flex-wrap gap-2">
              {objects.map((obj, i) => (
                <span key={i} className="px-2.5 py-1 bg-background border rounded-md text-xs font-medium shadow-sm">
                  {obj}
                </span>
              ))}
            </div>
          </div>
          
          {decision && (
            <div className={`mt-2 p-3 rounded-lg border text-sm ${decision === 'Validé' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'}`}>
              <strong>Décision: {decision}</strong> - {reason}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
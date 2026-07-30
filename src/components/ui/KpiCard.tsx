import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: { value: number; label: string }
  className?: string
  delay?: number
}

export function KpiCard({ title, value, icon: Icon, trend, className, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center text-sm">
              <span className={cn("font-medium", trend.value > 0 ? "text-green-600" : "text-red-600")}>
                {trend.value > 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="text-muted-foreground ml-2">{trend.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"
import { BottomNav } from "./BottomNav"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

export function AppLayout({ children }: { children: React.ReactNode }) {
  useScrollToTop()
  
  return (
    <div className="flex min-h-[100dvh] bg-background w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 transition-all">
        <Navbar />
        {/* Extra bottom padding on mobile so content clears the floating nav */}
        <main className="flex-1 p-4 pb-24 md:pb-8 md:p-8 w-full max-w-[1600px] mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
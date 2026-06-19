import type { ReactNode } from "react"
import { BottomNav } from "@/components/bottom-nav"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full justify-center bg-muted">
      <div className="relative flex min-h-svh w-full max-w-md flex-col overflow-hidden bg-background shadow-xl">
        <div className="flex-1 pb-20">{children}</div>
        <BottomNav />
      </div>
    </div>
  )
}

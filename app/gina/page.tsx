import { Suspense } from "react"
import { AppShell } from "@/components/app-shell"
import { GinaScreen } from "@/components/gina/gina-screen"

export default function GinaPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <GinaScreen />
      </Suspense>
    </AppShell>
  )
}

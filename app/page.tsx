import { AppShell } from "@/components/app-shell"
import { SpacerHeader } from "@/components/home/spacer-header"
import { AapStatusCard } from "@/components/home/aap-status-card"

export default function HomePage() {
  return (
    <AppShell>
      <SpacerHeader />
      <AapStatusCard />
    </AppShell>
  )
}

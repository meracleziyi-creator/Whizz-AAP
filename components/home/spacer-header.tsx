"use client"

import { BatteryMedium, RefreshCw, CalendarClock, Clock } from "lucide-react"
import { useAsthma } from "@/lib/asthma-store"
import { cn } from "@/lib/utils"

export function SpacerHeader() {
  const { spacerConnected, batteryLevel, nextDose, nextAppointment } = useAsthma()

  return (
    <header className="bg-brand-gradient rounded-b-[2.5rem] px-6 pb-12 pt-10 text-white">
      <h1 className="text-center text-2xl font-bold tracking-tight text-balance">
        Hello Janice
      </h1>

      {/* Smart spacer status */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
          <span className="relative flex size-9 items-center justify-center rounded-full bg-white/90">
            <RefreshCw
              className={cn(
                "size-4 text-primary",
                spacerConnected && "animate-spin [animation-duration:3s]",
              )}
              aria-hidden="true"
            />
          </span>
          <span className="text-sm font-medium">Smart Spacer</span>
          <span className="flex items-center gap-1">
            <BatteryMedium className="size-5" aria-hidden="true" />
            <span className="text-sm font-semibold">{batteryLevel}%</span>
          </span>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 text-sm font-semibold",
            spacerConnected ? "text-white" : "text-white/80",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              spacerConnected ? "bg-zone-green" : "bg-white/70",
            )}
            aria-hidden="true"
          />
          {spacerConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Upcoming */}
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
          Upcoming
        </p>
        <div className="mt-3 divide-y divide-white/25">
          <UpcomingRow
            icon={<Clock className="size-4" aria-hidden="true" />}
            label="Next Spacer Session"
            value={nextDose}
          />
          <UpcomingRow
            icon={<CalendarClock className="size-4" aria-hidden="true" />}
            label="Next Doctor's Appointment"
            value={nextAppointment}
          />
        </div>
      </div>
    </header>
  )
}

function UpcomingRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium text-white/90">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold whitespace-nowrap">{value}</span>
    </div>
  )
}

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Zone = "green" | "yellow" | "red"

export type ZoneInfo = {
  id: Zone
  title: string
  message: string
}

export const ZONE_DETAILS: Record<Zone, ZoneInfo> = {
  green: {
    id: "green",
    title: "Green Zone",
    message:
      "Your asthma is under control. Continue your regular medication according to your Asthma Action Plan.",
  },
  yellow: {
    id: "yellow",
    title: "Yellow Zone",
    message:
      "Your asthma is getting worse. If no improvement 7-14 days of stepping up your medication, escalate to red zone.",
  },
  red: {
    id: "red",
    title: "Red Zone",
    message: "Step up your medication according to AAP red zone and see your doctor NOW!",
  },
}

type AsthmaState = {
  zone: Zone
  zoneUpdatedAt: string
  aapImage: string | null
  spacerConnected: boolean
  batteryLevel: number
  nextDose: string
  nextAppointment: string
}

type AsthmaContextValue = AsthmaState & {
  ready: boolean
  setZone: (zone: Zone) => void
  setAapImage: (image: string | null) => void
}

const DEFAULT_STATE: AsthmaState = {
  zone: "green",
  zoneUpdatedAt: new Date().toISOString(),
  aapImage: null,
  spacerConnected: false,
  batteryLevel: 85,
  nextDose: "Today, 8:00 PM",
  nextAppointment: "15 Aug 2026",
}

const STORAGE_KEY = "asthma-app-state-v1"

const AsthmaContext = createContext<AsthmaContextValue | null>(null)

export function AsthmaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AsthmaState>(DEFAULT_STATE)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setState({ ...DEFAULT_STATE, ...(JSON.parse(stored) as Partial<AsthmaState>) })
      }
    } catch {
      // ignore malformed storage
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state, ready])

  const setZone = (zone: Zone) =>
    setState((prev) => ({ ...prev, zone, zoneUpdatedAt: new Date().toISOString() }))

  const setAapImage = (aapImage: string | null) =>
    setState((prev) => ({ ...prev, aapImage }))

  return (
    <AsthmaContext.Provider value={{ ...state, ready, setZone, setAapImage }}>
      {children}
    </AsthmaContext.Provider>
  )
}

export function useAsthma() {
  const ctx = useContext(AsthmaContext)
  if (!ctx) throw new Error("useAsthma must be used within an AsthmaProvider")
  return ctx
}

export function formatTimestamp(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  if (isToday) return `Today, ${time}`
  return `${date.toLocaleDateString([], { day: "numeric", month: "short" })}, ${time}`
}

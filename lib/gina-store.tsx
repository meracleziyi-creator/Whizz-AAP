"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { GinaAssessment } from "@/lib/gina-types"

const STORAGE_KEY = "gina-assessments-v1"

type GinaContextValue = {
  assessments: GinaAssessment[]
  ready: boolean
  addAssessment: (assessment: GinaAssessment) => void
}

const GinaContext = createContext<GinaContextValue | null>(null)

export function GinaProvider({ children }: { children: ReactNode }) {
  const [assessments, setAssessments] = useState<GinaAssessment[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setAssessments(JSON.parse(stored) as GinaAssessment[])
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments))
    } catch {
      // ignore quota errors
    }
  }, [assessments, ready])

  const addAssessment = (assessment: GinaAssessment) => {
    setAssessments((prev) => [assessment, ...prev])
  }

  return (
    <GinaContext.Provider value={{ assessments, ready, addAssessment }}>
      {children}
    </GinaContext.Provider>
  )
}

export function useGinaAssessments() {
  const ctx = useContext(GinaContext)
  if (!ctx) throw new Error("useGinaAssessments must be used within a GinaProvider")
  return ctx
}

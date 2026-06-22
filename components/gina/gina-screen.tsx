"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ClipboardCheck, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { GinaQuestionnaire } from "@/components/gina/gina-questionnaire"
import { GinaHistory } from "@/components/gina/gina-history"

type Tab = "new" | "history"

export function GinaScreen() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>("new")

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "history") {
      setTab("history")
    }
  }, [searchParams])

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-card-gradient px-6 pb-6 pt-10">
        <div className="rounded-3xl bg-card p-6 text-center shadow-lg shadow-black/5">
          <h1 className="text-lg font-semibold text-primary">GINA Asthma Control</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Assess your asthma control over the past 4 weeks
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="mx-5 flex rounded-full bg-muted p-1">
        <button
          type="button"
          onClick={() => setTab("new")}
          aria-pressed={tab === "new"}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
            tab === "new"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ClipboardCheck className="size-4" aria-hidden="true" />
          New Assessment
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          aria-pressed={tab === "history"}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
            tab === "history"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <History className="size-4" aria-hidden="true" />
          Past Assessments
        </button>
      </div>

      {/* Content */}
      {tab === "new" ? <GinaQuestionnaire /> : <GinaHistory />}
    </div>
  )
}

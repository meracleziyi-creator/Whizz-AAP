"use client"

import { useState } from "react"
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, ChevronRight } from "lucide-react"
import type { GinaAssessment, ControlStatus } from "@/lib/gina-types"
import { CONTROL_STATUS_LABELS, formatAssessmentDate } from "@/lib/gina-types"
import { useGinaAssessments } from "@/lib/gina-store"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const CONTROL_STYLES: Record<
  ControlStatus,
  { bg: string; dot: string; icon: typeof CheckCircle; textColor: string }
> = {
  well_controlled: {
    bg: "bg-zone-green/10",
    dot: "bg-zone-green",
    icon: CheckCircle,
    textColor: "text-zone-green",
  },
  partly_controlled: {
    bg: "bg-zone-yellow/15",
    dot: "bg-zone-yellow",
    icon: AlertTriangle,
    textColor: "text-yellow-700",
  },
  poorly_controlled: {
    bg: "bg-zone-red/10",
    dot: "bg-zone-red",
    icon: AlertCircle,
    textColor: "text-zone-red",
  },
}

const QUESTION_LABELS = {
  q1_daytime_symptoms: "Daytime asthma symptoms more than twice per week?",
  q2_night_waking: "Any night waking due to asthma?",
  q3_reliever_use: "SABA reliever use for symptoms more than twice per week?",
  q4_activity_limitation: "Any activity limitation due to asthma?",
}

export function GinaHistory() {
  const { assessments, ready } = useGinaAssessments()
  const [selectedAssessment, setSelectedAssessment] = useState<GinaAssessment | null>(null)

  if (!ready) {
    return (
      <section className="px-5">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </section>
    )
  }

  if (assessments.length === 0) {
    return (
      <section className="px-5">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No past assessments recorded yet.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Complete a new assessment to start tracking your asthma control.
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="px-5">
        <div className="space-y-3">
          {assessments.map((assessment) => {
            const styles = CONTROL_STYLES[assessment.control_status as ControlStatus]
            const Icon = styles.icon
            const statusLabel = CONTROL_STATUS_LABELS[assessment.control_status as ControlStatus]

            return (
              <button
                key={assessment.id}
                type="button"
                onClick={() => setSelectedAssessment(assessment)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border border-border p-4 text-left transition-colors hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    styles.bg,
                  )}
                >
                  <Icon className={cn("size-5", styles.textColor)} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {formatAssessmentDate(assessment.assessment_date)}
                  </p>
                  <p className={cn("mt-0.5 text-xs font-medium", styles.textColor)}>
                    {statusLabel}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </section>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedAssessment}
        onOpenChange={(o) => !o && setSelectedAssessment(null)}
      >
        <DialogContent className="max-h-[90svh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>
              {selectedAssessment && formatAssessmentDate(selectedAssessment.assessment_date)}
            </DialogDescription>
          </DialogHeader>

          {selectedAssessment && (
            <AssessmentDetail assessment={selectedAssessment} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function AssessmentDetail({ assessment }: { assessment: GinaAssessment }) {
  const styles = CONTROL_STYLES[assessment.control_status as ControlStatus]
  const statusLabel = CONTROL_STATUS_LABELS[assessment.control_status as ControlStatus]

  return (
    <div className="space-y-4">
      {/* Status */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border p-4",
          styles.bg,
        )}
      >
        <span className={cn("size-3 rounded-full", styles.dot)} aria-hidden="true" />
        <span className="text-sm font-bold text-foreground">{statusLabel}</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Positive Responses</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {assessment.positive_responses} of 4
          </p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">AAP Zone</p>
          <p className="mt-1 text-lg font-bold capitalize text-foreground">
            {assessment.aap_zone_at_assessment}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Question Responses
        </p>
        {(
          [
            "q1_daytime_symptoms",
            "q2_night_waking",
            "q3_reliever_use",
            "q4_activity_limitation",
          ] as const
        ).map((key, idx) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
          >
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-muted-foreground">{idx + 1}.</span>
              <p className="text-sm text-foreground">
                {QUESTION_LABELS[key]}
              </p>
            </div>
            <span
              className={cn(
                "ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                assessment[key]
                  ? "bg-zone-red/15 text-zone-red"
                  : "bg-zone-green/15 text-zone-green",
              )}
            >
              {assessment[key] ? "Yes" : "No"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

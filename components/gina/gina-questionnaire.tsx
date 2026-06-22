"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from "lucide-react"
import { useAsthma } from "@/lib/asthma-store"
import { useGinaAssessments } from "@/lib/gina-store"
import {
  GINA_QUESTIONS,
  type GinaAnswers,
  type GinaAssessment,
  type ControlStatus,
  calculateControlStatus,
  countPositiveResponses,
  CONTROL_STATUS_LABELS,
} from "@/lib/gina-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Step = "form" | "result" | "save-confirm"

const CONTROL_STYLES: Record<ControlStatus, { bg: string; icon: typeof CheckCircle; iconColor: string; titleColor: string }> = {
  well_controlled: {
    bg: "bg-zone-green/10 border-zone-green/30",
    icon: CheckCircle,
    iconColor: "text-zone-green",
    titleColor: "text-zone-green",
  },
  partly_controlled: {
    bg: "bg-zone-yellow/20 border-zone-yellow/40",
    icon: AlertTriangle,
    iconColor: "text-zone-yellow",
    titleColor: "text-yellow-800",
  },
  poorly_controlled: {
    bg: "bg-zone-red/10 border-zone-red/30",
    icon: AlertCircle,
    iconColor: "text-zone-red",
    titleColor: "text-zone-red",
  },
}

const RISK_FACTORS = [
  "Severe asthma exacerbation within the last year",
  "Overuse of SABA reliever medication",
  "Inadequate ICS treatment",
  "Poor medication adherence",
  "Incorrect inhaler technique",
  "Exposure to smoke, e-cigarettes, allergens, or air pollution",
]

export function GinaQuestionnaire() {
  const router = useRouter()
  const { zone } = useAsthma()
  const { addAssessment } = useGinaAssessments()
  const [answers, setAnswers] = useState<GinaAnswers>({
    q1_daytime_symptoms: null,
    q2_night_waking: null,
    q3_reliever_use: null,
    q4_activity_limitation: null,
  })
  const [step, setStep] = useState<Step>("form")

  const allAnswered = Object.values(answers).every((v) => v !== null)
  const positiveCount = countPositiveResponses(answers)
  const controlStatus = calculateControlStatus(positiveCount)

  const showAapNav = controlStatus !== "well_controlled" && zone === "green"

  function setAnswer(key: keyof GinaAnswers, value: boolean) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function submitAssessment() {
    if (!allAnswered) return
    setStep("result")
  }

  function handleSaveResult() {
    setStep("save-confirm")
  }

  function confirmSave(goToAap: boolean) {
    const newAssessment: GinaAssessment = {
      id: crypto.randomUUID(),
      assessment_date: new Date().toISOString(),
      q1_daytime_symptoms: answers.q1_daytime_symptoms!,
      q2_night_waking: answers.q2_night_waking!,
      q3_reliever_use: answers.q3_reliever_use!,
      q4_activity_limitation: answers.q4_activity_limitation!,
      positive_responses: positiveCount,
      control_status: controlStatus,
      aap_zone_at_assessment: zone,
    }
    addAssessment(newAssessment)
    setStep("form")
    setAnswers({
      q1_daytime_symptoms: null,
      q2_night_waking: null,
      q3_reliever_use: null,
      q4_activity_limitation: null,
    })
    router.push(goToAap ? "/aap" : "/gina?tab=history")
  }

  function handleDontSave() {
    setStep("form")
    setAnswers({
      q1_daytime_symptoms: null,
      q2_night_waking: null,
      q3_reliever_use: null,
      q4_activity_limitation: null,
    })
  }

  return (
    <>
      {/* Questionnaire Form */}
      <section className="px-5">
        <h2 className="text-base font-semibold text-foreground">
          In the past 4 weeks, have you experienced:
        </h2>

        <div className="mt-4 space-y-3">
          {GINA_QUESTIONS.map(({ key, question }, idx) => (
            <div
              key={key}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-sm font-medium text-foreground">
                {idx + 1}. {question}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAnswer(key, true)}
                  aria-pressed={answers[key] === true}
                  className={cn(
                    "flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    answers[key] === true
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer(key, false)}
                  aria-pressed={answers[key] === false}
                  className={cn(
                    "flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    answers[key] === false
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="mt-6 w-full rounded-full"
          disabled={!allAnswered}
          onClick={submitAssessment}
        >
          Submit Assessment
        </Button>
      </section>

      {/* Result Dialog */}
      <Dialog open={step === "result"} onOpenChange={(o) => !o && setStep("form")}>
        <DialogContent className="max-h-[90svh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Results</DialogTitle>
            <DialogDescription>
              Based on your responses over the past 4 weeks
            </DialogDescription>
          </DialogHeader>

          <ResultContent
            controlStatus={controlStatus}
            positiveCount={positiveCount}
            currentZone={zone}
          />

          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="ghost" onClick={() => setStep("form")}>
              Close
            </Button>
            <Button onClick={handleSaveResult}>
              {showAapNav ? "Save Result and Go to AAP" : "Save Result"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Confirmation Dialog */}
      <Dialog open={step === "save-confirm"} onOpenChange={(o) => !o && setStep("result")}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Save Assessment Result?</DialogTitle>
            <DialogDescription>
              This will add the assessment to your Past Assessments history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="ghost" onClick={handleDontSave}>
              Don&apos;t Save
            </Button>
            <Button onClick={() => confirmSave(showAapNav)}>
              {showAapNav ? "Save Result and Go to AAP" : "Save Result"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ResultContent({
  controlStatus,
  positiveCount,
  currentZone,
}: {
  controlStatus: ControlStatus
  positiveCount: number
  currentZone: "green" | "yellow" | "red"
}) {
  const styles = CONTROL_STYLES[controlStatus]
  const Icon = styles.icon
  const statusLabel = CONTROL_STATUS_LABELS[controlStatus]

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border p-4",
          styles.bg,
        )}
      >
        <Icon className={cn("size-6", styles.iconColor)} aria-hidden="true" />
        <span className={cn("text-lg font-bold", styles.titleColor)}>{statusLabel}</span>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-muted p-4 text-sm">
        <p className="text-muted-foreground">
          Assessment Date:{" "}
          <span className="font-medium text-foreground">
            {new Date().toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="mt-1 text-muted-foreground">
          Positive Responses:{" "}
          <span className="font-medium text-foreground">{positiveCount} of 4</span>
        </p>
        <p className="mt-1 text-muted-foreground">
          Current AAP Zone:{" "}
          <span className="font-medium text-foreground capitalize">{currentZone}</span>
        </p>
      </div>

      {/* Messages based on status */}
      {controlStatus === "well_controlled" && <WellControlledMessage />}
      {controlStatus === "partly_controlled" && (
        <PartlyControlledMessage currentZone={currentZone} />
      )}
      {controlStatus === "poorly_controlled" && (
        <PoorlyControlledMessage currentZone={currentZone} />
      )}
    </div>
  )
}

function WellControlledMessage() {
  return (
    <div className="rounded-xl bg-zone-green/10 p-4">
      <p className="text-sm font-medium text-foreground">
        Your asthma symptoms are well controlled.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        However, there is still a risk of asthma exacerbation if you have any of the
        following risk factors:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {RISK_FACTORS.map((factor) => (
          <li key={factor}>{factor}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">
        Please continue taking your medications as prescribed and always carry your rescue
        inhaler with you.
      </p>
    </div>
  )
}

function PartlyControlledMessage({ currentZone }: { currentZone: "green" | "yellow" | "red" }) {
  return (
    <div className="rounded-xl bg-zone-yellow/15 p-4">
      <p className="text-sm font-medium text-foreground">
        Your asthma symptoms are partly controlled.
      </p>
      {currentZone === "green" ? (
        <p className="mt-3 text-sm text-muted-foreground">
          You may be experiencing an asthma flare-up. Review your Asthma Action Plan and
          determine whether you need to step up to the Yellow Zone according to your
          healthcare provider&apos;s instructions.
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Continue following your medication plan according to your Asthma Action Plan and
          monitor your symptoms closely.
        </p>
      )}
    </div>
  )
}

function PoorlyControlledMessage({ currentZone }: { currentZone: "green" | "yellow" | "red" }) {
  return (
    <div className="rounded-xl bg-zone-red/10 p-4">
      <p className="text-sm font-medium text-foreground">
        Your asthma symptoms are poorly controlled.
      </p>
      {currentZone === "green" ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Follow your Asthma Action Plan Red Zone instructions and speak to your
          healthcare provider as soon as possible.
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Speak to your healthcare provider as soon as possible and continue following your
          Asthma Action Plan.
        </p>
      )}
    </div>
  )
}

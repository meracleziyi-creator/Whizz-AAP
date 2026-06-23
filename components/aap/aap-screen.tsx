"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil, X, ShieldCheck } from "lucide-react"
import {
  useAsthma,
  ZONE_DETAILS,
  formatTimestamp,
} from "@/lib/asthma-store"
import { ZONE_STYLES } from "@/lib/zone-styles"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AapUpload } from "@/components/aap/aap-upload"
import { ChangeZoneDialog } from "@/components/aap/change-zone-dialog"

const SYMPTOMS_RED = [
  "Difficulty breathing",
  "Difficulty speaking",
  "Wheezing",
  "Night-time symptoms",
  "Needing reliever more often than every 3–4 hours",
]

const SYMPTOMS_YELLOW = [
  "Waking up at night due to asthma symptoms",
  "Day time asthma symptoms more than twice a week",
  "Use reliever more than twice a week",
  "Activity limitation due to asthma"
]

type Step = "idle" | "result" | "clear" | "review" | "update"

export function AapScreen() {
  const { zone, zoneUpdatedAt, aapImage, ready } = useAsthma()
  const details = ZONE_DETAILS[zone]
  const styles = ZONE_STYLES[zone]
  const symptoms =
    zone === "green"
      ? SYMPTOMS_YELLOW
      : zone === "yellow"
      ? SYMPTOMS_RED
      : []

  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [step, setStep] = useState<Step>("idle")
  const [changeZoneOpen, setChangeZoneOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const selectedCount = Object.values(checked).filter(Boolean).length

  function toggle(symptom: string) {
    setChecked((prev) => ({ ...prev, [symptom]: !prev[symptom] }))
  }

  function submit() {
    setStep(selectedCount > 0 ? "result" : "clear")
  }

  if (!ready) {
    return (
      <div className="space-y-6">
        <section className="bg-card-gradient px-6 pb-8 pt-10">
          <div className="h-72 rounded-3xl bg-card shadow-lg shadow-black/5" />
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current zone hero */}
      <section className="bg-card-gradient px-6 pb-8 pt-10">
        <div className="rounded-3xl bg-card p-6 text-center shadow-lg shadow-black/5">
          <h1 className="text-lg font-semibold text-primary">Asthma Action Plan</h1>
          <p className="mt-3 text-sm text-muted-foreground">You are in the</p>
          <div
            className={cn(
              "mx-auto mt-2 inline-flex items-center justify-center rounded-2xl px-8 py-4 text-xl font-extrabold uppercase tracking-wide",
              styles.badge,
            )}
          >
            {styles.label} Zone
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90 text-pretty">
            {details.message}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Last updated: {formatTimestamp(zoneUpdatedAt)}
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => setChangeZoneOpen(true)}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Change zone
          </Button>
        </div>
      </section>

      {/* Symptom assessment */}
      {zone !== "red" && (
        <section className="px-5">
          <h2 className="text-base font-semibold text-foreground">
            Do you experience any of the following?
          </h2>
          <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {symptoms.map((symptom) => (
              <label
                key={symptom}
                className="flex cursor-pointer items-center gap-3 px-4 py-3.5"
              >
                <Checkbox
                  checked={!!checked[symptom]}
                  onCheckedChange={() => toggle(symptom)}
                  aria-label={symptom}
                />
                <span className="text-sm leading-snug text-foreground">{symptom}</span>
              </label>
            ))}
          </div>
          <Button className="mt-4 w-full rounded-full" onClick={submit}>
            Submit Assessment
          </Button>
        </section>
      )}

      {/* Upload */}
      <AapUpload onPreview={(src) => setPreview(src)} />

      <div className="h-2" />

      {/* --- Flow dialogs --- */}

      {/* Result: symptoms present */}
      <Dialog open={step === "result"} onOpenChange={(o) => !o && setStep("idle")}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Review your Asthma Action Plan</DialogTitle>
            <DialogDescription>
              You reported {selectedCount} symptom{selectedCount === 1 ? "" : "s"}. Review
              your Asthma Action Plan and see if you are in the Yellow Zone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="ghost" onClick={() => setStep("idle")}>
              Cancel
            </Button>
            <Button onClick={() => setStep("review")}>Review AAP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result: no symptoms */}
      <Dialog open={step === "clear"} onOpenChange={(o) => !o && setStep("idle")}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-zone-green" aria-hidden="true" />
              You appear to be in control
            </DialogTitle>
            <DialogDescription>
              You did not report any symptoms. Keep following your Green Zone plan and use
              your preventer inhaler as prescribed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setStep("idle")}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen AAP review (part of the flow) */}
      <Dialog open={step === "review"} onOpenChange={(o) => !o && setStep("idle")}>
        <DialogContent
          showCloseButton={false}
          className="h-[100svh] max-w-md gap-0 rounded-none border-0 p-0 sm:rounded-none"
        >
          <DialogHeader className="flex-row items-center justify-between border-b border-border bg-card px-4 py-3 text-left">
            <DialogTitle className="text-base">Your Asthma Action Plan</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              onClick={() => setStep("idle")}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Review your uploaded Asthma Action Plan, then choose whether to update your
            status.
          </DialogDescription>
          <div className="flex-1 overflow-auto bg-muted p-4">
            {aapImage ? (
              <Image
                src={aapImage || "/placeholder.svg"}
                alt="Your Asthma Action Plan"
                width={900}
                height={1200}
                unoptimized
                className="mx-auto w-full rounded-lg shadow"
              />
            ) : (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                No Asthma Action Plan uploaded yet. Close this and upload your plan first.
              </p>
            )}
          </div>
          <div className="border-t border-border bg-card p-4">
            <p className="text-center text-sm font-medium text-foreground">
              Would you like to update your asthma status?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-full" onClick={() => setStep("idle")}>
                Keep current zone
              </Button>
              <Button
                className="rounded-full"
                onClick={() => {
                  setStep("idle")
                  setChangeZoneOpen(true)
                }}
              >
                Change zone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Standalone fullscreen image preview (from upload tap) */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent
          showCloseButton={false}
          className="h-[100svh] max-w-md gap-0 rounded-none border-0 p-0 sm:rounded-none"
        >
          <DialogHeader className="flex-row items-center justify-between border-b border-border bg-card px-4 py-3 text-left">
            <DialogTitle className="text-base">Your Asthma Action Plan</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              onClick={() => setPreview(null)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Full screen view of your Asthma Action Plan.
          </DialogDescription>
          <div className="flex-1 overflow-auto bg-muted p-4">
            {preview && (
              <Image
                src={preview || "/placeholder.svg"}
                alt="Your Asthma Action Plan"
                width={900}
                height={1200}
                unoptimized
                className="mx-auto w-full rounded-lg shadow"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Change zone */}
      <ChangeZoneDialog open={changeZoneOpen} onOpenChange={setChangeZoneOpen} />
    </div>
  )
}

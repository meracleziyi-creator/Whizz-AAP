"use client"

import Link from "next/link"
import { ClipboardList, ChevronRight, Upload, AlertCircle, Pill, FileText } from "lucide-react"
import { useAsthma, ZONE_DETAILS } from "@/lib/asthma-store"
import { ZONE_STYLES } from "@/lib/zone-styles"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function AapStatusCard() {
  const { zone, aapImage, ready } = useAsthma()
  const details = ZONE_DETAILS[zone]
  const styles = ZONE_STYLES[zone]

  if (!ready) {
    return (
      <section className="-mt-8 px-5">
        <div className="h-72 rounded-3xl border border-border bg-card shadow-lg shadow-black/5" />
      </section>
    )
  }

  return (
    <section className="-mt-8 px-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2 text-primary">
          <ClipboardList className="size-5" aria-hidden="true" />
          <h2 className="text-base font-semibold">Asthma Action Plan</h2>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">You are in zone:</span>
          <span
            className={cn(
              "rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wide",
              styles.badge,
            )}
          >
            {styles.label}
          </span>
        </div>

        {!aapImage && (
          <Link
            href="/aap"
            className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-primary"
          >
            <Upload className="size-3.5" aria-hidden="true" />
            Upload your AAP for a personalised treatment plan
          </Link>
        )}

        {zone === "yellow" ? (
          <div className="mt-5 rounded-2xl bg-yellow-50 p-4">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="size-5 flex-shrink-0 text-yellow-700 mt-0.5" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-yellow-900">
                Take your medications as prescribed in your Asthma Action Plan to help prevent symptoms and flare-ups.
              </p>
            </div>
            <div className="flex gap-3">
              <FileText className="size-5 flex-shrink-0 text-yellow-700 mt-0.5" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-yellow-900">
                Contact your healthcare provider if symptoms do not improve after 7-14 days of stepping up medications
              </p>
            </div>
          </div>
        ) : zone === "green" ? (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
            <div className="flex gap-3 mb-3">
              <Pill className="size-5 flex-shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-emerald-900">
                Keep using your preventer inhaler as prescribed even when you feel well.
              </p>
            </div>
            <div className="flex gap-3">
              <Pill className="size-5 flex-shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-emerald-900">
                Use your emergency inhaler when necessary.
              </p>
            </div>
          </div>
        ) : zone === "red" ? (
          <div className="mt-5 rounded-2xl bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 flex-shrink-0 text-red-700 mt-0.5" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-red-900">
                Step up your medication according to AAP red zone and see your doctor NOW!
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-foreground/90 text-pretty">
            {details.message}
          </p>
        )}

        <Link
          href="/aap"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "mt-5 h-10 w-full rounded-full",
          )}
        >
          View More
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

function ReviewChecklist() {
  const items = [
    "Waking up at night due to asthma symptoms",
    "Daytime asthma symptoms more than twice a week",
    "Using your reliever more than twice a week",
    "Activity limitation due to asthma",
  ]
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-foreground">
        Review your AAP if you have any of the following:
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

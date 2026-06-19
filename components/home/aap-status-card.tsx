"use client"

import Link from "next/link"
import { ClipboardList, ChevronRight, Upload } from "lucide-react"
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
          <span className="text-sm text-muted-foreground">Your current zone:</span>
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

        <p className="mt-4 text-sm leading-relaxed text-foreground/90 text-pretty">
          {details.message}
        </p>

        {zone === "green" && <ReviewChecklist />}

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

"use client"

import { useState } from "react"
import { useAsthma, ZONE_DETAILS, type Zone } from "@/lib/asthma-store"
import { ZONE_STYLES } from "@/lib/zone-styles"
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

const ORDER: Zone[] = ["green", "yellow", "red"]

export function ChangeZoneDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { zone, setZone } = useAsthma()
  const [selected, setSelected] = useState<Zone>(zone)

  // keep the radio in sync with the current zone whenever the dialog opens
  function handleOpenChange(next: boolean) {
    if (next) setSelected(zone)
    onOpenChange(next)
  }

  function save() {
    setZone(selected)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Update your asthma status</DialogTitle>
          <DialogDescription>
            Select the zone that matches how your asthma is right now.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {ORDER.map((z) => {
            const styles = ZONE_STYLES[z]
            const active = selected === z
            return (
              <button
                key={z}
                type="button"
                onClick={() => setSelected(z)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted",
                )}
              >
                <span className={cn("mt-0.5 size-4 shrink-0 rounded-full", styles.dot)} />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {ZONE_DETAILS[z].title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {ZONE_DETAILS[z].message}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save zone</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

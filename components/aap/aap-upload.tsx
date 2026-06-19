"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, ImageUp, FileImage, Sparkles } from "lucide-react"
import { useAsthma } from "@/lib/asthma-store"
import { fileToDataUrl } from "@/lib/resize-image"
import { Button } from "@/components/ui/button"

const SAMPLE_PLAN = "/sample-asthma-action-plan.png"

export function AapUpload({ onPreview }: { onPreview: (src: string) => void }) {
  const { aapImage, setAapImage } = useAsthma()
  const cameraRef = useRef<HTMLInputElement>(null)
  const libraryRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(file?: File | null) {
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      setAapImage(dataUrl)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="px-5">
      <h2 className="text-base font-semibold text-foreground">My Asthma Action Plan</h2>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {aapImage ? (
        <div className="mt-3 space-y-3">
          <button
            type="button"
            onClick={() => onPreview(aapImage)}
            className="block w-full overflow-hidden rounded-2xl border border-border bg-muted"
            aria-label="View Asthma Action Plan full screen"
          >
            <Image
              src={aapImage || "/placeholder.svg"}
              alt="Your uploaded Asthma Action Plan"
              width={800}
              height={1000}
              unoptimized
              className="h-56 w-full object-cover object-top"
            />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={busy}
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="size-4" aria-hidden="true" />
              Camera
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={busy}
              onClick={() => libraryRef.current?.click()}
            >
              <ImageUp className="size-4" aria-hidden="true" />
              Replace
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-muted/50 px-5 py-8 text-center">
          <FileImage
            className="mx-auto size-9 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            No Asthma Action Plan uploaded yet.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="rounded-full"
              disabled={busy}
              onClick={() => libraryRef.current?.click()}
            >
              <ImageUp className="size-4" aria-hidden="true" />
              {busy ? "Uploading…" : "Upload AAP"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={busy}
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="size-4" aria-hidden="true" />
              Take a photo
            </Button>
            <button
              type="button"
              className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary"
              onClick={() => setAapImage(SAMPLE_PLAN)}
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Use a sample plan for this demo
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export type ControlStatus = "well_controlled" | "partly_controlled" | "poorly_controlled"

export type GinaAnswers = {
  q1_daytime_symptoms: boolean | null
  q2_night_waking: boolean | null
  q3_reliever_use: boolean | null
  q4_activity_limitation: boolean | null
}

export type GinaAssessment = {
  id: string
  assessment_date: string
  q1_daytime_symptoms: boolean
  q2_night_waking: boolean
  q3_reliever_use: boolean
  q4_activity_limitation: boolean
  positive_responses: number
  control_status: ControlStatus
  aap_zone_at_assessment: "green" | "yellow" | "red"
}

export const GINA_QUESTIONS = [
  {
    key: "q1_daytime_symptoms" as const,
    question: "Daytime asthma symptoms more than twice per week?",
  },
  {
    key: "q2_night_waking" as const,
    question: "Any night waking due to asthma?",
  },
  {
    key: "q3_reliever_use" as const,
    question: "SABA reliever use for symptoms more than twice per week?",
  },
  {
    key: "q4_activity_limitation" as const,
    question: "Any activity limitation due to asthma?",
  },
]

export function calculateControlStatus(positiveCount: number): ControlStatus {
  if (positiveCount === 0) return "well_controlled"
  if (positiveCount <= 2) return "partly_controlled"
  return "poorly_controlled"
}

export function countPositiveResponses(answers: GinaAnswers): number {
  return Object.values(answers).filter((v) => v === true).length
}

export function formatAssessmentDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export const CONTROL_STATUS_LABELS: Record<ControlStatus, string> = {
  well_controlled: "Well Controlled",
  partly_controlled: "Partly Controlled",
  poorly_controlled: "Poorly Controlled",
}

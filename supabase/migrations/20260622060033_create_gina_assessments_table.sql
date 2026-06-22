CREATE TABLE gina_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_date timestamptz DEFAULT now(),
  q1_daytime_symptoms boolean NOT NULL,
  q2_night_waking boolean NOT NULL,
  q3_reliever_use boolean NOT NULL,
  q4_activity_limitation boolean NOT NULL,
  positive_responses integer NOT NULL,
  control_status text NOT NULL CHECK (control_status IN ('well_controlled', 'partly_controlled', 'poorly_controlled')),
  aap_zone_at_assessment text NOT NULL CHECK (aap_zone_at_assessment IN ('green', 'yellow', 'red')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gina_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_assessments" ON gina_assessments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_assessments" ON gina_assessments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_assessments" ON gina_assessments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_gina_assessments_user_date ON gina_assessments(user_id, assessment_date DESC);
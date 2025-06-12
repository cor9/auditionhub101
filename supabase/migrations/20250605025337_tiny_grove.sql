-- ENUM Types
CREATE TYPE appt_type_enum AS ENUM ('self_tape', 'in_person', 'zoom');
CREATE TYPE project_type_enum AS ENUM ('tv', 'film', 'commercial', 'theatre', 'voice_over', 'other');
CREATE TYPE source_enum AS ENUM ('self', 'theatrical_agent', 'commercial_agent', 'regional_agent', 'vo_agent', 'manager', 'production');
CREATE TYPE casting_status_enum AS ENUM ('submitted', 'passed', 'pinned', 'on_avail', 'testing', 'booked');
CREATE TYPE role_size_enum AS ENUM ('principal', 'supporting', 'lead', 'series_regular', 'recurring', 'guest_star', 'costar', 'contract', 'featured');

-- Create actors table
CREATE TABLE IF NOT EXISTS actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  gender text,
  email text,
  dob date,
  commercial_agent text,
  theatrical_agent text,
  headshot_url text,
  resume_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create auditions table
CREATE TABLE IF NOT EXISTS auditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES actors(id) ON DELETE CASCADE NOT NULL,
  project_title text NOT NULL,
  role_name text NOT NULL,
  role_size role_size_enum NOT NULL,
  project_type project_type_enum NOT NULL,
  appt_type appt_type_enum NOT NULL,
  status casting_status_enum NOT NULL DEFAULT 'submitted',
  casting_director text NOT NULL,
  is_in_person boolean DEFAULT false,
  location text,
  audition_date timestamptz NOT NULL,
  source source_enum NOT NULL,
  union boolean NOT NULL DEFAULT false,
  breakdown text NOT NULL,
  date_submitted date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditions ENABLE ROW LEVEL SECURITY;

-- Policies for actors
CREATE POLICY "Users can create their own actors"
  ON actors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own actors"
  ON actors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own actors"
  ON actors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own actors"
  ON actors
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for auditions
CREATE POLICY "Users can create their own auditions"
  ON auditions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM actors
      WHERE actors.id = auditions.actor_id
      AND actors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own auditions"
  ON auditions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM actors
      WHERE actors.id = auditions.actor_id
      AND actors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own auditions"
  ON auditions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM actors
      WHERE actors.id = auditions.actor_id
      AND actors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM actors
      WHERE actors.id = auditions.actor_id
      AND actors.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own auditions"
  ON auditions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM actors
      WHERE actors.id = auditions.actor_id
      AND actors.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS actors_user_id_idx ON actors(user_id);
CREATE INDEX IF NOT EXISTS auditions_actor_id_idx ON auditions(actor_id);
CREATE INDEX IF NOT EXISTS auditions_status_idx ON auditions(status);
CREATE INDEX IF NOT EXISTS auditions_project_type_idx ON auditions(project_type);
CREATE INDEX IF NOT EXISTS auditions_audition_date_idx ON auditions(audition_date);

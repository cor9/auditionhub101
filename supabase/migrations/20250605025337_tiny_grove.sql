/*
  # Create actors and auditions tables

  1. New Tables
    - `actors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `age` (integer)
      - `gender` (text)
      - `ethnicity` (text)
      - `height` (text)
      - `weight` (text)
      - `hair_color` (text)
      - `eye_color` (text)
      - `bio` (text)
      - `headshot` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `auditions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `actor_id` (uuid, foreign key to actors)
      - `project_title` (text)
      - `role_name` (text)
      - `role_size` (text)
      - `type` (text)
      - `status` (text)
      - `casting_director` (text)
      - `is_in_person` (boolean)
      - `location` (text)
      - `audition_date` (timestamp)
      - `source` (text)
      - `union` (text)
      - `breakdown` (text)
      - `date_submitted` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create actors table
CREATE TABLE IF NOT EXISTS actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  gender text,
  ethnicity text,
  height text,
  weight text,
  hair_color text,
  eye_color text,
  bio text,
  headshot text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create auditions table
CREATE TABLE IF NOT EXISTS auditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  actor_id uuid REFERENCES actors(id) ON DELETE CASCADE NOT NULL,
  project_title text NOT NULL,
  role_name text NOT NULL,
  role_size text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  casting_director text NOT NULL,
  is_in_person boolean DEFAULT false,
  location text,
  audition_date timestamptz NOT NULL,
  source text NOT NULL,
  union text NOT NULL,
  breakdown text NOT NULL,
  date_submitted timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditions ENABLE ROW LEVEL SECURITY;

-- Create policies for actors table
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

-- Create policies for auditions table
CREATE POLICY "Users can create their own auditions"
  ON auditions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own auditions"
  ON auditions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own auditions"
  ON auditions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own auditions"
  ON auditions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX actors_user_id_idx ON actors(user_id);
CREATE INDEX auditions_user_id_idx ON auditions(user_id);
CREATE INDEX auditions_actor_id_idx ON auditions(actor_id);
CREATE INDEX auditions_status_idx ON auditions(status);
CREATE INDEX auditions_type_idx ON auditions(type);
CREATE INDEX auditions_date_idx ON auditions(audition_date);
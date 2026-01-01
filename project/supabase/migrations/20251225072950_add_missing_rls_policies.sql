/*
  # Add missing RLS policies for profile creation

  1. Security
    - Add INSERT policy to allow authenticated users to create their own profiles
    - Add INSERT policy to allow users to create tickets for themselves
*/

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (passenger_id = auth.uid());

CREATE POLICY "Conductors can scan tickets"
  ON ticket_scans FOR INSERT
  TO authenticated
  WITH CHECK (conductor_id = auth.uid());

CREATE POLICY "Public can view routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view bus stops"
  ON bus_stops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view route stops"
  ON route_stops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view buses"
  ON buses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (passenger_id = auth.uid());

CREATE POLICY "Conductors can view ticket scans"
  ON ticket_scans FOR SELECT
  TO authenticated
  USING (conductor_id = auth.uid());

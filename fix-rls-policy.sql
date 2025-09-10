-- Fix RLS policy for milano_leads to allow public read access
-- This is for MVP demo purposes only

-- Drop existing policies 
DROP POLICY IF EXISTS "Public milano_leads policy" ON milano_leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON milano_leads;
DROP POLICY IF EXISTS "Enable insert access for all users" ON milano_leads;

-- Create new policy for public read access
CREATE POLICY "Allow public read access" 
ON milano_leads 
FOR SELECT 
USING (true);

-- Create new policy for public insert access (for scraper)
CREATE POLICY "Allow public insert access" 
ON milano_leads 
FOR INSERT 
WITH CHECK (true);

-- Create new policy for public update access 
CREATE POLICY "Allow public update access" 
ON milano_leads 
FOR UPDATE 
USING (true);

-- Ensure RLS is enabled
ALTER TABLE milano_leads ENABLE ROW LEVEL SECURITY;
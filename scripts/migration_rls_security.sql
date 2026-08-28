-- XYLO Esports Security Audit Migration
-- Ensures public read-only access for games, categories, and config
-- Ensures only authenticated admins (or service role) can modify data
-- Protects private user data

-- 1. Enable RLS on all key tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_game_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_matches ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing potentially insecure policies (if any exist) to start fresh
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- 3. Public Read Policies (Allow anyone to read website content)
CREATE POLICY "Public can view active game config" 
ON active_game_config FOR SELECT USING (true);

CREATE POLICY "Public can view game categories" 
ON game_categories FOR SELECT USING (true);

CREATE POLICY "Public can view games" 
ON games FOR SELECT USING (true);

CREATE POLICY "Public can view published blogs" 
ON ai_blogs FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view completed matches" 
ON team_matches FOR SELECT USING (true);

-- 4. Admin Write Policies (Assuming Admins use Service Role which bypasses RLS)
-- We don't necessarily need to create specific policies for Admins if they use the SERVICE_ROLE key.
-- But if they use an authenticated user token with an 'admin' role, we would do:
-- CREATE POLICY "Admins can do everything" ON games FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
-- Since the XYLO project typically uses SERVICE_ROLE key in the admin panel for all operations, we can just rely on the default deny-all for inserts/updates from anon/public clients.

-- 5. User Data Protection
-- Users can only view their own registrations (unless service role)
CREATE POLICY "Users can view own registrations"
ON registrations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations"
ON registrations FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL); -- Allow guest registration if user_id is null

-- Ensure that nobody can maliciously modify registration statuses
CREATE POLICY "Users cannot update registrations"
ON registrations FOR UPDATE
USING (false);

CREATE POLICY "Users cannot delete registrations"
ON registrations FOR DELETE
USING (false);

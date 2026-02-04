-- Fix chat_messages table to support user_id directly
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id) on delete cascade;

-- Make session_id nullable since the code uses user_id primarily
ALTER TABLE public.chat_messages 
ALTER COLUMN session_id DROP NOT NULL;

-- Update policies for chat_messages to use user_id
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;

CREATE POLICY "Users can view own messages" 
ON public.chat_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Ensure onboarding_answers table exists and has correct structure
-- (This part is just in case, usually CREATE TABLE IF NOT EXISTS handles it)
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_key text not null,
  answer text,
  answer_array text[],
  other_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, question_key)
);

-- Enable RLS on onboarding_answers if not already
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist for onboarding_answers
DROP POLICY IF EXISTS "Users can view own answers" ON public.onboarding_answers;
DROP POLICY IF EXISTS "Users can insert own answers" ON public.onboarding_answers;
DROP POLICY IF EXISTS "Users can update own answers" ON public.onboarding_answers;

CREATE POLICY "Users can view own answers" 
ON public.onboarding_answers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers" 
ON public.onboarding_answers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers" 
ON public.onboarding_answers FOR UPDATE 
USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create onboarding_answers table
CREATE TABLE public.onboarding_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  frequency_impact TEXT,
  main_triggers TEXT[],
  main_triggers_other TEXT,
  high_risk_times TEXT[],
  previous_attempts TEXT[],
  previous_attempts_other TEXT,
  primary_goal TEXT,
  consent_privacy TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on onboarding_answers
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;

-- Onboarding answers policies
CREATE POLICY "Users can view their own onboarding answers"
ON public.onboarding_answers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding answers"
ON public.onboarding_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding answers"
ON public.onboarding_answers FOR UPDATE
USING (auth.uid() = user_id);

-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL DEFAULT 'free_limited' CHECK (mode IN ('free_limited', 'premium')),
  messages_used_today INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions"
ON public.chat_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions"
ON public.chat_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
ON public.chat_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Create chat_messages table for conversation history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view their own messages"
ON public.chat_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_answers_updated_at
  BEFORE UPDATE ON public.onboarding_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
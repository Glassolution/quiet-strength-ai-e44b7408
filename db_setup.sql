
-- Habilita a extensão UUID
create extension if not exists "uuid-ossp";

-- 1. Tabela de Perfis (Profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  is_premium boolean default false,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Respostas do Onboarding
create table if not exists public.onboarding_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_key text not null,
  answer text, -- Para respostas únicas ou texto
  answer_array text[], -- Para respostas múltiplas
  other_text text, -- Para campo "Outro"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, question_key) -- Garante uma resposta por pergunta por usuário
);

-- 3. Tabela de Sessões de Chat
create table if not exists public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mode text not null default 'free_limited', -- 'free_limited' ou 'premium'
  messages_used_today integer default 0,
  session_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabela de Mensagens do Chat (Histórico)
create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade, -- tornado opcional
  user_id uuid references auth.users(id) on delete cascade, -- adicionado user_id
  role text not null, -- 'user' ou 'assistant'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) - Segurança

-- Profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Onboarding Answers
alter table public.onboarding_answers enable row level security;
create policy "Users can view own answers" on public.onboarding_answers for select using (auth.uid() = user_id);
create policy "Users can insert own answers" on public.onboarding_answers for insert with check (auth.uid() = user_id);
create policy "Users can update own answers" on public.onboarding_answers for update using (auth.uid() = user_id);

-- Chat Sessions
alter table public.chat_sessions enable row level security;
create policy "Users can view own sessions" on public.chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.chat_sessions for update using (auth.uid() = user_id);

-- Chat Messages
alter table public.chat_messages enable row level security;
-- Atualizado para usar user_id diretamente
create policy "Users can view own messages" on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Trigger para criar Profile automaticamente ao cadastrar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

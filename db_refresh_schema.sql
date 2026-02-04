-- Force schema cache refresh and ensure columns exist
DO $$
BEGIN
    -- Ensure user_id exists in chat_messages
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'chat_messages' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.chat_messages 
        ADD COLUMN user_id uuid references auth.users(id) on delete cascade;
    END IF;

    -- Drop constraints if they exist to recreate them (helps refresh cache)
    ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;
    ALTER TABLE public.chat_messages 
    ADD CONSTRAINT chat_messages_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

    -- Ensure RLS is enabled
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
    
    -- Re-apply policies to be sure
    DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
    DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
    
    CREATE POLICY "Users can view own messages" 
    ON public.chat_messages FOR SELECT 
    USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own messages" 
    ON public.chat_messages FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    -- Ensure profiles table has correct permissions too
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Notify schema cache reload (PostgREST specific trick: notify pgrst)
    NOTIFY pgrst, 'reload config';
END $$;

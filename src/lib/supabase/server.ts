// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Supabase cookies set method is synchronous but Next.js cookies set is async
            // this is a known issue and can be ignored if you're not using middleware
            // for refreshing session. if you are, use middleware to refresh session
            // and this will be handled automatically.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: -1 });
          } catch (error) {
            // Supabase cookies remove method is synchronous but Next.js cookies set is async
            // this is a known issue and can be ignored if you're not using middleware
            // for refreshing session. if you are, use middleware to refresh session
            // and this will be handled automatically.
          }
        },
      },
    }
  );
};

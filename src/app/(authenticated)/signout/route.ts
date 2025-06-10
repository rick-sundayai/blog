// src/app/(authenticated)/signout/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Instantiate the Supabase client using the server utility
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to the login page
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL('/login', requestUrl.origin), {
    status: 307, // Use 307 for temporary redirect with POST
  });
}

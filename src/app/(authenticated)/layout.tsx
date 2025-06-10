// src/app/(authenticated)/layout.tsx
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const supabase = await createClient();
  const { data: { user } = {} } = await supabase.auth.getUser();

  // If no user, redirect to login (Protects all routes in this group)
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="authenticated-layout">
      {children}
    </div>
  );
}

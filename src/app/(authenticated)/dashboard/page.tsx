// src/app/(authenticated)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">ID:</span> {user?.id}</p>
          <p><span className="font-medium">Last Sign In:</span> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
        </div>
        <div className="mt-6">
          <form action="/signout" method="post">
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

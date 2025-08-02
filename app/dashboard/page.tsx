// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-lg">You are logged in as <strong>{session.user.email}</strong>.</p>

      <div className="mt-6">
        <p className="text-gray-500">This will eventually show your calendar, auditions, expenses, and services.</p>
        <p className="text-sm text-gray-400 mt-2">This page is protected. If someone is not logged in, they’ll be redirected here:</p>
        <pre className="bg-gray-800 text-white text-sm p-4 rounded mt-2">/sign-in</pre>
      </div>
    </div>
  );
}

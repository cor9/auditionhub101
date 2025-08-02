import { createServerSupabaseClient } from '../../../lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';


export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to the login page if not logged in
    redirect("/login")
    return null;
  }

  return (
      <div className="w-full">
        <h1>Landing Page</h1>
      </div>
  
       
  );
}

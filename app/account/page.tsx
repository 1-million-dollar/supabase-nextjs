import { redirect } from 'next/navigation'
import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'



export default async function Account() {
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
  <div>
    
    <AccountForm user={user} />
</div>)
    
  
}
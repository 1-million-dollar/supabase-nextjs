import { redirect } from 'next/navigation'
import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile',
};



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
  <div className='mb-24 md:mb-0 p-2'>
    
    <AccountForm user={user} />
</div>)
    
  
}
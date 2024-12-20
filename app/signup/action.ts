'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const dataF = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
  
    const { data, error } = await supabase.auth.signUp(dataF)
    console.error(error)
  
    if (error?.code === 'user_already_exists') {
      redirect('/signup/authError')  
    }
    
  
    const fullName = formData.get('firstname') as string + " " + formData.get('lastname') as string
    const username = formData.get('username') as string
    
    if (username !== null && fullName !== null && data.user!== null) {
      InsertData(fullName, username, data.user?.id)
    }
   
    revalidatePath('/', 'layout')
    redirect('/home')
  
    
  }

  async function InsertData(fullname: string, username: string, id: string) {
    const supabase = await createClient()

    const { error } = await supabase
    .from('profiles')
    .update([{username: username, full_name: fullname, created_at: new Date() }])
    .eq('id', id)

    
    if (error) {
      redirect('/error')
    }
  }
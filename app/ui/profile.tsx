'use client'

import { type User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import ProfilePhoto from './profilephoto'

export default function Profile({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const getProfile = useCallback(async () => {
        try {
          setLoading(true)
    
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`full_name, username, avatar_url`)
            .eq('id', user?.id)
            .single()
    
          if (error && status !== 406) {
            console.log(error)
            throw error
          }
    
          if (data) {
            setFullname(data.full_name)
            setUsername(data.username)
            
            setAvatarUrl(data.avatar_url)
          }
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }, [user, supabase])
    
      useEffect(() => {
        getProfile()
      }, [user, getProfile])
    return (
        <div className='flex flex-row items-center p-2 mb-5'>
            <ProfilePhoto url={avatar_url}
          size={50} />
            <div className='flex flex-col justify-center p-2'>
            <div className='text-lg font-extrabold'>
            {fullname}
            </div>
            <div className='text-sm'>
            {username}
            </div>
            </div>
        </div>
    )
}
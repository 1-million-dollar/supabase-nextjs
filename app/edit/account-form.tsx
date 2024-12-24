'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './avatar'
import { redirect } from 'next/navigation'



// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [bio, setBio] = useState<string | null>(null)
  
 
  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, points, correct, wrong, bio`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        redirect('/error')
        
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        
        setAvatarUrl(data.avatar_url)
        setBio(data.bio)
      }
    } catch (error) {
      console.log(error)
      redirect('/error')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    avatar_url: string | null
    bio: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        avatar_url,
        bio,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      //alert('Error updating the data!')
      console.log(error)
      redirect('/error')
      
    } finally {
      setLoading(false)
    }

    
  }

  return (
      <div className='p-2'>

<div className='flex justify-center items-center rounded-lg p-2'>
<Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={300}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ fullname, username, avatar_url: url, bio })
          } } />
      </div>
        
        {/* ... */}


        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="email">Email</label>
          <input id="email" type="text" className='flex rounded-2xl border-2 border-black p-4' value={user?.email} disabled />
        </div>
        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="fullName">Full Name</label>
          <input
            className='flex rounded-2xl border-2 border-black p-4'
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)} />
        </div>
        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="username">Username</label>
          <input
            className='flex rounded-2xl border-2 border-black p-4'
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)} />
             
        </div>
        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="username">Bio</label>
          <input
            className='flex rounded-2xl border-2 border-black p-4'
            id="username"
            type="text"
            value={bio || ''}
            onChange={(e) => setBio(e.target.value)} />
             
        </div>
       
        <div className='flex flex-row items-center p-2'>
          <div>
            <button
              className="flex rounded-2xl p-4 border-2 border-green-800 bg-green-400"
              onClick={() => updateProfile({ fullname, username, avatar_url, bio })}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </button>
          </div>
        </div>
        
      </div>


    
  )
}
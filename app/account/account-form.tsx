'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './avatar'



// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [points, setPoints] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
 
  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, points, correct, wrong`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setPoints(data.points)
        setCorrect(data.correct)
        setWrong(data.wrong)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
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
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
      console.log(error)
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }

    
  }

  return (
    <div>
      <div className=''>
        <Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ fullname, username, avatar_url: url })
          } } />
        {/* ... */}

        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="email">Email</label>
          <input id="email" type="text" className='flex rounded-2xl border-2 border-black p-4 md:w-[400px]' value={user?.email} disabled />
        </div>
        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="fullName">Full Name</label>
          <input
            className='flex rounded-2xl border-2 border-black p-4 md:w-[400px]'
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)} />
        </div>
        <div className='flex flex-col p-2'>
          <label className='font-bold' htmlFor="username">Username</label>
          <input
            className='flex rounded-2xl border-2 border-black p-4 md:w-[400px]'
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='font-extrabold'>
          <p>Points Earned: {points}</p>
          <p>Accuracy: correct- {correct} wrong- {wrong}</p>
        </div>
          <div className='flex flex-row items-center p-2'>
        <div>
          <button
            className="flex rounded-2xl p-4 border-2 border-green-800 bg-green-400 mr-10"
            onClick={() => updateProfile({ fullname, username, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button className="flex rounded-2xl p-4 border-2 border-red-800 bg-red-400" type="submit">
              Sign out
            </button>
          </form>
        </div>
        </div>
      </div>
    <div>
      </div>
      </div>

    
  )
}
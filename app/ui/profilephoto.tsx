'use client'
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { UserCircleIcon } from "@heroicons/react/24/solid"

export default function ProfilePhoto({url, size}: {url: string | null, size: number}) {
    
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
      finally {
        setLoading(false)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  if (loading) {
    return <div>
    <UserCircleIcon className="rounded-full"
    style={{ height: size, width: size }} />
  </div>
  }
    return (
        <div>
             {avatarUrl ? (
                <Image
                  width={size}
                  height={size}
                  src={avatarUrl}
                  alt="Avatar"
                  className="rounded-full"
                  style={{ height: size, width: size }}
                />
                  ) : (
                  <div>
                    <UserCircleIcon className="rounded-full"
                    style={{ height: size, width: size }} />
                  </div>
                  )}
          </div>
    )
}
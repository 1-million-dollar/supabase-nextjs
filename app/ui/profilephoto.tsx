'use client'
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"

export default function ProfilePhoto({url, size}: {url: string | null, size: number}) {
    
    const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)

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
    }

    if (url) downloadImage(url)
  }, [url, supabase])

    return (
        <div className="rounded-md bg-gray-50">
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
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
        </div>
    )
}
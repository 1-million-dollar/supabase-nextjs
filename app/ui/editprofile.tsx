import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function EditProfile({ id }: { id: string | null }) {
    const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if(user) {
    if(user.id !== id)
        return null
  }
  return (
    <div>
     <Link href='/edit'>
        <div className="absolute top-0 right-0 rounded-full border-2 border-black p-2 mt-2 mr-5 bg-blue-300 font-bold">Edit Profile</div>
      </Link>
    </div>
  )

}
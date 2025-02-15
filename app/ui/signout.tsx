import { createClient } from "@/utils/supabase/server"

export default async function SignOut({id} : {id : string | null}) {
    const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if(user) {
    if(user.id !== id)
        return null
}
return (<div className="mt-10">

          <form action="/auth/signout" method="post">
            <button className="bg-red-600 text-red-800 font-extrabold p-5 rounded-full border-2 border-red-400 w-max">
                Signout
            </button>
          </form>
        </div>
)

    
}
import CenteredScrollableDivs from "./centeredscrollabledivs"
import { createClient } from "@/utils/supabase/server"

export default async function Page() {

    let userLevel 
    const supabase = await createClient()

    const {data : { user }, } = await supabase.auth.getUser()

    const {data, error} = await supabase
        .from('profiles')
        .select('level')
        .eq('id', user?.id)

    if (data) {
        userLevel = data[0].level
    }
    if (error) {
        console.log(error)
    }
    return (
        <CenteredScrollableDivs userLevel={userLevel} />
    )
}
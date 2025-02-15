

import QuestionPage from "./questionPage";
import { vocabQuestions } from "@/app/lib/data";

import { createClient } from "@/utils/supabase/server";


type Params = Promise<{ level: number }>


export default async function Page(props: { params: Params }) {

    const supabase = await createClient()

    const { data : {user}, } = await supabase.auth.getUser()

    let id = ""

    if (user != undefined) {
        id = user.id
    }

    const params = await props.params;
    const level = params.level;
    const questions = await vocabQuestions(level)

    console.log(questions)

    return (
       
            <QuestionPage questions={questions} level={level} userId={id} />
        
    )
}


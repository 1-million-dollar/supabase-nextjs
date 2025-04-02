

import QuestionPage from "./questionPage";
import { vocabQuestions } from "@/app/lib/data";




type Params = Promise<{ level: number }>


export default async function Page(props: { params: Params }) {

    

    const params = await props.params;
    const level = params.level;
    const questions = await vocabQuestions(level)

    console.log(questions)

    return (
       
            <QuestionPage questions={questions} level={level} />
        
    )
}


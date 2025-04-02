

import ReviewQuestions from '@/app/ui/reviewquestions'

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Review Your Words',
  };


export default async function Page() {

    
    
    
    return (
        <div>
            <ReviewQuestions />
        </div>
    )
}
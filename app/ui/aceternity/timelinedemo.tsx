
import React from "react";
import { Timeline } from "./timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Discover Words",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
           Read article, newspapers, journals, book to discover words, listen to great speakers and writers to come in touch with new words
          </p>
          
        </div>
      ),
    },
    {
      title: "Learn about the Words",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            The best way to learn Vocab is to understand it&apos;s meaning and frame sentences out of it
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            By writing down the words in a piece of paper and revising the from time to time will instill the words into your brain
          </p>
          
        </div>
      ),
    },
    {
      title: "Use them in your daily practice. ",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            This is the best way to improve vocab, you can do this by following ways:
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Pick a word and make sentences out of it
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ While noormal conversation inspite of using repeated words use similar words
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Write articles on certain scenarios
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Talk to people with new words
            </div>
           
          </div>
         
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}

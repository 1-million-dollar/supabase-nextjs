import SearchBox from "../ui/searchbox";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Dictionary',
  };


export default function Page() {

    const addedWords = [   "cutscene",
  "learning",
  "fashioning piece",
  "flipperless",
  "coreceptor",
  "geotracking",
  "abi",
  "iechyd da",
  "bronchiolitis obliterans",
  "stage time",
  "flip-up",
  "argumentum ad populum",
  "tadcu",
  "cuttingness",
  "Canis Major",
  "banku",]

      
    const updatedWords = [   "cut steel",
  "argument",
  "beerage",
  "flip side",
  "licked",
  "biceps",
  "clogged",
  "cut-price",
  "collider",
  "cheapish",
  "wound",
  "wealthy",
  "downwind",
  "cutpurse",
  "cutover",
  "braced",]

      

    return (
        <div className="mb-24 md:mb-0">
            <div className="flex justify-center p-5 mb-5">
                <SearchBox />
            </div>
            <div className="flex flex-col justify-center mb-5 p-5 items-center text-center bg-gray-200 rounded-lg">
                <p className="text-2xl mb-1"><b>Word of the day</b></p>
                <div className="h-1 w-10 mb-3 bg-black"></div>
                <p className="font-extrabold text-4xl mb-1">rechauffe</p>
                <p className="text-sm mb-3">verb</p>
                <p className="text-md">To warm again; to turn (leftovers) into a new dish. In later use also figurative: to rehash, rework.</p>
            </div>
            <div className="flex flex-col gap-10 md:gap-40 md:flex-row md:justify-center p-5 text-center bg-gray-200 rounded-lg">
                <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl mb-1"><b>Recently added</b></p>
                    <div className="h-1 w-10 mb-3 bg-black"></div>
                    <div className="grid grid-cols-2 w-max items-center justify-center gap-x-10 gap-2">
                        {addedWords.map((word, index) => (
                            <Link key={index} href={`/dictionary/${word}`}>
                                <p key={index}>{word}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl mb-1"><b>Recently updated</b></p>
                    <div className="h-1 w-10 mb-3 bg-black"></div>
                    <div className="grid grid-cols-2 w-max items-center justify-center gap-x-10 gap-2">
                        {updatedWords.map((word, index) => (
                            <Link key={index} href={`/dictionary/${word}`}>
                                <p key={index}>{word}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            
            
            <div>

            </div>
        </div>
    )
}
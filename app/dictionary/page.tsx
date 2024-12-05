import SearchBox from "../ui/searchbox";
import Link from "next/link";


export default function Page() {

    const addedWords = [
        "winding down",
        "cancanning",
        "victimism",
        "five-alarm",
        "ticket gate",
        "geotracking",
        "bierwurst",
        "waka jump",
        "bifold",
        "Grus",
        "kar seva",
        "pyrocumulus",
        "theatrician",
        "beer baron",
        "windmilled",
        "anaesthetics",
      ]
      
    const updatedWords = [
       "cable car",
  "clubmoss",
  "ticket",
  "Kolam",
  "wound",
  "cadre",
  "clary",
  "amitosis",
  "excurse",
  "estated",
  "bracing",
  "fleecy",
  "argute",
  "brace",
  "wind fan",
  "Elfin",
      ]
      

    return (
        <div>
            <div className="flex justify-center mb-5 p-2 md:p-5">
                <SearchBox />
            </div>
            <div className="flex flex-col justify-center mb-5 p-5 items-center text-center bg-gray-200 rounded-lg">
                <p className="text-2xl mb-1"><b>Word of the day</b></p>
                <div className="h-1 w-10 mb-3 bg-black"></div>
                <p className="font-extrabold text-4xl mb-1">rantoone</p>
                <p className="text-sm mb-3">NOUN</p>
                <p className="text-md">A type of tricycle used in the 19th cent., propelled both by foot pedals and hand-operated levers.</p>
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
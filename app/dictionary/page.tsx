import SearchBox from "../ui/searchbox";
import Link from "next/link";


export default function Page() {

    const addedWords = [   "geolocator",
        "tikanga",
        "crepe",
        "maknae",
        "brown Windsor",
        "unhackable",
        "coreceptor",
        "pansori",
        "bronchiolitis obliterans",
        "brandsolder",
        "Calennig",
        "419",
        "frustrator",
        "wizardy",
        "snow angel",
        "stage managing"]

      
    const updatedWords = [  "LP",
        "textuist",
        "triceps",
        "hurrick",
        "braiser",
        "brand new",
        "estated",
        "elfic",
        "elf",
        "specie",
        "berserk",
        "cut weed",
        "barging",
        "breeding",
        "Cuts",
        "chining"]

      

    return (
        <div className="mb-24 md:mb-0">
            <div className="flex justify-center p-5 mb-5">
                <SearchBox />
            </div>
            <div className="flex flex-col justify-center mb-5 p-5 items-center text-center bg-gray-200 rounded-lg">
                <p className="text-2xl mb-1"><b>Word of the day</b></p>
                <div className="h-1 w-10 mb-3 bg-black"></div>
                <p className="font-extrabold text-4xl mb-1">palmy</p>
                <p className="text-sm mb-3">verb</p>
                <p className="text-md">Triumphant, flourishing, successful.</p>
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
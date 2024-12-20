'use client'

import { SpeakerWaveIcon } from "@heroicons/react/24/solid"

export default function AudioPlayer({audio} : {audio : string | undefined}) {

    const handlePlay = () => {

        
        
        const a = new Audio(audio);
        a.play();
        
        
      };
      if(audio === undefined) {
        return null
    }

    return (
        <div>
            <SpeakerWaveIcon onClick={handlePlay} className="w-8 p-1" />
        </div>
    )

}
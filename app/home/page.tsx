
import Poster from '../ui/poster'
import SearchBox from '../ui/searchbox'


export default function Page() {
    return (
        <div className='flex flex-col justify-center w-full'>
           <div className='flex justify-center p-5'>
            <Poster />
           </div>
           
           <div className='flex justify-center p-5'>
            <SearchBox />
           </div>
        </div>
    )
}
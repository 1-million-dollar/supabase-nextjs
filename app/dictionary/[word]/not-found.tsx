import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <main className='flex h-full flex-col items-center justify-center gap-2'>
            <FaceFrownIcon className='w-10 text-gray-400' />
            <h2 className='text-x1 font-semibold'>404 Not Found</h2>
            <p className='text-center'>Could not find the word you are searching for, <b>please check the spelling !!!</b></p>
            <Link
            href='/dictionary'
            className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400'
            >
                Go Back
            </Link>
        </main>
    );
}
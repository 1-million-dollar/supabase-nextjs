'use client';
import Link from "next/link";

import { HomeIcon,GlobeAltIcon,BookmarkIcon,QuestionMarkCircleIcon,UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname } from "next/navigation";


const links = [
    {name: 'Home', href: '/home', icon: HomeIcon },
    {name: 'DIctionary', href: '/dictionary', icon: GlobeAltIcon},
    {name: 'Words', href: '/words', icon: BookmarkIcon },
    {name: 'Quiz', href: '/quiz', icon: QuestionMarkCircleIcon },
    {name: 'Account', href: '/account', icon: UserIcon }    
]

export default function NavLinks() {
    const pathname = usePathname();

    
    return (
       <div className="flex flex-row w-full fixed bottom-0 left-0 z-50 rounded-lg justify-center md:flex-col md:justify-start md:relative">
        {
            links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                        'flex rounded-lg items-center justify-center w-full border-green-400 border-2 bg-green-50 p-5 text-sm font-medium hover:bg-sky-100 hover:text-green-400 md:justify-start',
                        {
                            'bg-sky-100 text-green-600': pathname === link.href,
                        },
                    )}
                    >
                        <LinkIcon className="w-9" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                )
            })
        }
       </div>
    )
}
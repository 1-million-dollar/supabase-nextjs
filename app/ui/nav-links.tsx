'use client';
import Link from "next/link";
import { HomeIcon, GlobeAltIcon, BookmarkIcon, AcademicCapIcon, UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
    { name: 'Home', href: '/home', icon: HomeIcon },
    { name: 'SayIt', href: '/game', icon: GlobeAltIcon },
    { name: 'Words', href: '/words', icon: BookmarkIcon },
    { name: 'Quiz', href: '/quiz/lessons', icon: AcademicCapIcon },
    { name: 'Account', href: '/profile', icon: UserIcon }    
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:relative md:w-full">
            <div className="flex flex-row md:flex-col items-center justify-around md:justify-start gap-1 md:gap-2 bg-white/90 backdrop-blur-md p-2 md:p-4 border-t md:border-t-0 border-gray-200 md:border-r md:border-gray-200 md:h-full shadow-lg md:shadow-none">
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex flex-col md:flex-row items-center justify-center w-full p-3 rounded-xl transition-all duration-300 group relative',
                                {
                                    'text-white bg-gradient-to-br from-green-500 to-teal-400': isActive,
                                    'text-gray-600 hover:text-green-600 hover:bg-green-50': !isActive,
                                }
                            )}
                            aria-label={link.name}
                        >
                            <div className="relative">
                                <LinkIcon className="w-6 h-6" />
                                {/* Active indicator for mobile */}
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full md:hidden"></span>
                                )}
                            </div>
                            
                            {/* Text label - hidden on mobile, shown on desktop */}
                            <span className="hidden md:block text-sm font-medium mt-0 ml-2">
                                {link.name}
                            </span>
                            
                            {/* Tooltip for mobile (optional) */}
                            {!isActive && (
                                <span className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                                    {link.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
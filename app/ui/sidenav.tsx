'use client'

import { usePathname } from 'next/navigation';

import Logo from "./logo"
import NavLinks from "./nav-links"





export default function SideNav() {

    const pathname = usePathname();

    const hideNav = ['/', '/login', '/error','/signup','/signup/authError', '/login/authError'];

    if (hideNav.includes(pathname)) {
        return null; // Hide navigation on specific pages
    }
    
   
   
    return(
        <div className="flex h-full flex-col md:px-2">
            
            <div className="p-2 md:p-5">
                <Logo />
            </div>
            
            
            <div>
                <NavLinks />
            </div>
        </div>
    )
}
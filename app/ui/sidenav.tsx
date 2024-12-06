"use client"

import Logo from "./logo"
import NavLinks from "./nav-links"
import { usePathname } from "next/navigation"


export default function SideNav() {
    const pathname = usePathname()
   

    return(
        <div className={`flex h-full flex-col md:px-2 ${pathname === "/quiz/rapid" || pathname === "/login" ? "hidden" : "flex"}`}>
            
            <div className="p-2 md:p-5">
                    <Logo />
            </div>
            
            
            <div>
                <NavLinks />
            </div>
        </div>
    )
}
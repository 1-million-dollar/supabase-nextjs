'use client';

import '@/app/ui/global.css';

import SideNav from './ui/sidenav';
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  
  return (
    <html lang="en">

      <body
        className={`antialiased bg-gray-100`} 
      >

        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">

          
          <div className="w-full flex-none md:w-max">
            <SideNav />
          </div>

          <div className="flex-grow md:overflow-y-auto">
            {children}
            <Analytics />
          </div>

        </div>

      </body>

    </html>
  );
}

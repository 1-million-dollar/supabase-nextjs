'use client';

import '@/app/ui/global.css';

import SideNav from './ui/sidenav';

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
          </div>

        </div>

      </body>

    </html>
  );
}

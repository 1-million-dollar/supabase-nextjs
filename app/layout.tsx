

import '@/app/ui/global.css';

import { Metadata } from 'next';

import SideNav from './ui/sidenav';
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: {
    template: '%s | VocabTrivia',
    default: 'VocabTrivia',
  },
  description: 'A modern website that helps you to improve your knowledge of words and vocabulary through interactive quizes and many more. The three ways of learning vocab is to firstly discover words through reading newspapers and articles and then understanding the word by looking for it in dictionary and finally practicing the words in daily life.',
 
};

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

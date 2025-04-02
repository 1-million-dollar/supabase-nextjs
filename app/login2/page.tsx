'use client'
import { Label } from "../ui/aceternity/label";
import { Input } from "../ui/aceternity/input";
import { cn } from "@/app/lib/utils";

import { login } from './action';
import Link from 'next/link';
import { redirect } from "next/navigation";

import { signIn, useSession } from "next-auth/react";


export default function LoginPage() {

  const { data: session } = useSession();


  

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
    {!session ? (
        <>
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
      Welcome to VocabTrivia
    </h2>
    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
      Login to VocabTrivia 
    </p>

    <form className="my-8">
    
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" placeholder="www.vocabtrivia.com" type="email" required />
      </LabelInputContainer>
      
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" placeholder="••••••••" type="password" required />
      </LabelInputContainer>
      

      <button
        className="bg-gradient-to-br mb-10 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
           formAction={login}
      >
        Login &rarr;
        <BottomGradient />
      </button>
      <LabelInputContainer className="mb-4 mt-4">
        <Label htmlFor="message">If you don&apos;t have an account</Label>
      </LabelInputContainer>
      <div className="flex flex-col justify-center">
        <Link href='/signup'>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
        </Link>
        <button className="flex items-center justify-center px-4 py-2 space-x-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-8" 
                onClick={() => signIn("google")}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 21.99 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.64 12 18.64C9.14 18.64 6.71 16.68 5.84 14.07H2.18V16.94C4.01 20.53 7.71 23 12 23Z" fill="#34A853"/>
                    <path d="M5.84 14.07C5.62 13.43 5.49 12.76 5.49 12.07C5.49 11.38 5.62 10.71 5.84 10.07V7.2H2.18C1.43 8.52 1 10.03 1 11.57C1 13.11 1.43 14.62 2.18 15.94L5.84 14.07Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.71 1 4.01 3.47 2.18 7.06L5.84 9.93C6.71 7.32 9.14 5.38 12 5.38Z" fill="#EA4335"/>
                  </svg>
  
                  <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      
    </form>
          
        </>
      ) : (
        <>
          {redirect("/home")}
        </>
      )}
    </div>
);
    
  
}
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

import { Metadata } from "next";
import { SignupFormDemo } from "../ui/aceternity/signupformdemo"

export const metadata: Metadata = {
    title: 'Sign up',
  };

export default function Page() {
    return (
        <div>
            <SignupFormDemo />
        </div>
    )
}
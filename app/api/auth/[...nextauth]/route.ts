// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient()

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async signIn({ user }) {
      // Store user data in Supabase
      const {  error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          name: user.name,
          email: user.email,
          username: (user.email)?.replace("@gmail.com", "")
        })
        .select();

      if (error) {
        console.error("Error saving user to Supabase:", error);
        return false;
      }

      return true;
    },
   
  },
});

export { handler as GET, handler as POST };
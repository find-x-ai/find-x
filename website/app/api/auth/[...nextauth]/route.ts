import { signInWithGoogle } from "@/actions/auth";
import { sql } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const CLIENT_ID = process.env.OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET!;

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email || !profile?.name) {
        throw new Error("NO profile email");
      }
      const session = Date.now().toString();
      await sql`
      INSERT INTO users (email, name, session)
      VALUES (${profile.email}, ${profile.name}, ${session})
      ON CONFLICT (email) 
      DO UPDATE SET name = ${profile.name}, session = ${session}
    `;

      const res = await signInWithGoogle({
        email: profile.email,
        name: profile.name,
        session,
      });

      if (!res.success) {
        throw new Error("Failed to sign in with Google");
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

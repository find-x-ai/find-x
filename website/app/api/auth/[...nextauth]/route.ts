import { signInWithGoogle } from "@/actions/auth";
import { sql } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from "resend";
import { FINDXWelcomeEmail } from "@/emails/welcome";

const CLIENT_ID = process.env.OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);

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
      const userExists =
        await sql`SELECT * FROM users WHERE email = ${profile.email}`;

      try {
        // For new users
        if (userExists.length === 0) {
          const dbRes = await sql`
            INSERT INTO users (email, name, session)
            VALUES (${profile.email}, ${profile.name}, ${session})
            RETURNING id
          `;

          await sql`
            INSERT INTO plans (user_email, name, paid) 
            VALUES (${profile.email}, 'free', 0) 
          `;

          await signInWithGoogle({
            email: profile.email,
            name: profile.name,
            session,
            id: dbRes[0].id,
          });

          const teamMembers = ["Sahil", "Sohel", "Saad"];
          // select random team member to send magic link
          const teamMember =
            teamMembers[Math.floor(Math.random() * teamMembers.length)];
          const {} = await resend.emails.send({
            from: ` ${teamMember} <${teamMember.toLocaleLowerCase()}@find-x.tech>`,
            to: [profile.email],
            subject: "Welcome to FIND-X!",
            react: FINDXWelcomeEmail({
              userFirstname: profile.name || "there",
            }),
          });
        } else {
          // For existing users, update their session
          await sql`
            UPDATE users 
            SET session = ${session}, name = ${profile.name}
            WHERE email = ${profile.email}
          `;

          await signInWithGoogle({
            email: profile.email,
            name: profile.name,
            session,
            id: userExists[0].id,
          });
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

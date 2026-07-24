import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials username:", credentials?.username);
        
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
        
        try {
          const email = credentials.username.trim().toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email }
          });

          console.log("Prisma user found:", user ? user.email : "Not found");

          if (!user) return null;

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) return null;

          return { id: user.id, name: user.name, email: user.email };
        } catch (e) {
          console.error("Error in authorize:", e);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
// import * as bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions"; // Import from separate file

// declare module "next-auth" {
//   interface Session {
//     user?: {
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       id?: string;
//     };
//   }
// }

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) return null;
//         const user = await prisma.user.findUnique({ where: { email: credentials.email } });
//         if (!user || !user.password) return null;
//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) return null;
//         return { id: user.id, email: user.email, name: user.name, image: user.image };
//       },
//     }),
//   ],
//   session: { strategy: "jwt" },
//   pages: { signIn: "/login" },
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user && token.sub) session.user.id = token.sub;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) token.id = user.id;
//       return token;
//     },
//   },
//   debug: process.env.NODE_ENV === "development",
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

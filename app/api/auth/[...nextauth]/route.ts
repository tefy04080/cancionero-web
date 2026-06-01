import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@/types/next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // JWT strategy para que el middleware pueda leer la sesión
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Al crear/actualizar el JWT, incluimos id y role
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Traer el role actualizado desde la DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        token.role = (dbUser?.role ?? 'USER') as UserRole
      }
      return token
    },
    // Exponer id y role en la sesión del cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role ?? 'USER') as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

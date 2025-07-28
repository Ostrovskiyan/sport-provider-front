import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken: string;
    role: string;
  }
  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
    customField: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    role: string;
  }
}

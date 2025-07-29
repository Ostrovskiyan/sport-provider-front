import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { jwtVerify, importSPKI } from 'jose';

const publicKey = await importSPKI(process.env.BACKEND_JWT_PUBLIC_KEY as string, "RS256");

const loginPasswordProvider = CredentialsProvider({
  id: "login-password",
  name: "Login Password",
  credentials: {
    username: { label: "Username", type: "text", placeholder: "jsmith" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials, req) {
    const response = await fetch("http://localhost:8080/api/v1/usr-srv/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: credentials?.username,
        password: credentials?.password
      })
    });

    const jwt = await response.text();
    const pasrsedJwt = await jwtVerify(jwt, publicKey);

    const user : User = {
      id: pasrsedJwt.payload.sub as string,
      name: pasrsedJwt.payload.sub as string,
      accessToken: jwt    
    };

    return user;
  },
});

export const authOptions = {
  providers: [
    loginPasswordProvider
  ],
  callbacks : {
    async jwt({ token, user } : {token: JWT, user: User, account: any, profile: any}) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token
    },
    async session({ session, token }: {session: any, token: any, user: User}) {
      session.accessToken = token.accessToken
      session.role = token.role;
      return session
    }
  }
};

export function getServerSession() {
  return import("next-auth").then(({ getServerSession }) => getServerSession(authOptions));
}
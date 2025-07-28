import { cookies } from "next/headers";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

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

    const user : User = {
      id: "albert",
      name: "albert",
      accessToken: jwt,
      role: "admin",
    };

    return user;
  },
});

export const authOptions = {
  providers: [
    loginPasswordProvider
  ],
  events: {
    async signIn() {
      console.log("User signed in!");
    },
    async signOut() {
        const cookiesStore = await cookies();
        cookiesStore.delete("JSESSIONID");
    },
  },
  callbacks : {
    async jwt({ token, user, account, profile } : {token: JWT, user: User, account: any, profile: any}) {
      // Persist the OAuth access_token to the token right after signin
      console.log("jwt callback", token, user, account, profile);
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token
    },
    async session({ session, token, user }: {session: any, token: any, user: User}) {
      // Send properties to the client, like an access_token from a provider.
      console.log("session callback", session, token, user);
      session.accessToken = token.accessToken
      session.role = token.role;
      return session
    }
  }
};
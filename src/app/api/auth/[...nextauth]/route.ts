import { authOptions } from "@/auth/auth-options";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

const callbacks = {
  async jwt({ token, account } : {token: any, account: any}) {
    // Persist the OAuth access_token to the token right after signin
    console.log("jwt callback", token, account);
    if (account) {
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token, user }: {session: any, token: any, user: any}) {
    // Send properties to the client, like an access_token from a provider.
    console.log("session callback", session, token, user);
    session.accessToken = token.accessToken
    return session
  }
}

export { 
    handler as GET, 
    handler as POST,
    callbacks as callbacks
};
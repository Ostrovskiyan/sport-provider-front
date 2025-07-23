import { cookies } from "next/headers";

const springOAuthProvider = {
  id: "spring",
  name: "Spring Auth Server",
  type: "oauth",
  version: "2.0",
  authorization: "http://localhost:8081/oauth2/authorize",
  token: "http://localhost:8081/oauth2/token",
  userinfo: "http://localhost:8081/userinfo",
  clientId: 'reactapp',
  clientSecret: 'reactapp',
  clientAuthMethod: "client_secret_basic",
  redirectUri: "http://localhost:3000/api/auth/callback",
  scope: "openid",
  idToken: true,
  issuer: "http://localhost:8081",
  // jwks_endpoint: 'http://localhost:9000/oauth2/jwks',
  wellKnown: "http://localhost:8081/.well-known/openid-configuration",
  profile: (profile: any) => {
    console.log("profile", profile);
    return {
        id: profile.sub,
      name: profile.sub
    };
  },
};

export const authOptions = {
  providers: [springOAuthProvider],
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
  async jwt({ token, account } : {token: any, account: any}) {
    // Persist the OAuth access_token to the token right after signin
    console.log("jwt callback", token, account);
    const cookiesStore = await cookies();
    if (account) {
      token.accessToken = account.access_token
      cookiesStore.set({
        name: "X-Access-Token",
        value: account.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
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
};
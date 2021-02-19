import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET
    })
  ],
  // database: process.env.DATABASE_URL,
  secret: process.env.JWT_SECRET,
  session: {
    jwt: true
  },
  jwt: {},
  pages: {
    error: "/" // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      return { ...token, ...account, ...user };
    }
  },

  events: {},

  debug: false
});

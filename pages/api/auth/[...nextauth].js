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
    error: "/error" // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (account && user) {
        return {
          id: account.id,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          screenName: account.results.screen_name,
          image: user.image,
          email: user.email,
          name: user.name
        };
      }
      return token;
    },
    async session(session, user) {
      session.user.image = user.image;
      return session;
    }
  },

  events: {},

  debug: false
});

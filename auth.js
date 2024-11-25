import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "register",
      name: "register",
      credentials: {
        name: { label: "Username", type: "text", placeholder: "Username" },
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
        role: { label: "Role", type: "role", placeholder: "" },
      },
      async authorize(credentials) {
        console.log("Register Credentials =>", credentials);

        // Simulate user registration logic
        const user = {
          id: 1,
          name: credentials.name,
          email: credentials.email,
          role: credentials.role,
        };

        return user; // Return user object or null if invalid
      },
    }),
    Credentials({
      id: "login",
      name: "login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        console.log("Login Credentials =>", credentials);

        // Simulate login logic
        const user = {
          id: 1,
          name: "Test User",
          email: credentials.email,
        };

        return user; // Return user object or null if invalid
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
        console.log("Sign In User =>", user);
        return true; // Return true to allow sign-in
      },
      async session({ session, user, token }) {
        console.log("Session =>", session);
        session.user = token.user; // Attach user to session
        return session;
      },
    async profile(profile, user, account, isNewUser) {
      console.log("Profile User =>", user);
      return user;
    },
  },
  pages: {
    signIn: "/auth",
    signOut: "/",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
});

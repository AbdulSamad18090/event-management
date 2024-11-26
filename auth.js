import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import dbConnect from "./lib/db-connection/DbConnection";
import User from "./lib/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      async profile(profile) {
        try {
          await dbConnect(); // Connect to the database

          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = new User({
              name: profile.name,
              email: profile.email,
              role: "attendee", // Default to attendee for Google login
            });
            await user.save();
          } else {
            user.name = profile.name; // Update user name if changed
            await user.save();
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return null; // Prevent login on error
        }
      },
    }),

    // Credentials provider for custom login (email/password)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          // Find the user based on the email
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            // Check if password matches (hash comparison)
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordValid) {
              // If valid, return user data (attached to session)
              return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            } else {
              // Password invalid
              return null;
            }
          } else {
            // No user found with this email
            return null;
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // signIn callback: return true or false depending on whether the login is successful
    async signIn({ user, account, profile, credentials }) {
      if (user) {
        console.log("User:", user)
        return true; // Allow sign-in if user is found and authorized
      } else {
        return false; // Deny sign-in if user is invalid (e.g., invalid password or no user)
      }
    },

    // session callback: attach the user data to the session object
    async session({ session, user, token }) {
      session.user = token.user; // Attach user data to session
      return session;
    },

    // jwt callback: add user data to the JWT token when the user is logged in
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Add user data to JWT token
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth", // Redirect to the custom sign-in page
    signOut: "/",
    error: "/auth/error", // Redirect to error page on error
  },

  secret: process.env.AUTH_SECRET, // Secret for signing JWTs
});

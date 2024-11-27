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
      // profile(profile) {
      //   return {
      //     role: profile.role ?? "assignee",
      //     image: profile.image,
      //     ...profile,
      //   };
      // },
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
                image: user.image,
                bio: user.bio, // Ensure bio is included
              };
            } else {
              // Password invalid
              return null;
            }
          } else if (user.isGoogleLogin) {
            throw new Error("Please Login with your Google account");
            return null;
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
    async signIn({ user, account, profile }) {
      console.log("User ====>>", user);
      console.log("Account ====>>", account);
      console.log("Profile ====>>", profile);
      if (user) {
        if (account.provider === "google") {
          await dbConnect();

          const existing = await User.findOne({ email: user.email });

          if (existing) {
            // Update user with Google profile data, ensuring all fields are included
            await User.findByIdAndUpdate(existing._id, {
              name: profile.name || existing.name,
              image: profile.picture || existing.image,
              bio: profile.bio || existing.bio, // Add bio if available
            });
          } else {
            // Create new user with Google profile data, including all fields (name, email, bio)
            const newUser = await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              password: "", // Ensure password is empty for Google login
              role: "attendee", // Default role (adjust as needed)
              isGoogleLogin: true, // Mark that this user logged in via Google
              bio: profile.bio || "", // Add bio if available
            });
            await newUser.save();
          }
        }
        return true; // Allow sign-in if user is found and authorized
      } else {
        return false; // Deny sign-in if user is invalid (e.g., invalid password or no user)
      }
    },

    // session callback: attach the user data to the session object
    async session({ session, token }) {
      // Ensure all relevant user data is passed in session
      if (token.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
          bio: token.user.bio, // Add bio to session data
          role: token.user.role, // Add role to session data
        };
      }
      return session;
    },

    // jwt callback: add user data to the JWT token when the user is logged in
    async jwt({ token, user }) {
      if (user) {
        // Add all relevant user data to the JWT token
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio, // Include bio in JWT
          role: user.role, // Include role in JWT
        };
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

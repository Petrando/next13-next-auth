import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Define the shape of credentials
interface Credentials {
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Invalid credentials");
                }
                const { email, password } = credentials as Credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    // Return user object with a subset of properties
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name
                    };
                } catch (error) {
                    console.error("Error: ", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

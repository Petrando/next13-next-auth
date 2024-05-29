import { Db, WithId, Document } from "mongodb";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

interface User {
    _id: string;
    email: string;
    password: string;
    name: string;
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Invalid credentials");
                }
                const { email, password } = credentials as { email: string, password: string };

                try {
                    const client = await clientPromise;
                    const db: Db = client.db("test");
                    const userDoc: WithId<Document> | null = await db.collection("users").findOne({ email });

                    if (!userDoc) {
                        return null;
                    }

                    const user = userDoc as unknown as User

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    // Return user object with a subset of properties
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name,
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

import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const client = await clientPromise;
        const db = client.db("test");
        await db.collection("users").insertOne({ name, email, password: hashedPassword });        

        return NextResponse.json({ message: "User Registered." }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }
}
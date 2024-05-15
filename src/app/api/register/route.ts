import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectMongoDB();
        await User.create({ name, email, password: hashedPassword });        

        return NextResponse.json({ message: "User Registered." }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }
}
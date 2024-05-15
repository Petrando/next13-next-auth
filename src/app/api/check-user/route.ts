import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");        
        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
    }
}
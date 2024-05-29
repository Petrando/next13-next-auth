import clientPromise from "@/lib/mongodb";
//import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try {        
        const { email } = await req.json();
        const client = await clientPromise;
        const db = client.db("test");
        const user = await db.collection("users").findOne({ email })
        console.log(user)
        return NextResponse.json({ user });
    } catch (error) {
        console.log(error);
    }
}
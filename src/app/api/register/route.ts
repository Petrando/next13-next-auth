import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest) {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await clientPromise;

    const session = client.startSession();
    try {
        session.startTransaction()
        const users = client.db("medical-study").collection("users");
        const user = await users.findOne({ email })
        
        if(user){
            throw `Email ${email} already used`
        }

        const userWithName = await users.findOne({ name })
        if(userWithName){
            throw `Username ${user} already exists.`
        }
        
        await users.insertOne({ name, email, password: hashedPassword, role: 0 });        
        await session.commitTransaction()
        
        return NextResponse.json({ message: "User registered." }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()        
        return NextResponse.json(
            { message: error === `Email ${email} already used`?error:"Error when registering." },
            { status: 500 }
        );
    }finally {
        await session.endSession();
    }
}
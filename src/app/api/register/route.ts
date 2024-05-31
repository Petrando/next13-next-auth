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
        const users = client.db("charity-org").collection("users");
        const user = await users.findOne({ email })
        
        if(user){
            throw `Email ${email} sudah terdaftar`
        }
        await users.insertOne({ name, email, password: hashedPassword });        
        await session.commitTransaction()
        
        return NextResponse.json({ message: "Pengguna berhasil terdaftar." }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()        
        return NextResponse.json(
            { message: error === `Email ${email} sudah terdaftar`?error:"Kesalahan sewaktu mendaftar." },
            { status: 500 }
        );
    }finally {
        await session.endSession();
    }
}
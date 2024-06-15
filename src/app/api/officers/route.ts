import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { filter, projection, limit, offset, itemPerPage = 10 } = await req.json();    
    const client = await clientPromise;

    const skip = offset * itemPerPage
    
    try {        
        const recipients = client.db("charity-org").collection("officers");
        const data = await recipients.find(filter, projection).skip(skip).limit(limit).toArray()
                           
        return NextResponse.json({ message: "Daftar petugas.", data }, { status: 201 });
    } catch (error) {
    
        return NextResponse.json(
            { message: "Gagal mengambil data petugas" },
            { status: 500 }
        );
    }finally {
    
    }
}
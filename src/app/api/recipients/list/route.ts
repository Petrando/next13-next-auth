import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    const { filter, projection, limit, offset, itemPerPage = 10 } = await req.json();    
    const client = await clientPromise;

    const skip = offset * itemPerPage
    
    try {        
        const recipients = client.db("charity-org").collection("recipients");
        const data = await recipients.find(filter, projection).skip(skip).limit(limit)
                           
        return NextResponse.json({ message: "Daftar penerima bantuan.", data }, { status: 201 });
    } catch (error) {
    
        return NextResponse.json(
            { message: "Gagal mengambil data penerima bantuan" },
            { status: 500 }
        );
    }finally {
    
    }
}
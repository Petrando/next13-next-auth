import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { filter, projection, limit, offset, itemPerPage = 10 } = await req.json();    
    const client = await clientPromise;
    
    const skip = offset * itemPerPage    
    try {        
        const RABs = client.db("charity-org").collection("RAB");
        const data = await RABs.find(filter, projection).skip(skip).limit(limit).toArray()
                                   
        return NextResponse.json({ message: "Daftar RAB.", data }, { status: 201 });
    } catch (error) {
    
        return NextResponse.json(
            { message: "Gagal mengambil data RAB" },
            { status: 500 }
        );
    }finally {
    
    }
}
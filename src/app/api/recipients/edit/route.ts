import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req:NextRequest) {
    const { _id, name, birthplaceAndDate, address, ids, contacts } = await req.json();    
    const client = await clientPromise;
    
    try {        
        const recipients = client.db("charity-org").collection("recipients");
        await recipients.updateOne({_id}, {name, birthplaceAndDate, address, ids, contacts})
                           
        return NextResponse.json({ message: "Penerima bantuan berhasil di-update." }, { status: 201 });
    } catch (error) {
    
        return NextResponse.json(
            { message: "Gagal update penerima bantuan" },
            { status: 500 }
        );
    }finally {
    
    }
}
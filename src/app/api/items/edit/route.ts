import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req:NextRequest) {
    const { _id, name, productName, category, subCategory, price } = await req.json();    
    const client = await clientPromise;
    
    try {        
        const items = client.db("charity-org").collection("items");
        await items.updateOne({_id}, {name, productName, category, subCategory, price})
                           
        return NextResponse.json({ message: `Barang ${name} berhasil di update` }, { status: 201 });
    } catch (error) {
    
        return NextResponse.json(
            { message: `Gagal meng-update item ${name}` },
            { status: 500 }
        );
    }finally {
    
    }
}
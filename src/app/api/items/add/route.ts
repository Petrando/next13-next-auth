import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { name, productName, category, subCategory, price } = await req.json();
    
    const client = await clientPromise
    
    try {        
        const items = client.db("charity-org").collection("items");
        
        await items.insertOne({ name, productName, category, subCategory, price });                

        return NextResponse.json({ message: "Barang berhasil ditambahkan." }, { status: 201 });
    } catch (error) {
        
        return NextResponse.json(
            { message: `Tidak berhasil menambahkan barang ${name}` },
            { status: 500 }
        );
    }finally {
                
    }
}
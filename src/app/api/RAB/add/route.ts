/*
import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { title, date, category, recipients } = await req.json();
    
    const client = await clientPromise

    const newRecipients = recipients.filter((d:any) => !d._id)
    const allItems = recipients.map((d:any) => (d.items))
    const newItems = allItems.filter((d:any) => !d._id)

    const session = client.startSession()    
    try {
        const db = client.db("charity-org")        
        const recipients = db.collection("recipients")
        const items = db.collection("items");

        if(newRecipients.length > 0){

        }
        
        await items.insertOne({ name, productName, category, subCategory, price });                

        return NextResponse.json({ message: "Barang berhasil ditambahkan." }, { status: 201 });
    } catch (error) {
        
        return NextResponse.json(
            { message: `Tidak berhasil menambahkan barang ${name}` },
            { status: 500 }
        );
    }finally {
                
    }
}*/
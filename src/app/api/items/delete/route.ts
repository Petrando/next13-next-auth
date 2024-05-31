import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req:NextRequest) {
    const { _id } = await req.json();    

    const client = await clientPromise
    
    try {        
        const items = client.db("charity-org").collection("items");        
        
        await items.deleteOne({_id});        
        
        return NextResponse.json({ message: "Barang berhasil dihapus." }, { status: 201 });
    } catch (error) {
        
        return NextResponse.json(
            { message: error === `gagal menghapus barang dengan _id : ${_id}` },
            { status: 500 }
        );
    }finally {
        
    }
}
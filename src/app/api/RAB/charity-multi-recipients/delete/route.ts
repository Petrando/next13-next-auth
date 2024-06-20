import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req:NextRequest) {
    const { _id } = await req.json();    

    const client = await clientPromise
    
    try {        
        const RABs = client.db("charity-org").collection("RAB");        
        
        await RABs.deleteOne({_id});        
        
        return NextResponse.json({ message: "RAB berhasil dihapus." }, { status: 201 });
    } catch (error) {
        
        return NextResponse.json(
            { message: `Gagal menghapus RAB dengan _id ${_id}` },
            { status: 500 }
        );
    }finally {
        
    }
}
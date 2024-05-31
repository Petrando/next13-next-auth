import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req:NextRequest) {
    const { _id, nik } = await req.json();    

    const client = await clientPromise
    
    try {        
        const recipients = client.db("charity-org").collection("recipients");        
        
        const deleteFilter = _id!==""?{_id}:{nik}
        await recipients.deleteOne(deleteFilter);        
        
        return NextResponse.json({ message: "Penerima bantuan berhasil dihapus." }, { status: 201 });
    } catch (error) {
        
        return NextResponse.json(
            { message: error === `gagal menghapus penerima dengan ${_id!==""?"_id  " + _id:"NIK : " + nik}` },
            { status: 500 }
        );
    }finally {
        
    }
}
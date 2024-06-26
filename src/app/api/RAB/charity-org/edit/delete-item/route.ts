import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req:NextRequest) {
    const { RABId, itemId } = await req.json();
    
    const client = await clientPromise                      
        
    try {
        const db = client.db("charity-org")          
        const RABColl = db.collection("RAB")
                                       
        const result = await RABColl.updateOne(
            {_id: new ObjectId(RABId)},
            {
                $pull:{
                    items:{
                        _id:new ObjectId(itemId)
                    } as any
                }
            }
        )                              

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: 'Barang berhasil dihapus' }, {status: 200});
        } else {
            return NextResponse.json({ message: 'Hapus barang gagal' }, { status: 400});
        }
        
    } catch (error) {        
        return NextResponse.json(
            { message: `Tidak berhasil menambahkan barang baru` },
            { status: 500 }
        );
    }finally {

    }
}
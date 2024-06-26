import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req:NextRequest) {
    const { RABId, itemId, newAmount } = await req.json();
    
    const client = await clientPromise                      
        
    try {
        const db = client.db("charity-org")          
        const RABColl = db.collection("RAB")
                                       
        const result = await RABColl.updateOne(
            {_id: new ObjectId(RABId)},
            {
                $set: {
                    "items.$[elem].amount": newAmount
                }
            },
            {
                arrayFilters: [
                    { "elem._id": new ObjectId(itemId as string) }
                ]
            }
        )                              

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: 'Jumlah barang berhasil dirubah' }, {status: 200});
        } else {
            return NextResponse.json({ message: 'Gagal merubah jumlah barang' }, { status: 400});
        }
        
    } catch (error) {        
        return NextResponse.json(
            { message: `Tidak berhasil merubah jumlah barang` },
            { status: 500 }
        );
    }finally {

    }
}
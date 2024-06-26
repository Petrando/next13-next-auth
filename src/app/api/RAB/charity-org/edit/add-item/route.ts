import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req:NextRequest) {
    const { RABId, item } = await req.json();
    
    const client = await clientPromise                

    const session = client.startSession()  
    
    let itemId = item._id
    try {
        session.startTransaction()
        const db = client.db("charity-org")    
        const itemsColl = db.collection("items");         
        const RABColl = db.collection("RAB")               
        
        if(!item._id || item._id === ""){
            const newInsertedItem = await itemsColl.insertOne(item)
            const {insertedId} = newInsertedItem

            item._id = insertedId
            itemId = insertedId
        }
        
        //after dealing with new recipients and new items, just simply insert the new RAB data        
        const result = await RABColl.updateOne(
            {_id: new ObjectId(RABId)},
            {
                $push:{
                    items:item
                }
            }
        )        
        await session.commitTransaction()                       

        return NextResponse.json({ message: "Barang baru berhasil ditambahkan.", itemId }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()
        return NextResponse.json(
            { message: `Tidak berhasil menambahkan barang baru` },
            { status: 500 }
        );
    }finally {
        await session.endSession();        
    }
}
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";
import { PersonRecipientWItems, OrderedItem } from "@/types";

/*
NOTE TO SELF:
Currently this route can only deal with change recipient address, 
in the future, consider to modify to change other recipient's field as well

*/
export async function PATCH(req:NextRequest) {
    const { RABId, recipientIdx, recipientNik, address } = await req.json();
    
    const client = await clientPromise        

    const session = client.startSession()  
        
    try {
        session.startTransaction()
        const db = client.db("charity-org")        
        const recipientsColl = db.collection("recipients")        
        const RABColl = db.collection("RAB")
        
        const result1 = await RABColl.updateOne(
            { _id: new ObjectId(RABId) },
            { $set: { [`recipients.${recipientIdx}.address`]: address } }
        );

        console.log(`${result1.modifiedCount} document(s) updated`);

        const result2 = await recipientsColl.updateOne(
            { "ids.nik": recipientNik }, // Filter by NIK
            { $set: { address } } // Update address
        );

        console.log(`${result2.modifiedCount} document(s) updated`);
           
        await session.commitTransaction()                       

        return NextResponse.json({ message: "Penerima berhasil diubah." }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()
        return NextResponse.json(
            { message: `Tidak berhasil merubah penerima` },
            { status: 500 }
        );
    }finally {
        await session.endSession();        
    }
}
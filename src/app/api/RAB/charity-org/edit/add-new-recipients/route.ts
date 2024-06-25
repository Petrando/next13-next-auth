import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";
import { PersonRecipientWItems, OrderedItem } from "@/types";

export async function PATCH(req:NextRequest) {
    const { RABId, recipients } = await req.json();
    
    const client = await clientPromise
    
    const newRecipients = recipients.filter((d:PersonRecipientWItems) => !d._id).map((d:PersonRecipientWItems)=>{
        const {items, completed, ...rest} = d

        return {...rest}
    })      

    const items = recipients.map((d:PersonRecipientWItems)=>d.items).flat()
    const newItems = items.reduce((acc:OrderedItem[], curr:OrderedItem)=>{
        const newItemIdx = acc.findIndex((d:any)=>
            d.name === curr.name && d.productName === curr.productName && d.category === curr.category && 
            d.subCategory === curr.subCategory && d.unit === curr.unit)
        if(newItemIdx === -1 && !curr._id){
            acc.push(curr)
        }
        return acc
    }, [])    

    const session = client.startSession()  
        
    try {
        session.startTransaction()
        const db = client.db("charity-org")        
        const recipientsColl = db.collection("recipients")
        const itemsColl = db.collection("items");         
        const RABColl = db.collection("RAB")

        //if threre are new recipients, insert those new recipients into 'recipients' collection
        //and update main data
        if(newRecipients.length > 0){
            const newRecipientsIds = await recipientsColl.insertMany(newRecipients)
                   
            const { insertedIds } = newRecipientsIds

            for(let i = 0; i<newRecipients.length - 1; i++){
                //newRecipients[i]._id = insertedIds[i]
                if(Array.isArray(recipients)){
                    const recipientsIdx = recipients.findIndex((d:any) => d.nik === newRecipients[i].nik)

                    recipients[recipientsIdx]._id = insertedIds[i]
                }                
            } 
        }        
        
        if(newItems.length > 0){
            const newInsertedItems = await itemsColl.insertMany(newItems)
            const {insertedIds} = newInsertedItems

            newItems.forEach((d:any, i: number) => {
                d._id = insertedIds[i]
            })
        }

        recipients.forEach((r:any)=>{
            r.items.forEach((item:any)=>{
                if(!item._id){
                    const {_id} = newItems.find((newItem:any)=> newItem.name === item.name && newItem.productName === item.productName && newItem.category === item.category && newItem.subCategory === item.subCategory)
                    item._id = _id
                }
            })
        })
        
        //after dealing with new recipients and new items, just simply insert the new RAB data        
        await RABColl.updateOne(
            {_id: new ObjectId(RABId)},
            {
                $addToSet:{
                    recipients:{ $each: recipients}
                }
            }
        )        
        await session.commitTransaction()                       

        return NextResponse.json({ message: "Penerima baru berhasil ditambahkan." }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()
        return NextResponse.json(
            { message: `Tidak berhasil menambahkan penerima baru` },
            { status: 500 }
        );
    }finally {
        await session.endSession();        
    }
}
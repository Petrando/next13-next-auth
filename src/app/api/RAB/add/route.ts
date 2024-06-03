import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { title, date, category, recipients } = await req.json();
    
    const client = await clientPromise
    
    const newRecipients = recipients.filter((d:any) => !d._id).map((d:any)=>{
        const {items, ...rest} = d

        return {...rest}
    })      

    const items = recipients.map((d:any)=>d.items).flat()
    const newItems = items.reduce((acc:any[], curr:any)=>{
        const newItemIdx = acc.findIndex((d:any)=>d.name === curr.name && d.productName === curr.productName && d.category === curr.category && d.subCategory === curr.subCategory)
        if(newItemIdx === -1){
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
            /*{
                acknowledged: true,
                insertedCount: 2,
                insertedIds: {
                    '0': new ObjectId('66587d119608933e96031e1b'),
                    '1': new ObjectId('66587d119608933e96031e1c')
                }
            }*/        
            const {insertedIds} = newRecipientsIds

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
        await RABColl.insertOne({title, date, category, recipients})        
        await session.commitTransaction()                       

        return NextResponse.json({ message: "RAB berhasil ditambahkan." }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()
        return NextResponse.json(
            { message: `Tidak berhasil menambahkan RAB ${title} tanggal ${date}` },
            { status: 500 }
        );
    }finally {
        await session.endSession();        
    }
}
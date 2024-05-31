import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req:NextRequest) {
    const { _id, title, date, category, recipients } = await req.json();
    
    const client = await clientPromise
    
    const newRecipients = recipients.filter((d:any) => !d._id).map((d:any)=>{
        const {items, ...rest} = d

        return {...rest}
    })

    const recipientsWithNewItems = Array.isArray(recipients) && recipients.reduce((acc, curr)=>{
        const withNewItems = Array.isArray(curr.items) && curr.items.some((d:any)=>!d._id)

        if(withNewItems){
            acc.push(curr)
        }

        return acc
    }, [])    

    const session = client.startSession()
    
    try {        
        const db = client.db("charity-org")        
        const recipients = db.collection("recipients")
        const items = db.collection("items");         
        const RAB = db.collection("RAB")

        //if threre are new recipients, insert those new recipients into 'recipients' collection
        //and update main data
        if(newRecipients.length > 0){
            const newRecipientsIds = await recipients.insertMany(newRecipients)            
            const {insertedIds} = newRecipientsIds

            for(let i = 0; i<newRecipients.length - 1; i++){                
                if(Array.isArray(recipients)){
                    const recipientsIdx = recipients.findIndex((d:any) => d.nik === newRecipients[i].nik)

                    recipients[recipientsIdx]._id = insertedIds[i]
                }                
            } 
        }
        
        //if recipients has new items, insert the new items into 'items' collection
        //and update main data accordingly
        recipientsWithNewItems.forEach(async (d:any)=>{
            const myNewItems = d.items.filter((di:any) => !di._id)

            const {insertedIds} = await items.insertMany(myNewItems)

            for(let i = 0; i < myNewItems.length; i++){
                const myNewItem = myNewItems[i]
                const itemIdx = d.items.findIndex((d:any)=> d.name === myNewItem.name && d.productName === myNewItem.productName && d.category === myNewItem.category && d.subCategory === myNewItem.subCategory)

                d.items[itemIdx]._id = insertedIds[i]
            }
        })
        await RAB.updateOne({_id}, { title, date, category, recipients })
        await session.commitTransaction()

        return NextResponse.json({ message: `RAB ${title} berhasil di update` }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()
        return NextResponse.json(
            { message: `Gagal meng-update RAB ${title}` },
            { status: 500 }
        );
    }finally {
        await session.endSession()
    }
}
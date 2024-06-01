import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { title, date, category, recipients } = await req.json();
    
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
        
        //if recipients has new items, insert the new items into 'items' collection
        //and update main data accordingly
        if(recipientsWithNewItems.length > 0){
            //first process all recipients who has new item(s)
            recipientsWithNewItems.forEach(async (d:any)=>{
                const myNewItems = d.items.filter((di:any) => !di._id)
                //get all new items and insert them into 'items' collection
                const {insertedIds} = await items.insertMany(myNewItems)
                
                //update the new items with newly inserted _id(s)
                for(let i = 0; i < myNewItems.length; i++){
                    const myNewItem = myNewItems[i]
                    const itemIdx = d.items.findIndex((d:any)=> d.name === myNewItem.name && d.productName === myNewItem.productName && d.category === myNewItem.category && d.subCategory === myNewItem.subCategory)
    
                    d.items[itemIdx]._id = insertedIds[i]
                }

                //then update the main recipients data
                if(Array.isArray(recipients)){
                    const recipientsIdx = recipients.findIndex((dr:any)=> dr.nik === d.nik)
                    recipients[recipientsIdx].items = d.items
                }                
            })            
        }
        
        //after dealing with new recipients and new items, just simply insert the new RAB data
        await RAB.insertOne({title, date, category, recipients})
        await session.commitTransaction()
        //await items.insertOne({ name, productName, category, subCategory, price });                

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
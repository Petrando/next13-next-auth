import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { title, date, category, recipient, items } = await req.json();
    
    const client = await clientPromise
    
    const isNewRecipient = !recipient._id      
    
    const newItems = items.reduce((acc:any[], curr:any)=>{
        const newItemIdx = acc.findIndex((d:any)=>
            d.name === curr.name && d.productName === curr.productName && d.category === curr.category && 
            d.subCategory === curr.subCategory && d.unit === curr.unit)
        if(newItemIdx === -1 && !curr._id){
            const { amount, ...rest} = curr
            acc.push({...rest})
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
        if(isNewRecipient){
            const result = await recipientsColl.insertOne(recipient)                  
            const { insertedId } = result

            recipient._id = insertedId 
        }        
        
        if(newItems.length > 0){
            const newInsertedItems = await itemsColl.insertMany(newItems)
            const {insertedIds} = newInsertedItems

            newItems.forEach((d:any, i: number) => {
                d._id = insertedIds[i]
            })
        }

        items.forEach((item:any)=>{
            if(!item._id){
                const {_id} = newItems.find((newItem:any)=> newItem.name === item.name && 
                    newItem.productName === item.productName && newItem.category === item.category && 
                        newItem.subCategory === item.subCategory && newItem.unit === item.unit)
                item._id = _id
            }
        })
        
        //after dealing with new recipients and new items, just simply insert the new RAB data
        await RABColl.insertOne({title, date, category, recipient, items})        
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
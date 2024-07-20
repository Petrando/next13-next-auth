import fs from 'fs'
import path from 'path'
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";


export async function POST(req:NextRequest) {
    const { filter, projection, limit, offset, itemPerPage = 10, logo = "KemensosLogo.png" } = await req.json();    
    const client = await clientPromise;

    const skip = offset * itemPerPage
    
    const session = client.startSession()
    try {        
        session.startTransaction()
        const officersColl = client.db("charity-org").collection("operators");
        const operators = await officersColl.find(filter, projection).skip(skip)/*.limit(limit)*/.toArray()        
                                   
        await session.commitTransaction()

        const filePath = path.join(process.cwd(), 'public', 'images', logo);
        const fileBuffer = fs.readFileSync(filePath);
        const base64String = fileBuffer.toString('base64')        
                
        return NextResponse.json(
            { 
                message: "Daftar petugas dan logo", 
                data:{
                    operators,
                    logo: `data:image/png;base64,${base64String}`
                } 
            }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()
        return NextResponse.json(
            { message: "Gagal mengambil data petugas atau logo" },
            { status: 500 }
        );
    }finally {
        await session.endSession()
    }
}
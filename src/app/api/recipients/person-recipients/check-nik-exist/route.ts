import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { nik } = await req.json();    
    const client = await clientPromise;
    
    try {        
        const recipients = client.db("charity-org").collection("recipients");
        const user = await recipients.find({ "ids.nik":nik, type: "person" }).toArray()
                
        if(user.length > 0){
            throw `Nik ${nik} sudah terdaftar`
        }        

        return NextResponse.json({ message: "Nik belum ada." }, { status: 201 });
    } catch (error) {               
        return NextResponse.json(
            { message: error === `Nik ${nik} sudah terdaftar`?error:"Kesalahan sewaktu periksa NIK." },
            { status: 500 }
        );
    }finally {
        
    }
}
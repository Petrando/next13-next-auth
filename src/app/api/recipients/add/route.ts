import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    const { name, birthplaceAndDate, address, ids, contacts } = await req.json();
    const { nik, nokk } = ids
    const client = await clientPromise;

    const session = client.startSession();
    try {        
        const recipients = client.db("charity-org").collection("recipients");
        const user = await recipients.find({ $or:[{nik}, {nokk}] })
        
        if(user){
            throw `Nik ${nik} atau nomor KK ${nokk} sudah terdaftar`
        }
        await recipients.insertOne({ name, birthplaceAndDate, address, ids, contacts });        
        await session.commitTransaction()

        return NextResponse.json({ message: "Penerima bantuan berhasil terdaftar." }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()        
        return NextResponse.json(
            { message: error === `Nik ${nik} atau nomor KK ${nokk} sudah terdaftar`?error:"Kesalahan sewaktu mendaftar penerima bantuan." },
            { status: 500 }
        );
    }finally {
        await session.endSession();
    }
}
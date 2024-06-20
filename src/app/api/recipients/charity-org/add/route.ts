import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { CharityOrgRecipient } from "@/types";

export async function POST(req:NextRequest) {
    const { org } = await req.json();
    const { name, number, address, contact } = org as CharityOrgRecipient
    const { street, kelurahan, kecamatan, kabupaten, propinsi, postCode, rtRw } = address

    const client = await clientPromise;

    const session = client.startSession();
    try {        
        const recipients = client.db("charity-org").collection("recipients");
        const org = await recipients.find({ 
            name, number,
            "address.street": street,
            "address.rtRw": rtRw,
            "address.kelurahan": kelurahan,
            "address.kecamatan": kecamatan,
            "address.kabupaten": kabupaten,
            "address.propinsi": propinsi,
            "address.postCode": postCode,
            type: "charity-org"            
        })
        
        if(org){
            throw `${name} sudah terdaftar`
        }
        await recipients.insertOne({ name, number, address, contact, type: "charity-org" });        
        await session.commitTransaction()

        return NextResponse.json({ message: `Organisasi "${name}" bantuan berhasil terdaftar.` }, { status: 201 });
    } catch (error) {
        await session.abortTransaction()        
        return NextResponse.json(
            { message: error === `${name} sudah terdaftar`?error:"Kesalahan sewaktu mendaftar organisasi penerima bantuan." },
            { status: 500 }
        );
    }finally {
        await session.endSession();
    }
}
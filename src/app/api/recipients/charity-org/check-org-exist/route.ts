import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { CharityOrgRecipient } from "@/types";

export async function POST(req:NextRequest) {
    const { org } = await req.json();    
    const { name, number, address, contact } = org as CharityOrgRecipient
    const { street, kelurahan, kecamatan, kabupaten, propinsi, postCode, rtRw } = address
    const client = await clientPromise;
    
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
        }).toArray()
        
        if(org.length > 0){
            throw `${name} sudah terdaftar`
        }        

        return NextResponse.json({ message: `Organisasi ${name} belum ada.` }, { status: 201 });
    } catch (error) {               
        return NextResponse.json(
            { message: error === `${name} sudah terdaftar`?error:"Kesalahan sewaktu periksa organisasi amal." },
            { status: 500 }
        );
    }finally {
        
    }
}
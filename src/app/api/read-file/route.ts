import fs from 'fs'
import path from 'path'
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'images', 'BASTLogo.png');
        const fileBuffer = fs.readFileSync(filePath);
        const base64String = fileBuffer.toString('base64');

        return NextResponse.json(
            { message: "Read picture success.", data: `data:image/png;base64,${base64String}` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error reading file:', error);
        return NextResponse.json(
            { message: "Gagal membaca file gambar" },
            { status: 500 }
        );
    }
}

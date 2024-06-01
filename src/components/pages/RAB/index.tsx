'use client'

import Link from "next/link"
import { Button } from "@nextui-org/react"
export const RABList = () => {
    return (
        <div className="h-screen flex flex-col ">
            <div className="flex items-center justify-end px-2 py-3">
                <div className="flex-auto flex items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Daftar RAB
                    </h1>
                </div>
                <div className="w-fit">
                    <Link href={"/RAB/add"}>
                    <Button color="primary">Tambah RAB</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
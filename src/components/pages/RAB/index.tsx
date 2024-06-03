'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@nextui-org/react"
import { IRAB } from "@/types"

export const RABList = () => {
    const [RABs, setRABs] = useState<IRAB[]>([])

    const getRABs = async () => {
        const filter = {}
        const projection = {}
        const limit = 10
        const offset = 0
        try{
            const response = await fetch('/api/RAB/list', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            setRABs(data.data)
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            
        } 
    }

    useEffect(()=>{
        getRABs()
    }, [])

    console.log(RABs)
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
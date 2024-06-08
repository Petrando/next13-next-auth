'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, DateInput,
    Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
        Skeleton
 } from "@nextui-org/react"
import { createDateString } from "@/lib/functions";
import { IRAB, PersonRecipientWItems } from "@/types"

export const RABList = () => {
    const [RABs, setRABs] = useState<IRAB[]>([])
    const [fetchState, setFetchState] = useState("loading")

    const getRABs = async () => {
        const filter = {}
        const projection = {}
        const limit = 10
        const offset = 0

        setFetchState("loading")
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
            setFetchState("complete")
        } 
    }

    useEffect(()=>{
        getRABs()
    }, [])
    
    return (
        <div className="h-screen flex flex-col ">
            <div className="flex items-center justify-end px-2 py-3">
                <div className="flex-auto flex items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        {
                            fetchState === "loading"?
                                "Mengambil Data RAB...":RABs.length > 0?"Daftar RAB":
                                    "Belum ada RAB"
                        }
                    </h1>
                </div>
                <div className="w-fit">
                    <Link href={"/RAB/add"}>
                        <Button color="primary">Tambah RAB</Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-wrap px-1 md:px-3">
                {fetchState === "complete" ? (RABs.length > 0 && RABs.map((d:IRAB) => {                    
                    return(
                        <div key={d._id} className="h-60 basis-full md:basis-1/2 lg:basis-1/3 flex p-1 md:p-2">
                            <Card  className="basis-full">
                                <CardHeader className="flex">
                                    <h3 className="text-lg font-semibold basis-4/5 text-center">
                                        {d.title}
                                    </h3>
                                    <DateInput 
                                        label={"Tanggal"} 
                                        isReadOnly
                                        value={createDateString(new Date(d.date))}  
                                        className="basis-1/5"
                                    />
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                <Table aria-label="Tabel Penerima Bantuan">
                                    <TableHeader>
                                        <TableColumn>NAMA</TableColumn>                                    
                                        <TableColumn>NIK</TableColumn>                                    
                                        <TableColumn>Barang</TableColumn>
                                    </TableHeader> 
                                    <TableBody>
                                    {
                                        d.recipients.map((dPerson:PersonRecipientWItems)=>{
                                            return (
                                                <TableRow key={dPerson._id?dPerson._id:dPerson.ids.nik}>
                                                    <TableCell>{dPerson.name}</TableCell>
                                                    <TableCell>{dPerson.ids.nik}</TableCell>
                                                    <TableCell>{dPerson.items[0].name}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    </TableBody>
                                </Table>
                                </CardBody>
                                <Divider />
                                <CardFooter className="flex justify-end">
                                    <Link href={{
                                        pathname:"/RAB/detail",
                                        query:{
                                            _id:d._id
                                        }
                                    }}>
                                    <Button color="primary" size="sm">
                                        Detil RAB
                                    </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    )
                })): 
                    <div className="h-60 basis-full md:basis-1/2 lg:basis-1/3 flex p-1 md:p-2">               
                        <Card className="basis-full">
                            <CardHeader className="flex">
                                <Skeleton className="rounded" isLoaded={fetchState==="complete"}>
                                    <h3 className="text-lg font-semibold basis-4/5 text-center">
                                        Judul RAB yang akan dimuat
                                    </h3>
                                </Skeleton>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="w-full flex space-x-1 pt-10">
                                    <Skeleton className="rounded-md h-8 basis-1/3" isLoaded={fetchState==="complete"} />   
                                    <Skeleton className="rounded-md h-8 basis-1/3" isLoaded={fetchState==="complete"} />   
                                    <Skeleton className="rounded-md h-8 basis-1/3" isLoaded={fetchState==="complete"} />   
                                </div>                            
                            </CardBody>
                            <Divider />
                            <CardFooter className="flex justify-end">
                                <Skeleton className="rounded-md" isLoaded={fetchState === "complete"}>
                                    <Button size="sm">
                                        Detil RAB
                                    </Button>
                                </Skeleton>
                            </CardFooter>
                        </Card>
                    </div>
                }
               
            </div>
        </div>
    )
}
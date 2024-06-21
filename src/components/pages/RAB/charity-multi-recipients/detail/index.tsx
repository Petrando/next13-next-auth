'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,    
        DatePicker, Input,  Skeleton, Tabs, Tab,
            Link
 } from "@nextui-org/react"
import { AddRecipients } from './AddRecipients';
import { ItemsTable } from '../../shared/ItemsTable';
import { TableItem } from '../../shared/TableItemCard';
import { TableContact } from '../../shared/TableContact';
import { TotalRow } from '../../shared/TotalTableRow';
import { TotalCard } from '../../shared/TotalCard';
import { PrintIcon } from '@/components/Icon';
import { PrintBAST } from './PrintBASTDialog';
import { createDateString } from '@/lib/functions';
import { emptyRAB, emptyPerson } from '@/variables-and-constants';
import { IRABMultiPerson, PersonRecipientWItems, OrderedItem } from '@/types';


export const RABDetail = () => {
    const [ tab, setTab ] = useState("recipients");

    const [RAB, setRAB] = useState<IRABMultiPerson>(emptyRAB)
    const [fetchState, setFetchState] = useState("loading")

    const [ printingRecipient, setPrintingRecipient ] = useState(emptyPerson)

    const searchParams = useSearchParams()
    const rabId = searchParams.get("_id")

    const getRAB = async (_id:string) => {
        const filter = {_id}
        const projection = {}
        const limit = 1
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
            setRAB(data.data[0])
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setFetchState("complete")
        } 
    }
    
    useEffect(()=>{
        if(rabId && rabId !== ""){
            getRAB(rabId)
        }
    }, [rabId])

    const { title, date, recipients } = RAB

    const items = recipients.map((d:PersonRecipientWItems) => d.items).flat()

    const totalPrice = recipients
        .filter((d:PersonRecipientWItems) => d.items.length > 0)
        .map((d:PersonRecipientWItems) => d.items).flat()
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)

    const renderElement = recipients.length > 0?recipients.concat(emptyPerson):[]    
    
    const { ids:{nik} } = printingRecipient
    return (
        <div className="flex flex-col w-screen px-1 md:px-2">            
            <div className="px-0 py-2 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker 
                        label="Tanggal" className="max-w-[284px]" 
                        value={createDateString(new Date(date))} 
                        isReadOnly
                    />
                </div>
                <div className="flex-auto p-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} 
                        isReadOnly                        
                    />
                </div>
            </div>
            <Tabs 
                aria-label="Options"         
                selectedKey={tab}
                onSelectionChange={(e) =>{setTab(e as string)}}
                disabledKeys={recipients.length === 0?["items", "new recipients"]:[]}
            >
                <Tab key="recipients" title="Detil RAB">                                        
                    <Table aria-label="Tabel Penerima Bantuan">
                        <TableHeader>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    NAMA
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    ALAMAT
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    NIK
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    No KK
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    Kontak
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    Bantuan
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState!=="loading"}>
                                    BAST
                                </Skeleton>
                            </TableColumn>
                        </TableHeader>                
                        <TableBody>
                            {
                                renderElement.map((d:PersonRecipientWItems, i:number)=>{
                                    const isEmptyElement = d.name === "" && d.ids.nik === ""
                                    if(isEmptyElement){
                                        return <TableRow key={i.toString()}>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={6}>
                                                <TotalCard total={totalPrice} />   
                                            </TableCell>
                                            <TableCell colSpan={1}>{''}</TableCell>
                                        </TableRow>
                                    }                            
                                    return (
                                        <TableRow key={i.toString()}>
                                            <TableCell>                                        
                                                {d.name}                                        
                                            </TableCell>
                                            <TableCell>                                        
                                                {d.address.street}, {d.address.rtRw}, {d.address.kelurahan}, {d.address.kecamatan}, {d.address.kabupaten}                                        
                                            </TableCell>
                                            <TableCell>
                                                {d.ids.nik}                                        
                                            </TableCell>
                                            <TableCell>
                                                {d.ids.noKk}                                        
                                            </TableCell>
                                            <TableCell>
                                                <TableContact contact={d.contact} />                                                                                
                                            </TableCell>
                                            <TableCell>
                                                <TableItem item={d.items[0]} editable={false} />                                        
                                            </TableCell>
                                            <TableCell>
                                                <Button size='sm' color='primary' startContent={<PrintIcon className='size-4' />}
                                                    onPress={()=>{
                                                        setPrintingRecipient(d)
                                                    }}
                                                >
                                                    BAST 
                                                </Button>                                        
                                            </TableCell>                                    
                                        </TableRow>
                                    )
                                })
                            }                    
                        </TableBody>
                    </Table>
                </Tab>
                <Tab key="items" title="Rekapan">
                    <ItemsTable items={items} />
                </Tab>
                <Tab key="new recipients" title="Tambah Penerima">
                    <AddRecipients />
                </Tab>
            </Tabs>
            <div className="flex items-center justify-end px-2 py-3">
                <Link href="/RAB" isDisabled={fetchState === "loading"} color="primary" underline="hover"
                    className="mx-4"
                >
                    Daftar RAB
                </Link>
            </div>
            {
                nik !== "" &&
                <PrintBAST recipient={printingRecipient} show={nik!==""}
                    hideForm={()=>{setPrintingRecipient(emptyPerson)}} />
             }
        </div>
    )
}
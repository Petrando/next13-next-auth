'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,    
        DatePicker, Input,  Skeleton, Tabs, Tab, Card, CardBody, CardFooter,
            Link
 } from "@nextui-org/react"
import { AddRecipients } from './AddRecipients';
import { ItemsTable } from '../../shared/ItemsTable';
import { TableItem } from '../../shared/TableItemCard';
import { TableContact } from '../../shared/TableContact';
import { TotalRow } from '../../shared/TotalTableRow';
import { TotalCard } from '../../shared/TotalCard';
import { PrintIcon, CogIcon } from '@/components/Icon';
import { SelectBAST } from '../../shared/SelectBASTButton';
import { PrintBAST as PrintReceiverBAST } from './print-BAST-dialog/BASTReceiverDialog';
import { PrintBAST as PrintGigBAST } from '../../shared/PrintDocDialogs/BASTGigDialog';
import { PrintDocs } from '../../shared/PrintDocDialogs';
import { EditRecipientDialog } from './EditRecipientDialog';
import { EditBtn } from '@/components/shared/Buttons';
import { createDateString } from '@/lib/functions';
import { emptyRAB, emptyPerson } from '@/variables-and-constants';
import { IRABMultiPerson, PersonRecipientWItems, OrderedItem } from '@/types';

export const RABDetail = () => {
    const [ tab, setTab ] = useState("recipients");

    const [RAB, setRAB] = useState<IRABMultiPerson>(emptyRAB)
    const [fetchState, setFetchState] = useState("loading")

    const [editRecipientIdx, setEditRecIdx] = useState(-1)

    const [ printingRecipient, setPrintingRecipient ] = useState(emptyPerson)
    const [ printWorkingBast, setPrintWorkingBast ] = useState(false)
    const [ printDocs, setPrintDocs ] = useState(false)

    const searchParams = useSearchParams()
    const rabId = searchParams.get("_id")

    const getRAB = async () => {
        if(!rabId || rabId === ""){return}

        const filter = {_id:rabId}
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
            setEditRecIdx(-1)
        } 
    }
    
    useEffect(()=>{        
        getRAB()        
    }, [rabId])

    const { title, date, recipients } = RAB

    const items = recipients.map((d:PersonRecipientWItems) => d.items).flat()

    const totalPrice = recipients
        .filter((d:PersonRecipientWItems) => d.items.length > 0)
        .map((d:PersonRecipientWItems) => d.items).flat()
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)

    const niks = recipients.map((d:PersonRecipientWItems) => d.ids.nik)
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
                <div className="w-fit p-1">
                    <Button
                        color="primary"
                        size="md"
                        onPress={()=>{ setPrintWorkingBast(true) }}
                        startContent={<PrintIcon />}
                        disabled={fetchState === "loading"}
                    >
                        BAST Pekerjaan
                    </Button>
                    <Button
                        color="primary"
                        size="md"
                        onPress={()=>{ setPrintDocs(true) }}
                        startContent={<CogIcon />}
                        disabled={fetchState === "loading"}
                    >
                        Pilih Dokumen
                    </Button>
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
                                                <Card>
                                                    <CardBody>
                                                        {d.address.street}, {d.address.rtRw}, {d.address.kelurahan}, {d.address.kecamatan}, {d.address.kabupaten}, {d.address.propinsi}                                        
                                                    </CardBody>
                                                    <CardFooter className='flex items-center justify-end'>
                                                        <EditBtn onPress={()=>{ setEditRecIdx(i)} } />
                                                    </CardFooter>
                                                </Card>                                        
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
                                                <TableItem item={d.items[0]} isDisabled={true} />                                        
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    color="primary" size="sm"
                                                    startContent={<PrintIcon />}
                                                    onPress={()=>{setPrintingRecipient(d)}}
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
                    <AddRecipients 
                        refresh={()=>{                        
                            getRAB()       
                        }}
                        id={rabId?rabId:""}
                        existingNiks={niks}
                    />
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
                <PrintReceiverBAST 
                    recipient={printingRecipient} show={nik!==""} hideForm={()=>{setPrintingRecipient(emptyPerson)}} />
            }
            {
                printWorkingBast &&
                <PrintGigBAST
                    items={items} show={printWorkingBast} hideForm={()=>{setPrintWorkingBast(false)}}
                />
            }
            {
                printDocs &&
                <PrintDocs RAB={RAB} show={printDocs} hideForm={()=>{setPrintDocs(false)}} />
            }
            {
                editRecipientIdx > -1 &&
                <EditRecipientDialog 
                    idx={editRecipientIdx} rabId={RAB._id} 
                    recipient={recipients[editRecipientIdx]}
                    show={editRecipientIdx > -1}                    
                    close={(refetch)=>{
                        if(refetch){
                            getRAB()
                        }else{
                            setEditRecIdx(-1)
                        }
                        
                    }}
                />
            }
        </div>
    )
}
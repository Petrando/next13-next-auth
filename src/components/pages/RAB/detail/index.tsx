'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input,  Skeleton, 
            Link
 } from "@nextui-org/react"
import { TableItem } from '../shared/TableItemCard';
import { TableContact } from '../shared/TableContact';
import { TotalRow } from '../shared/TotalTableRow';
import { TotalCard } from '../shared/TotalCard';
import CurrencyFormat from 'react-currency-format';
import { PrintIcon } from '@/components/Icon';
import { createDateString } from '@/lib/functions';
import { emptyRAB, emptyPerson } from '@/variables-and-constants';
import { IRAB, PersonRecipientWItems, OrderedItem } from '@/types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const doc = new Document({
    styles: {
        paragraphStyles: [
            {
                id: "myWonkyStyle",
                name: "My Wonky Style",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    italics: true,
                    color: "999999",
                },
                paragraph: {
                    spacing: {
                        line: 276,
                    },
                    indent: {
                        left: 720,
                    },
                },
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    size: 26,
                    color: "999999"
                },
                paragraph: {
                    spacing: {
                        before: 240,
                        after: 120
                    },
                },
            },
        ]
    },
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: "KEMENTERIAN SOSIAL REPUBLIK INDONESIA",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.START,
                    style: "FFFFFF"
                }),
                new Paragraph({
                    text: "SENTRA “MULYA JAYA” DI JAKARTA",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.START,
                    style: "FFFFFF"
                }),
                new Paragraph({
                    text: "JALAN TAT TWAM ASI NO. 47 KOMPLEK DEPSOS PASAR REBO",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.START,
                    style: "FFFFFF"
                }),
                new Paragraph({
                    text: "JAKARTA TIMUR 13760",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.START,
                    style: "FFFFFF"
                }),
                new Paragraph({
                    text: "TELEPON (021) 8400631    FAKSIMILE: (021) 8415717",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.START,
                    style: "FFFFFF"
                }),
                new Paragraph({
                    text: "stylehttp//mulyajaya.depsos.go.id    E_MAIL: pskw_mulyajaya@depsos.go.id",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.START,
                    style: "FFFFFF"
                }),
                new Paragraph({
                    children: [
                        new TextRun("Hello World"),
                        new TextRun({
                            text: "Foo Bar",
                            bold: true,
                        }),
                        new TextRun({
                            text: "\tGithub is the best",
                            bold: true,
                        }),
                    ],
                }),
            ],
        },
    ],
});

export const RABDetail = () => {
    const [RAB, setRAB] = useState<IRAB>(emptyRAB)
    const [fetchState, setFetchState] = useState("loading")

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

    const totalPrice = recipients
        .filter((d:PersonRecipientWItems) => d.items.length > 0)
        .map((d:PersonRecipientWItems) => d.items).flat()
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)

    const renderElement = recipients.length > 0?recipients.concat(emptyPerson):[]    

    function saveDocumentToFile(doc:any, fileName:string) {
        
        const mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        Packer.toBlob(doc).then((blob:any) => {
            const docblob = blob.slice(0, blob.size, mimeType);
            saveAs(docblob, fileName);
        });
    }



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
                                                saveDocumentToFile(doc, 'first.docx')
                                            }}
                                        >
                                            BAST <br/>(maintenance)   
                                        </Button>                                        
                                    </TableCell>                                    
                                </TableRow>
                            )
                        })
                    }                    
                </TableBody>
            </Table>
            <div className="flex items-center justify-end px-2 py-3">
                <Link href="/RAB" isDisabled={fetchState === "loading"} color="primary" underline="hover"
                    className="mx-4"
                >
                    Daftar RAB
                </Link>
            </div>
        </div>
    )
}
'use client'

import { useState, useEffect } from "react"
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input, RadioGroup, Radio

 } from "@nextui-org/react"
import { CogIcon } from "@/components/Icon"
import { PersonRecipientWItems, Contact } from "@/types"

export const AddRAB = () => {
    const [date, setDate] = useState(new Date())
    const [title, setTitle] = useState('')
    const [recipients, setRecipients] = useState<PersonRecipientWItems[]>([
        {
            name: 'SUWARNO',
            birthdata:{
                birthplace: 'Jakarta',
                birthdate: new Date('27 July 1957')
            },
            ids:{
                nik:'3171031206570005',
                noKk:'3171031401097655'
            },
            address:{
                street:'Jl. Kemayoran Gempol',
                rtRw:'12/6',
                kelurahan: 'Kebon Kosong',
                kecamatan: 'Kemayoran',
                kabupaten: 'Jakarta Pusat'
            },
            contact:[{type:'cellphone', address:''}],
            items:[]
        }
    ])
    const [recipientOption, setRecptOption] = useState<Set<string>>(new Set(["new"]))
    const [selectedKeys, setSelectedKeys] = useState(new Set(["new"]));

    return (
        <div className="flex flex-col w-screen">
            <div className="px-1 py-2 flex items-center">
                <div className="w-fit px-1">
                    <DatePicker label="Tanggal" className="max-w-[284px]" />
                </div>
                <div className="flex-auto px-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="w-fit flex items-center px-1">                    
                    <Button color="primary">
                        + Penerima
                    </Button>
                    <Dropdown className="w-fit" >
                        <DropdownTrigger>
                            <Button 
                                variant="bordered" 
                            >
                            <CogIcon />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={recipientOption}
                            onSelectionChange={(keys) => setRecptOption(keys as Set<string>)}
                        >
                            <DropdownItem key="new">Penerima Baru</DropdownItem>
                            <DropdownItem key="old">Penerima Lama</DropdownItem>                            
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>NAMA</TableColumn>
                    <TableColumn>ALAMAT</TableColumn>
                    <TableColumn>NIK</TableColumn>
                    <TableColumn>No KK</TableColumn>
                    <TableColumn>Kontak</TableColumn>
                    <TableColumn>Barang</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        recipients.map((d:PersonRecipientWItems, i:number)=>{
                            return (
                                <TableRow key={i.toString()}>
                                    <TableCell>{d.name}</TableCell>
                                    <TableCell>{d.address.street}, {d.address.rtRw}, {d.address.kelurahan}, {d.address.kecamatan}, {d.address.kabupaten}</TableCell>
                                    <TableCell>{d.ids.nik}</TableCell>
                                    <TableCell>{d.ids.noKk}</TableCell>
                                    <TableCell>{Array.isArray(d.contact) && d.contact.map((c:Contact, index:number) => (
                                        <div key={index}>{c.type}: {c.address}</div>
                                    ))}</TableCell>
                                    <TableCell>{d.items.join(", ")}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                    
                </TableBody>
            </Table>
        </div>
    )
}
'use client'

import { useState, useEffect } from "react"
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input, RadioGroup, Radio

 } from "@nextui-org/react"
import { NewRecipientForm } from "./NewRecipient"
import { CogIcon } from "@/components/Icon"
import { PersonRecipientWItems, Contact } from "@/types"

export const AddRAB = () => {
    const [date, setDate] = useState(new Date())
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [recipients, setRecipients] = useState<PersonRecipientWItems[]>([
        /*{
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
        {
            "name": "Hj Nurlela",
            "birthdata": {
                "birthplace": "Jambi",
                "birthdate": new Date("1967-08-03T16:00:00.000Z")
            },
            "ids": {
                "nik": "3171025508670004",
                "noKk": "3171020310190004"
            },
            "address": {
                "street": "Jl. Budi Rahayu III No. 16",
                "rtRw": "11/9",
                "kelurahan": "Mangga Dua Selatan",
                "kecamatan": "Sawah Besar",
                "kabupaten": "Jakarta Pusat",
                "postCode": ""
            },
            "contact": [
                {
                    "type": "cellphone",
                    "address": ""
                }
            ],
            "items": [
                {
                    "name": "Kursi Roda",
                    "productName": "",
                    "category": "",
                    "subCategory": "",
                    "price": 17000000,
                    "unit": 1
                }
            ]
        },
        {
            "name": "Aryani",
            "birthdata": {
                "birthplace": "Jakarta",
                "birthdate": new Date("1963-11-12T16:00:00.000Z")
            },
            "ids": {
                "nik": "3171035711630001",
                "noKk": "3171031301090125"
            },
            "address": {
                "street": "Jl. Bungur Besar XVI",
                "rtRw": "1/1",
                "kelurahan": "Kemayoran",
                "kecamatan": "Kemayoran",
                "kabupaten": "Jakarta Pusat",
                "postCode": ""
            },
            "contact": [
                {
                    "type": "cellphone",
                    "address": ""
                }
            ],
            "items": [
                {
                    "name": "Kursi Roda",
                    "productName": "",
                    "category": "",
                    "subCategory": "",
                    "price": 1700000,
                    "unit": 1
                }
            ]
        }*/
    ])
    const [isAddRecipient, setIsAddRecipient] = useState(false)
    const [recipientOption, setRecptOption] = useState<Set<string>>(new Set(["old"]))
        
    const submitData = async () => {
        try{
            const response = await fetch('/api/RAB/add', {
                method: 'POST',
                body: JSON.stringify({ title, date, category, recipients }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();
            console.log(data)
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            
        } 
    }
    
    return (
        <div className="flex flex-col w-screen">
            <div className="px-0 py-2 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker label="Tanggal" className="max-w-[284px]" />
                </div>
                <div className="flex-auto p-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="w-full md:w-fit flex justify-end items-center p-1">                    
                    <Button color="primary" onPress={()=>{if(!isAddRecipient){setIsAddRecipient(true)}}}>
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
                            onSelectionChange={(keys) => {
                                setRecptOption(keys as Set<string>)
                                setIsAddRecipient(false)
                            }}
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
                                    <TableCell>{d.items[0].name}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                    
                </TableBody>
            </Table>
            {
                recipients.length === 0 &&
                <div className="flex items-center justify-center">
                    <p className="font-semibold italic">Belum ada penerima bantuan..</p>
                </div>
            }
            <div className="flex items-center justify-end px-2 py-3">
                <Button size="lg" color={`${recipients.length > 0?"primary":"default"}`} 
                    disabled={recipients.length === 0}
                    disableRipple={recipients.length === 0}
                    disableAnimation={recipients.length === 0}
                    onPress={submitData}
                >
                    Tambahkan RAB
                </Button>
            </div>
            {
                isAddRecipient && recipientOption.has("new") &&
                <NewRecipientForm 
                    show={isAddRecipient && recipientOption.has("new")} 
                    hideForm={()=>{                    
                        setIsAddRecipient(false)                    
                    }} 
                    submit={(recipient:PersonRecipientWItems)=>{
                        const newRecipients = [...recipients]                    
                        newRecipients.push(recipient)
                        setRecipients(newRecipients)
                        setIsAddRecipient(false) 
                    }}
                />
            }
            
        </div>
    )
}
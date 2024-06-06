'use client'

import { useState, useEffect } from "react"
import _ from "lodash"
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input, RadioGroup, Radio

 } from "@nextui-org/react"
import { NewRecipientForm } from "./NewRecipient"
import { AddExistingRecipients } from "./AddExistingRecipients"
import { CogIcon } from "@/components/Icon"
import { TableItem } from "../shared/TableItemCard"
import { EditItem } from "../shared/AddEditItem"
import { todayDateString } from "@/lib/functions";
import { PersonRecipientWItems, PersonRecipient, Contact, OrderedItem } from "@/types"

export const AddRAB = () => {
    const [date, setDate] = useState(todayDateString())
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
    const [ editRecipientItem, setEditRecipientItem ] = useState<PersonRecipientWItems | null>(null)

    const [fetchState, setFetchState] = useState("")
    const [fetchError, setFetchError] = useState("")
        
    const submitData = async () => {
        
        const RABDate = new Date(date.year + "-" + date.month + "-" + date.day)
        setFetchState("submitting")
        try{
            const response = await fetch('/api/RAB/add', {
                method: 'POST',
                body: JSON.stringify({ title, date:RABDate, category, recipients }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();
            console.log(data)
        }catch(err:any){
            console.log('fetch error : ', err)
            setFetchError("Error when submitting")
        }
        finally{
            setFetchState("done")
        } 
    }
    
    const existingRecipients = recipients.filter((d:PersonRecipientWItems) => d._id)   

    return (
        <div className="flex flex-col w-screen px-1 md:px-2">
            <h1 className="text-xl md:text-2xl font-bold text-left basis-full py-3 pl-2 md:pl-4">
                Data RAB Baru
            </h1>
            <div className="px-0 py-2 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker 
                        label="Tanggal" className="max-w-[284px]" 
                        value={date} 
                        onChange={setDate}
                    />
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
            <Table aria-label="Tabel Penerima Bantuan">
                <TableHeader>
                    <TableColumn>NAMA</TableColumn>
                    <TableColumn>ALAMAT</TableColumn>
                    <TableColumn>NIK</TableColumn>
                    <TableColumn>No KK</TableColumn>
                    <TableColumn>Kontak</TableColumn>
                    <TableColumn>Bantuan</TableColumn>
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
                                        <div key={index}>{c.type}: {c.value}</div>
                                    ))}</TableCell>
                                    <TableCell>
                                        <TableItem 
                                            item={d.items[0]}                                            
                                            editPress={()=>{setEditRecipientItem(d)}}
                                            deletePress={()=>{
                                                const updatedRecipients = _.cloneDeep(recipients)
                                                updatedRecipients[i].items = []
                                                setRecipients(updatedRecipients)
                                            }}
                                        />    
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                    
                </TableBody>
            </Table>
            {
                recipients.length === 0 &&
                <div className="flex items-center justify-center">
                    <p className="font-semibold italic text-gray-800 py-3">Belum ada penerima bantuan..</p>
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
            {
                isAddRecipient && recipientOption.has("old") &&
                <AddExistingRecipients 
                    show={isAddRecipient && recipientOption.has("old")} 
                    hideForm={()=>{                    
                        setIsAddRecipient(false)                    
                    }} 
                    submit={(newrecipients:PersonRecipientWItems[])=>{
                        /*const newRecipients = newrecipients.map((d:PersonRecipient)=>{
                            const recipientWItem = {
                                ...d,
                                items:[]
                            }

                            return recipientWItem
                        })*/
                        if(existingRecipients.length === 0){
                            const updatedRecipients = [...recipients]                    
                            updatedRecipients.push(...newrecipients)
                            setRecipients(updatedRecipients)
                        }
                        else{                            
                            //cleanse newrecipients from existingRecipients
                            const newRecipients = newrecipients.reduce((acc:PersonRecipientWItems[], curr:PersonRecipientWItems) => {
                                const recipientIdx = existingRecipients.findIndex((dRec:PersonRecipientWItems) => dRec._id === curr._id )

                                if(recipientIdx === -1){
                                    acc.push(curr)
                                }
                                return acc
                            }, [])
                            
                            const updatedRecipients = recipients.reduce((acc:PersonRecipientWItems[], curr:PersonRecipientWItems) => {
                                if(!curr._id){
                                    acc.push(curr)
                                }

                                const recIdx = newrecipients.findIndex((dNewRec:PersonRecipientWItems) => dNewRec._id === curr._id )
                                if(recIdx > -1){
                                    const newRecipient = newrecipients[recIdx]
                                    const existingRecIdx = existingRecipients.findIndex((dExRec:PersonRecipientWItems) => dExRec.ids.nik === newRecipient.ids.nik)
                                    if(existingRecIdx > -1){
                                        acc.push(newRecipient)
                                    }
                                }
                                                                
                                return acc
                            }, [])
                        
                            updatedRecipients.push(...newRecipients)
                            setRecipients(updatedRecipients)
                        }
                        
                        setIsAddRecipient(false) 
                    }}
                    existingRecipients={existingRecipients}
                />
            }
            {
            editRecipientItem !== null &&
                <EditItem
                    recipient={editRecipientItem}
                    show={editRecipientItem !== null}
                    hideForm={()=>{setEditRecipientItem(null)}}
                    submit={(newItem:OrderedItem)=>{                        
                        const {_id} = editRecipientItem                        
                        const recipientIdx = recipients.findIndex((dRec:PersonRecipientWItems) => dRec._id === _id)
                        const updatedSelecteds = _.cloneDeep(recipients)
                        updatedSelecteds[recipientIdx].items[0] = newItem
                        setRecipients(updatedSelecteds)
                        setEditRecipientItem(null)

                    }}
                />
        }
        </div>
    )
}
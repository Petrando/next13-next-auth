'use client'

import { useState, useEffect } from "react"
import _ from "lodash"
import { useRouter } from "next/navigation"
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input, 
            Link, Tabs, Tab, 
 } from "@nextui-org/react"
import { NewRecipientForm } from "./NewRecipient"
import { EditRecipientForm } from "./EditRecipient"
import { AddExistingRecipients } from "./AddExistingRecipients"
import { CogIcon } from "@/components/Icon"
import { TableItem } from "../shared/TableItemCard"
import { EditItem } from "../shared/AddEditItem"
import { createDateString } from "@/lib/functions";
import { TableContact } from "../shared/TableContact"
import { DeleteIcon, AddDocumentIcon, AddUserIcon, EditIcon } from "@/components/Icon"
import { ItemsTable } from "../shared/ItemsTable"
import { TotalRow } from "../shared/TotalTableRow"
import { TotalCard } from "../shared/TotalCard"
import { emptyPerson } from "@/variables-and-constants"
import { PersonRecipientWItems, OrderedItem } from "@/types"

export const AddRAB = () => {
    const [ tab, setTab ] = useState("recipients");

    const [date, setDate] = useState(createDateString())
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [recipients, setRecipients] = useState<PersonRecipientWItems[]>([])
    const [ isAddRecipient, setIsAddRecipient] = useState(false)
    const [ editedRecipient, setEditedRecipient ] = useState<PersonRecipientWItems | null>(null)

    const [ recipientOption, setRecptOption] = useState<Set<string>>(new Set(["old"]))
    const [ editRecipientItem, setEditRecipientItem ] = useState<PersonRecipientWItems | null>(null)

    const [fetchState, setFetchState] = useState("")
    const [fetchError, setFetchError] = useState("")
    
    const router = useRouter()

    const submitData = async () => {
        
        const RABDate = new Date(date.year + "-" + date.month + "-" + date.day)
        setFetchState("submiting")
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
            router.push("/RAB")
        }catch(err:any){
            console.log('fetch error : ', err)
            setFetchError("Error when submiting")
        }
        finally{
            setFetchState("done")
        } 
    }

    useEffect(()=>{
        if(fetchError !== ""){
            setFetchError("")
        }
    }, [isAddRecipient, fetchError])
    
    const existingRecipients = recipients.filter((d:PersonRecipientWItems) => d._id)

    const items = recipients.map((d:PersonRecipientWItems) => d.items).flat()
    const newItems = items.filter((d:OrderedItem) => !d._id)
        .reduce((acc:OrderedItem[], curr:OrderedItem) => {//prevent duplicate items            
            const itemIdx = acc.findIndex((dAcc:OrderedItem) =>  dAcc.name === curr.name &&
                dAcc.productName === curr.productName && dAcc.category === curr.category &&
                dAcc.subCategory === curr.subCategory
            )
            if(itemIdx === -1){
                acc.push(curr)
            }
            return acc
        }, [])
        
    const totalPrice = recipients
        .filter((d:PersonRecipientWItems) => d.items.length > 0)
        .map((d:PersonRecipientWItems) => d.items).flat()
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)

    const renderElement = recipients.length > 0?recipients.concat(emptyPerson):[]

    const canSubmit = title !== "" && recipients.length > 0 && recipients.map((d:PersonRecipientWItems) => d.items).every((d:OrderedItem[]) => d.length > 0)

    return (
        <div className="flex flex-col w-screen px-1 md:px-2">
            <h1 className="text-xl md:text-2xl font-bold text-left basis-full py-3 pl-2 md:pl-4">
                Data RAB Baru
            </h1>
            <div className="px-0 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker 
                        label="Tanggal" className="max-w-[284px]" 
                        value={date} 
                        onChange={setDate}
                    />
                </div>
                <div className="flex-auto p-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} onChange={e => setTitle(e.target.value)} 
                        isInvalid={fetchError === "Error when submiting"}
                        errorMessage="Gagal Menambahkan RAB..."
                    />
                </div>
                <div className="w-full md:w-fit flex justify-end items-center p-1">                    
                    <Button color="primary" onPress={()=>{if(!isAddRecipient){setIsAddRecipient(true)}}}
                        isDisabled={fetchState === "submiting"}
                        startContent={<AddUserIcon />}
                    >
                        Penerima
                    </Button>
                    <Dropdown className="w-fit" >
                        <DropdownTrigger>
                            <Button 
                                variant="bordered" 
                                startContent={<CogIcon />}                                
                            >
                                Opsi
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
            <Tabs 
                aria-label="Options"         
                selectedKey={tab}
                onSelectionChange={(e) =>{setTab(e as string)}}
                disabledKeys={recipients.length === 0?["items"]:[]}
            >
                <Tab key="recipients" title="Penerima Bantuan">
                    
                    <Table aria-label="Tabel Penerima Bantuan">
                        <TableHeader>
                            <TableColumn>NAMA</TableColumn>
                            <TableColumn>ALAMAT</TableColumn>
                            <TableColumn>NIK</TableColumn>
                            <TableColumn>No KK</TableColumn>
                            <TableColumn>Kontak</TableColumn>
                            <TableColumn>Bantuan</TableColumn>
                            <TableColumn>Ubah/Hapus</TableColumn>
                        </TableHeader>                
                        <TableBody>                    
                            {
                                renderElement.map((d:PersonRecipientWItems, i:number)=>{
                                    const {name, address, ids, contact, items} = d

                                    const isTotalRow = name === "" && ids.nik === ""
                                    if(isTotalRow){
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
                                                {name}                                        
                                            </TableCell>
                                            <TableCell>                                        
                                                {address.street}, {address.rtRw}, {address.kelurahan}, {address.kecamatan}, {address.kabupaten}                                        
                                            </TableCell>
                                            <TableCell>
                                                {ids.nik}                                        
                                            </TableCell>
                                            <TableCell>
                                                {ids.noKk}
                                            </TableCell>
                                            <TableCell>
                                                <TableContact contact={contact} /> 
                                            </TableCell>
                                            <TableCell>
                                                <TableItem 
                                                    item={items[0]}                                            
                                                    editPress={()=>{setEditRecipientItem(d as PersonRecipientWItems)}}
                                                    deletePress={()=>{
                                                        const updatedRecipients = _.cloneDeep(recipients)
                                                        updatedRecipients[i].items = []
                                                        setRecipients(updatedRecipients)
                                                    }}
                                                />    
                                            </TableCell>
                                            <TableCell className="flex items-center">
                                                <Button color="warning" startContent={<EditIcon className="size-4" />} size="sm"
                                                    onPress={()=>{
                                                        setEditedRecipient(d)
                                                    }}
                                                >
                                                    Ubah
                                                </Button>                                        
                                                <Button color="danger" startContent={<DeleteIcon className="size-4" />} size="sm"
                                                    onPress={()=>{
                                                        const updatedRecipients = recipients.filter((dRec:PersonRecipientWItems) => dRec.ids.nik !== ids.nik)
                                                        setRecipients(updatedRecipients)
                                                    }}
                                                >
                                                    Hapus
                                                </Button>
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
                </Tab>
                <Tab key="items" title="Daftar Bantuan">
                    <ItemsTable items={items} />
                </Tab>
            </Tabs>

            <div className="flex items-center justify-end px-2 py-3">
                <Link href="/RAB" isDisabled={fetchState === "submiting"} color="danger" underline="hover"
                    className="mx-4"
                >
                    Kembali
                </Link>
                <Button size="lg" color={`primary`} 
                    isDisabled={!canSubmit}
                    onPress={submitData}
                    endContent={<AddDocumentIcon />}
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
                editedRecipient !== null &&
                <EditRecipientForm 
                    show={editedRecipient !== null} 
                    hideForm={()=>{                    
                        setEditedRecipient(null)                    
                    }} 
                    submit={(recipient:PersonRecipientWItems)=>{
                        const newRecipients = _.cloneDeep(recipients)                    
                        const recipientIdx = newRecipients.findIndex((dRec:PersonRecipientWItems) => 
                            dRec.ids.nik === editedRecipient.ids.nik
                        )
                        console.log(newRecipients)
                        console.log(typeof editedRecipient.ids.nik)
                        console.log(recipientIdx)
                        if(recipientIdx > -1){
                            newRecipients[recipientIdx] = recipient
                            setRecipients(newRecipients)
                        }                        
                        setEditedRecipient(null)
                    }}
                    editedRecipient={editedRecipient}
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
                    newItems={newItems}
                />
            }
            {
                editRecipientItem !== null &&
                    <EditItem
                        recipient={editRecipientItem}
                        show={editRecipientItem !== null}
                        hideForm={()=>{setEditRecipientItem(null)}}
                        submit={(newItem:OrderedItem)=>{                        
                            const {ids:{nik}} = editRecipientItem                        
                            const recipientIdx = recipients.findIndex((dRec:PersonRecipientWItems) => dRec.ids.nik === nik)
                            const updatedSelecteds = _.cloneDeep(recipients)
                            updatedSelecteds[recipientIdx].items[0] = newItem
                            setRecipients(updatedSelecteds)
                            setEditRecipientItem(null)
                        }}
                        newItems={newItems}
                    />
            }
        </div>
    )
}

const sampleRecipients:PersonRecipientWItems[] = [
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
        contact:[{type:'cellphone', value:''}],
        items:[],
        completed:{
            done: false, RABScreenshot: ""
        }
    },
    {
        name: "Hj Nurlela",
        birthdata: {
            birthplace: "Jambi",
            birthdate: new Date("1967-08-03T16:00:00.000Z")
        },
        ids: {
            nik: "3171025508670004",
            noKk: "3171020310190004"
        },
        address: {
            street: "Jl. Budi Rahayu III No. 16",
            rtRw: "11/9",
            kelurahan: "Mangga Dua Selatan",
            kecamatan: "Sawah Besar",
            kabupaten: "Jakarta Pusat",
            postCode: ""
        },
        contact: [
            {
                type: "cellphone",
                value: ""
            }
        ],
        items: [
            {
                name: "Kursi Roda",
                productName: "",
                category: "",
                subCategory: "",
                price: 17000000,
                unit: 1
            }
        ],
        completed:{
            done:false, RABScreenshot: ""
        }
    },
    {
        name: "Aryani",
        birthdata: {
            birthplace: "Jakarta",
            birthdate: new Date("1963-11-12T16:00:00.000Z")
        },
        ids: {
            nik: "3171035711630001",
            noKk: "3171031301090125"
        },
        address: {
            street: "Jl. Bungur Besar XVI",
            rtRw: "1/1",
            kelurahan: "Kemayoran",
            kecamatan: "Kemayoran",
            kabupaten: "Jakarta Pusat",
            postCode: ""
        },
        contact: [
            {
                type: "cellphone",
                value: ""
            }
        ],
        items: [
            {
                name: "Kursi Roda",
                productName: "",
                category: "",
                subCategory: "",
                price: 1700000,
                unit: 1
            }
        ],
        completed:{
            done: false, RABScreenshot: ""
        }
    }
]
'use client'

import { useState, useEffect } from "react"
import _ from "lodash"
import { useRouter } from "next/navigation"
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,    
        DatePicker, Input, 
            Link, Tabs, Tab, CalendarDate 
 } from "@nextui-org/react"
import { NewRecipientForm } from "./NewRecipient"
import { ListedRecipientForm } from "./ListedRecipient"
import { CogIcon } from "@/components/Icon"
import { TableItem } from "../../shared/TableItemCard"
import { EditItem } from "../../shared/AddEditItem"
import { createDateString, isSameOrderedItem } from "@/lib/functions";
import { TableContact } from "../../shared/TableContact"
import { DeleteIcon, AddDocumentIcon, AddUserIcon, EditIcon, PlusIcon } from "@/components/Icon"
import { ItemsTable } from "../../shared/ItemsTable"
import { TotalRow } from "../../shared/TotalTableRow"
import { TotalCard } from "../../shared/TotalCard"
import { NewOldDropDown } from "../../shared/NewOldDropdown"
import { emptyPerson, emptyRABCharityOrg, emptyCharityOrg, emptyOrderedItem } from "@/variables-and-constants"
import { CharityOrgRecipient, OrderedItem } from "@/types"
import CurrencyFormat from "react-currency-format"

export const AddRAB = () => {
    const [ tab, setTab ] = useState("recipient");

    const [RAB, setRAB] = useState(_.cloneDeep(emptyRABCharityOrg))
    const [date, setDate] = useState<CalendarDate | null>(null)
            
    const [ recipientOption, setRecptOption ] = useState<Set<string>>(new Set(["old"]))
    const [ isChangingRecipient, setIsChangingRecipient ] = useState(false)
    const [ isEditRecipient, setIsEditRecipient ] = useState(false)
    
    const [ isAddNewItem, setIsAddItem ] = useState(false)
    const [ editedItem, setEditedItem ] = useState<OrderedItem | null>(null)

    const [fetchState, setFetchState] = useState("")
    const [fetchError, setFetchError] = useState("")
    
    const router = useRouter()

    const { title, recipient, items} = RAB

    const submitData = async () => {
        
        const RABDate = date !== null?new Date(date.year + "-" + date.month + "-" + date.day):null
        setFetchState("submiting")
        try{
            const response = await fetch('/api/RAB/charity-org/add', {
                method: 'POST',
                body: JSON.stringify({ date:RABDate, title,  category: 'charity-org', recipient, items }),
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
    }, [isChangingRecipient, fetchError])
    
    const changeRecipient = (recipient:CharityOrgRecipient) => {
        setRAB({...RAB, recipient: _.cloneDeep(recipient)})
        setIsChangingRecipient(false)
    }
    
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
        
    const totalPrice = items
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)
        
    const renderElement = items.length > 0?items.concat(emptyOrderedItem):[]

    const canSubmit = false//title !== "" && recipient.length > 0 && recipient.map((d:CharityOrgRecipient) => d.items).every((d:OrderedItem[]) => d.length > 0)   

    return (
        <div className="flex flex-col w-screen px-1 md:px-2">
            <h1 className="text-xl md:text-2xl font-bold text-left basis-full py-3 pl-2 md:pl-4">
                Data RAB Baru
            </h1>
            <div className="px-0 flex items-center flex-wrap">
                <div className="flex basis-full lg:basis-1/2">
                    <div className="w-fit p-1">
                        <DatePicker 
                            label="Tanggal" className="max-w-[284px]" 
                            value={date} 
                            onChange={setDate}
                        />
                    </div>
                    <div className="flex-auto p-1">
                        <Input size="lg" variant="underlined" fullWidth 
                            label="Judul RAB" value={title} 
                            onChange={e => {setRAB({...RAB, title: e.target.value})}} 
                            isInvalid={fetchError === "Error when submiting"}
                            errorMessage="Gagal Menambahkan RAB..."
                        />
                    </div>
                </div>
                <div className="flex basis-full lg:basis-1/2">
                    <div className="flex-auto p-1">
                        <Input variant="underlined" fullWidth 
                            label="Penerima" value={recipient.name}                             
                            isReadOnly={true}                                                         
                        />
                    </div>                    
                    <div className="w-full md:w-fit flex justify-end items-center p-1">                    
                        <Button color="primary" 
                            onPress={()=>{
                                //console.log('change recipient button press : ', RAB.recipient)
                                if(!isChangingRecipient){setIsChangingRecipient(true)}
                            }}
                            isDisabled={fetchState === "submiting"}
                            startContent={recipient.name === ""?<AddUserIcon />:<EditIcon />}                                        
                        >
                            Penerima
                        </Button>
                        <NewOldDropDown 
                            recipientOption={recipientOption}
                            onChange={(keys) => {
                                setRecptOption(keys as Set<string>)
                                setIsChangingRecipient(false)
                            }}   
                        />
                    </div>
                </div>
            </div>
            <Tabs 
                aria-label="Options"         
                selectedKey={tab}
                onSelectionChange={(e) =>{setTab(e as string)}}
                disabledKeys={items.length === 0?["items"]:[]}
            >
                <Tab key="recipient" title="Daftar Bantuan">
                    
                    <Table aria-label="Tabel Bantuan"
                        topContent={
                            <div className="w-full flex justify-end items-center p-1">                    
                                <Button color="primary" 
                                    size="sm"
                                    onPress={()=>{setIsAddItem(true)}}
                                    isDisabled={fetchState === "submiting"}
                                    startContent={<PlusIcon className="size-4"/>}                                        
                                >
                                    Barang
                                </Button>
                            </div>
                        }
                    >
                        <TableHeader>
                            <TableColumn>No.</TableColumn>
                            <TableColumn>Nama</TableColumn>
                            <TableColumn>Volume</TableColumn>
                            <TableColumn>Harga/unit</TableColumn>                            
                            <TableColumn>TOTAL</TableColumn>
                            <TableColumn>Ubah/Hapus</TableColumn>
                        </TableHeader>                
                        <TableBody>                    
                            {
                                renderElement.map((d:OrderedItem, i:number)=>{
                                    const {name, productName, unit, amount, price} = d

                                    const isTotalRow = name === "" && productName === ""
                                    if(isTotalRow){
                                        return <TableRow key={i.toString()}>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>
                                            <TableCell colSpan={0}>{''}</TableCell>                                            
                                            <TableCell colSpan={5}>
                                                <TotalCard total={totalPrice} />   
                                            </TableCell>
                                            <TableCell colSpan={1}>{''}</TableCell>                                            
                                        </TableRow>
                                    }
                                    
                                    return (
                                        <TableRow key={i.toString()}>
                                            <TableCell>                                        
                                                {i + 1}                                        
                                            </TableCell>
                                            <TableCell>                                        
                                                { name } { productName }
                                            </TableCell>
                                            <TableCell>
                                                {amount} {unit}                                        
                                            </TableCell>
                                            <TableCell>
                                                {price} per {unit}
                                            </TableCell>
                                            <TableCell>
                                                <CurrencyFormat value={price * amount} thousandSeparator="," prefix="Rp. " /> 
                                            </TableCell>                                            
                                            <TableCell className="flex items-center">
                                                <Button color="warning" startContent={<EditIcon className="size-4" />} size="sm"
                                                    onPress={()=>{
                                                        
                                                    }}
                                                >
                                                    Ubah
                                                </Button>                                        
                                                <Button color="danger" startContent={<DeleteIcon className="size-4" />} size="sm"
                                                    onPress={()=>{
                                                        
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
                        items.length === 0 &&
                        <div className="w-full flex items-center justify-center py-2 text-slate-800">
                            <p className="font-semibold italic">
                                Daftar barang masih kosong....
                            </p>
                        </div>
                    }                    
                </Tab>
                <Tab key="items" title="Rekapan">
                    <ItemsTable items={items} />
                </Tab>
            </Tabs>
            { 
                isChangingRecipient && recipientOption.has("new") &&
                <NewRecipientForm 
                    show={isChangingRecipient && recipientOption.has("new")}
                    hideForm={()=>{setIsChangingRecipient(false)}}
                    submit={changeRecipient}
                    orgRecipient={
                            /*
                                Only 2 conditions : 
                                * if RAB.recipient has _id prop - meaning listed recipient - if "new" recipient then 
                                  supply empty new recipient. Here user want to change from listed to not listed, new recipient
                                * or else, if RAB.recipient has no _id prop - meaning a new not listed recipient - just edit the current RAB recipient
                            */
                            typeof RAB.recipient._id !== "undefined"?_.cloneDeep(emptyCharityOrg):
                                _.cloneDeep(RAB.recipient)
                    }
                />
            }
            { 
                isChangingRecipient && recipientOption.has("old") &&
                <ListedRecipientForm 
                    show={isChangingRecipient && recipientOption.has("old")}
                    hideForm={()=>{setIsChangingRecipient(false)}}
                    submit={changeRecipient}
                    orgRecipient={
                            /*
                                Only 2 conditions : 
                                * if RAB.recipient has _id prop - meaning listed recipient - if "new" recipient then 
                                  supply empty new recipient. Here user want to change from listed to not listed, new recipient
                                * or else, if RAB.recipient has no _id prop - meaning a new not listed recipient - just edit the current RAB recipient
                            */
                            typeof RAB.recipient._id === "undefined"?_.cloneDeep(emptyCharityOrg):
                                _.cloneDeep(RAB.recipient)
                    }
                />
            }
            <div className="flex items-center justify-end px-2 py-3">
                <Link href="/RAB" isDisabled={fetchState === "submiting"} color="danger" underline="hover"
                    className="mx-4"
                >
                    Kembali
                </Link>
                <Button color={`primary`} 
                    isDisabled={!canSubmit}
                    onPress={submitData}
                    endContent={<AddDocumentIcon />}
                >
                    Tambahkan RAB
                </Button>
            </div>
            
        </div>
    )
}
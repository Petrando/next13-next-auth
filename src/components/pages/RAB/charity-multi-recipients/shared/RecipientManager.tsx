import { useState, useEffect, FC, ReactNode } from "react"
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,     
            Tabs, Tab, Skeleton
 } from "@nextui-org/react"
import _ from "lodash"
import { NewRecipientForm } from "./NewRecipient"
import { EditRecipientForm } from "./EditRecipient"
import { AddExistingRecipients } from "./AddExistingRecipients"
import { NewOldDropDown } from "../../shared/NewOldDropdown"
import { TableItem } from "../../shared/TableItemCard"
import { EditItem } from "../../shared/AddEditItem"
import { TableContact } from "../../shared/TableContact"
import { DeleteIcon, AddUserIcon, EditIcon } from "@/components/Icon"
import { ItemsTable } from "../../shared/ItemsTable"
import { TotalRow } from "../../shared/TotalTableRow"
import { TotalCard } from "../../shared/TotalCard"
import { emptyPerson } from "@/variables-and-constants"
import { PersonRecipientWItems, OrderedItem } from "@/types"
import { isSameItem } from "@/lib/functions"
import { processRecipients } from "./functions"

type IRecipientTable = {
    recipients: PersonRecipientWItems[];
    setRecipients: (recipients: PersonRecipientWItems[]) => void;
    fetchState: string;
    bottomComponent?: ReactNode;
    /*
        about existingNiks prop:
        this component is called by 2 parent components at : 
        a. by add a new RAB form, where there are no previous recipients
        b. by RAB detail component, there are already existing recipients that should be considered
    */
   existingNiks?: string[];
}

export const RecipientTable:FC<IRecipientTable> = ({ recipients, setRecipients, fetchState, bottomComponent = <></>,
    existingNiks
 }) => {    
    const [ isAddRecipient, setIsAddRecipient] = useState(false)
    const [ editedRecipient, setEditedRecipient ] = useState<PersonRecipientWItems | null>(null)

    const [ recipientOption, setRecptOption] = useState<Set<string>>(new Set(["old"]))
    const [ editRecipientItem, setEditRecipientItem ] = useState<PersonRecipientWItems | null>(null)

    const [ tab, setTab ] = useState("recipients");

    const {
        existingRecipients, items, newItems, totalPrice, niks
    } = processRecipients(recipients)

    const renderElement = recipients.length > 0?recipients.concat(emptyPerson):[]
    
    return (
        <>
        <Tabs 
            aria-label="Options"         
            selectedKey={tab}
            onSelectionChange={(e) =>{setTab(e as string)}}
            disabledKeys={recipients.length === 0?["items"]:[]}           
        >
            <Tab key="recipients" title="Penerima Bantuan">
                
                <Table aria-label="Tabel Penerima Bantuan"
                    topContent={
                        <div className="w-full flex justify-end items-center p-1">                    
                            <Button color="primary" onPress={()=>{if(!isAddRecipient){setIsAddRecipient(true)}}}
                                isDisabled={fetchState !== ""}
                                startContent={<AddUserIcon />}                            
                            >
                                Penerima
                            </Button>
                            <NewOldDropDown recipientOption={recipientOption}
                                onChange={(keys) => {
                                    setRecptOption(keys as Set<string>)
                                    setIsAddRecipient(false)
                                }}
                            />
                        </div>
                    }
                >
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
                                            <Skeleton isLoaded={fetchState === ""}>
                                            {name}                                 
                                            </Skeleton>                                               
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton isLoaded={fetchState === ""}>                                        
                                            {address.street}, {address.rtRw}, {address.kelurahan}, {address.kecamatan}, {address.kabupaten}                                        
                                            </Skeleton> 
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton isLoaded={fetchState === ""}>
                                            {ids.nik}                                        
                                            </Skeleton> 
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton isLoaded={fetchState === ""}>
                                            {ids.noKk}
                                            </Skeleton> 
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton isLoaded={fetchState === ""}>
                                            <TableContact contact={contact} /> 
                                            </Skeleton> 
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
                                                isDisabled={fetchState!==""}
                                            />    
                                        </TableCell>
                                        <TableCell className="flex items-center">
                                            <Button color="warning" startContent={<EditIcon className="size-4" />} size="sm"
                                                onPress={()=>{
                                                    setEditedRecipient(d)
                                                }}
                                                isDisabled={fetchState!==""}
                                            >
                                                Ubah
                                            </Button>                                        
                                            <Button color="danger" startContent={<DeleteIcon className="size-4" />} size="sm"
                                                isDisabled={fetchState!==""}
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
            <Tab key="items" title="Rekapan">
                <ItemsTable items={items} />
            </Tab>
        </Tabs>
        { bottomComponent }        
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
                niks={niks}
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
                    
                    if(recipientIdx > -1){
                        newRecipients[recipientIdx] = recipient
                        setRecipients(newRecipients)
                    }                        
                    setEditedRecipient(null)
                }}
                editedRecipient={editedRecipient}
                niks={niks}
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
                existingNiks={existingNiks}
            />
        }
        {
            editRecipientItem !== null &&
                <EditItem
                    recipientItems={
                        {
                            recipientName: editRecipientItem.name,
                            items: editRecipientItem.items,
                            itemIdx: 0
                        }
                    }
                    show={editRecipientItem !== null}
                    hideForm={()=>{setEditRecipientItem(null)}}
                    submit={(newItem:OrderedItem)=>{                        
                        const {ids:{nik}} = editRecipientItem                        
                        const recipientIdx = recipients.findIndex((dRec:PersonRecipientWItems) => dRec.ids.nik === nik)
                        const updatedSelecteds = _.cloneDeep(recipients)
                        updatedSelecteds[recipientIdx].items[0] = newItem

                        updatedSelecteds.forEach((dSelected:PersonRecipientWItems, i: number) => {                                                        
                            if(i !== recipientIdx &&
                                dSelected.items.length > 0 && 
                                    isSameItem(dSelected.items[0], newItem)
                            ){
                                dSelected.items[0].price = newItem.price
                            }
                        })

                        setRecipients(updatedSelecteds)
                        setEditRecipientItem(null)
                    }}
                    newItems={newItems}
                    RABType="charity-multi-recipients"
                />
        }
        </>
    )
}
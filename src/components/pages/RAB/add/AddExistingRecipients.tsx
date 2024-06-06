import React, { useEffect, useState, FC } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
        Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Checkbox,
            Skeleton,
            Card, CardHeader, CardBody, CardFooter,  
            Input, DatePicker, Divider } from "@nextui-org/react";
import { parseDate, toCalendarDate, CalendarDate } from "@internationalized/date";
import { EditItem } from "../shared/AddEditItem"
import { TableItem } from "../shared/TableItemCard";
import { PersonRecipientWItems, PersonRecipient, Contact, Item, OrderedItem } from "@/types";

type TRecipientForm = {
    show: boolean;
    hideForm: ()=>void;
    existingRecipients: PersonRecipientWItems[];
    submit: (recipient:PersonRecipientWItems[])=>void;
}

export const AddExistingRecipients:FC<TRecipientForm> = ({show, hideForm, submit, existingRecipients }) => {
    const [ recipients, setRecipients ] = useState<PersonRecipient[]>([])    
    const [ selecteds, setSelecteds ] = useState<PersonRecipientWItems[]>([])
    const [ editRecipientItem, setEditRecipientItem ] = useState<PersonRecipientWItems | null>(null)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [ fetchState, setFetchState ] = useState("loading")
    
    const getRecipients = async () => {
        const filter = {}
        const projection = {}
        const limit = 10
        const offset = 0

        setFetchState("loading")
        try{
            const response = await fetch('/api/recipients/list', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();
            setRecipients(data.data)            
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setFetchState("complete")
        } 
    }

    useEffect(()=>{
        getRecipients()
        setSelecteds(_.cloneDeep(existingRecipients))
    }, [])

    useEffect(()=>{
        if(show){
            onOpen()
        }else{
            onClose()
        }
    }, [show])            

    const selectedNiks = selecteds.map((d:PersonRecipientWItems) => d.ids.nik)    
        
    return (
        <>               
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="top"
            size="5xl"
            hideCloseButton={true}
            isDismissable={false}
            scrollBehavior="outside"
        >
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1 text-xl font-bold">Data Penerima Bantuan</ModalHeader>
                <ModalBody>
                    <Table aria-label="Penerima Bantuan Terpilih"
                        topContent={
                            <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                <div className="w-full flex items-center justify-center">
                                    <h2 className={`text-lg font-semibold ${selecteds.length === 0 && "opacity-75"}`}>
                                        {selecteds.length === 0?"Silahkan Pilih Penerima":"Penerima Terpilih"}
                                    </h2>
                                </div>
                            </Skeleton>
                        }
                    >
                        <TableHeader>
                                                       
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}> 
                                    {''}
                                </Skeleton>
                            </TableColumn>
                            
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    NAMA
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    ALAMAT
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    NIK
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    No KK
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    Kontak
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    Bantuan
                                </Skeleton>
                            </TableColumn>
                        </TableHeader>                
                        <TableBody>
                            {
                                selecteds.map((d:PersonRecipientWItems, i:number)=>{
                                    
                                    const nikSelected = selectedNiks.findIndex((dNik:string)=> dNik === d.ids.nik) > -1                                    
                                    
                                    return (
                                        <TableRow key={d._id}>
                                            <TableCell>
                                                <Checkbox 
                                                    isSelected={nikSelected}
                                                    onValueChange={(e)=>{
                                                        if(nikSelected){
                                                            const newSelected = selecteds.filter((dSelected:PersonRecipient) => dSelected.ids.nik !== d.ids.nik)
                                                            setSelecteds(newSelected)
                                                        }
                                                    }}
                                                />
                                            </TableCell>
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
                                                        const updatedSelecteds = _.cloneDeep(selecteds)
                                                        updatedSelecteds[i].items = []
                                                        setSelecteds(updatedSelecteds)
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            
                        </TableBody>
                    </Table>
                    <Table aria-label="Pilih Penerima Bantuan"
                        topContent={
                            <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                <div className="w-full flex items-center justify-center">
                                    <h2 className="text-lg font-semibold">Pilihan Penerima Bantuan</h2>
                                </div>
                            </Skeleton>
                        }
                    >
                        <TableHeader>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    {''}
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    NAMA
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    ALAMAT
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    NIK
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    No KK
                                </Skeleton>
                            </TableColumn>
                            <TableColumn>
                                <Skeleton className="rounded" isLoaded={fetchState === "complete"}>
                                    Kontak
                                </Skeleton>
                            </TableColumn>
                        </TableHeader>                
                        <TableBody>
                            {
                                recipients.map((d:PersonRecipient, i:number)=>{                                    
                                    const nikSelected = selectedNiks.findIndex((dNik:string)=> dNik === d.ids.nik) > -1                                    
                                    
                                    return (
                                        <TableRow key={d._id}>
                                            <TableCell>
                                                <Checkbox                                                     
                                                    isSelected={nikSelected}
                                                    onValueChange={(e)=>{
                                                        if(!nikSelected){
                                                            const newSelected = [...selecteds]
                                                            const selected = {...d, items:[]}
                                                            newSelected.push(selected)
                                                            setSelecteds(newSelected)
                                                        }else{
                                                            const newSelected = selecteds.filter((dSelected:PersonRecipient) => dSelected.ids.nik !== d.ids.nik)
                                                            setSelecteds(newSelected)
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{d.name}</TableCell>
                                            <TableCell>{d.address.street}, {d.address.rtRw}, {d.address.kelurahan}, {d.address.kecamatan}, {d.address.kabupaten}</TableCell>
                                            <TableCell>{d.ids.nik}</TableCell>
                                            <TableCell>{d.ids.noKk}</TableCell>
                                            <TableCell>{Array.isArray(d.contact) && d.contact.map((c:Contact, index:number) => (
                                                <div key={index}>{c.type}: {c.value}</div>
                                            ))}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            
                        </TableBody>
                    </Table>
                    {
                        fetchState === "complete" && recipients.length === 0 &&
                        <h3 className="font-semibold italic text-gray-800 py-3">
                            Daftar penerima bantuan masih kosong....
                        </h3>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" 
                        isDisabled={fetchState!=="complete"}
                        onPress={()=>{submit(selecteds)}}
                    >
                        Tambahkan
                    </Button>
                    <Button color="danger" variant="flat" onPress={()=>{hideForm()}}>
                        Batal
                    </Button>
                    
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal> 
        {
            editRecipientItem !== null &&
                <EditItem
                    recipient={editRecipientItem}
                    show={editRecipientItem !== null}
                    hideForm={()=>{setEditRecipientItem(null)}}
                    submit={(newItem:OrderedItem)=>{                        
                        const {_id} = editRecipientItem                        
                        const selectedIdx = selecteds.findIndex((dRec:PersonRecipientWItems) => dRec._id === _id)
                        const updatedSelecteds = _.cloneDeep(selecteds)
                        updatedSelecteds[selectedIdx].items[0] = newItem
                        setSelecteds(updatedSelecteds)
                        setEditRecipientItem(null)

                    }}
                />
        }
        </>        
    );
}

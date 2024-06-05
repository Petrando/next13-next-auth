import React, { useEffect, useState, FC } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
        Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Checkbox,  
            Input, DatePicker, Divider, RadioGroup, Radio } from "@nextui-org/react";
import { parseDate, toCalendarDate, CalendarDate } from "@internationalized/date";
import { emptyOrderedItem } from "@/variables-and-constants";
import { Item, OrderedItem, PersonRecipientWItems } from "@/types";

type TItemForm = {
    recipient: PersonRecipientWItems,
    show: boolean;
    hideForm: ()=>void;    
    submit: (newItem:OrderedItem)=>void;
}

export const EditItem:FC<TItemForm> = ({recipient, show, hideForm, submit}) => {    

    const [ newItem, setNewItem] = useState<OrderedItem>(_.cloneDeep(emptyOrderedItem))

    const [ itemSelection, setSelection] = useState<Item[]>([])
    const [ selectedItemId, setSelectedId] = useState("")
    const [ selectedUnitAmt, setSeletedUnitAmt ]  = useState(0)

    const [ itemType, setItemType ] = useState("existing")

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const {items} = recipient

    useEffect(()=>{
        if(items.length > 0){
            const {_id} = items[0]
            if(_id && _id !== ""){
                setSelectedId(_id)
            }else{
                setNewItem(items[0])
            }
            
        }else{
            setNewItem(_.cloneDeep(emptyOrderedItem))
        }
        
    }, [ items ])

    const getItems = async () => {
        const filter = {}
        const projection = {}
        const limit = 10
        const offset = 0
        try{
            const response = await fetch('/api/items/list', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();
            setSelection(data.data)           
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            
        } 
    }
    useEffect(()=>{
        getItems()
    }, [])


    const baseSelectedItem = itemSelection[itemSelection.findIndex((d:Item) => d._id === selectedItemId)]
    const selectedItem = selectedItemId === ""?_.cloneDeep(emptyOrderedItem):{...baseSelectedItem, unit:selectedUnitAmt}

    const currentItem = itemType === "new"?newItem:selectedItem
    const { name, unit, price } = currentItem || {name:"", unit:0, price:0}   
    const canSubmit = name !== "" && unit > 0 && price > 0

    const {name:recipientName} = recipient

    return (
        <Modal 
            isOpen={show} 
            onOpenChange={onOpenChange}
            placement="top"
            size="3xl"
            hideCloseButton={true}
            isDismissable={false}
            scrollBehavior="outside"
        >
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex justify-between items-center">
                    Bantuan Untuk sdr/i {recipientName}
                    
                    <RadioGroup className="text-sm font-normal" size="sm" label={`Pilihan`}
                        value={itemType} onChange={(e)=>{setItemType(e.target.value)}}
                        orientation="horizontal"
                    >
                        <Radio value="new">Barang Baru</Radio>
                        <Radio value="existing">Dari Daftar</Radio>
                    </RadioGroup>
                    
                </ModalHeader>
                <ModalBody>
                <div className="w-full">
                    
                    <div className="w-full flex flex-wrap mb-2">
                        <Input
                            label="Nama Barang"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/2"
                            value={name}
                            isReadOnly={itemType==="existing"}
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, name:e.target.value})
                                }
                            }}
                        />
                        <Input
                            label="Jumlah"
                            variant="bordered"
                            size="sm"
                            className="basis-1/5 md:basis-1/12" 
                            value={unit.toString()}
                            type="number"
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, unit:parseInt(e.target.value)})
                                }else{
                                    setSeletedUnitAmt(parseInt(e.target.value))
                                }
                            }}    
                        />
                        <Input
                            label="Harga"
                            variant="bordered"
                            size="sm"
                            className="basis-4/5 md:basis-5/12" 
                            value={price.toString()}
                            isReadOnly={itemType === "existing"}
                            type="number"
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, price:parseInt(e.target.value)})
                                }
                            }}    
                        />
                    </div>
                    
                    {
                        itemType === "existing" && itemSelection.length > 0 &&
                            <>
                            <Divider />
                            <Table aria-label="Pilihan Bantuan" className=" mt-2"
                                topContent={
                                    <div className="w-full flex items-center justify-center">
                                        <h2 className={`font-semibold`}>
                                            Pilihan Bantuan
                                        </h2>
                                    </div>
                                }
                            >
                                <TableHeader>
                                    <TableColumn>{''}</TableColumn>
                                    <TableColumn>Barang</TableColumn>                                
                                    <TableColumn>Harga Per Unit</TableColumn>                            
                                </TableHeader>                
                                <TableBody>
                                    {itemSelection.map((d:Item, i:number)=>{
                                        const selected = selectedItemId === d._id
                                        return (
                                            <TableRow key={d._id?d._id:i}>
                                                <TableCell>
                                                    <Checkbox 
                                                        isSelected={selected}
                                                        onValueChange={(e)=>{
                                                            if(!selected){                                                            
                                                                setSelectedId(d._id?d._id:"")
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{d.name}</TableCell>
                                                <TableCell>{d.price}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            </>
                    }
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`${canSubmit?"primary":"default"}`} size="sm"
                        disabled={!canSubmit}
                        onPress={()=>{submit(currentItem)}}
                    >
                        Tambahkan
                    </Button>
                    <Button color="danger" size="sm" onPress={hideForm}>
                        Batal
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
)}
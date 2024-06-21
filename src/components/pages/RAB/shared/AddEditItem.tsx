import React, { useEffect, useState, FC } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
        Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Checkbox,  
            Input, Divider, RadioGroup, Radio, Skeleton } from "@nextui-org/react";
import CurrencyFormat from "react-currency-format";
import { emptyOrderedItem, categories as currentCategories } from "@/variables-and-constants";
import { Item, OrderedItem, PersonRecipientWItems, RABTypes, category } from "@/types";

type TItemForm = {
    recipient: PersonRecipientWItems,
    show: boolean;
    hideForm: ()=>void;    
    submit: (newItem:OrderedItem)=>void;
    newItems: OrderedItem[];
    RABType: RABTypes;
}

export const EditItem:FC<TItemForm> = ({recipient, show, hideForm, submit, newItems, RABType}) => {    

    const [ newItem, setNewItem] = useState<OrderedItem>(_.cloneDeep(emptyOrderedItem))
    const [ newItemIdx, setNewItemIdx ] = useState(-1)

    const [ itemSelection, setSelection] = useState<Item[]>([])
    const [ selectedItemId, setSelectedId] = useState("")    
    const [ selectedAmount, setSelectedAmount ]  = useState(1)

    const [ itemPrice, setPrice ] = useState(0)

    const [ itemType, setItemType ] = useState("existing")

    const [fetchState, setFetchState] = useState("loading")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const { items } = recipient

    useEffect(()=>{
        const newItem = _.cloneDeep(newItemIdx === -1?emptyOrderedItem:newItems[newItemIdx])        
        setNewItem(newItem)
    }, [newItemIdx])

    useEffect(()=>{
        if(items.length > 0){
            const {_id, amount} = items[0]
            if(_id && _id !== ""){
                setSelectedId(_id)
                setSelectedAmount(amount)                
            }else{
                setNewItem(items[0])
                setItemType("new")
            }
            
        }else{
            setNewItem(_.cloneDeep(emptyOrderedItem))
        }
        
    }, [ items ])

    const categories = RABType === "charity-multi-recipients"?
        [currentCategories[0]]:
            RABType === "charity-org"?
                [currentCategories[1], currentCategories[2]]:
                    []
                    
    const getItems = async () => {
        const filter = RABType === "charity-multi-recipients"?
            {
                category: "Kesehatan", subCategory: "Perlengkapan Medis"
            }:
                RABType === "charity-org"?
                {
                    $or: [
                        { category: "Makanan & Minuman" },
                        { category: "Rumah Tangga" }
                    ]
                }:
                    {}
        const projection = {}
        const limit = 10
        const offset = 0

        setFetchState("loading")
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
            setFetchState("complete")
        } 
    }

    useEffect(()=>{
        getItems()
    }, [])

    useEffect(()=>{
        if(itemType === "new"){
            if(newItemIdx === -1){
                setPrice(0)
                setNewItem({...newItem, unit: "unit", amount: 1})

            }
            else{
                const { price } = newItems[newItemIdx]
                if(itemPrice === 0){
                    setPrice( price )
                }                
            }
        }else{
            if(selectedItemId === ""){
                setPrice(0)
            }else{
                const selectedItemIdx = itemSelection.findIndex((d:Item) => d._id === selectedItemId)
                
                if(itemSelection[selectedItemIdx]){
                    const { price } = itemSelection[selectedItemIdx]
                    setPrice(price)
                }
                
            }
        }
    }, [itemType, newItemIdx, selectedItemId])
    
    const baseSelectedItem = itemSelection.length > 0?
        itemSelection[itemSelection.findIndex((d:Item) => d._id === selectedItemId)]:
            items.length > 0?items[0]:_.cloneDeep(emptyOrderedItem)
    const selectedItem = selectedItemId === ""?_.cloneDeep(emptyOrderedItem):
        {...baseSelectedItem, amount:selectedAmount}        

    const currentItem = itemType === "new"?newItem:selectedItem
    const { name, category, subCategory, unit, amount, price } = currentItem || { name:"", amount:0, unit: "", price:0 }   
    
    const { name:recipientName } = recipient

    const canSubmit = name !== "" && amount > 0 && itemPrice > 0

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
                            isReadOnly={itemType==="existing" || (itemType === "new" && newItemIdx > -1)}
                            label="Nama Barang"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/2"
                            value={name}
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, name:e.target.value})
                                }
                            }}
                        />                                                
                        <Input
                            isDisabled={itemType === "existing" && fetchState!=="complete"}
                            label="Jumlah"
                            variant="bordered"
                            size="sm"
                            className="basis-1/5 md:basis-1/12" 
                            value={amount.toString()}
                            type="number"
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, amount:parseInt(e.target.value)})
                                }else{
                                    setSelectedAmount(parseInt(e.target.value))
                                }
                            }}    
                        />
                        <Input                            
                            isReadOnly={itemType==="existing"}
                            label="Satuan"
                            variant="bordered"
                            size="sm"
                            className="basis-2/5 md:basis-2/12" 
                            value={unit}                            
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, unit:e.target.value})
                                }
                            }}    
                        />                                        
                        <Input
                            isDisabled={(itemType==="existing" && fetchState!=="complete")}
                            label="Harga per unit"
                            variant="bordered"
                            size="sm"
                            className="basis-2/5 md:basis-3/12" 
                            value={itemPrice.toString()}
                            type="number"
                            onChange={(e)=>{setPrice(parseInt(e.target.value))}}    
                        />
                        
                    </div>
                    
                    {
                        (itemType === "existing" || (itemType === "new" && newItems.length > 0)) && 
                            <>
                            <Divider />
                            <Table aria-label="Pilihan Bantuan" className=" mt-2"
                                topContent={
                                    <div className="w-full flex items-center justify-center">
                                        <h2 className={`font-semibold`}>
                                            Pilihan Bantuan {`${itemType === "new"?"Baru":""}`}
                                        </h2>
                                    </div>
                                }
                            >
                                <TableHeader>
                                    <TableColumn>
                                        <Skeleton className="rounded" isLoaded={ itemType === "new" || (itemType === "existing" && fetchState === "complete")}>
                                            {''}
                                        </Skeleton>
                                    </TableColumn>
                                    <TableColumn>
                                        <Skeleton className="rounded" isLoaded={ itemType === "new" || (itemType === "existing" && fetchState === "complete")}>
                                            Barang
                                        </Skeleton>
                                    </TableColumn>                                
                                    <TableColumn>
                                        <Skeleton className="rounded" isLoaded={ itemType === "new" || (itemType === "existing" && fetchState === "complete")}>
                                            Harga Per Unit
                                        </Skeleton>
                                    </TableColumn>                            
                                </TableHeader>                
                                <TableBody>
                                    {(itemType === "existing"?itemSelection:newItems)
                                        .map((d:Item, i:number)=>{
                                        const selected = itemType === "existing"?
                                            selectedItemId === d._id:
                                                newItemIdx === i
                                        return (
                                            <TableRow key={d._id?d._id:i}>
                                                <TableCell>
                                                    <Checkbox 
                                                        isSelected={selected}
                                                        onValueChange={(e)=>{
                                                            if(itemType === "existing"){
                                                                if(!selected){                                                            
                                                                    setSelectedId(d._id?d._id:"")
                                                                }else{
                                                                    setSelectedId("")
                                                                }
                                                            }else{
                                                                if(!selected){
                                                                    setNewItemIdx(i)
                                                                }else{
                                                                    setNewItemIdx(-1)
                                                                }
                                                            }
                                                            
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{d.name}</TableCell>
                                                <TableCell>
                                                    <CurrencyFormat value={d.price} prefix="Rp. " 
                                                        thousandSeparator=","
                                                        className="text-right w-fit"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            </>
                    }
                    {
                        itemType === "existing" && fetchState === "complete" && itemSelection.length === 0 &&
                        <p className="italic font-semibold text-gray-700 py-2">
                            Daftar barang kosong...
                        </p>
                    }
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"
                        isDisabled={!canSubmit}
                        onPress={()=>{
                            currentItem.price = itemPrice
                            submit(currentItem);
                        }}
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
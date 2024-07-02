import React, { useEffect, useState, FC } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
        Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, 
            Checkbox, Input, Divider, RadioGroup, Radio, Skeleton } from "@nextui-org/react";
import { NewItemForm } from "./NewItemForm";
import { SavedItemForm } from "./SavedItemForm";
import { NewItemCategory } from "./NewItemCategory";
import { CategoryFilter } from "./CategoryFilter";
import CurrencyFormat from "react-currency-format";
import { emptyOrderedItem, categories as availCategories } from "@/variables-and-constants";
import { Item, OrderedItem, RABTypes, category, subCategory, option } from "@/types";

export type TItemForm = {
    /*
        recipientItems.recipientName is self explanatory
        recipientItems.items are items that belongs to current recipient who's item is being edited.
        recipient can have one or more items
        itemIdx is the index of the recipient's item which is currently being edited
    */
    
    recipientItems:{
        recipientName: string;
        items: OrderedItem[],
        itemIdx: number
    },
    show: boolean;
    hideForm: ()=>void;    
    submit: (newItem:OrderedItem)=>void;
    /*
        newItems are items without _id from the calling components
        in other words : items that are not being listed yet.                
    */
    newItems: OrderedItem[];
    RABType: RABTypes;
    fetchState?: string;
}

type tItemType = "new" | "existing"

export const EditItem:FC<TItemForm> = (props) => {    
    
    const [ itemType, setItemType ] = useState<tItemType>("existing")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    
    const { recipientItems:{itemIdx, items} } = props
    const editedNewItem = itemIdx > -1?items[itemIdx]:null

    useEffect(()=>{
        if(editedNewItem!==null){
            const itemType = ("_id" in editedNewItem)?"existing":"new"
            setItemType(itemType)
        }
    }, [editedNewItem])
    
    return (
        <Modal 
            isOpen={props.show} 
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
                    Bantuan Untuk sdr/i {props.recipientItems.recipientName}
                    
                    <RadioGroup className="text-sm font-normal" size="sm" label={`Pilihan`}
                        value={itemType} onChange={(e)=>{setItemType(e.target.value as tItemType)}}
                        orientation="horizontal"
                    >
                        <Radio value="new">Barang Baru</Radio>
                        <Radio value="existing">Dari Daftar</Radio>
                    </RadioGroup>
                    
                </ModalHeader>
                <NewItemForm {...props} showForm={itemType === "new"} />
                <SavedItemForm {...props} showForm={itemType === "existing"} />
                </>
            )}
            </ModalContent>
        </Modal>
)}
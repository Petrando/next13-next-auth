import { FC, useState, useEffect } from "react"
import { Button, Checkbox, Divider, Input, ModalBody, ModalFooter, 
    Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { categories as availCategories } from "@/variables-and-constants"
import _ from "lodash"
import CurrencyFormat from "react-currency-format"
import { TItemForm } from "."
import { NewItemCategory } from "./NewItemCategory"
import { isSameItem } from "@/lib/functions"
import { emptyOrderedItem } from "@/variables-and-constants"
import { OrderedItem, category, subCategory, option, Item } from "@/types"

/*
    NewItemForm called when add/edit item without _id filed, 
    in other words: item(s) that haven't been in the database yet
*/

interface INewItemForm extends TItemForm {
    showForm: boolean;
}

export const NewItemForm:FC<INewItemForm> = (props) => {            
    if(!props.showForm){
        return null
    }    

    return <>
        {props.RABType === "charity-multi-recipients"?
            <NewItemMultiRecipient {...props} />:
                <NewItemCharityOrg {...props} />
        }
    </>
}

const NewItemMultiRecipient:FC<INewItemForm> = ({recipientItems:{ items, itemIdx }, show, 
    hideForm, submit, newItems, RABType, showForm, fetchState = ""}) => {
    const [ newItem, setNewItem] = useState<OrderedItem>(_.cloneDeep(emptyOrderedItem))
    //there is 'newItems' prop in this component
    //newItemIdx is for that prop
    const [ newItemIdx, setNewItemIdx ] = useState(-1)

    const editedNewItem = itemIdx > -1?items[itemIdx]:null    

    useEffect(()=>{
        if(editedNewItem !== null && !("_id" in editedNewItem)){
            setNewItem(_.cloneDeep(editedNewItem))
        }
    }, [editedNewItem])

    const { name, productName, category, subCategory, subSubCategory, unit, amount, price } = newItem

    const itemDataCompleted = (item:OrderedItem) => {
        const { name, productName, category, subCategory, subSubCategory, unit, amount, price } = item

        return name !== "" && productName !== "" && category !== "" && subCategory !== ""
            && unit !== "" && amount > 0 && price > 0
    }

    const categories = RABType === "charity-multi-recipients"?
        [availCategories[0]]:
            RABType === "charity-org"?
                [availCategories[1], availCategories[2]]:
                    []

    const filterCategories = _.cloneDeep(categories)

    const subCategories = categories.map((dCat:category) => dCat.subCategory).flat()    
    const subSubCategories = subCategories.map((d:subCategory) => d.subCategory)
        .flat().filter((d:option | undefined) => typeof d !== "undefined")    

    const withProductName = RABType !== "charity-multi-recipients"
    const canSubmit = name !== "" && (withProductName?productName !== "":true) 
        && category !== "" && subCategory !== "" && amount > 0 && price > 0   

    /*
        newItems from props needs to be filtered so the recipientItems.items is not included in it
    */
    const filteredNewItems = newItems.reduce((acc:OrderedItem[], curr: OrderedItem)=>{
        const isIncluded = items.every((dI:OrderedItem)=>{            
            return isSameItem(dI, curr)?true:false
        })

        if(!isIncluded){
            acc.push(curr)
        }
        return acc
    }, [])

    return <>
        <ModalBody>
            <div className="w-full">                    
                <div className="w-full flex flex-wrap mb-2">                        
                    <Input
                        isReadOnly={newItemIdx > -1}
                        label="Nama Barang"                        
                        variant="bordered"
                        size="sm"
                        className={withProductName?"basis-full md:basis-1/4":"basis-full md:basis-1/2"}
                        value={name}
                        onChange={(e)=>{                            
                            setNewItem({...newItem, name:e.target.value})                            
                        }}
                    />
                    {
                        withProductName &&
                        <Input
                            isReadOnly={newItemIdx > -1}
                            label="Spesifikasi"                        
                            variant="bordered"
                            size="sm"
                            className={"basis-full md:basis-1/4"}
                            value={productName}
                            onChange={(e)=>{                                
                                setNewItem({...newItem, productName:e.target.value})                                
                            }}
                        />
                    }                                                
                    <Input
                        label="Jumlah"
                        variant="bordered"
                        size="sm"
                        className="basis-1/5 md:basis-1/12" 
                        value={amount.toString()}
                        type="number"
                        onChange={(e)=>{
                            setNewItem({...newItem, amount:parseInt(e.target.value)})
                        }}    
                    />
                    <Input                            
                        isReadOnly={newItemIdx > -1}
                        label="Satuan"
                        variant="bordered"
                        size="sm"
                        className="basis-2/5 md:basis-2/12" 
                        value={unit}                            
                        onChange={(e)=>{                            
                            setNewItem({...newItem, unit:e.target.value})                            
                        }}    
                    />                                        
                    <Input                        
                        label={`Harga per ${unit === ""?"unit":unit}`}
                        variant="bordered"
                        size="sm"
                        className="basis-2/5 md:basis-3/12" 
                        value={price.toString()}
                        type="number"
                        onChange={(e)=>{setNewItem({...newItem, price:parseInt(e.target.value)})}}    
                    />
                    
                </div>
                <NewItemCategory 
                    isReadonly={newItemIdx !== -1}
                    categories={categories} 
                    category={newItem.category}
                    subCategory={newItem.subCategory}
                    subSubCategory={newItem.subSubCategory}
                    changeClassificiation={(newName:string, level:"category" | "subCategory" | "subSubCategory")=>{
                        
                        const updatedNewItem = _.cloneDeep(newItem)
                        switch(level){
                            case "category":
                                if(updatedNewItem.category!==newName){
                                    updatedNewItem.category = newName
                                    setNewItem(updatedNewItem)
                                }
                                
                                break;
                            case "subCategory":
                                if(updatedNewItem.subCategory !== newName){
                                    updatedNewItem.subCategory = newName
                                    setNewItem(updatedNewItem)
                                }                                    
                                break;
                            case "subSubCategory":
                                if(updatedNewItem.subSubCategory !== newName){
                                    updatedNewItem.subSubCategory = newName
                                    setNewItem(updatedNewItem)
                                }                                    
                                break
                        }                            
                    }}
                />                                                    
                {
                    filteredNewItems.length > 0 && 
                        <>
                        <Divider />
                        <Table aria-label="Pilihan Bantuan" className=" mt-2"
                            topContent={
                                <div className="w-full flex items-center">
                                    <h2 className={`font-semibold`}>
                                        Pilihan Bantuan Baru
                                    </h2>
                                </div>                                
                            }
                        >
                            <TableHeader>
                                <TableColumn>                                    
                                    {''}                                    
                                </TableColumn>
                                <TableColumn>                                    
                                    Barang                                    
                                </TableColumn>                                
                                <TableColumn>                                    
                                    Harga Per Unit                                    
                                </TableColumn>                            
                            </TableHeader>                
                            <TableBody>
                                {filteredNewItems
                                    .map((d:Item, i:number)=>{
                                        const selected = newItemIdx === i
                                        return (
                                            <TableRow key={d._id?d._id:i}>
                                                <TableCell>
                                                    <Checkbox 
                                                        isSelected={selected}
                                                        onValueChange={(e)=>{
                                                            setNewItemIdx(selected?-1:i)
                                                            
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
            </div>
            </ModalBody>
            <ModalFooter>
                <Button color={`primary`} size="sm"
                    isDisabled={!canSubmit}
                    onPress={()=>{                        
                        submit(newItem);
                    }}
                >
                    Tambahkan
                </Button>
                <Button color="danger" size="sm" onPress={hideForm}>
                    Batal
                </Button>
            </ModalFooter>
    </>
}

const NewItemCharityOrg:FC<INewItemForm> = ({recipientItems:{ items, itemIdx }, show, 
    hideForm, submit, newItems, RABType, showForm, fetchState = ""}) => {
    const [ newItem, setNewItem] = useState<OrderedItem>(_.cloneDeep(emptyOrderedItem))
    //there is 'newItems' prop in this component
    //newItemIdx is for that prop
    const [ newItemIdx, setNewItemIdx ] = useState(-1)

    const editedNewItem = itemIdx > -1?items[itemIdx]:null    

    useEffect(()=>{
        if(editedNewItem !== null && !("_id" in editedNewItem)){
            setNewItem(_.cloneDeep(editedNewItem))
        }
    }, [editedNewItem])

    const { name, productName, category, subCategory, subSubCategory, unit, amount, price } = newItem

    const itemDataCompleted = (item:OrderedItem) => {
        const { name, productName, category, subCategory, subSubCategory, unit, amount, price } = item

        return name !== "" && productName !== "" && category !== "" && subCategory !== ""
            && unit !== "" && amount > 0 && price > 0
    }

    const categories = RABType === "charity-multi-recipients"?
        [availCategories[0]]:
            RABType === "charity-org"?
                [availCategories[1], availCategories[2]]:
                    []

    const filterCategories = _.cloneDeep(categories)

    const subCategories = categories.map((dCat:category) => dCat.subCategory).flat()    
    const subSubCategories = subCategories.map((d:subCategory) => d.subCategory)
        .flat().filter((d:option | undefined) => typeof d !== "undefined")    

    const withProductName = RABType !== "charity-multi-recipients"
    const canSubmit = name !== "" && (withProductName?productName !== "":true) 
        && category !== "" && subCategory !== "" && amount > 0 && price > 0   

    const existingItems = items.filter((d:OrderedItem, i: number) => i !== itemIdx)
    const itemListed = existingItems.find((d:OrderedItem) => isSameItem(d, newItem)) === undefined?
        false:true        

    return <>
        <ModalBody>
            <div className="w-full">
                <p className="text-xs text-slate-700 italic">
                    {itemListed?"Barang ini sudah ada":""}    
                </p>                    
                <div className="w-full flex flex-wrap mb-2">                        
                    <Input
                        isReadOnly={newItemIdx > -1}
                        label="Nama Barang"                        
                        variant="bordered"
                        size="sm"
                        className={withProductName?"basis-full md:basis-1/4":"basis-full md:basis-1/2"}
                        value={name}
                        onChange={(e)=>{                            
                            setNewItem({...newItem, name:e.target.value})                            
                        }}
                    />
                    {
                        withProductName &&
                        <Input
                            isReadOnly={newItemIdx > -1}
                            label="Spesifikasi"                        
                            variant="bordered"
                            size="sm"
                            className={"basis-full md:basis-1/4"}
                            value={productName}
                            onChange={(e)=>{                                
                                setNewItem({...newItem, productName:e.target.value})                                
                            }}
                        />
                    }                                                
                    <Input
                        label="Jumlah"
                        variant="bordered"
                        size="sm"
                        className="basis-1/5 md:basis-1/12" 
                        value={amount.toString()}
                        type="number"
                        onChange={(e)=>{
                            setNewItem({...newItem, amount:parseInt(e.target.value)})
                        }}    
                    />
                    <Input                            
                        isReadOnly={newItemIdx > -1}
                        label="Satuan"
                        variant="bordered"
                        size="sm"
                        className="basis-2/5 md:basis-2/12" 
                        value={unit}                            
                        onChange={(e)=>{                            
                            setNewItem({...newItem, unit:e.target.value})                            
                        }}    
                    />                                        
                    <Input                        
                        label={`Harga per ${unit === ""?"unit":unit}`}
                        variant="bordered"
                        size="sm"
                        className="basis-2/5 md:basis-3/12" 
                        value={price.toString()}
                        type="number"
                        onChange={(e)=>{setNewItem({...newItem, price:parseInt(e.target.value)})}}    
                    />
                    
                </div>
                <NewItemCategory 
                    isReadonly={newItemIdx !== -1}
                    categories={categories} 
                    category={newItem.category}
                    subCategory={newItem.subCategory}
                    subSubCategory={newItem.subSubCategory}
                    changeClassificiation={(newName:string, level:"category" | "subCategory" | "subSubCategory")=>{
                        
                        const updatedNewItem = _.cloneDeep(newItem)
                        switch(level){
                            case "category":
                                if(updatedNewItem.category!==newName){
                                    updatedNewItem.category = newName
                                    setNewItem(updatedNewItem)
                                }
                                
                                break;
                            case "subCategory":
                                if(updatedNewItem.subCategory !== newName){
                                    updatedNewItem.subCategory = newName
                                    setNewItem(updatedNewItem)
                                }                                    
                                break;
                            case "subSubCategory":
                                if(updatedNewItem.subSubCategory !== newName){
                                    updatedNewItem.subSubCategory = newName
                                    setNewItem(updatedNewItem)
                                }                                    
                                break
                        }                            
                    }}
                />                                                                    
            </div>
            </ModalBody>
            <ModalFooter>
                <Button color={`primary`} size="sm"
                    isDisabled={!canSubmit || itemListed || fetchState !== ""}
                    onPress={()=>{                        
                        submit(newItem);
                    }}
                >
                    Tambahkan
                </Button>
                <Button color="danger" size="sm" onPress={hideForm}>
                    Batal
                </Button>
            </ModalFooter>
    </>
}
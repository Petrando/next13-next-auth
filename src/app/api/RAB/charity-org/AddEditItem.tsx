import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
        Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Select, SelectItem, Selection,
            Checkbox, Input, Divider, RadioGroup, Radio, Skeleton } from "@nextui-org/react";
import CurrencyFormat from "react-currency-format";
import { emptyOrderedItem, categories as availCategories, emptyCategory } from "@/variables-and-constants";
import { Item, OrderedItem, PersonRecipientWItems, RABTypes, category, filterCategory, subCategory, filterSubCategory, 
    option, filterOption } from "@/types";

type TItemForm = {
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
        in other words : items that are not being listed yet
    */
    newItems: OrderedItem[];
    RABType: RABTypes;
}

type tItemType = "new" | "existing"

export const EditItem:FC<TItemForm> = ({recipientItems:{ recipientName, items, itemIdx }, show, 
    hideForm, submit, newItems, RABType}) => {    

    const [ newItem, setNewItem] = useState<OrderedItem>(_.cloneDeep(emptyOrderedItem))
    //there is 'newItems' prop in this component
    //newItemIdx is for that prop
    const [ newItemIdx, setNewItemIdx ] = useState(-1)

    const [ itemSelection, setSelection] = useState<Item[]>([])
    const [ selectedItemId, setSelectedId] = useState("")    
    const [ selectedAmount, setSelectedAmount ]  = useState(1)

    const [ itemPrice, setPrice ] = useState(0)

    const [ itemType, setItemType ] = useState<tItemType>("existing")

    const [fetchState, setFetchState] = useState("loading")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    
    const getItems = async () => {
        const filter = RABType === "charity-multi-recipients"?
            {
                category: "Kesehatan"
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
        const newItem = _.cloneDeep(newItemIdx === -1?emptyOrderedItem:newItems[newItemIdx])        
        setNewItem(newItem)
    }, [newItemIdx])

    useEffect(()=>{
        if(items.length > 0){
            const {_id, amount} = items[itemIdx]
            if(_id && _id !== ""){
                setSelectedId(_id)
                setSelectedAmount(amount)                
            }else{                
                setNewItem(_.cloneDeep(items[itemIdx]))
                setItemType("new")
            }
            
        }else{
            setNewItem(_.cloneDeep(emptyOrderedItem))
        }
        
    }, [ items, itemIdx ])
                        
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
            items.length > 0?items[itemIdx]:_.cloneDeep(emptyOrderedItem)
    const selectedItem = selectedItemId === ""?_.cloneDeep(emptyOrderedItem):
        {...baseSelectedItem, amount:selectedAmount}        

    const currentItem = itemType === "new"?newItem:selectedItem
    const { name, productName, category, subCategory, subSubCategory, unit, amount, price } = currentItem || 
        { name:"", productName:"", amount:0, unit: "", price:0, category: "", subCategory: "", subSubCategory: "" }       

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
        && category !== "" && subCategory !== "" && amount > 0 && itemPrice > 0 

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
                        value={itemType} onChange={(e)=>{setItemType(e.target.value as tItemType)}}
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
                            className={withProductName?"basis-full md:basis-1/4":"basis-full md:basis-1/2"}
                            value={name}
                            onChange={(e)=>{
                                if(itemType === "new"){
                                    setNewItem({...newItem, name:e.target.value})
                                }
                            }}
                        />
                        {
                            withProductName &&
                            <Input
                                isReadOnly={itemType==="existing" || (itemType === "new" && newItemIdx > -1)}
                                label="Spesifikasi"                        
                                variant="bordered"
                                size="sm"
                                className={"basis-full md:basis-1/4"}
                                value={productName}
                                onChange={(e)=>{
                                    if(itemType === "new"){
                                        setNewItem({...newItem, productName:e.target.value})
                                    }
                                }}
                            />
                        }                                                
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
                        itemType === "new" &&
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
                    }
                                        
                    {
                        (itemType === "existing" || (itemType === "new" && newItems.length > 0)) && 
                            <>
                            <Divider />
                            <Table aria-label="Pilihan Bantuan" className=" mt-2"
                                topContent={
                                    <>
                                    <div className="w-full flex items-center">
                                        <h2 className={`font-semibold`}>
                                            Pilihan Bantuan {`${itemType === "new"?"Baru":""}`}
                                        </h2>
                                    </div>
                                    {
                                        itemType === "existing" &&
                                        <Skeleton isLoaded={fetchState === "complete"}>
                                            <FilterCategories categories={filterCategories} />
                                        </Skeleton>
                                    }
                                    </>
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

type INewCategory = {    
    categories: filterCategory[];
    category: string;
    subCategory: string; 
    subSubCategory: string | undefined;
    changeClassificiation: (newName:string, level:"category" | "subCategory" | "subSubCategory") => void;   
    isReadonly: boolean;
}

const NewItemCategory:FC<INewCategory> = ({
    categories, category, subCategory, subSubCategory, changeClassificiation, isReadonly}) => {    

    const categoryIdx = categories.findIndex((dCat:category) => dCat.name === category)
    const subCategories = categoryIdx > -1?categories[categoryIdx].subCategory:[]
    const subCategoryIdx = subCategories.findIndex((dSub:subCategory) => dSub.name === subCategory)
    const subSubCategories = typeof subCategories[subCategoryIdx] !== "undefined"?
        subCategories[subCategoryIdx].subCategory:
            []

    const hasSubSubCategories = Array.isArray(subSubCategories) && subSubCategories.length > 0

    useEffect(()=>{
        if(category === ""){
            changeClassificiation(categories[0].name, "category")
            changeClassificiation(categories[0].subCategory[0].name, "subCategory")
            if(subSubCategory && subSubCategory !== ""){
                changeClassificiation(hasSubSubCategories?subSubCategories[0].name:"", "subSubCategory")
            }
        }
                
    }, [])
            
    const styles = hasSubSubCategories?
        "basis-full md:basis-1/3":"basis-full md:basis-1/2"            

    return (
        <div className="flex flex-wrap">
            <Select                        
                label="Kategori"
                variant="bordered"
                selectedKeys={[category]}
                className={styles}
                onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                    changeClassificiation(e.target.value, "category")
                }}                
            >
                {categories.map((c) => (
                    <SelectItem key={c.name} isReadOnly={isReadonly}>
                        {c.name}
                    </SelectItem>
                    ))}
            </Select>
            <Select                        
                label="Sub Kategori"
                variant="bordered"
                selectedKeys={[subCategory]}
                className={styles}
                onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                    changeClassificiation(e.target.value, "subCategory")
                }}
                isDisabled={isReadonly}
            >
                {subCategories.map((c) => (
                    <SelectItem key={c.name}>
                        {c.name}
                    </SelectItem>
                    ))}
            </Select>
            {
                hasSubSubCategories && 
                <Select                        
                    label="Sub Sub Kategori"
                    variant="bordered"
                    selectedKeys={[subSubCategory?subSubCategory:""]}
                    className={styles}
                    onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                        changeClassificiation(e.target.value, "subSubCategory")
                    }}
                    isDisabled={isReadonly}
                >
                    {subSubCategories.map((c) => (
                        <SelectItem key={c.name}>
                            {c.name}
                        </SelectItem>
                        ))}
                </Select>
            }
        </div>

    )
}

type IFilterCategory = {
    categories: filterCategory[];
}

const FilterCategories:FC<IFilterCategory> = ({ categories: baseCategories }) => {
    const [ categories, setCategories ] = useState<Selection>(new Set([]))
    const [ subCategories, setSubCategories] = useState<Selection>(new Set([]))
    const [ subSubCategories, setSubSubCategories] = useState<Selection>(new Set([]))
    
    const categoryNames = baseCategories.filter((d: filterCategory) => d.checked).map((d:filterCategory) => d.name)
    const baseSubCategories = baseCategories.map((d:filterCategory) => d.subCategory).flat()
    const subCategoryNames = baseSubCategories.filter((d:filterSubCategory) => d.checked).map((d:filterSubCategory) => d.name)
    const baseSubSubCategories = baseSubCategories.filter((d:filterSubCategory) => Array.isArray(d.subCategory))
        .map((d:filterSubCategory) => d.subCategory).flat()
    const subSubCategoryNames = baseSubSubCategories.filter((d:filterOption | undefined) => d && d.checked)
            .map((d:filterOption | undefined) => d && d.name)        

    const changeCategories = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategories(new Set(e.target.value.split(",")));
    };

    const changeSubCategories = (e: ChangeEvent<HTMLSelectElement>) => {
        
    };

    const changeSubSubCategories = (e: ChangeEvent<HTMLSelectElement>) => {
        
    };

    useEffect(()=>{
        const categories = new Set(categoryNames)
        setCategories(categories)
        const subCategories = new Set(subCategoryNames)
        setSubCategories(subCategories)
        if(subSubCategoryNames.length > 0){
            const subSubCategories = new Set(subSubCategoryNames)
            setSubSubCategories(subSubCategories as Selection)           
        }
    }, [])

    const withSubSubCategories = baseSubSubCategories.length > 0
    const styles = !withSubSubCategories?
        "basis-full md:basis-1/2 overflow-hidden":
            "basis-full md:basis-1/3 overflow-hidden"

    return (
        <div className="flex flex-wrap">
            <Select
                label="Kategori"
                selectionMode="multiple"
                placeholder="Pilih Kategori"
                selectedKeys={categories}
                className={styles}
                onChange={changeCategories}                
            >
                {baseCategories.map((c) => (
                <SelectItem key={c.name} isReadOnly>
                    {c.name}
                </SelectItem>
                ))}
            </Select>
            <Select
                label="Sub Kategori"
                selectionMode="multiple"
                placeholder="Pilih Sub Kategori"
                selectedKeys={subCategories}
                className={styles}
                onChange={changeSubCategories}                
            >
                {baseSubCategories.map((c) => (
                    <SelectItem key={c.name} isReadOnly>
                        {c.name}
                    </SelectItem>
                ))}
            </Select>
            {
                withSubSubCategories &&
                <Select
                    label="Sub Sub Kategori"
                    selectionMode="multiple"
                    placeholder="Pilih Sub Sub Kategori"
                    selectedKeys={subSubCategories}
                    className={styles}
                    onChange={changeSubSubCategories}                
                >
                    {baseSubSubCategories.map((c) => {
                        const { name } = c as filterOption
                        return (
                            <SelectItem key={name} isReadOnly>
                                {name}
                            </SelectItem>
                        )
                    })}
                </Select>
            }
        </div>   
    )
}
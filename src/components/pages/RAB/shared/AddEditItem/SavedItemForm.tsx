import { FC, useState, useEffect } from "react"
import CurrencyFormat from "react-currency-format";
import { ModalBody, Divider, Table, TableRow, TableCell, TableHeader, TableColumn, TableBody, 
    Skeleton, Checkbox, Input, ModalFooter, Button } from "@nextui-org/react";
import _ from "lodash";
import { CategoryFilter } from "./CategoryFilter";
import { TItemForm } from "."
import { categories as availCategories, emptyOrderedItem } from "@/variables-and-constants";
import { Item, OrderedItem, category, subCategory, option } from "@/types";

interface ISavedItemForm extends TItemForm {
    showForm: boolean;
}

export const SavedItemForm:FC<ISavedItemForm> = ({ recipientItems:{ recipientName, items, itemIdx }, 
    show, hideForm, submit, RABType, showForm, fetchState: parentFetchState = "" }) => {
    const [ itemSelection, setSelection] = useState<Item[]>([])
    const [ selectedItemId, setSelectedId] = useState("")    
    const [ selectedAmount, setSelectedAmount ]  = useState(1)

    const [ itemPrice, setPrice ] = useState(0)

    const [fetchState, setFetchState] = useState("loading")

    const editedItem = itemIdx > -1?items[itemIdx]:null 

    useEffect(()=>{
        if(editedItem !== null && "_id" in editedItem){
            setSelectedId(editedItem._id?editedItem._id:"")
            setSelectedAmount(editedItem.amount)
            setPrice(editedItem.price)
        }
    }, [editedItem])
        
    console.log('saved item form')
    const getItems = async () => {
        type tNameProd = {name:string, productName: string}
        const savedItems = items.filter((d:OrderedItem) => "_id" in d)
            .filter((d:OrderedItem) => editedItem === null?true:editedItem._id !== d._id)            
            .map((d:OrderedItem) => ({name:d.name, productName:d.productName})) as tNameProd[]

        const nameFilter = (Array.isArray(savedItems) && savedItems.length > 0)?
                {$nor:savedItems}:{}

        console.log(nameFilter)
        
        const categoryFilter = RABType === "charity-multi-recipients"?
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
                
        const filter = {
            ...categoryFilter, ...nameFilter
        }
        
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

    const selectedItem = itemSelection.find((d:Item) => d._id === selectedItemId)

    const { name, productName, category, subCategory, subSubCategory, unit, price } = selectedItem?selectedItem:emptyOrderedItem

    const editedItemId = (editedItem !== null && "_id" in editedItem)?editedItem._id:""

    useEffect(()=>{
        /*
            At every selectedId change, price will only be based on selected item if
            the selected item is not the one that is currently being edited
        */
        if(selectedItem && selectedItemId !== editedItemId){            
            setPrice(price)
        }    
    }, [selectedItem, editedItemId])    

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
        && category !== "" && subCategory !== "" && selectedAmount > 0 && itemPrice > 0 

    if(!showForm){
        return null
    }

    return (
        <>
        <ModalBody>
            <div className="w-full">                    
                <div className="w-full flex flex-wrap mb-2">                        
                    <Input
                        isReadOnly
                        label="Nama Barang"                        
                        variant="bordered"
                        size="sm"
                        className={withProductName?"basis-full md:basis-1/4":"basis-full md:basis-1/2"}
                        value={name}
                    />
                    {
                        withProductName &&
                        <Input
                            isReadOnly
                            label="Spesifikasi"                        
                            variant="bordered"
                            size="sm"
                            className={"basis-full md:basis-1/4"}
                            value={productName}
                        />
                    }                                                
                    <Input
                        isDisabled={fetchState!=="complete"}
                        label="Jumlah"
                        variant="bordered"
                        size="sm"
                        className="basis-1/5 md:basis-1/12" 
                        value={selectedAmount.toString()}
                        type="number"
                        onChange={(e)=>{                                
                            setSelectedAmount(parseInt(e.target.value))                                
                        }}    
                    />
                    <Input                            
                        isReadOnly
                        label="Satuan"
                        variant="bordered"
                        size="sm"
                        className="basis-2/5 md:basis-2/12" 
                        value={unit}     
                    />                                        
                    <Input
                        isDisabled={fetchState!=="complete"}
                        label={`Harga per ${unit === ""?"unit":unit}`}
                        variant="bordered"
                        size="sm"
                        className="basis-2/5 md:basis-3/12" 
                        value={itemPrice.toString()}
                        type="number"
                        onChange={(e)=>{setPrice(parseInt(e.target.value))}}    
                    />
                    
                </div>                                                         
                <Divider />
                <Table aria-label="Pilihan Bantuan" className=" mt-2"
                    topContent={
                        <>
                        <div className="w-full flex items-center">
                            <h2 className={`font-semibold`}>
                                Pilihan Bantuan 
                            </h2>
                        </div>
                            <Skeleton isLoaded={fetchState === "complete"}>
                                <CategoryFilter categories={filterCategories} />
                            </Skeleton>
                        
                        </>
                    }
                >
                    <TableHeader>
                        <TableColumn>
                            <Skeleton className="rounded" isLoaded={ fetchState === "complete" }>
                                {''}
                            </Skeleton>
                        </TableColumn>
                        <TableColumn>
                            <Skeleton className="rounded" isLoaded={ fetchState === "complete" }>
                                Barang
                            </Skeleton>
                        </TableColumn>                                
                        <TableColumn>
                            <Skeleton className="rounded" isLoaded={ fetchState === "complete" }>
                                Harga Per Unit
                            </Skeleton>
                        </TableColumn>                            
                    </TableHeader>                
                    <TableBody>
                        {itemSelection.map((d:Item, i:number)=>{
                            const selected = selectedItemId === d._id
                            return (
                                <TableRow key={d._id?d._id:i}>
                                    <TableCell>
                                        <Checkbox 
                                            isSelected={selected}
                                            onValueChange={(e)=>{setSelectedId(d._id?d._id:"")}}
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
                {
                    fetchState === "complete" && itemSelection.length === 0 &&
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
                    if(selectedItem){
                        const item = {...selectedItem, price: itemPrice, amount: selectedAmount}
                        submit(item);
                    }                    
                }}
            >
                Tambahkan
            </Button>
            <Button color="danger" size="sm" onPress={hideForm}>
                Batal
            </Button>
        </ModalFooter>
        </>
    )
}
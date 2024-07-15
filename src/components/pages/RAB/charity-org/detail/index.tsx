'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,    
        DatePicker, Input
 } from "@nextui-org/react"
import _ from 'lodash';
import { EditItem } from '../../shared/AddEditItem';
import { UpdateItemForm } from './UpdateItemDialog';
import { SelectBAST } from '../../shared/SelectBASTButton';
import { PrintBAST as ReceiverBAST } from './print-BAST-dialog/BASTReceiverDialog';
import { TotalCard } from '../../shared/TotalCard';
import { DeleteIcon, EditIcon, PlusIcon, PrintIcon } from '@/components/Icon';
import { createDateString } from '@/lib/functions';
import { emptyRABCharityOrg, emptyOrderedItem } from '@/variables-and-constants';
import { IRABCharityOrg, OrderedItem } from '@/types';
import CurrencyFormat from 'react-currency-format';
import { DeleteItemForm } from './DeleteItemDialog';

export const RABDetail = () => {
    const [ tab, setTab ] = useState("recipients");

    const [RAB, setRAB] = useState<IRABCharityOrg>(emptyRABCharityOrg)
    const { title, date, recipient, items } = RAB
    const [ printBast, setPrintBast ] = useState("")
    const [ fetchState, setFetchState ] = useState("loading")
    /*
        if isChanging item is -1, adding new item
        if greater than -1, is editing new item index
        if it contains a string, it will be the item id to delete 
    */
    const [ isChangingItem, setIsChangingItem ] = useState<null | number | string>(null)    

    const searchParams = useSearchParams()
    const rabId = searchParams.get("_id")

    const getRAB = async () => {
        if(!rabId || rabId === ""){return}

        const filter = {_id:rabId}
        const projection = {}
        const limit = 1
        const offset = 0

        setFetchState("loading")
        try{
            const response = await fetch('/api/RAB/list', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            setRAB(data.data[0])
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setFetchState("complete")
        } 
    }

    const addNewItem = async (item:OrderedItem) => {
        setFetchState("loading")
        try{
            const response = await fetch('/api/RAB/charity-org/edit/add-item', {
                method: 'PATCH',
                body: JSON.stringify({ RABId:RAB._id, item }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            console.log(data)
            const {itemId} = data
            getRAB() 
            setIsChangingItem(null)
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setFetchState("complete")
        } 
    }

    const updateItemAmount = async (newAmount:number) => {
        setFetchState("loading")
        const { _id } = items[isChangingItem as number]
        try{
            const response = await fetch('/api/RAB/charity-org/edit/update-item-amount', {
                method: 'PATCH',
                body: JSON.stringify({ RABId:RAB._id, itemId: _id, newAmount }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            console.log(data)
            setIsChangingItem(null)
            getRAB()
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setFetchState("complete")
        }
    }

    const deleteItem = async () => {
        setFetchState("loading")
        try{
            const response = await fetch('/api/RAB/charity-org/edit/delete-item', {
                method: 'PATCH',
                body: JSON.stringify({ RABId:RAB._id, itemId: isChangingItem }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();                        
            
            const updatedItem = items.filter((d:OrderedItem) => d._id !== isChangingItem as string)
            setRAB({...RAB, items: updatedItem})
            setIsChangingItem(null)
        }catch(err:any){
            console.log('fetch error : ', err)            
        }
        finally{
            setFetchState("complete")
        } 
    }
    
    useEffect(()=>{        
        getRAB()        
    }, [rabId])
        
    const totalPrice = items
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)
    
    const renderElement = items.length > 0?items.concat(emptyOrderedItem):[]    
        
    const itemToChange = (typeof isChangingItem === "number" && isChangingItem > -1)?
        items[isChangingItem]:null
    //const { ids:{nik} } = printingRecipient
    const itemToDelete = items.find((d:OrderedItem) => d._id === isChangingItem as string)
    
    return (
        <div className="flex flex-col w-screen px-1 md:px-2">            
            <div className="px-0 py-2 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker 
                        label="Tanggal" className="max-w-[284px]" 
                        value={createDateString(new Date())} 
                        isReadOnly
                    />
                </div>
                <div className="flex-auto p-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} 
                        isReadOnly                        
                    />
                </div>
            </div>
            <Table aria-label="Tabel Bantuan"
                topContent={
                    <div className="w-full flex p-1">                    
                        <h3 className='font-semibold flex-auto'>
                            {recipient.name}
                        </h3>
                        <Button color="primary" 
                            size="sm"
                            onPress={()=>{setIsChangingItem(-1)}}
                            startContent={<PlusIcon className="size-4"/>}
                            isDisabled={fetchState === "loading"}                                        
                        >
                            Barang
                        </Button>
                        <SelectBAST
                            selectReceive={()=>{setPrintBast("Penerima")}}
                            selectDeliver={()=>{setPrintBast("Pekerjaan")}}
                        />                                       
                                            
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
                            const {_id, name, productName, unit, amount, price} = d

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
                                        <CurrencyFormat value={price} thousandSeparator=","
                                            prefix="Rp. " suffix={` per ${unit}`} />                                                
                                    </TableCell>
                                    <TableCell>
                                        <CurrencyFormat value={price * amount} thousandSeparator="," prefix="Rp. " /> 
                                    </TableCell>                                            
                                    <TableCell className="flex items-center">
                                        <Button color="warning" startContent={<EditIcon className="size-4" />} size="sm"
                                            isDisabled={fetchState === "loading"}
                                            onPress={()=>{
                                                setIsChangingItem(i)
                                            }}
                                        >
                                            Jumlah
                                        </Button>                                        
                                        <Button color="danger" startContent={<DeleteIcon className="size-4" />} size="sm"
                                            isDisabled={fetchState === "loading"}
                                            onPress={()=>{
                                                setIsChangingItem(_id as string)
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
                isChangingItem === -1 &&
                <EditItem
                    recipientItems={{
                        recipientName: recipient.name,
                        items: items,
                        itemIdx: -1
                    }}
                    show={isChangingItem === -1}
                    hideForm={()=>{setIsChangingItem(null)}}
                    submit={addNewItem}
                    newItems={[]}
                    RABType='charity-org'
                />
            }
            {
                itemToChange !== null &&
                <UpdateItemForm
                    show={itemToChange!==null}
                    item={itemToChange}
                    hideForm={()=>{setIsChangingItem(null)}}
                    submit={updateItemAmount}
                    fetchState={fetchState}
                />
            }
            {
                typeof itemToDelete !== "undefined" &&
                <DeleteItemForm
                    show={ typeof itemToDelete !== "undefined" }
                    item={itemToDelete}
                    hideForm={()=>{setIsChangingItem(null)}}
                    submit={deleteItem}
                    fetchState={fetchState}
                />
            }
            {
                printBast === "Penerima" &&
                <ReceiverBAST 
                    show={printBast === "Penerima"}
                    hideForm={()=>{setPrintBast("")}}
                    rab={RAB}
                />
            }
        </div>
    )
}
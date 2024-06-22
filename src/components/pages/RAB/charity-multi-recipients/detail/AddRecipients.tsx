'use client'

import { useState, FC, useEffect } from "react"
import _ from "lodash"
import { useRouter } from "next/navigation"
import { DatePicker, Input, Link, Button } from "@nextui-org/react"
import { RecipientTable } from "../shared/RecipientManager"
import { AddDocumentIcon, CheckIcon } from "@/components/Icon"
import { createDateString } from "@/lib/functions";
import { PersonRecipientWItems, OrderedItem } from "@/types"

type IAddRecipients = {
    refresh: () => void;
    id: string;
    existingNiks: string[];
}

export const AddRecipients:FC<IAddRecipients> = ({refresh, id, existingNiks}) => {    
    
    const [ recipients, setRecipients ] = useState<PersonRecipientWItems[]>([])    

    const [ fetchState, setFetchState ] = useState("")
    const [ fetchError, setFetchError ] = useState("")

    useEffect(()=>{
        if(fetchState === "done"){
            setTimeout(()=>{
                setFetchState("")
            }, 1000)
            refresh()
        }
    }, [fetchState])
    
    const router = useRouter()

    const submitData = async () => {             
        setFetchState("submiting")
        try{
            const response = await fetch('/api/RAB/charity-multi-recipients/edit/add-new-recipients', {
                method: 'PATCH',
                body: JSON.stringify({
                    RABId:id, 
                    recipients 
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();
            console.log(data)            
            setRecipients([])
        }catch(err:any){
            console.log('fetch error : ', err)
            setFetchError("Error when submiting")
        }
        finally{
            setFetchState("done")
        } 
    }    
    
    const bottomComponent = () => {
        return (
            <div className="flex items-center justify-end px-2 py-3">                
                <Button 
                    color={`primary`} 
                    isDisabled={!canSubmit}
                    onPress={submitData}
                    startContent={<CheckIcon className="size-4" />}
                >
                    Tambahkan Penerima
                </Button>
            </div>
        )
    }

    const canSubmit = recipients.length > 0 && 
        recipients.map((d:PersonRecipientWItems) => d.items).every((d:OrderedItem[]) => d.length > 0)

    return (
        <div className="w-full overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 text-left mr-4">
                {fetchState === "done"?"Berhasil Menambah Penerima":"Tambahkan Penerima Baru"}    
            </h3>            
            <RecipientTable
                recipients={recipients}
                setRecipients={setRecipients}
                fetchState={fetchState}
                bottomComponent={bottomComponent()}
                existingNiks={existingNiks}
            />
        </div>
    )
}
'use client'

import { useState } from "react"
import _ from "lodash"
import { useRouter } from "next/navigation"
import { DatePicker, Input, Link, Button } from "@nextui-org/react"
import { RecipientTable } from "../shared/RecipientManager"
import { AddDocumentIcon } from "@/components/Icon"
import { createDateString } from "@/lib/functions";
import { PersonRecipientWItems, OrderedItem } from "@/types"

export const AddRAB = () => {    
    const [date, setDate] = useState(createDateString())
    const [title, setTitle] = useState('')
    
    const [ recipients, setRecipients ] = useState<PersonRecipientWItems[]>([])    

    const [ fetchState, setFetchState ] = useState("")
    const [ fetchError, setFetchError ] = useState("")
    
    const router = useRouter()

    const submitData = async () => {
        
        const RABDate = new Date(date.year + "-" + date.month + "-" + date.day)
        setFetchState("submiting")
        try{
            const response = await fetch('/api/RAB/charity-multi-recipients/add', {
                method: 'POST',
                body: JSON.stringify({ 
                    title, date:RABDate, category: 'charity-multi-recipients', recipients 
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            router.push("/RAB")
        }catch(err:any){
            console.log('fetch error : ', err)
            setFetchError("Error when submiting")
        }
        finally{
            setFetchState("done")
        } 
    }

    /*useEffect(()=>{
        if(fetchError !== ""){
            setFetchError("")
        }
    }, [isAddRecipient, fetchError])*/
    
    
    const bottomComponent = () => {
        return (
            <div className="flex items-center justify-end px-2 py-3">
                <Link href="/RAB" isDisabled={fetchState === "submiting"} color="danger" underline="hover"
                    className="mx-4"
                >
                    Kembali
                </Link>
                <Button color={`primary`} 
                    isDisabled={!canSubmit}
                    onPress={submitData}
                    endContent={<AddDocumentIcon />}
                >
                    Tambahkan RAB
                </Button>
            </div>
        )
    }

    const canSubmit = title !== "" && recipients.length > 0 && recipients.map((d:PersonRecipientWItems) => d.items).every((d:OrderedItem[]) => d.length > 0)

    return (
        <div className="flex flex-col w-screen px-1 md:px-2">
            <h1 className="text-xl md:text-2xl font-bold text-left basis-full py-3 pl-2 md:pl-4">
                Data RAB Baru
            </h1>
            <div className="px-0 flex items-center flex-wrap">
                <div className="w-fit p-1">
                    <DatePicker 
                        label="Tanggal" className="max-w-[284px]" 
                        value={date} 
                        onChange={setDate}
                    />
                </div>
                <div className="flex-auto p-1">
                    <Input size="lg" variant="underlined" fullWidth label="Judul RAB" value={title} onChange={e => setTitle(e.target.value)} 
                        isInvalid={fetchError === "Error when submiting"}
                        errorMessage="Gagal Menambahkan RAB..."
                    />
                </div>                
            </div>
            <RecipientTable
                recipients={recipients}
                setRecipients={setRecipients}
                fetchState={fetchState}
                bottomComponent={bottomComponent()}
            />
        </div>
    )
}
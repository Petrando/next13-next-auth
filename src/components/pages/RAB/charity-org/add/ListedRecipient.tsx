import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, Skeleton, Select, SelectItem } from "@nextui-org/react";
import { emptyCharityOrg } from "@/variables-and-constants";
import { CharityOrgRecipient } from "@/types";

type TRecipientForm = {
    show: boolean;
    hideForm: ()=>void;
    submit: (recipient:CharityOrgRecipient)=>void;
    orgRecipient: CharityOrgRecipient;    
}

export const ListedRecipientForm:FC<TRecipientForm> = ({ show, hideForm, submit, orgRecipient }) => {
    const [ recipients, setRecipients ] = useState<CharityOrgRecipient[]>([])
    const [ selectedId, setSelectedId ] = useState("")        

    const [ fetchState, setFetchState ] = useState("")
    const [ orgExist, setOrgExist ] = useState({exist:false, checked:false})
    const [ submitPressed, setSubmitPressed ] = useState(false)
        
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();    
        
    const recipientIdx = recipients.length > 0 ?
        recipients.findIndex((dRec:CharityOrgRecipient) => {
            //const {street, rtRw, kelurahan, kecamatan, kabupaten, propinsi, postCode} = dRec.address
            return(
                selectedId === dRec._id
                /*dRec.name === orgRecipient.name && dRec.number === orgRecipient.number &&
                street === orgRecipient.address.street && rtRw === orgRecipient.address.rtRw &&
                kelurahan === orgRecipient.address.kelurahan &&
                kecamatan === orgRecipient.address.kecamatan &&
                kabupaten === orgRecipient.address.kabupaten &&
                propinsi === orgRecipient.address.propinsi &&
                postCode === orgRecipient.address.postCode*/
            
        )}):
            -1
    console.log(selectedId, recipientIdx)
    const getRecipients = async () => {
        const filter = {
            type: "charity-org"
        }
        const projection = {}
        const limit = 10
        const offset = 0

        setFetchState("loading")
        try{
            const response = await fetch('/api/recipients/charity-org/list', {
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

    useEffect(()=>{ getRecipients() }, [])

    useEffect(()=>{
        if(fetchState === "complete" && recipients.length > 0){            
            console.log(orgRecipient)
            if(orgRecipient.name !== "" && orgRecipient._id){
                setSelectedId(orgRecipient._id as string)
            }
            /*else if(recipientIdx > -1){
                const { _id } = recipients[0]
                setSelectedId(_id as string)
            }*/            
        }
    }, [orgRecipient, recipients, fetchState/*, recipientIdx*/])

    useEffect(()=>{
        if(show){
            onOpen()
        }else{
            onClose()
        }
    }, [show]) 

    const recipient = recipientIdx > -1?recipients[recipientIdx]:emptyCharityOrg
    const { name, address, contact } = recipient 
    
    const { street, rtRw, kelurahan, kecamatan, kabupaten, postCode } = address
    const { value } = contact[0]    

    const rtNRw = recipient!==null?recipient.address.rtRw.split("/"):""
    const rt = rtRw === ""?"":rtNRw[0]    
    const rw = rtNRw === ""?"":rtNRw[1]
                
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
                <ModalHeader className="flex flex-col gap-1">
                    {
                        fetchState === "loading"?
                            "Mengambil Data Penerima":
                                (fetchState === "complete" && recipients.length === 0)?
                                    "Tidak Ada Data":
                                        "Pilihan Penerima Bantuan"
                    }                    
                </ModalHeader>
                <ModalBody>
                    <Skeleton className="w-full" isLoaded={fetchState === "complete"}>
                    <div className="w-full flex flex-wrap">
                                                                        
                        <Select 
                            label="Pilih Nama Penerima"                       
                            className="basis-full md:basis-3/5"
                            selectedKeys={[selectedId]}
                            onChange={(e:ChangeEvent<HTMLSelectElement>)=>{setSelectedId(e.target.value)}}
                        >
                            {recipients.map((recipient, i) => (
                                <SelectItem key={recipient._id?recipient._id:i} textValue={recipient.name}>                                
                                    {recipient.name}                                                                    
                                </SelectItem>
                            ))}
                        </Select>
                        <Input                                                    
                            label="No Hp"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-2/5"
                            value={value}
                            isReadOnly
                        />
                    </div>
                    </Skeleton>                    
                    <Divider />
                    <Skeleton className="w-full" isLoaded={fetchState === "complete"}>
                    <div className="w-full space-x-0 md:space-x-2 space-y-1">
                        <div className="flex flex-col md:flex-row">
                            <Input
                                label="Jalan"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/2"
                                value={street}
                                isRequired
                                isReadOnly
                            />
                            <div className="basis-full md:basis-1/2 flex">
                                <Input
                                    label="RT"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rt}
                                    isRequired
                                    isReadOnly
                                />
                                <Input
                                    label="RW"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rw}
                                    isRequired
                                    isReadOnly
                                />
                                <Input
                                    label="Kode Pos"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-3/5"
                                    value={postCode} 
                                    isReadOnly
                                />   
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <Input
                                label="Kelurahan"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kelurahan}    
                                name="address.kelurahan"
                                isRequired
                                isReadOnly
                            />
                            <Input
                                label="Kecamatan"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kecamatan}
                                name="address.kecamatan"
                                isRequired
                                isReadOnly
                            />
                            <Input
                                label="Kabupaten"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kabupaten}                                
                                name="address.kabupaten"
                                isRequired
                                isReadOnly
                            />
                        </div>
                    </div>
                    </Skeleton>
                    <Divider />                                        
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={()=>{                                                                                      
                            submit(recipient as CharityOrgRecipient)                                                    
                        }}
                        isDisabled={fetchState !== "complete" || (fetchState === "complete" && recipients.length === 0)}
                    >
                        Tambahkan
                    </Button>
                    <Button color="danger" onPress={()=>{hideForm()}}>
                        Batal
                    </Button>
                    
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
        </>
    );
}

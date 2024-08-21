import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox} from "@nextui-org/react";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createReceiverBASTDocs } from "@/lib/create-docx/BAST/receiverBAST";
import { displayIDR, createDateString, totalPrice, addressChanged, getRtRw } from "@/lib/functions";
import { emptyOperator, defaultCentre } from "@/variables-and-constants";
import { PersonRecipientWItems, IOperator, ICentre, Address } from "@/types";

export type TChangeRecipient = {
    idx: number;
    rabId: string;
    recipient: PersonRecipientWItems;
    show: boolean;
    close: ( refetch: boolean)=>void;       
}

export const EditRecipientDialog:FC<TChangeRecipient> = ({ idx, rabId, recipient, show, close }) => {    
    
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [ updatedAddress, setUpdatedAddress ] = useState<Address>()
    const [ isSaving, setIsSaving ] = useState(false)

    const initAddress = () => {
        setUpdatedAddress(_.cloneDeep(recipient.address))
    }

    const { rt, rw } = getRtRw(updatedAddress?updatedAddress.rtRw:recipient.address.rtRw)

    const updateAddress = (e:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if(updatedAddress){
            setUpdatedAddress({...updatedAddress, [name]:value})
        }        
    }

    const saveAddress = async () => {
        setIsSaving(true)
        try{
            const response = await fetch('/api/RAB/charity-multi-recipients/edit/edit-recipient', {
                method: 'PATCH',
                body: JSON.stringify({ 
                    RABId:rabId, recipientIdx: idx, 
                    recipientNik:recipient.ids.nik, address:updatedAddress }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();            
            console.log(data)
            close(true)
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
            setIsSaving(false)
        }
    }

    useEffect(()=>{ initAddress() }, [])
    
    const addressEdited = updatedAddress?addressChanged(updatedAddress, recipient.address):false

    const requiredFilled = updatedAddress && updatedAddress.street !== "" && updatedAddress.rtRw !== ""
        && updatedAddress.kelurahan !== "" && updatedAddress.kecamatan !== "" && updatedAddress.kabupaten !== ""
            && updatedAddress.propinsi !== ""
    
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
                    <span>Rubah Alamat Penerima {recipient.name}</span>
                                                                               
                </ModalHeader>
                <ModalBody>
                <div className="w-full">                    
                    <div className="w-full flex flex-wrap mb-2">                                                
                        <Input                                                    
                            label="Jalan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-3/5"
                            value={updatedAddress?.street}
                            onChange={updateAddress}
                            name="street"
                        />
                        <Input                                                    
                            label="RT"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/5"
                            value={rt}
                            onChange={()=>{}}
                            name="rt"
                        />
                        <Input                                                    
                            label="RW"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/5"
                            value={rw}
                            onChange={()=>{}}
                            name="rw"
                        />
                        <Input                                                    
                            label="Kelurahan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3 mt-1"
                            value={updatedAddress?.kelurahan}
                            onChange={updateAddress}
                            name="kelurahan"
                        />
                        <Input                                                    
                            label="Kecamatan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3 mt-1"
                            value={updatedAddress?.kecamatan}
                            onChange={updateAddress}
                            name="kecamatan"
                        />
                        <Input                                                    
                            label="Kabupaten"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3 mt-1"
                            value={updatedAddress?.kabupaten}
                            onChange={updateAddress}
                            name="kabupaten"
                        />
                        <Input                                                    
                            label="Propinsi"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-2/3 mt-1"
                            value={updatedAddress?.propinsi}
                            onChange={updateAddress}
                            name="propinsi"
                        />
                        <Input                                                    
                            label="Kode Pos"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3 mt-1"
                            value={updatedAddress?.postCode}
                            onChange={updateAddress}
                            name="postCode"
                        />
                    </div>                    
                    
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"                                                
                        isDisabled={!requiredFilled}
                        onPress={()=>{
                            if(!addressEdited){
                                close(false)
                            }
                            saveAddress()
                        }}
                        isLoading={isSaving}                        
                    >
                        Simpan
                    </Button>
                    <Button color={`primary`} size="sm"                                                
                        isDisabled={!addressEdited}
                        onPress={initAddress}
                        isLoading={isSaving}
                    >
                        Reset
                    </Button>
                    <Button 
                        color="warning" 
                        size="sm" 
                        onPress={()=>{close(false)}}
                        isLoading={isSaving}
                    >
                        Tutup
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
)}
import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, } from "@nextui-org/react";
import { emptyCharityOrg } from "@/variables-and-constants";
import { CharityOrgRecipient } from "@/types";

type TRecipientForm = {
    show: boolean;
    hideForm: ()=>void;
    submit: (recipient:CharityOrgRecipient)=>void;
    orgRecipient: CharityOrgRecipient;    
}

export const NewRecipientForm:FC<TRecipientForm> = ({ show, hideForm, submit, orgRecipient }) => {
    const [ recipient, setRecipient ] = useState<null | CharityOrgRecipient>(null)    
    //const [ rt, setRt ] = useState("")
    //const [ rw, setRw ] = useState("")

    const [ fetchState, setFetchState ] = useState("")
    const [ orgExist, setOrgExist ] = useState({exist:false, checked:false})
    const [ submitPressed, setSubmitPressed ] = useState(false)
    
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();    
    
    useEffect(()=>{
        setRecipient(orgRecipient)
    }, [orgRecipient])

    useEffect(()=>{
        if(show){
            onOpen()
        }else{
            onClose()
        }
    }, [show])    

    const checkOrg = async () => {
        console.log('checkOrg called') 
        if(!requiredFilled){
            return;
        }             
        setFetchState("checking org")
        try{
            const response = await fetch('/api/recipients/charity-org/check-org-exist', {
                method: 'POST',
                body: JSON.stringify({ org: recipient }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { message } = await response.json();
            
            if(response.ok){                
                setOrgExist({checked: true, exist: false})                
            }else{
                if(recipient !== null && message === `${recipient.name} sudah terdaftar`){
                    setOrgExist({ checked: true, exist: true})
                }
            }            
            
        }catch(err:any){
            console.log('fetch error : ')
            console.log(err)         
            
        }
        finally{            
            setFetchState("")
        }         
    }

    const { name, address, contact } = recipient || emptyCharityOrg
    
    const { street, rtRw, kelurahan, kecamatan, kabupaten, postCode } = address
    const { value } = contact[0]
    
    const changeState = (e:ChangeEvent<HTMLInputElement>) => {
        const newRecipient:any = {...recipient}
        const props = e.target.name.split(".")
        if(props.length === 1){
            newRecipient[props[0]] = e.target.value
        }
        if(props.length === 2){
            newRecipient[props[0]][props[1]] = e.target.value
        }
        if(props.length === 3){                        
            newRecipient[props[0]][parseInt(props[1])][props[2]] = e.target.value
        }                
        setRecipient(newRecipient)

        if(submitPressed){setSubmitPressed(false)}
    }

    const rtNRw = recipient!==null?recipient.address.rtRw.split("/"):""
    const rt = rtRw === ""?"":rtNRw[0]    
    const rw = rtNRw === ""?"":rtNRw[1] 

    const requiredFilled = (name !== "" && street !== "" && rt !== "" && rw !== "" && kelurahan !== ""
        && kecamatan !== "" && kabupaten !== ""
    ) 
    
    console.log(recipient)
    console.log(name)
    
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
                    Data Penerima Bantuan Baru
                </ModalHeader>
                <ModalBody>
                    <div className="w-full flex flex-wrap">
                        <Input                        
                            label="Nama"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-3/5"
                            value={name}
                            onChange={changeState}
                            name="name"
                            isRequired
                            isInvalid={submitPressed && name === ""}
                            errorMessage="Nama masih kosong"
                            onBlur={checkOrg}
                        />
                        <Input                                                    
                            label="No Hp"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-2/5"
                            value={value}
                            onChange={changeState}
                            name="contact.0.value"
                        />
                    </div>                    
                    <Divider />
                    <div className="w-full space-x-0 md:space-x-2 space-y-1">
                        <div className="flex flex-col md:flex-row">
                            <Input
                                label="Jalan"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/2"
                                value={street}
                                onChange={changeState}
                                name="address.street"
                                isRequired
                                isInvalid={submitPressed && street === ""}
                                errorMessage="Nama jalan masih kosong"
                                onBlur={checkOrg}
                            />
                            <div className="basis-full md:basis-1/2 flex">
                                <Input
                                    label="RT"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rt}
                                    onChange={(e)=>{
                                        const newRtRw = e.target.value + "/" + rw
                                        if(recipient !== null){
                                            setRecipient({
                                                ...recipient, 
                                                address:{...recipient?.address, rtRw:newRtRw}})
                                        }                                        
                                    }}
                                    isRequired
                                    isInvalid={submitPressed && rt === ""}
                                    errorMessage="RT masih kosong"
                                    onBlur={checkOrg}
                                />
                                <Input
                                    label="RW"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rw}
                                    onChange={(e)=>{
                                        const newRtRw = rt + "/" + e.target.value
                                        if(recipient !== null){
                                            setRecipient({
                                                ...recipient, 
                                                address:{...recipient?.address, rtRw:newRtRw}})
                                        }  
                                    }}
                                    isRequired
                                    isInvalid={submitPressed && rw === ""}
                                    errorMessage="Rw masih kosong"
                                    onBlur={checkOrg}
                                />
                                <Input
                                    label="Kode Pos"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-3/5"
                                    value={postCode}                                    
                                    onChange={changeState}
                                    name="address.postCode"
                                    onBlur={checkOrg}
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
                                onChange={changeState}
                                name="address.kelurahan"
                                isRequired
                                isInvalid={submitPressed && kelurahan === ""}
                                errorMessage="Kelurahan masih kosong"
                                onBlur={checkOrg}
                            />
                            <Input
                                label="Kecamatan"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kecamatan}
                                onChange={changeState}
                                name="address.kecamatan"
                                isRequired
                                isInvalid={submitPressed && kecamatan === ""}
                                errorMessage="Kecamatan masih kosong"
                                onBlur={checkOrg}
                            />
                            <Input
                                label="Kabupaten"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kabupaten}
                                onChange={changeState}
                                name="address.kabupaten"
                                isRequired
                                isInvalid={submitPressed && kabupaten === ""}
                                errorMessage="Kabupaten masih kosong"
                                onBlur={checkOrg}
                            />
                        </div>
                    </div>
                    <Divider />                                        
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={()=>{
                            if(!orgExist.checked){
                                checkOrg()
                            }
                            if(!requiredFilled){
                                setSubmitPressed(true)
                            }
                            else{                                
                                submit(recipient as CharityOrgRecipient)
                            }                        
                        }}
                        isDisabled={
                            (orgExist.exist || !orgExist.checked) || 
                                fetchState === "checking org"}
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

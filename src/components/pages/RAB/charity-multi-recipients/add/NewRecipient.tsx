import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, DatePicker, Divider, 
        CalendarDate} from "@nextui-org/react";
import { createDateString } from "@/lib/functions";
import { emptyPerson } from "@/variables-and-constants";
import { PersonRecipientWItems } from "@/types";

type TRecipientForm = {
    show: boolean;
    hideForm: ()=>void;
    submit: (recipient:PersonRecipientWItems)=>void;
    niks: string[];
}

export const NewRecipientForm:FC<TRecipientForm> = ({show, hideForm, submit, niks }) => {
    const [ recipient, setRecipient ] = useState(_.cloneDeep(emptyPerson))
    const [ birthday, setBirthday ] = useState<CalendarDate | null>(null)    

    const [ fetchState, setFetchState ] = useState("")
    const [ nikExist, setNikExist ] = useState({exist:false, checked:false})
    const [submitPressed, setSubmitPressed] = useState(false)
    
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();    

    useEffect(()=>{
        if(show){
            onOpen()
        }else{
            onClose()
        }
    }, [show])        

    const checkNIK = async () => {  
        const { nik } = recipient.ids
        if(niks.includes(nik)){
            setNikExist({checked: true, exist: true})
            return;
        }     
        setFetchState("checking NIK")
        try{
            const response = await fetch('/api/recipients/person-recipients/check-nik-exist', {
                method: 'POST',
                body: JSON.stringify({ nik }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { message } = await response.json();
            
            if(response.ok){                
                setNikExist({checked: true, exist: false})                
            }else{
                if(message === `Nik ${recipient.ids.nik} sudah terdaftar`){
                    setNikExist({ checked: true, exist: true})
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

    const { name, birthdata, ids, address, contact } = recipient
    const { birthplace } = birthdata    
    
    const { nik, noKk } = ids
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

    const rtNRw = recipient.address.rtRw.includes("/")?recipient.address.rtRw.split("/"):""
    const rt = rtRw === ""?"":rtNRw[0]    
    const rw = rtNRw === ""?"":rtNRw[1] 

    const requiredFilled = (name !== "" && nik !== "" && noKk !== "" && street !== "" && rt !== "" && rw !== "" && kelurahan !== ""
        && kecamatan !== "" && kabupaten !== ""
    )
    
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
                            autoFocus                        
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
                    <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                        <div className="basis-full md:basis-1/2">
                            <DatePicker label="Tanggal Lahir" className="max-w-[200px] md:max-w-[284px]" 
                                value={birthday} 
                                onChange={setBirthday}
                            />
                            <Input                                
                                label="Tempat Lahir"                        
                                variant="bordered"
                                size="sm"
                                className="mb-2 md:mb-0"
                                value={birthplace}
                                onChange={changeState}
                                name="birthdata.birthplace"
                            />
                        </div>
                        <Divider orientation="vertical" />
                        <div className="basis-full md:basis-1/2">
                            <Input
                                label="No. KTP"                        
                                variant="bordered"
                                size="sm"
                                className="mb-2"
                                value={nik}
                                onChange={(e)=>{
                                    changeState(e)
                                    if(nikExist.checked){
                                        setNikExist({exist:false, checked: false})
                                    }
                                }}
                                name="ids.nik"
                                isRequired
                                isInvalid={(submitPressed && nik === "") || nikExist.exist }
                                errorMessage={`${nikExist.exist?"NIK sudah terdaftar":"Nomor KTP masih kosong"}`}
                                onBlur={()=>{checkNIK()}}                            
                            />
                            <Input
                                label="No. KK"                        
                                variant="bordered"
                                size="sm"
                                value={noKk}
                                onChange={changeState}
                                name="ids.noKk"
                                isRequired
                                isInvalid={ submitPressed && noKk === ""}
                                errorMessage="Kartu Keluarga masih kosong"
                            />
                        </div>
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
                                        
                                        setRecipient({
                                            ...recipient, 
                                            address:{...recipient.address, rtRw:newRtRw}})
                                        
                                        if(submitPressed){setSubmitPressed(false)}
                                         
                                    }}
                                    isRequired
                                    isInvalid={submitPressed && rt === ""}
                                    errorMessage="RT masih kosong"
                                />
                                <Input
                                    label="RW"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rw}
                                    onChange={(e)=>{
                                        const newRtRw = rt + "/" + e.target.value
                                        
                                        setRecipient({
                                            ...recipient, 
                                            address:{...recipient.address, rtRw:newRtRw}})
                                        
                                        if(submitPressed){setSubmitPressed(false)}
                                    }}
                                    isRequired
                                    isInvalid={submitPressed && rw === ""}
                                    errorMessage="Rw masih kosong"
                                />
                                <Input
                                    label="Kode Pos"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-3/5"
                                    value={postCode}                                    
                                    onChange={changeState}
                                    name="address.postCode"
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
                            />
                        </div>
                    </div>
                    <Divider />                    
                    {/*    
                    <div className="flex h-5 items-center space-x-4 text-small">
                        <div>Blog</div>
                        <Divider orientation="vertical" />
                        <div>Docs</div>
                        <Divider orientation="vertical" />
                        <div>Source</div>
                    </div>
                    */}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={()=>{
                            if(!nikExist.checked){
                                checkNIK()
                            }
                            if(!requiredFilled){
                                setSubmitPressed(true)
                            }
                            else{
                                const birthdate = birthday !== null?
                                    new Date(birthday.year + "-" + birthday.month + "-" + birthday.day) : null
                                recipient.birthdata.birthdate = birthdate
                                submit(recipient)
                            }                        
                        }}
                        isDisabled={
                            (nikExist.exist || !nikExist.checked) || 
                                fetchState === "checking NIK"}
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

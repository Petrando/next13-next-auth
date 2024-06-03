import React, { useEffect, useState, FC } from "react";
const _ = require("lodash")
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Link, DatePicker, Divider } from "@nextui-org/react";
import { parseDate, toCalendarDate, CalendarDate } from "@internationalized/date";
import { emptyPerson, emptyOrderedItem } from "@/variables-and-constants";
import { PersonRecipientWItems } from "@/types";

type TRecipientForm = {
    show: boolean;
    hideForm: ()=>void;
    submit: (recipient:PersonRecipientWItems)=>void;
}

export const NewRecipientForm:FC<TRecipientForm> = ({show, hideForm, submit }) => {
    const [recipient, setRecipient] = useState(_.cloneDeep(emptyPerson))
    const [rt, setRt ] = useState("")
    const [rw, setRw ] = useState("")
    
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();    

    useEffect(()=>{
        if(show){
            onOpen()
        }else{
            onClose()
        }
    }, [show])
    
    useEffect(()=>{
        const newRecipient = {...recipient}
        newRecipient.address.rtRw = `${rt}/${rw}`
        setRecipient(newRecipient)
    }, [rt, rw])

    const {name, birthdata, ids, address, contact, items} = recipient
    const {birthdate, birthplace} = birthdata
    const convertedBirthday = parseDate(birthdate.toISOString().split('T')[0])
    
    const {nik, noKk} = ids
    const {street, rtRw, kelurahan, kecamatan, kabupaten, postCode} = address
    
    const {name:itemName, unit, price} = items[0]

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
                <ModalHeader className="flex flex-col gap-1">Data Penerima Bantuan</ModalHeader>
                <ModalBody>
                    <Input
                        autoFocus
                        endContent={
                            <></>
                        }
                        label="Nama Penerima"                        
                        variant="bordered"
                        size="sm"
                        value={name}
                        onChange={(e)=>{
                            const newRecipient = {...recipient}
                            newRecipient.name = e.target.value
                            setRecipient(newRecipient)
                        }}
                    />
                    <Divider />
                    <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                        <div className="basis-full md:basis-1/2">
                            <DatePicker label="Tanggal Lahir" className="max-w-[200px] md:max-w-[284px]" 
                                value={convertedBirthday} 
                                onChange={(date: CalendarDate) => {
                                    const newRecipient = {...recipient}
                                    newRecipient.birthdata.birthdate = new Date(date.year, date.month - 1, date.day)
                                    setRecipient(newRecipient)
                                  }}
                            />
                            <Input                                
                                label="Tempat Lahir"                        
                                variant="bordered"
                                size="sm"
                                className="mb-2 md:mb-0"
                                value={birthplace}
                                onChange={(e)=>{
                                    const newRecipient = {...recipient}
                                    newRecipient.birthdata.birthplace = e.target.value
                                    setRecipient(newRecipient)
                                }}
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
                                    const newRecipient = {...recipient}
                                    newRecipient.ids.nik = e.target.value
                                    setRecipient(newRecipient)
                                }}
                            />
                            <Input
                                label="No. KK"                        
                                variant="bordered"
                                size="sm"
                                value={noKk}
                                onChange={(e)=>{
                                    const newRecipient = {...recipient}
                                    newRecipient.ids.noKk = e.target.value
                                    setRecipient(newRecipient)
                                }}
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
                                onChange={(e)=>{
                                    const newRecipient = {...recipient}
                                    newRecipient.address.street = e.target.value
                                    setRecipient(newRecipient)
                                }}
                            />
                            <div className="basis-full md:basis-1/2 flex">
                                <Input
                                    label="RT"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rt}
                                    onChange={(e)=>{
                                        setRt(e.target.value)
                                    }}
                                />
                                <Input
                                    label="RW"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-1/5"
                                    value={rw}
                                    onChange={(e)=>{
                                        setRw(e.target.value)
                                    }}
                                />
                                <Input
                                    label="Kode Pos"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-3/5"
                                    value={postCode}                                    
                                    onChange={(e)=>{
                                        const newRecipient = {...recipient}
                                        newRecipient.address.postCode = e.target.value
                                        setRecipient(newRecipient)
                                    }}
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
                                onChange={(e)=>{
                                    const newRecipient = {...recipient}
                                    newRecipient.address.kelurahan = e.target.value
                                    setRecipient(newRecipient)
                                }}
                            />
                            <Input
                                label="Kecamatan"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kecamatan}
                                onChange={(e)=>{
                                    const newRecipient = {...recipient}
                                    newRecipient.address.kecamatan = e.target.value
                                    setRecipient(newRecipient)
                                }}
                            />
                            <Input
                                label="Kabupaten"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/3"
                                value={kabupaten}
                                onChange={(e)=>{
                                    const newRecipient = {...recipient}
                                    newRecipient.address.kabupaten = e.target.value
                                    setRecipient(newRecipient)
                                }}
                            />
                        </div>
                    </div>
                    <Divider />
                    <div className="w-full flex flex-wrap">
                        <Input
                            label="Nama Barang"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/2"
                            value={itemName}
                            onChange={(e)=>{
                                const newRecipient = {...recipient}
                                newRecipient.items[0].name = e.target.value
                                setRecipient(newRecipient)
                            }}
                        />
                        <Input
                            label="Jumlah"
                            variant="bordered"
                            size="sm"
                            className="basis-1/5 md:basis-1/12" 
                            value={unit.toString()}
                            type="number"
                            onChange={(e)=>{
                                const newRecipient = {...recipient}
                                newRecipient.items[0].unit = parseInt(e.target.value)
                                setRecipient(newRecipient)
                            }}    
                        />
                        <Input
                            label="Harga"
                            variant="bordered"
                            size="sm"
                            className="basis-4/5 md:basis-5/12" 
                            value={price.toString()}
                            type="number"
                            onChange={(e)=>{
                                const newRecipient = {...recipient}
                                newRecipient.items[0].price = parseInt(e.target.value)
                                setRecipient(newRecipient)
                            }}    
                        />
                    </div>
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
                    <Button color="primary" onPress={()=>{submit(recipient)}}>
                        Tambahkan
                    </Button>
                    <Button color="danger" variant="flat" onPress={()=>{hideForm()}}>
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

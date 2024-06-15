import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
            Input, Divider, DatePicker,
                Select, SelectItem, Selection  } from "@nextui-org/react";
import CurrencyFormat from "react-currency-format";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createBASTDocs } from "@/lib/create-docx";
import { displayIDR, createDateString } from "@/lib/functions";
import { emptyOrderedItem, emptyOperator, defaultCentre, weekDays, localizedMonths } from "@/variables-and-constants";
import { Item, OrderedItem, PersonRecipientWItems, IOperator, ICentre } from "@/types";
import { Document, Footer, Header, ImageRun,  Paragraph } from "docx";

type TItemForm = {
    recipient: PersonRecipientWItems,
    show: boolean;
    hideForm: ()=>void;        
}

export const animals = [
    {key: "cat", label: "Cat"},
    {key: "dog", label: "Dog"},
    {key: "elephant", label: "Elephant"},
    {key: "lion", label: "Lion"},
    {key: "tiger", label: "Tiger"},
    {key: "giraffe", label: "Giraffe"},
    {key: "dolphin", label: "Dolphin"},
    {key: "penguin", label: "Penguin"},
    {key: "zebra", label: "Zebra"},
    {key: "shark", label: "Shark"},
    {key: "whale", label: "Whale"},
    {key: "otter", label: "Otter"},
    {key: "crocodile", label: "Crocodile"}
  ];

export const PrintBAST:FC<TItemForm> = ({recipient, show, hideForm }) => {    
    const [ bastNo, setBastNo ] = useState("")
    const [ nominalInWords, setNominalWords ] = useState("")
    const [ picData, setPicData ] = useState("")
    const [ operators, setOperators ] = useState<IOperator[]>([])
    const [ decidingOperator, setDecidingOperator] = React.useState<string>("");
    const [ fieldOperator, setFieldOperator] = React.useState<string>("");
    const [ date, setDate] = useState(createDateString())
    const [ centre, setCentre ] = useState(defaultCentre)

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const getPrintData = async () => {
        const filter = {}
        const projection = {}
        const limit = 0
        const offset = 0                
        try{
            const response = await fetch('/api/RAB/print-data', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          
            const data = await response.json();                        
            const {operators, logo} = data.data                        
            
            setPicData(logo)
            setOperators(operators)
        }catch(err:any){
            console.log('fetch error : ', err)
            
        }
        finally{
        } 
    }

    useEffect(()=>{
        getPrintData()
    }, [])

    function saveDocumentToFile(doc:any, fileName:string) {        
        const mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        Packer.toBlob(doc).then((blob:any) => {
            const docblob = blob.slice(0, blob.size, mimeType);
            saveAs(docblob, fileName);
        });
    }

    const { items } = recipient
    const { price, unit } = items[0]
    const nominal = price * unit

    console.log(date, typeof date)
    type dayType = 0 | 1 | 2 | 3 | 4| 5 | 6
    type localMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

    const currentDate = new Date(date.year + "-" + date.month + "-" + date.day)
    const dayNum = currentDate.getDay() as dayType 
    const monthNum = currentDate.getMonth() + 1 as localMonth   
    console.log(localizedMonths[monthNum])
    const { name, address: { street, kelurahan, kecamatan, kabupaten, postCode } } = centre

    const changeCentre = (e:ChangeEvent<HTMLInputElement>) => {
        const updatedCentre:ICentre = _.cloneDeep(centre)
        const props = e.target.name.split(".")

        const { value } = e.target
        if(props.length === 1){
            updatedCentre.name = value
        }
        if(props.length === 2){
            if(props[0] === "address"){
                switch(props[1]){
                    case "street":
                        updatedCentre.address.street = value
                        break;
                    case "kelurahan":
                        updatedCentre.address.kelurahan = value
                        break;
                    case "kecamatan":
                        updatedCentre.address.kecamatan = value
                        break;
                    case "kabupaten":
                        updatedCentre.address.kabupaten = value
                        break;
                    case "postCode":
                        updatedCentre.address.postCode = value
                        break;
                }
            }            
        }
        setCentre(updatedCentre)
    }
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
                    <span>CETAK BAST UNTUK {recipient.name}</span>
                    <DatePicker label="Tanggal Pelaksanaan" className="max-w-[200px] md:max-w-[284px]" 
                        value={date} 
                        onChange={setDate}
                    />                                                            
                </ModalHeader>
                <ModalBody>
                <div className="w-full">                    
                    <div className="w-full flex flex-wrap mb-2">                                                
                        <Input                                                    
                            label="Sentra"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-3/5"
                            value={name}
                            onChange={changeCentre}
                            name="name"
                        />
                        <Input                                                    
                            label="Kode Pos"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-2/5"
                            value={postCode}
                            onChange={changeCentre}
                            name="address.postCode"
                        />
                        <Input                                                    
                            label="Jalan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full"
                            value={street}
                            onChange={changeCentre}
                            name="address.street"
                        />
                        <Input                                                    
                            label="Kelurahan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={kelurahan}
                            onChange={changeCentre}
                            name="address.kelurahan"
                        />
                        <Input                                                    
                            label="Kecamatan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={kecamatan}
                            onChange={changeCentre}
                            name="address.kecamatan"
                        />
                        <Input                                                    
                            label="Kabupaten"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={kabupaten}
                            onChange={changeCentre}
                            name="address.kabupaten"
                        />
                        <Divider className="my-2"/>
                        <Input
                            placeholder={`Contoh : "591/BAST/4.11/5/2024"`}
                            label="Nomor BAST"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/2"
                            value={bastNo}
                            onChange={(e)=>{setBastNo(e.target.value)}}
                        />                                                
                        <Input
                            label="Nilai Nominal"
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/2"
                            placeholder="Contoh: tiga ratus dua puluh lima ribu rupiah" 
                            description={`Tuliskan nilai nominal dari harga ${displayIDR(nominal)}`}
                            value={nominalInWords}
                            onChange={(e)=>{setNominalWords(e.target.value)}}
                        />                                                                
                        <Select                        
                            label="Pejabat Pembuat Komitmen"
                            variant="bordered"
                            placeholder="Pilih Pejabat"
                            selectedKeys={[decidingOperator]}
                            className="basis-full md:basis-1/2"
                            onChange={(e:ChangeEvent<HTMLSelectElement>)=>{setDecidingOperator(e.target.value)}}
                        >
                            {operators.map((operator) => (
                                <SelectItem key={operator.NIP}>
                                    {operator.name}
                                </SelectItem>
                                ))}
                        </Select>
                        <Select                        
                            label="Petugas yang Menyerahkan"
                            variant="bordered"
                            placeholder="Pilih Petugas"
                            selectedKeys={[fieldOperator]}
                            className="basis-full md:basis-1/2"
                            onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                                setFieldOperator(e.target.value)
                            }}
                        >
                            {([emptyOperator].concat(operators)).map((operator) => (
                                <SelectItem key={operator.NIP}>
                                    {operator.name === ""?"Kosongkan":operator.name}
                                </SelectItem>
                                ))}
                        </Select>
                        <Divider />
                        
                    </div>                    
                    
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"                        
                        startContent={<PrintIcon />}
                        isDisabled={picData === ""}
                        onPress={()=>{
                            const { BASTdoc, attachmentDoc } = createBASTDocs(
                                bastNo === ""?undefined:bastNo,
                                recipient,
                                undefined,
                                nominalInWords === ""?undefined:nominalInWords,
                                "Dodi Rusdi",
                                picData
                            )

                            saveDocumentToFile(BASTdoc, `bast-${recipient.name}.docx`)
                            saveDocumentToFile(attachmentDoc, `lampiran-bast-${recipient.name}.docx`)                                                        
                        }}
                    >
                        Cetak
                    </Button>
                    <Button color="warning" size="sm" onPress={hideForm}>
                        Tutup
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
)}
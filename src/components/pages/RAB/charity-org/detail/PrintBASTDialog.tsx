import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
            Input, Divider, DatePicker,
                Select, SelectItem,   
                Checkbox} from "@nextui-org/react";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createBASTDocs } from "@/lib/create-docx";
import { displayIDR, createDateString, totalPrice } from "@/lib/functions";
import { emptyOperator, defaultCentre } from "@/variables-and-constants";
import { IRABCharityOrg, IOperator, ICentre } from "@/types";

type TItemForm = {
    rab: IRABCharityOrg,
    show: boolean;
    hideForm: ()=>void;        
}

export const PrintBAST:FC<TItemForm> = ({rab, show, hideForm }) => {    
    const [ bastNo, setBastNo ] = useState("")
    const [ nominalInWords, setNominalWords ] = useState({
        nominal:"", display:true
    })
    const [ helpType, setHelpType ] = useState("Alat Bantu")
    const [ picData, setPicData ] = useState("")
    const [ operators, setOperators ] = useState<IOperator[]>([])
    const [ decidingOperatorNip, setDecidingOperator] = useState<string>("");
    const [ fieldOperatorNip, setFieldOperator] = useState<string>("");
    const [ actingRecipient, setActingRecipient ] = useState("")
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
            setDecidingOperator(operators[0].NIP)
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

    const { items, recipient } = rab    
    const total = totalPrice(items)          
    
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
                            isReadOnly
                        />
                        <Input                                                    
                            label="Kode Pos"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-2/5"
                            value={postCode}
                            onChange={changeCentre}
                            name="address.postCode"
                            isReadOnly
                        />
                        <Input                                                    
                            label="Jalan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full"
                            value={street}
                            onChange={changeCentre}
                            name="address.street"
                            isReadOnly
                        />
                        <Input                                                    
                            label="Kelurahan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={kelurahan}
                            onChange={changeCentre}
                            name="address.kelurahan"
                            isReadOnly
                        />
                        <Input                                                    
                            label="Kecamatan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={kecamatan}
                            onChange={changeCentre}
                            name="address.kecamatan"
                            isReadOnly
                        />
                        <Input                                                    
                            label="Kabupaten"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={kabupaten}
                            onChange={changeCentre}
                            name="address.kabupaten"
                            isReadOnly
                        />
                        <Divider className="my-2"/>
                        <Input
                            placeholder={`Contoh : "591/BAST/4.11/5/2024"`}
                            label="Nomor BAST"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={bastNo}
                            onChange={(e)=>{setBastNo(e.target.value)}}
                        />    
                        <Input
                            placeholder={`Contoh : "Sembako dan Alat Kebersihan"`}
                            label="Jenis Bantuan"                        
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            value={helpType}
                            onChange={(e)=>{setHelpType(e.target.value)}}
                        />                                             
                        <Input
                            label="Nilai Nominal"
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            placeholder="Contoh: tiga ratus dua puluh lima ribu rupiah" 
                            description={`Tuliskan nilai nominal dari harga ${displayIDR(total)}`}
                            value={nominalInWords.nominal}
                            onChange={(e)=>{setNominalWords({...nominalInWords, nominal: e.target.value})}}
                            endContent={
                                <Checkbox size="sm" 
                                    isSelected={nominalInWords.display} 
                                    onValueChange={(e)=>{setNominalWords({...nominalInWords, display:e})}}
                                    className="flex flex-col items-center"
                                >
                                    <span className="text-xs text-slate-800">Tampilkan</span>
                                </Checkbox>
                            }
                        />                                                                
                        <Select                        
                            label="Pejabat Pembuat Komitmen"
                            variant="bordered"
                            placeholder="Pilih Pejabat"
                            selectedKeys={[decidingOperatorNip]}
                            className="basis-full md:basis-1/3"
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
                            selectedKeys={[fieldOperatorNip]}
                            className="basis-full md:basis-1/3"
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
                        <Input
                            label="Yang Menerima"
                            variant="bordered"
                            size="sm"
                            className="basis-full md:basis-1/3"
                            placeholder="Contoh: Dodi Rusdi"                             
                            value={actingRecipient}
                            onChange={(e)=>{setActingRecipient(e.target.value)}}
                        />
                        <Divider />
                        
                    </div>                    
                    
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"                        
                        startContent={<PrintIcon />}
                        isDisabled={picData === ""}
                        onPress={()=>{
                            const decidingOperator = operators.find((dOp:IOperator) => dOp.NIP === decidingOperatorNip)
                            const fieldOperator = operators.find((dOp:IOperator) => dOp.NIP === fieldOperatorNip)
                            const { BASTdoc, attachmentDoc } = createBASTDocs(
                                date,
                                bastNo === ""?undefined:bastNo,
                                rab,
                                decidingOperator as IOperator, fieldOperator as IOperator | undefined,
                                centre,
                                helpType, 
                                nominalInWords,
                                actingRecipient,
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
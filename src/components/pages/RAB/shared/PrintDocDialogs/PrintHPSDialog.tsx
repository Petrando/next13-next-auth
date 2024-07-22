import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox} from "@nextui-org/react";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createHpsDoc } from "@/lib/create-docx/hpsDoc";
import { displayIDR, createDateString, totalPrice } from "@/lib/functions";
import { defaultCentre, defaultVendorCentre } from "@/variables-and-constants";
import { IOperator, ICentre, OrderedItem, IVendor } from "@/types";

export type TItemForm = {
    items: OrderedItem[],
    show: boolean;
    hideForm: ()=>void;        
}

export const PrintHPS:FC<TItemForm> = ({items, show, hideForm }) => {
    const [ hpsNo, setHpsNo ] = useState("067/4.11/PL.02.01/HPS/3/2024")
    const [ hpsDate, setHpsDate ] = useState(createDateString())
    const [ purpose, setPurpose ] = useState("Bantuan Atensi Alat Bantu di Kota Tangerang Sentra Mulya Jaya")
    const [ picData, setPicData ] = useState("")

    const [ centreName, setCentreName ] = useState(defaultCentre.name)
    const [ vendorName, setVendorName ] = useState(defaultVendorCentre.name)

    const [ operators, setOperators ] = useState<IOperator[]>([])
    const [ decidingOperatorNip, setDecidingOperator] = useState<string>("");                    
        
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const getPrintData = async () => {
        const filter = {}
        const projection = {}
        const limit = 0
        const offset = 0                
        try{
            const response = await fetch('/api/RAB/print-data', {
                method: 'POST',
                body: JSON.stringify({ filter, projection, limit, offset, logo: "KemensosLogo.png" }),
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

    const centres = [ defaultCentre ]
    const vendors = [ defaultVendorCentre ]

    useEffect(()=>{
        setCentreName(centres[0].name)
    }, [centres])

    useEffect(()=>{
        setVendorName(vendors[0].name)
    }, [ vendors ])

    const centre = centres.find((v:ICentre) => v.name === centreName)    
    const vendor = vendors.find((v:IVendor) => v.name === vendorName) || { name: "vendor", owner: { name: "" } }    

    function saveDocumentToFile(doc:any, fileName:string) {        
        const mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        Packer.toBlob(doc).then((blob:any) => {
            const docblob = blob.slice(0, blob.size, mimeType);
            saveAs(docblob, fileName);
        });
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
                    <span>Harga Perkiraan Sendiri/Owner Estimation</span>
                    <div className="flex">
                                               
                    </div>                                        
                </ModalHeader>
                <ModalBody>
                    <div className="w-full">                    
                        <div className="w-full flex flex-wrap mb-2">
                            <Input
                                placeholder={``}
                                label="No. HPS"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-2/3"
                                value={hpsNo}                                    
                                onChange={(e)=>{setHpsNo(e.target.value)}}                                
                            />                            
                            <DatePicker label="Tanggal" className="basis-full md:basis-1/3" 
                                value={hpsDate} 
                                onChange={setHpsDate}
                            />               
                            <Select                        
                                label="Sentra"
                                variant="bordered"
                                placeholder="Pilih Sentra"
                                selectedKeys={[centreName]}
                                className="basis-full md:basis-1/2"
                                onChange={
                                    (e:ChangeEvent<HTMLSelectElement>)=>{
                                        setCentreName(e.target.value)
                                }}
                            >
                                {centres.map((c) => (
                                    <SelectItem key={c.name}>
                                        {c.name}
                                    </SelectItem>
                                    ))}
                            </Select>
                            {/*<Select                        
                                label="Vendor"
                                variant="bordered"
                                placeholder="Pilih Vendor"
                                selectedKeys={[vendorName]}
                                className="basis-full md:basis-1/2"
                                onChange={
                                    (e:ChangeEvent<HTMLSelectElement>)=>{
                                        setVendorName(e.target.value)
                                }}
                            >
                                {vendors.map((c) => (
                                    <SelectItem key={c.name}>
                                        {c.name}
                                    </SelectItem>
                                    ))}
                            </Select> */}                       
                                                                                                                    
                            <Select                        
                                label="Pejabat Pembuat Komitmen"
                                variant="bordered"
                                placeholder="Pilih Pejabat"
                                selectedKeys={[decidingOperatorNip]}
                                className="basis-full md:basis-1/2"
                                onChange={
                                    (e:ChangeEvent<HTMLSelectElement>)=>{
                                        setDecidingOperator(e.target.value)
                                }}
                            >
                                {operators.map((operator) => (
                                    <SelectItem key={operator.NIP}>
                                        {operator.name}
                                    </SelectItem>
                                    ))}
                            </Select>
                            {/*<Input
                                label="Owner Vendor"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-1/2"
                                value={vendor.owner.name}
                                isDisabled
                            />*/}
                            <Divider className="my-2" />
                                <Input
                                    placeholder={``}
                                    label="Tujuan"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full"
                                    value={purpose}                                    
                                    onChange={(e)=>{setPurpose(e.target.value)}}                                    
                                />                                  
                        </div>                                        
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"                        
                        startContent={<PrintIcon />}
                        isDisabled={picData === ""}
                        onPress={()=>{
                            const decidingOperator = operators.find((dOp:IOperator) => dOp.NIP === decidingOperatorNip)
                            const { doc } = createHpsDoc(
                                {
                                    hpsNo, date: hpsDate,
                                    
                                },
                                centre as ICentre, decidingOperator as IOperator,
                                vendor as IVendor, purpose,
                                picData
                            )                         

                            saveDocumentToFile(doc, `hps-${purpose}.docx`)
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
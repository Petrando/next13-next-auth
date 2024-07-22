import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox} from "@nextui-org/react";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createPaymentReqDoc } from "@/lib/create-docx/paymentReqDoc"
import { displayIDR, createDateString, totalPrice } from "@/lib/functions";
import { defaultCentre, defaultVendorCentre } from "@/variables-and-constants";
import { IOperator, ICentre, OrderedItem, IVendor } from "@/types";

export type TItemForm = {
    items: OrderedItem[],
    show: boolean;
    hideForm: ()=>void;        
}

export const PrintPaymentReq:FC<TItemForm> = ({items, show, hideForm }) => {
    const [ receiptNum, setReceiptNum ] = useState("058/MMN/RK/03/2024")
    const [ receiptDate, setReceiptDate ] = useState(createDateString())    
    const [ spkNum, setSpkNum ] = useState("080/4.11/PL.01.02/SPK/3/2024")
    const [ spkDate, setSpkDate ] = useState(createDateString())
    const [ payment, setPayment ] = useState({
        value: 147370000, inWords: "Seratus Empat Puluh Tujuh Juta Tiga Ratus Tujuh Puluh Ribu Rupiah"
    })
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
                body: JSON.stringify({ filter, projection, limit, offset, logo: "MMN.jpg" }),
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
                    <span>Permohonan Pembayaran</span>
                    <div className="flex">
                                               
                    </div>                                        
                </ModalHeader>
                <ModalBody>
                    <div className="w-full">                    
                        <div className="w-full flex flex-wrap mb-2">
                            <Input
                                placeholder={``}
                                label="No. Kuitansi"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-2/3"
                                value={receiptNum}                                    
                                onChange={(e)=>{setReceiptNum(e.target.value)}}                                
                            />                            
                            <DatePicker label="Tanggal" className="basis-full md:basis-1/3" 
                                value={receiptDate} 
                                onChange={setReceiptDate}
                            />                                  
                            <Input
                                placeholder={``}
                                label="No. SPK"                        
                                variant="bordered"
                                size="sm"
                                className="basis-full md:basis-2/3"
                                value={spkNum}                                    
                                onChange={(e)=>{setSpkNum(e.target.value)}}                                
                            />
                            <DatePicker label="Tanggal SPK" className="basis-full md:basis-1/3" 
                                value={receiptDate} 
                                onChange={setSpkDate}
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
                            <Select                        
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
                            </Select>                        
                            <Divider className="my-2"/>                                                                                        
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
                                <Input
                                    label="Owner Vendor"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={vendor.owner.name}
                                    isDisabled
                                />
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
                                <Input
                                    placeholder={``}
                                    label="Nilai"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={payment.value.toString()}                                    
                                    onChange={(e)=>{setPayment({...payment, value: parseInt(e.target.value)})}}
                                    description={displayIDR(payment.value)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Nilai Kontrak"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={payment.inWords}                                    
                                    onChange={(e)=>{setPayment({...payment, inWords: e.target.value})}}
                                    description={`Nilai dari angka ${displayIDR(payment.value)}`}
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

                            const {doc} = createPaymentReqDoc(
                                {
                                    receiptNum, date: receiptDate
                                },
                                {
                                    spkNum, date: spkDate
                                },                               
                                centre?centre:defaultCentre, decidingOperator as IOperator,                              
                                vendor as IVendor,                            
                                payment, purpose,   
                                picData
                            )                            

                            saveDocumentToFile(doc, `permohonan-bayar-${vendor.name}.docx`)
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
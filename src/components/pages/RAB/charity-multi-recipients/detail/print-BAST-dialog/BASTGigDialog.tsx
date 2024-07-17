import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox} from "@nextui-org/react";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createGigBASTDoc } from "@/lib/create-docx/BAST/gigBAST";
import { displayIDR, createDateString, totalPrice } from "@/lib/functions";
import { defaultCentre, defaultVendorCentre } from "@/variables-and-constants";
import { IOperator, ICentre, OrderedItem, IVendor } from "@/types";

export type TItemForm = {
    items: OrderedItem[],
    show: boolean;
    hideForm: ()=>void;        
}

export const PrintBAST:FC<TItemForm> = ({items, show, hideForm }) => {    
    const [ bastNo, setBastNo ] = useState("090/4.11/PL.01.02/BAST/3/2024")
    const [ spkNo, setSpkNo ] = useState("080/4.11/PL.01.02/SPK/3/2024")

    const [ nominalInWords, setNominalWords ] = useState({
        nominal:"", display:true
    })
    const [ helpType, setHelpType ] = useState("Alat Bantu")
    const [ picData, setPicData ] = useState("")

    const [ centreName, setCentreName ] = useState(defaultCentre.name)
    const [ vendorName, setVendorName ] = useState(defaultVendorCentre.name)

    const [ operators, setOperators ] = useState<IOperator[]>([])
    const [ decidingOperatorNip, setDecidingOperator] = useState<string>("");
    const [ fieldOperatorNip, setFieldOperator] = useState<string>("");

    const [ startDate, setStartDate] = useState(createDateString())
    const [ endDate, setEndDate] = useState(createDateString())

    const [ gig, setGig ] = useState("Bantuan Atensi Alat Bantu Di Kota Tangerang")
    const [ location, setLocation ] = useState("Dinas Sosial Kota Tangerang")
    
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
    
    const total = totalPrice(items)     

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
                    <span>BAST Pekerjaan</span>
                    <div className="flex">
                        <DatePicker label="Dari" className="max-w-[150px] md:max-w-[234px]" 
                            value={startDate} 
                            onChange={setStartDate}
                        />    
                        <DatePicker label="Sampai" className="max-w-[150px] md:max-w-[234px]" 
                            value={endDate} 
                            onChange={setEndDate}
                        />                    
                    </div>                                        
                </ModalHeader>
                <ModalBody>
                    <div className="w-full">                    
                        <div className="w-full flex flex-wrap mb-2">                                                
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
                                    label="Pekerjaaan"
                                    placeholder="Bantuan Atensi Alat Bantu Di Kota Tangerang"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={gig}
                                    onChange={(e)=>{setGig(e.target.value)}}
                                />
                                <Input
                                    label="Lokasi"
                                    placeholder="Dinas Sosial Kota Tangerang"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={location}
                                    onChange={(e)=>{setLocation(e.target.value)}}
                                />
                            <Divider className="my-2" />
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
                                    placeholder={`Contoh : "080/4.11/PL.01.02/SPK/3/2024"`}
                                    label="Nomor SPK"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={spkNo}
                                    onChange={(e)=>{setSpkNo(e.target.value)}}
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
                            
                        </div>                                        
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"                        
                        startContent={<PrintIcon />}
                        isDisabled={picData === ""}
                        onPress={()=>{
                            const decidingOperator = operators.find((dOp:IOperator) => dOp.NIP === decidingOperatorNip)

                            const {doc} = createGigBASTDoc(
                                startDate, endDate,
                                centre?centre:defaultCentre, 
                                decidingOperator as IOperator,
                                gig, location,
                                vendor as IVendor,
                                bastNo, spkNo,
                                nominalInWords,
                                total,
                                picData
                            )
                            
                            saveDocumentToFile(doc, `bast-${vendor.name}.docx`)
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
import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox} from "@nextui-org/react";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createBAPDoc } from "@/lib/create-docx/BAPDoc";
import { displayIDR, createDateString, totalPrice } from "@/lib/functions";
import { defaultCentre, defaultVendorCentre } from "@/variables-and-constants";
import { IOperator, ICentre, OrderedItem, IVendor } from "@/types";

export type TItemForm = {
    items: OrderedItem[],
    show: boolean;
    hideForm: ()=>void;        
}

export const PrintBAP:FC<TItemForm> = ({items, show, hideForm }) => {
    const [ bapDate, setBapDate ] = useState(createDateString())    
    const [ bapNo, setBapNo ] = useState("091/4.11/PL.01.02/BAP/3/2024")
    const [ dipaNo, setDipaNo ] = useState("SP DIPA- 027.04.2.690564/2024 ")
    const [ dipaDate, setDipaDate] = useState(createDateString())
    const [ spkNo, setSpkNo ] = useState("080/4.11/PL.01.02/SPK/3/2024")
       
    const [ picData, setPicData ] = useState("")

    const [ centreName, setCentreName ] = useState(defaultCentre.name)
    const [ vendorName, setVendorName ] = useState(defaultVendorCentre.name)

    const [ operators, setOperators ] = useState<IOperator[]>([])
    const [ decidingOperatorNip, setDecidingOperator] = useState<string>("");            

    const [ gig, setGig ] = useState("Pengadaan Bantuan Atensi Alat Bantu Di Kota Tangerang Tahun Anggaran 2024")
    const [ program, setProgram ] = useState("Perlindungan Sosial")
    const [ satKer, setSatKer ] = useState("Sentra Mulya Jaya Jakarta")
    const [ instansi, setInstansi ] = useState("Kementerian Sosial RI")

    const [ contractValue, setContractValue ] = useState({
        value: 147370000, inWords: "Seratus Empat Puluh Tujuh Juta Tiga Ratus Tujuh Puluh Ribu Rupiah"
    })//nilai kontrak
    const [ paymentUntilNow, setPaymentUntilNow ] = useState(147370000)//Pembayaran s/d BAP ini
    const [ valueUntilLastGig, setValueUntilLastGig ] = useState(0) //Nilai Pekerjaan s/d BAP yang lalu
    const [ currentPayment, setCurrentPayment ] = useState(147370000) //Pembayaran BAP ini
    const [ discounts, setDiscounts ] = useState({ // Potongan Pembayaran
        retention: 0, // Uang Jaminan
        refund: 0 // Pengembalian Uang Muka
    })
    const [ currentNetPayment, setCurrentNetPayment ] = useState(124562568) // Pembayaran Fisik BAP ini
    const [ taxes, setTaxes ] = useState(13910541) // PPN 11%

    const [ vendorBank, setVendorBank ] = useState("Bank Mandiri")
    const [ vendorAccNum, setAccNum ] = useState("1220012237791")

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
                    <span>BAP Alat Bantu</span>
                    <div className="flex">
                        <DatePicker label="Tanggal BAP" className="basis-full md:basis-1/2" 
                            value={bapDate} 
                            onChange={setBapDate}
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
                                    placeholder={`Contoh : "080/4.11/PL.01.02/SPK/3/2024"`}
                                    label="Nomor BAP"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={bapNo}
                                    onChange={(e)=>{setBapNo(e.target.value)}}
                                />
                                <Input
                                    placeholder={`Contoh : "080/4.11/PL.01.02/SPK/3/2024"`}
                                    label="Nomor SPK"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={spkNo}
                                    onChange={(e)=>{setSpkNo(e.target.value)}}
                                />
                                <Input
                                    placeholder={`Contoh : "591/BAST/4.11/5/2024"`}
                                    label="No DIPA"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={dipaNo}
                                    onChange={(e)=>{setDipaNo(e.target.value)}}
                                />
                                <DatePicker label="Tanggal DIPA" className="basis-full md:basis-1/2" 
                                    value={dipaDate} 
                                    onChange={setDipaDate}
                                />                                    
                            <Divider className="my-2" />                                             
                                <Input
                                    placeholder={``}
                                    label="Program"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={program}
                                    onChange={(e)=>{setProgram(e.target.value)}}
                                />
                                <Input
                                    placeholder={``}
                                    label="Unit Kerja"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={satKer}
                                    onChange={(e)=>{setSatKer(e.target.value)}}
                                />
                                <Input
                                    placeholder={``}
                                    label="Instansi"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={instansi}
                                    onChange={(e)=>{setInstansi(e.target.value)}}
                                />
                            <Divider className="my-2" />
                                <Input
                                    placeholder={``}
                                    label="Nilai Kontrak"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={contractValue.value.toString()}                                    
                                    onChange={(e)=>{setContractValue({...contractValue, value: parseInt(e.target.value)})}}
                                    description={displayIDR(contractValue.value)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Nilai Kontrak"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/2"
                                    value={contractValue.inWords}                                    
                                    onChange={(e)=>{setContractValue({...contractValue, inWords: e.target.value})}}
                                    description={`Nilai dari angka ${displayIDR(contractValue.value)}`}
                                />
                                <Input
                                    placeholder={``}
                                    label="Pembayaran s/d BAP ini"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={paymentUntilNow.toString()}                                    
                                    onChange={(e)=>{setPaymentUntilNow(parseInt(e.target.value))}}
                                    description={displayIDR(paymentUntilNow)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Nilai s/d BAP yg lalu"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={valueUntilLastGig.toString()}
                                    onChange={(e)=>{setValueUntilLastGig(parseInt(e.target.value))}}
                                    description={displayIDR(valueUntilLastGig)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Pembayaran BAP ini"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={currentPayment.toString()}
                                    onChange={(e)=>{setCurrentPayment(parseInt(e.target.value))}}
                                    description={displayIDR(currentPayment)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Rentensi"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={discounts.retention.toString()}                                    
                                    onChange={(e)=>{setDiscounts({...discounts, retention: parseInt(e.target.value)})}}
                                    description={displayIDR(discounts.retention)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Pengembalian Uang Muka"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={discounts.refund.toString()}                                    
                                    onChange={(e)=>{setDiscounts({...discounts, refund: parseInt(e.target.value)})}}
                                    description={displayIDR(discounts.refund)}
                                />
                                <Input
                                    placeholder={``}
                                    label="Pembayaran Fisik BAP ini"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={currentNetPayment.toString()}
                                    onChange={(e)=>{setCurrentNetPayment(parseInt(e.target.value))}}
                                    description={displayIDR(currentNetPayment)}
                                />
                                <Input
                                    placeholder={``}
                                    label="PPN 11%"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={taxes.toString()}
                                    onChange={(e)=>{setTaxes(parseInt(e.target.value))}}
                                    description={displayIDR(taxes)}
                                />
                                <Input                                    
                                    label="Bank Vendor"
                                    placeholder="Bank Mandiri"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={ vendorBank }
                                    onChange={(e)=>{setVendorBank(vendorBank)}}
                                />
                                <Input
                                    placeholder={``}
                                    label="No Rekening"                        
                                    variant="bordered"
                                    size="sm"
                                    className="basis-full md:basis-1/3"
                                    value={vendorAccNum}
                                    onChange={(e)=>{setAccNum(vendorAccNum)}}                                    
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

                            const { doc } = createBAPDoc(
                                { bapDate, bapNo},
                                centre as ICentre, decidingOperator as IOperator,
                                vendor as IVendor,
                                {
                                    dipaNo, dipaDate
                                },
                                spkNo,
                                {
                                    contractValue,
                                    paymentUntilNow, valueUntilLastGig, currentPayment, discounts,
                                    currentNetPayment, taxes
                                },
                                {
                                    gig, program, satKer, instansi
                                },
                                {
                                    bank: vendorBank, accNum: vendorAccNum
                                },
                                picData                                
                            )

                            saveDocumentToFile(doc, `bap-${vendor.name}.docx`)
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
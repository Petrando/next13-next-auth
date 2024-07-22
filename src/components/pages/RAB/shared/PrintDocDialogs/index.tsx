import { FC, useState } from "react"
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox
    } from "@nextui-org/react";
import { PrintIcon } from "@/components/Icon";
import { PrintBAP } from "./BAPDialog";
import { PrintReceipt } from "./ReceiptDialog";
import { PrintPaymentReq } from "./PaymentReqDialog";
import { PrintHPS } from "./PrintHPSDialog";
import { IRABMultiPerson, IRABCharityOrg, PersonRecipientWItems } from "@/types"

type TPrintDocs = {    
    RAB: IRABMultiPerson | IRABCharityOrg;
    show: boolean;
    hideForm: ()=>void;
}

export const PrintDocs:FC<TPrintDocs> = ({ RAB, show, hideForm }) => {
    const [ printDoc, setPrintDoc ] = useState("")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const items = RAB.category === "charity-multi-recipients"?
        RAB.recipients.map((d:PersonRecipientWItems) => d.items).flat():
            RAB.items

    return (
        <>
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
                    <span>Cetak Dokumen</span>                                                                                    
                </ModalHeader>
                <ModalBody className="flex flex-row justify-center flex-wrap">
                    <Button className="basis-full md:basis-1/4" size="md" color="primary"
                        onPress={()=>{setPrintDoc("BAP")}}
                    >
                        BAP
                    </Button>
                    <Button className="basis-full md:basis-1/4" size="md" color="primary"
                        onPress={()=>{setPrintDoc("HPS")}}
                    >
                        HPS
                    </Button>
                    <Button className="basis-full md:basis-1/4" size="md" color="primary"
                        onPress={()=>{setPrintDoc("paymentReq")}}
                    >
                        Permohonan Pembayaran
                    </Button>
                    <Button className="basis-full md:basis-1/4" size="md" color="primary"
                        onPress={()=>{setPrintDoc("receipt")}}
                    >
                        Kwitansi
                    </Button>
                    <Button className="basis-full md:basis-1/4" size="md">
                        SPH
                    </Button>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" size="md" onPress={hideForm}>
                        Selesai
                    </Button>
                </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>
        {
            printDoc === "BAP" &&
            <PrintBAP items={items} show={printDoc === "BAP"} hideForm={()=>{setPrintDoc("")}} />
        }
        {
            printDoc === "receipt" &&
            <PrintReceipt items={items} show={printDoc === "receipt"} hideForm={()=>{setPrintDoc("")}} />
        }
        {
            printDoc === "paymentReq" &&
            <PrintPaymentReq items={items} show={printDoc === "paymentReq"} hideForm={()=>{setPrintDoc("")}} />
        }
        {
            printDoc === "HPS" &&
            <PrintHPS items={items} show={printDoc === "HPS"} hideForm={()=>{setPrintDoc("")}} />
        }
        </>
    )
}
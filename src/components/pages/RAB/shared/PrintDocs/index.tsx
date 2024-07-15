import { FC, useState } from "react"
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
        Input, Divider, DatePicker, Select, SelectItem, Checkbox
    } from "@nextui-org/react";

type TPrintDocs = {    
    show: boolean;
    hideForm: ()=>void;
}

export const PrintDocs:FC<TPrintDocs> = ({  show, hideForm }) => {
    const [ printDoc, setPrintDoc ] = useState("")
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
                    <span>Cetak Dokumen</span>                                                                                    
                </ModalHeader>
                <ModalBody>

                </ModalBody>
                <ModalFooter>

                </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>
    )
}
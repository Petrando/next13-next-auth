import React, { useEffect, useState, FC } from "react";
import _ from "lodash";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,  
            Input, Divider,  } from "@nextui-org/react";
import CurrencyFormat from "react-currency-format";
import { saveAs } from "file-saver";
import { Packer } from 'docx';
import { PrintIcon } from "@/components/Icon";
import { createBASTDocs } from "@/lib/create-docx";
import { emptyOrderedItem } from "@/variables-and-constants";
import { Item, OrderedItem, PersonRecipientWItems } from "@/types";

type TItemForm = {
    recipient: PersonRecipientWItems,
    show: boolean;
    hideForm: ()=>void;        
}

export const PrintBAST:FC<TItemForm> = ({recipient, show, hideForm }) => {    
    const [ bastNo, setBastNo ] = useState("")
    const [ nominalInWords, setNominalWords ] = useState("")

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
                    CETAK BAST                                                            
                </ModalHeader>
                <ModalBody>
                <div className="w-full">                    
                    <div className="w-full flex flex-wrap mb-2">                        
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
                            description={"Tuliskan nilai nominal dari angka total dibawah"}
                            value={nominalInWords}
                            onChange={(e)=>{setNominalWords(e.target.value)}}
                        />                                                                
                        
                    </div>
                    <CurrencyFormat value={nominal} thousandSeparator="." decimalSeparator="," prefix="Total pembelian Rp." 
                        className="w-full text-right"
                    />
                    
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"                        
                        startContent={<PrintIcon />}
                        onPress={()=>{
                            const { BASTdoc, attachmentDoc } = createBASTDocs(
                                bastNo === ""?undefined:bastNo,
                                recipient,
                                undefined,
                                nominalInWords === ""?undefined:nominalInWords
                            )

                            saveDocumentToFile(BASTdoc, "bast.docx")
                            saveDocumentToFile(attachmentDoc, "attachBAST.docx")
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
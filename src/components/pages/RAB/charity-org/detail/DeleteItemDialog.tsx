import { FC,  } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, useDisclosure } from "@nextui-org/react"
import { displayIDR } from "@/lib/functions";
import { OrderedItem } from "@/types";

type IDeleteForm = {
    show: boolean;
    item: OrderedItem;
    hideForm: () => void;
    submit: ()=>void;
    fetchState: string;
}

export const DeleteItemForm:FC<IDeleteForm> = ({ show, item, hideForm, submit, fetchState }) => {    
    const { name, productName, category, subCategory, subSubCategory, amount, unit, price } = item
    
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    console.log(fetchState)
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
                    Hapus {name} dari RAB?                                                            
                </ModalHeader>
                <ModalBody>
                <div className="w-full">                    
                    <div className="w-full flex flex-wrap">                        
                        <Input
                            isReadOnly={true}
                            label="Nama Barang"                        
                            variant="bordered"
                            size="sm"
                            className={"basis-full md:basis-1/4"}
                            value={name}
                        />
                        <Input
                            isReadOnly={true}
                            label="Spesifikasi"                        
                            variant="bordered"
                            size="sm"
                            className={"basis-full md:basis-1/4"}
                            value={productName}                            
                        />                                               
                        <Input
                            label="Jumlah"
                            variant="bordered"
                            size="sm"
                            className="basis-1/5 md:basis-1/12" 
                            value={amount.toString()}
                            type="number"   
                        />
                        <Input                            
                            isReadOnly
                            label="Satuan"
                            variant="bordered"
                            size="sm"
                            className="basis-2/5 md:basis-2/12" 
                            value={unit}    
                        />                                        
                        <Input
                            isReadOnly
                            label={`Harga per ${unit}`}
                            variant="bordered"
                            size="sm"
                            className="basis-2/5 md:basis-3/12" 
                            value={displayIDR(price)}                                
                        />
                        
                    </div>
                    <div className="w-full flex flex-wrap mb-2">
                        <div className="basis-3/5 md:basis-9/12 flex">
                            <Input
                                isReadOnly
                                label="Kategori"
                                variant="bordered"
                                size="sm"
                                className="basis-1/2" 
                                value={category}                                    
                            />
                            <Input
                                isReadOnly
                                label="Sub Kategori"
                                variant="bordered"
                                size="sm"
                                className="basis-1/2" 
                                value={subCategory}                                    
                            />
                        </div>
                        <Input
                            isReadOnly
                            label="Total Harga"
                            variant="bordered"
                            size="sm"
                            className="basis-2/5 md:basis-3/12 font-semibold" 
                            value={displayIDR(price * amount)}                                
                        />
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`warning`} size="sm"
                        isDisabled={fetchState === "loading"}
                        onPress={submit}
                    >
                        Hapus
                    </Button>
                    <Button color="danger" size="sm" onPress={hideForm}
                        isDisabled={fetchState === "loading"}
                    >
                        Batal
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    )
}
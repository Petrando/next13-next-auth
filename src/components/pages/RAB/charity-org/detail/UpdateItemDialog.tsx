import { FC, useState, useEffect } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, useDisclosure } from "@nextui-org/react"
import { displayIDR } from "@/lib/functions";
import { OrderedItem } from "@/types";
import CurrencyFormat from "react-currency-format";

type IUpdateForm = {
    show: boolean;
    item: OrderedItem;
    hideForm: () => void;
    submit: (newAmount:number)=>void;
    fetchState: string;
}

export const UpdateItemForm:FC<IUpdateForm> = ({ show, item, hideForm, submit, fetchState }) => {
    const [ newAmount, setAmount ] = useState(0)
    const { name, productName, category, subCategory, subSubCategory, amount, unit, price } = item

    const initAmt = () => {setAmount(amount)}
    useEffect(()=>{
        initAmt()
    }, [])
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
                    Merubah jumlah {name}                                                            
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
                            value={newAmount.toString()}
                            type="number"
                            onChange={(e)=>{setAmount(parseInt(e.target.value))}}    
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
                            value={displayIDR(price * newAmount)}                                
                        />
                    </div>
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button color={`primary`} size="sm"
                        isDisabled={newAmount <= 0}
                        onPress={()=>{
                            if(newAmount === amount){
                                hideForm()
                            }else{
                                submit(newAmount)
                            }                            
                        }}
                    >
                        Update
                    </Button>
                    <Button color="danger" size="sm" onPress={hideForm}>
                        Batal
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    )
}
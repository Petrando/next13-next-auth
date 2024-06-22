import { FC } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import CurrencyFormat from 'react-currency-format';
import { EditBtn, DeleteBtn } from "@/components/shared/Buttons";
import { PlusIcon } from "@/components/Icon";
import { OrderedItem } from "@/types";

type ITableItem = {
    item: OrderedItem | undefined;    
    editPress?: () => void;
    deletePress?: () => void;
    isDisabled?: boolean;
}

export const TableItem:FC<ITableItem> = ({ item, editPress = ()=>{}, deletePress = ()=>{}, isDisabled = false }) => {
    if(!item){
        return (
            <motion.span
                className={`${item?"pointer-events-none":"pointer-events-auto"}`}
                initial={{ opacity:0}}
                animate={{ opacity: 1}}
                transition={{duration:1}}                
            >
                <Button color="primary" size="sm" 
                    onPress={editPress}
                    startContent={<PlusIcon  className="size-4"/>}
                    isDisabled
                >
                    Barang
                </Button>
            </motion.span>
        )
    }

    return (
        <motion.span
            className={`${!item?"pointer-events-none":"pointer-events-auto"}`}
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{duration:1}}
        >
            <Card>
                <CardHeader>
                    <p className="text-sm">
                        {item.name}
                    </p>                                                        
                </CardHeader>
                <Divider />
                <CardBody>
                    <CurrencyFormat value={item.price} prefix="Rp. " thousandSeparator="," 
                        className="text-right w-fit"
                    />    
                </CardBody>
                {
                    !isDisabled &&
                    <>
                        <Divider />
                        <CardFooter className="flex items-center justify-end">
                            <EditBtn label="Ganti" onPress={editPress} isDisabled={isDisabled} />
                            <DeleteBtn onPress={deletePress} isDisabled={isDisabled} />
                        </CardFooter>
                    </>
                }                        
                
            </Card>
        </motion.span>
    )
}


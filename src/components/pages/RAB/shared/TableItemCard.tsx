import { FC } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { EditBtn, DeleteBtn } from "@/components/shared/Buttons";
import { PlusIcon } from "@/components/Icon";
import { OrderedItem } from "@/types";

type ITableItem = {
    item: OrderedItem | undefined;    
    editPress: () => void;
    deletePress: () => void;
}

export const TableItem:FC<ITableItem> = ({ item, editPress, deletePress }) => {
    if(!item){
        return (
            <motion.span
                initial={{y:-20, opacity:0}}
                animate={{y:0, opacity: 1}}
                transition={{duration:1}}
            >
                <Button color="primary" size="sm" 
                    onPress={editPress}
                    startContent={<PlusIcon  className="size-4"/>}
                >
                    Barang
                </Button>
            </motion.span>
        )
    }

    return (
        <motion.span
            initial={{y:80, opacity: 0}}
            animate={{y:0, opacity: 1}}
            transition={{duration:1}}
        >
            <Card>
                <CardHeader>
                    <p className="text-sm">
                        {item.name}
                    </p>                                                        
                </CardHeader>                        
                <Divider />
                <CardFooter>
                    <EditBtn label="Ganti" onPress={editPress} />
                    <DeleteBtn onPress={deletePress} />
                </CardFooter>
            </Card>
        </motion.span>
    )
}


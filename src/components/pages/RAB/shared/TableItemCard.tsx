import { FC } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { EditButton, DeleteButton } from "@/components/shared/Buttons";
import { OrderedItem } from "@/types";

type ITableItem = {
    item: OrderedItem | undefined;
    startEdit: () => void;
    editPress: () => void;
    deletePress: () => void;
}

export const TableItem:FC<ITableItem> = ({ item, startEdit, editPress, deletePress }) => {
    if(!item){
        return (
            <Button color="primary" size="sm" 
                onPress={startEdit}>
                <span className="font-semibold">+</span> Barang
            </Button>
        )
    }

    return (
        <Card>
            <CardHeader>
                <p className="text-sm">
                    {item.name}
                </p>                                                        
            </CardHeader>                        
            <Divider />
            <CardFooter>
                <EditButton label="Ganti" onPress={editPress} />
                <DeleteButton onPress={deletePress} />
            </CardFooter>
        </Card>
    )
}


import { FC } from "react"
import { Button } from "@nextui-org/react";
import { EditIcon, DeleteIcon } from "../Icon";

type IButton = {
    onPress:() => void;
    label?:string;
}

export const EditButton:FC<IButton> = ({onPress = () => {}, label = "Ubah"}) => {
    return (
        <Button color="secondary" size="sm" onPress={onPress} isIconOnly>
            <EditIcon />            
        </Button>
    )
}

export const DeleteButton:FC<IButton> = ({onPress = () => {}, label = "Hapus"}) => {
    return (
        <Button color="danger" size="sm" onPress={onPress} isIconOnly>
            <DeleteIcon />            
        </Button>
    )
}
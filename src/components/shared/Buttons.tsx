import { FC } from "react"
import { Button } from "@nextui-org/react";
import { EditIcon, DeleteIcon } from "../Icon";

type IButton = {
    onPress:() => void;
    label?:string;
}

export const EditBtn:FC<IButton> = ({onPress = () => {}, label = "Ubah"}) => {
    return (
        <Button color="secondary" size="sm" onPress={onPress} isIconOnly>
            <EditIcon className="size-4" />            
        </Button>
    )
}

export const DeleteBtn:FC<IButton> = ({onPress = () => {}, label = "Hapus"}) => {
    return (
        <Button color="danger" size="sm" onPress={onPress} isIconOnly>
            <DeleteIcon className="size-4" />            
        </Button>
    )
}
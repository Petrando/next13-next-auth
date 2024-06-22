import { FC } from "react"
import { Button } from "@nextui-org/react";
import { EditIcon, DeleteIcon } from "../Icon";

type IButton = {
    onPress:() => void;
    label?:string;
    isDisabled?: boolean;
}

export const EditBtn:FC<IButton> = ({onPress = () => {}, label = "Ubah", isDisabled = false}) => {
    return (
        <Button color="secondary" size="sm" onPress={onPress} isIconOnly isDisabled={isDisabled}>
            <EditIcon className="size-4" />            
        </Button>
    )
}

export const DeleteBtn:FC<IButton> = ({onPress = () => {}, label = "Hapus",  isDisabled = false}) => {
    return (
        <Button color="danger" size="sm" onPress={onPress} isIconOnly isDisabled={isDisabled}>
            <DeleteIcon className="size-4" />            
        </Button>
    )
}
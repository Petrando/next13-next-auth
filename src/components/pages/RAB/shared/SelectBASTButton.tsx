import { FC } from "react"
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { PrintIcon } from "@/components/Icon"

type TSelectBAST = {
    selectReceive: () => void;//BAST Penerima
    selectDeliver: () => void;//BAST Pekerjaan
}

export const SelectBAST:FC<TSelectBAST> = ({ selectReceive, selectDeliver }) => {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button                     
                    className="capitalize"
                    startContent={<PrintIcon />}
                    color="primary"
                    size="sm"
                >
                    BAST
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Dropdown Variants"
                color="primary" 
                variant="solid"
            >
                <DropdownItem key="multi-recipients">
                    <Button onPress={selectReceive} size="sm" color="primary" className="w-full">
                        Penerima
                    </Button>
                </DropdownItem>
                <DropdownItem key="charity-org">
                    <Button onPress={selectDeliver} size="sm" color="primary" className="w-full">
                        Pekerjaan
                    </Button>
                </DropdownItem>                            
            </DropdownMenu>
        </Dropdown>
    )
}
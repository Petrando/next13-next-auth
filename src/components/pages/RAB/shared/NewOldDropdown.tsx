import { FC } from "react"
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Selection } from "@nextui-org/react"
import { CogIcon } from "@/components/Icon"

type IDropDown = {
    recipientOption: Set<string>;
    onChange: (keys: Selection) => void;
    size?: "md" | "sm" | "lg";
}

export const NewOldDropDown:FC<IDropDown> = ({ recipientOption, onChange, size = "md"}) => {
    return (
        <Dropdown className="w-fit" size={size}>
            <DropdownTrigger>
                <Button 
                    variant="bordered" 
                    startContent={<CogIcon className={size === "sm"?"size-4":"size-6"} />}                                
                >
                    Opsi
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={recipientOption}
                onSelectionChange={onChange}
            >
                <DropdownItem key="new">Baru</DropdownItem>
                <DropdownItem key="old">Terdaftar</DropdownItem>                            
            </DropdownMenu>
        </Dropdown>
    )
}
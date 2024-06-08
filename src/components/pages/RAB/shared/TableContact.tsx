import { FC } from "react";
import { Button } from "@nextui-org/react";
import { CellphoneIcon } from "@/components/Icon";
import { Contact } from "@/types";

type ITableContact = {
    contact:Contact[];
}

export const TableContact:FC<ITableContact> = ({contact}) => {
    return (
        <>
        {
            (contact[0].type === "cellphone" && (contact[0].value && contact[0].value !== ""))?
                <div className="flex items-center justify-center text-center">
                    <Button variant="light" startContent={<CellphoneIcon className="size-5"/>} size="sm">
                        {contact[0].value}
                    </Button>
                </div>:
                    <span className="basis-full flex items-center justify-center text-center">..~..</span>
            }
        </>
    )
}
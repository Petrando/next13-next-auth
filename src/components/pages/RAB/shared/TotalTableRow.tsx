import { FC } from "react"
import { TableRow, TableCell } from "@nextui-org/react"
import { TotalCard } from "./TotalCard"

type ITotal = {
    total: number;
}

export const TotalRow:FC<ITotal> = ({ total }) => {
    return (
        <TableRow>
            <TableCell colSpan={0}>{''}</TableCell>
            <TableCell colSpan={0}>{''}</TableCell>
            <TableCell colSpan={0}>{''}</TableCell>
            <TableCell colSpan={0}>{''}</TableCell>
            <TableCell colSpan={0}>{''}</TableCell>
            <TableCell colSpan={6}>
                <TotalCard total={total} />
            </TableCell>
            <TableCell colSpan={1}>
                {''}
            </TableCell>       
        </TableRow>
    )
}
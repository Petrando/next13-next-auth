import { FC, Fragment } from "react"
import * as d3 from "d3";
import { Button, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
        DatePicker, Input,  Skeleton, 
            Link, Tabs, Tab, Card, CardHeader, CardBody, CardFooter
 } from "@nextui-org/react"
 import CurrencyFormat from "react-currency-format";
 import { OrderedItem } from "../../../../types"

type IItemsTable = {
    items: OrderedItem[];
}

type ItemArray = {
    nama: string;
    anggota: OrderedItem[];
}

type TotalItemRow = {
    name:string;
    price: number;
    totalUnit: number;
}

 export const ItemsTable:FC<IItemsTable> = ({items}) => {    
    const groupedItems = d3.group(items, ((d:OrderedItem) => d.name))
    const groupedItemsArray = Array.from(groupedItems, ([key, values]:[key:string, values:OrderedItem[]]) => {
        return {nama:key, anggota:values}
    })
    
    const itemPrices = groupedItemsArray.reduce((acc:TotalItemRow[], curr:ItemArray) => {
        const totalUnit = curr.anggota.reduce((ac: number, cur: OrderedItem) => {
            ac+=cur.amount
            return ac
        }, 0)
        acc.push({name:curr.nama, price:curr.anggota[0].price, totalUnit})
        return acc
    }, [])

    itemPrices.push({name:"", totalUnit: 0, price: 0})
    const totalPrice = itemPrices.reduce((acc:number, curr:TotalItemRow) => {
        acc+=(curr.totalUnit * curr.price)
        return acc
    }, 0)
    
    return (
        <Table aria-label="Tabel Penerima Bantuan">
            <TableHeader>
                <TableColumn>No</TableColumn>
                <TableColumn>Barang</TableColumn>
                <TableColumn>Jumlah</TableColumn>
                <TableColumn>Harga per Unit</TableColumn>
                <TableColumn>Total Harga</TableColumn>
                
            </TableHeader>                
            <TableBody>
                {
                    itemPrices.map((d:TotalItemRow, i:number) => {
                        const { name, totalUnit, price } = d
                        const isTotalRow = name === "" && totalUnit === 0 && price === 0

                        if(isTotalRow){
                            return <TableRow key={i.toString()}>
                                <TableCell colSpan={0}>{''}</TableCell>
                                <TableCell colSpan={0}>{''}</TableCell>
                                <TableCell colSpan={0}>{''}</TableCell>
                                <TableCell colSpan={0}>{''}</TableCell>                                                                
                                <TableCell colSpan={5}>
                                    <CurrencyFormat value={totalPrice} prefix="Rp. " thousandSeparator="," 
                                        className="text-right font-semibold"
                                    />
                                </TableCell>
                            </TableRow>
                        }
                        return (
                            <TableRow key={d.name}>
                    
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.totalUnit}</TableCell>
                                <TableCell>
                                    <CurrencyFormat value={d.price} prefix="Rp. " thousandSeparator="," 
                                        className="text-right"
                                    />
                                </TableCell>
                                <TableCell>
                                    <CurrencyFormat value={d.price * d.totalUnit} thousandSeparator="," prefix="Rp. " 
                                        className="text-right"
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
                    
            </TableBody>
        </Table>
    )
 }
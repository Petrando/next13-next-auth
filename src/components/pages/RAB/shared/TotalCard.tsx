import { FC } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import CurrencyFormat from "react-currency-format";

type ITotalCard = {
    total: number;
}

export const TotalCard:FC<ITotalCard> = ({total}) => {
    return (
        <Card>
            <CardHeader>
                <p className="text-sm">
                    Total
                </p>                                                        
            </CardHeader>
            <Divider />
            <CardBody>
                <CurrencyFormat value={total} thousandSeparator='.' decimalSeparator="," prefix="Rp. " 
                    className="text-right w-fit font-semibold"
                />    
            </CardBody>                        
            
        </Card>
    )
}
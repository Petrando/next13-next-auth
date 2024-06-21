import { PersonRecipientWItems, OrderedItem } from "@/types";

export const processRecipients = (recipients:PersonRecipientWItems[]) => {
    const existingRecipients = recipients.filter((d:PersonRecipientWItems) => d._id)

    const items = recipients.map((d:PersonRecipientWItems) => d.items).flat()
    const newItems = items.filter((d:OrderedItem) => !d._id)
        .reduce((acc:OrderedItem[], curr:OrderedItem) => {//prevent duplicate items            
            const itemIdx = acc.findIndex((dAcc:OrderedItem) =>  dAcc.name === curr.name &&
                dAcc.productName === curr.productName && dAcc.category === curr.category &&
                dAcc.subCategory === curr.subCategory
            )
            if(itemIdx === -1){
                acc.push(curr)
            }
            return acc
        }, [])
        
    const totalPrice = recipients
        .filter((d:PersonRecipientWItems) => d.items.length > 0)
        .map((d:PersonRecipientWItems) => d.items).flat()
        .reduce((acc:number, curr:OrderedItem) => {            
            return acc + curr.price
        }, 0)
    
    const niks = recipients.map((d:PersonRecipientWItems) => d.ids.nik)

    return {
        existingRecipients, items, newItems, totalPrice, niks
    }
}
import { parseDate } from "@internationalized/date";
import { OrderedItem, Item, PersonRecipientWItems } from "@/types";

export const createDateString = (date:Date = new Date()) => {    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
     
    const day = date.getDate()
    const dateString = `${year}-${month < 10?"0" + month:month}-${day<10?"0"+day:day}`

    return parseDate(dateString)
}

export const displayIDR = (value:number) => {
    return new Intl.NumberFormat("id", {style:"currency", currency: "IDR"}).format(value)
}

export const totalPrice = (items:OrderedItem[]) => {
    return items.reduce((acc: number, curr: OrderedItem) => {
        return acc + (curr.amount * curr.price)
    }, 0)
}

export const personDataChanged = (person1:PersonRecipientWItems, person2:PersonRecipientWItems, checkItem = false) => {
    const { _id, name, birthdata:{birthdate, birthplace},
        ids:{nik, noKk}, address:{kelurahan, kecamatan, kabupaten, street, rtRw}, contact} = person1
    const { type, value } = contact[0]
    const birthtime = birthdate !== null?
        new Date(birthdate).getTime():null

    const { _id: _id2, name: name2, birthdata:{birthdate:birthdate2, birthplace:birthplace2},
        ids:{ nik:nik2, noKk:noKk2 }, 
            address:{kelurahan: kelurahan2, kecamatan: kecamatan2, kabupaten: kabupaten2, street: street2,
                rtRw: rtRw2
            }, contact:contact2} = person2
    const {type:type2, value:value2 } = contact2[0]
    const birthtime2 = birthdate2 !== null ? 
        new Date(birthdate2).getTime():null    

    return _id !== _id2 || name !== name2 || birthtime !== birthtime2 || birthplace !== birthplace2 ||
         nik !== nik2 || noKk !== noKk2 || rtRw !== rtRw2 || street !== street2 || 
            kelurahan !== kelurahan2 || kecamatan !== kecamatan2    || kabupaten !== kabupaten2 || 
                type !== type2 || value !== value2
    
}

export const isSameItem = (item1: OrderedItem | Item, item2:OrderedItem | Item) => {
    const {_id, name, productName, category, subCategory, unit } = item1
    const {
        _id: _id2, name: name2, productName: productName2, 
            category: category2, subCategory: subCategory2, 
                unit: unit2 
    } = item2

    const sameUpToSubCategory = name.toUpperCase() === name2.toUpperCase() && 
        productName?.toUpperCase() === productName2?.toUpperCase() &&
            category.toUpperCase() === category2.toUpperCase() && 
                subCategory.toUpperCase() === subCategory2.toUpperCase() && 
                    unit.toUpperCase() === unit2.toUpperCase()

    if("subSubCategory" in item1 && "subSubCategory" in item2){
        return sameUpToSubCategory && item1.subSubCategory?.toUpperCase() === item2.subSubCategory?.toUpperCase()
    }

    return sameUpToSubCategory
}
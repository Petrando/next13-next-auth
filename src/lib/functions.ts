import { parseDate } from "@internationalized/date";
import { OrderedItem, PersonRecipientWItems } from "@/types";

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

export const personDataChanged = (person1:PersonRecipientWItems, person2:PersonRecipientWItems, checkItem = false) => {
    const { _id, name, birthdata:{birthdate, birthplace},
        ids:{nik, noKk}, address:{kelurahan, kecamatan, kabupaten, street, rtRw}, contact} = person1
    const { type, value } = contact[0]
    const birthtime = new Date(birthdate).getTime()

    const { _id: _id2, name: name2, birthdata:{birthdate:birthdate2, birthplace:birthplace2},
        ids:{ nik:nik2, noKk:noKk2 }, 
            address:{kelurahan: kelurahan2, kecamatan: kecamatan2, kabupaten: kabupaten2, street: street2,
                rtRw: rtRw2
            }, contact:contact2} = person2
    const {type:type2, value:value2 } = contact2[0]
    const birthtime2 = new Date(birthdate2).getTime()    

    return _id !== _id2 || name !== name2 || birthtime !== birthtime2 || birthplace !== birthplace2 ||
         nik !== nik2 || noKk !== noKk2 || rtRw !== rtRw2 || street !== street2 || 
            kelurahan !== kelurahan2 || kecamatan !== kecamatan2    || kabupaten !== kabupaten2 || 
                type !== type2 || value !== value2
    
}

export const isSameOrderedItem = (item1: OrderedItem, item2:OrderedItem) => {
    const {_id, name, productName, category, subCategory } = item1
    const {_id: _id2, name: name2, productName: productName2, 
            category: category2, subCategory: subCategory2 } = item2

    return _id === _id2 && name === name2 && productName === productName2 &&
        category === category2 && subCategory === subCategory2
}
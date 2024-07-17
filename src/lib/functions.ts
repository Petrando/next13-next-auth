import { CalendarDate, parseDate } from "@internationalized/date";
import { OrderedItem, Item, PersonRecipientWItems } from "@/types";
import { weekDays, localizedDates, localizedMonths, localizedYears } from "@/variables-and-constants";

export const localizeDate = (date: CalendarDate) => {
    type dayIndexes = 0 | 1 | 2 | 3 | 4| 5 | 6
    type dateNums = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 
        11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
            21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 
                31
    type monthIdxs = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    type yearNums = 2023 | 2024 | 2025 | 2026 | 2027 | 2028    

    const currentDate = new Date(date.year + "-" + date.month + "-" + date.day)
    const todate = currentDate.getDate() as dateNums
    const dayNum = currentDate.getDay() as dayIndexes
    const monthNum = currentDate.getMonth() + 1 as monthIdxs
    const year = currentDate.getFullYear() as yearNums

    const hari = weekDays[dayNum]
    const tanggal = localizedDates[todate]
    const bulan = localizedMonths[monthNum]
    const tahun = localizedYears[year]

    return { todate, hari, tanggal, bulan, tahun, year }
}

export function dateDiff(first: Date, second: Date) {        
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}

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
        ids:{nik, noKk}, address:{kelurahan, kecamatan, kabupaten, propinsi,  street, rtRw}, contact} = person1
    const { type, value } = contact[0]
    const birthtime = birthdate !== null?
        new Date(birthdate).getTime():null

    const { _id: _id2, name: name2, birthdata:{birthdate:birthdate2, birthplace:birthplace2},
        ids:{ nik:nik2, noKk:noKk2 }, 
            address:{kelurahan: kelurahan2, kecamatan: kecamatan2, kabupaten: kabupaten2, 
                propinsi:propinsi2, street: street2,
                rtRw: rtRw2
            }, contact:contact2} = person2
    const {type:type2, value:value2 } = contact2[0]
    const birthtime2 = birthdate2 !== null ? 
        new Date(birthdate2).getTime():null    

    return _id !== _id2 || name !== name2 || birthtime !== birthtime2 || birthplace !== birthplace2 ||
         nik !== nik2 || noKk !== noKk2 || rtRw !== rtRw2 || street !== street2 || 
            kelurahan !== kelurahan2 || kecamatan !== kecamatan2  || kabupaten !== kabupaten2 || 
                propinsi !== propinsi2 || type !== type2 || value !== value2
    
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
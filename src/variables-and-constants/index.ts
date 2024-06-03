const _ = require("lodash")
import { PersonRecipientWItems, Item } from "@/types";

export const cloner = (obj:any) => {
    return JSON.parse(JSON.stringify(obj))
}

export const emptyOrderedItem:Item & {unit:number}  = _.cloneDeep({
    name:"",
    productName:"",
    category:"", 
    subCategory: "",
    price: 0,
    unit: 0
})

export const emptyPerson:PersonRecipientWItems = _.cloneDeep({
    name: '',
    birthdata:{
        birthplace: '',
        birthdate: new Date()
    },
    ids:{
        nik:'',
        noKk:''
    },
    address:{
        street:'',
        rtRw:'',
        kelurahan: '',
        kecamatan: '',
        kabupaten: '',
        postCode:''
    },
    contact:[{type:'cellphone', address:''}],
    items:[_.cloneDeep(emptyOrderedItem)]
})


import _ from "lodash";
import { PersonRecipientWItems, Item, OrderedItem, IRAB } from "@/types";

export const cloner = (obj:any) => {
    return JSON.parse(JSON.stringify(obj))
}

export const emptyOrderedItem: OrderedItem  = _.cloneDeep({    
    name: "",
    productName: "",
    category: "", 
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
        nik: '',
        noKk: ''
    },
    address:{
        street: '',
        rtRw: '',
        kelurahan: '',
        kecamatan: '',
        kabupaten: '',
        postCode: ''
    },
    contact: [{type:'cellphone', value:''}],
    items: []
})

export const emptyRAB:IRAB = _.cloneDeep({
    _id:"", date:new Date(), category:"", title:"", recipients:[]
})


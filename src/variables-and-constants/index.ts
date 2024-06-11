import _ from "lodash";
import { PersonRecipientWItems, Item, OrderedItem, IRAB, IOfficer } from "@/types";

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
    items: [],
    completed :{
        done: false, RABScreenshot: ''
    }
})

export const emptyRAB:IRAB = _.cloneDeep({
    _id:"", date:new Date(), category:"", title:"", recipients:[]
})

export const defaultOfficer:IOfficer = _.cloneDeep({
    name: "Santi Nurhayati", NIP: "19660503 199102 001", rank: "Pejabat Pembuat Komitmen",
    address :{
        street:"Jl. Tat Twam Asi No. 47", kelurahan: "Komplek Depsos", kecamatan: "Pasar Rebo",
        kabupaten: "Jakarta Timur", rtRw:""
    }
})


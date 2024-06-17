import _ from "lodash";
import { PersonRecipientWItems, Item, OrderedItem, IRAB, IOperator, ICentre } from "@/types";

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
        propinsi: '',
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

export const defaultOfficer:IOperator = _.cloneDeep({
    name: "Santi Nurhayati", NIP: "19660503 199102 001", rank: "Pejabat Pembuat Komitmen",
    address :{
        street:"Jl. Tat Twam Asi No. 47", kelurahan: "Komplek Depsos", kecamatan: "Pasar Rebo",
        kabupaten: "Jakarta Timur", rtRw:""
    }
})

export const emptyOperator:IOperator = _.cloneDeep({
    name: "", NIP: "", rank: ""
})

export const defaultCentre:ICentre = _.cloneDeep({
    name:"Mulya Jaya", 
    address :{
        street: "Jalan Tat Twan Asi No. 47",
        rtRw: "",
        kelurahan: "Komplek Depsos",
        kecamatan: "Pasar Rebo",
        kabupaten: "Jakarta Timur",
        propinsi: "",
        postCode: "13760"
    }
})

export const weekDays = {
    0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu"
}

export const localizedDates = {
    1: "Satu", 2: "Dua", 3: "Tiga", 4: "Empat", 5: "Lima", 6: "Enam",
    7: "Tujuh", 8: "Delapan", 9: "Sembilan", 10: "Sepuluh", 
    11: "Sebelas", 12: "Duabelas", 13: "Tigabelas", 14: "Empatbelas", 15: "Limabelas",
    16: "Enambelas", 17: "Tujuhbelas", 18: "Delapanbelas", 19: "Sembilanbelas", 20: "Duapuluh",
    21: "Duapuluh satu", 22: "Duapuluh dua", 23: "Duapuluh tiga", 24: "Duapuluh empat", 25: "Duapuluh lima",
    26: "Duapuluh enam", 27: "Duapuluh tujuh", 28: "Duapuluh delapan", 29: "Duapuluh sembilan", 30: "Tigapuluh",
    31: "Tigapuluh satu"
}

export const localizedMonths = {
    1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
    7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
}

export const localizedYears  ={
    2023: "Dua Ribu Dua Puluh Tiga",
    2024: "Dua Ribu Dua Puluh Empat",
    2025: "Dua Ribu Dua Puluh Lima",
    2026: "Dua Ribu Dua Puluh Enam",
    2027: "Dua Ribu Dua Puluh Tujuh",
    2028: "Dua Ribu Dua Puluh Delapan"
}


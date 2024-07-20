import _ from "lodash";
import { PersonRecipientWItems, CharityOrgRecipient, Item, OrderedItem, IRABMultiPerson, 
    IRABCharityOrg, IOperator, ICentre, IVendor, Address, category, filterCategory } from "@/types";

export const cloner = (obj:any) => {
    return JSON.parse(JSON.stringify(obj))
}

export const emptyOrderedItem: OrderedItem  = _.cloneDeep({    
    name: "",
    productName: "",
    category: "", 
    subCategory: "",
    subSubCategory:"",
    price: 0,
    unit: "",
    amount: 0
})

export const emptyAddress:Address = _.cloneDeep({
    street: "", rtRw: "", kelurahan: "", kecamatan: "", kabupaten: "", propinsi: "", postCode: ""
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
    },
    type: "person"
})

export const emptyRAB:IRABMultiPerson = _.cloneDeep({
    _id:"", date:new Date(), category:"charity-multi-recipients", title:"", recipients:[],
    type: "charity-multi-recipients"
})

export const emptyCharityOrg:CharityOrgRecipient = _.cloneDeep({
    name:"", number: "", address: emptyAddress, contact: [{type:'cellphone', value:''}], 
    type: "charity-org"
})

export const emptyRABCharityOrg:IRABCharityOrg = _.cloneDeep({
    _id: "", date: null, title: "",
    recipient:_.cloneDeep(emptyCharityOrg),
    items: [],
    category: "charity-org"
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
        propinsi: "DKI Jakarta",
        postCode: "13760"
    },
    email: "", phone: ""
})

export const defaultVendorCentre:IVendor = _.cloneDeep({
    name:"PT. Mendengar Mandiri Nusantara", 
    address :{
        street: "AD PREMIER LANTAI 17 SUITE 04 B, JL. TB. SIMATUPANG NO.5",
        rtRw: "",
        kelurahan: "Ragunan",
        kecamatan: "Pasar Minggu",
        kabupaten: "Kota Adm. Jakarta Selatan",
        propinsi: "DKI Jakarta",
        postCode: "12550"
    },
    email: "m2nusantara23@gmail.com",
    phone: "081255525238",
    owner: {
        name: "Nurul Aini",
        NIP: "",
        rank: "Direktur"
    }

})

export const emptyCategory:category = _.cloneDeep({
    name:"",
    subCategory:[
        {
            name:"",
            subCategory:[
                { name:"" }
            ]
        }
    ]
})


export const categories:filterCategory[] = [
    {
        name: "Kesehatan",
        subCategory: [
            {
                name: "Perlengkapan Medis",
                subCategory:[
                    { name: "Alat Penunjang Gerak", checked: true },
                    { name: "Alat Bantu Pernafasan", checked: true }
                ], 
                checked: true
            }
        ],
        checked: true
    },
    {
        name: "Makanan & Minuman",
        subCategory: [
            { name: "Beras", checked: true }, { name: "Makanan Jadi", checked: true }, 
            { name: "Makanan Ringan", checked: true },
            { name: "Minuman", checked: true }, { name: "Bumbu & Bahan Masakan", checked: true }
        ], 
        checked: true
    },
    {
        name: "Rumah Tangga",
        subCategory: [
            { name: "Kamar Mandi", checked: true }, { name: "Kebersihan", checked: true }
        ], 
        checked: true
    }
]

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

export const sampleRecipients:PersonRecipientWItems[] = [
    {
        name: 'SUWARNO',
        birthdata:{
            birthplace: 'Jakarta',
            birthdate: new Date('27 July 1957')
        },
        ids:{
            nik:'3171031206570005',
            noKk:'3171031401097655'
        },
        address:{
            street:'Jl. Kemayoran Gempol',
            rtRw:'12/6',
            kelurahan: 'Kebon Kosong',
            kecamatan: 'Kemayoran',
            kabupaten: 'Jakarta Pusat',
            propinsi: ""
        },
        contact:[{type:'cellphone', value:''}],
        items:[],
        completed:{
            done: false, RABScreenshot: ""
        },
        type: "person"
    },
    {
        name: "Hj Nurlela",
        birthdata: {
            birthplace: "Jambi",
            birthdate: new Date("1967-08-03T16:00:00.000Z")
        },
        ids: {
            nik: "3171025508670004",
            noKk: "3171020310190004"
        },
        address: {
            street: "Jl. Budi Rahayu III No. 16",
            rtRw: "11/9",
            kelurahan: "Mangga Dua Selatan",
            kecamatan: "Sawah Besar",
            kabupaten: "Jakarta Pusat",
            postCode: "",
            propinsi: ""
        },
        contact: [
            {
                type: "cellphone",
                value: ""
            }
        ],
        items: [
            {
                name: "Kursi Roda",
                productName: "",
                category: "",
                subCategory: "",
                price: 17000000,
                amount: 1,
                unit: "unit"
            }
        ],
        completed:{
            done:false, RABScreenshot: ""
        },
        type: "person"
    },
    {
        name: "Aryani",
        birthdata: {
            birthplace: "Jakarta",
            birthdate: new Date("1963-11-12T16:00:00.000Z")
        },
        ids: {
            nik: "3171035711630001",
            noKk: "3171031301090125"
        },
        address: {
            street: "Jl. Bungur Besar XVI",
            rtRw: "1/1",
            kelurahan: "Kemayoran",
            kecamatan: "Kemayoran",
            kabupaten: "Jakarta Pusat",
            postCode: "",
            propinsi: ""
        },
        contact: [
            {
                type: "cellphone",
                value: ""
            }
        ],
        items: [
            {
                name: "Kursi Roda",
                productName: "",
                category: "",
                subCategory: "",
                price: 1700000,
                unit: "unit",
                amount: 1
            }
        ],
        completed:{
            done: false, RABScreenshot: ""
        },
        type: "person"
    }
]
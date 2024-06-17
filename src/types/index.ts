export type BirthdatePlace = {
    birthplace: string;
    birthdate: Date;
}

export type PersonIds = {
    nik: string;
    noKk: string;
}

export type Address = {
    street: string;
    rtRw: string;
    kelurahan: string;
    kecamatan: string;    
    kabupaten: string;
    propinsi: string;
    postCode?: string;
}

export type Contact = {
    type: string;
    value: string;
}

export interface PersonRecipient {
    _id?:string | null;
    name: string;
    birthdata: BirthdatePlace;
    ids: PersonIds;
    address: Address;
    contact: Contact[];
}

export interface Item {
    _id?:string;
    name: string;
    productName?: string;
    category: string;
    subCategory: string;
    price: number;
    unit: string;
}

export interface OrderedItem extends Item {
    amount: number;
} 

export interface PersonRecipientWItems extends PersonRecipient{
    items: OrderedItem[];
    completed:{
        done: boolean;
        RABScreenshot: string;
    }
}

export interface IRAB {
    _id:string;
    date: Date;
    title: string;
    recipients: PersonRecipientWItems[];
    category: string;
}

export interface IOperator {
    _id?: string;
    name: string;
    NIP: string;
    rank: string;    
}

export interface ICentre  {
    name: string;
    address: Address;
}
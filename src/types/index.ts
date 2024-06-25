export type BirthdatePlace = {
    birthplace: string;
    birthdate: Date | null;
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

type RecipientTypes = "person" | "charity-org"

export interface PersonRecipient {
    _id?:string | null;
    name: string;
    birthdata: BirthdatePlace;
    ids: PersonIds;
    address: Address;
    contact: Contact[];
    type: "person";    
}

export interface Item {
    _id?:string;
    name: string;
    productName?: string;
    category: string;
    subCategory: string;
    subSubCategory?: string;
    price: number;
    unit: string;
}

export interface OrderedItem extends Item {
    amount: number;
} 

export interface PersonRecipientWItems extends PersonRecipient {
    items: OrderedItem[];
    completed:{
        done: boolean;
        RABScreenshot: string;
    }
}

export interface IRABMultiPerson {
    _id:string;
    date: Date;
    title: string;
    recipients: PersonRecipientWItems[];
    category: "charity-multi-recipients";
}

export interface CharityOrgRecipient {
    _id?: string;
    name: string;
    number: string;
    address: Address;
    contact: Contact[];
    type: "charity-org";
}

export interface IRABCharityOrg { 
    _id:string;
    date: Date | null;
    title: string;
    recipient: CharityOrgRecipient;
    items: OrderedItem[];
    category: "charity-org";
}

export type RABTypes = "charity-multi-recipients" | "charity-org" | "enterpreneur-charity"

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

/*
    item category type defenitions
    starting from subSubCategory as option
    all the way up to category which wrapped all the others
*/
export type option = {
    name: string;
}

export type subCategory = {
    name: string;
    subCategory?: option[]; 
}

export type category = {
    _id?: string;
    name: string;
    subCategory: subCategory[];
}

export interface filterOption  {
    name: string;
    checked: boolean;
}

export interface filterSubCategory {
    name: string;
    subCategory: filterOption[];
    checked: boolean;
}

export interface filterCategory {
    name: string;
    subCategory: filterSubCategory[];
    checked: boolean;
}


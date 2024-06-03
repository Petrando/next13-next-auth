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
    postCode?: string;
}

export type Contact = {
    type: string;
    address: string;
}

export interface PersonRecipient {
    _id?:string | null;
    name: string;
    birthdata: BirthdatePlace;
    ids: PersonIds;
    address: Address;
    contact: Contact | Contact[];
}

export interface Item {
    name: string;
    productName?: string;
    category: string;
    subCategory: string;
    price: number;
}

export interface PersonRecipientWItems extends PersonRecipient{
    items: (Item & {unit:number})[];
}
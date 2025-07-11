export interface ITems {
    label: string;
    desc: string;
}

export interface IFeatures {
    itm: string;
    title: string;
    desc: string;
}

export interface IContactUs {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
}

export interface ILogin {
    email: string;
    password: string;
}
export interface IAdminInfo {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface IUpdateAdmin {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IResetPass {
    email: string;
    password: string;
    passwordConfirmation: string;
}
export interface IShelves {
    _id?: string;
    title: string;
    shelfNumber?: string;
    stock: number;
    categories: string[];
    state: "Available" | "Out" | "Low";
}

export interface ISecurity {
    title: string;
    location: string;
    time: number;
    date: number;
    state: "Resolved" | "Critical" | "Under Review";
}

export interface ICustomer {
    title: string;
    id: string;
    total_orders: number;
    phone: string;
    state: "Active" | "Inactive" | "VIP";
}

export interface IProductInfo {
    title: string;
    description?: string;
    highlights?: string;
    image_url: string;
    price: number;
    discount?: number;
    discountType?: string;
    barcode: string;
    stock: number;
    stockState?: string;
    brand: string;
    category?: string;
    subCategory?: string;
    categoryId: string;
    subCategoryId: string;
    item_weight?: string;
    shelfNumber: number;
}

export interface IProduct {
    _id: string;
    title: string;
    barcode: string;
    shelfNumber?: string;
    price: number;
    image_url?: string;
    stock: number;
    stockState:  "available" | "out" | "low";
    categories: string[];
    state: "Available" | "Out" | "Low";
}

export interface IStatusData {
    src: string;
    name: string;
    number: number;
    numberColor: string;
    numberUnite: string;
    percent: number;
    percentIncreased: boolean;
}
export interface IAlert {
    id: string;
    confidence: number;
    image_url: string;
    status: string;
    timestamp: string;
}

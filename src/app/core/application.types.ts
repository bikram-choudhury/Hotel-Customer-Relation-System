export interface ApplicationStore {
    categories: Category[];
    items: Item[];
    cart: Cart[];
    auth: Token;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}

export interface Item {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
}

export interface Cart {
    itemId: string;
    qty: number;
    price: number;
}

export interface PastOrderDetails {
    createdAt: string;
    status: string;
    itemsInCart: {
        name: string;
        price: number;
        qty: number;
    }[]
}

export interface RequestBodyForSignIn {
    username: string;
    password: string;
}

export interface RequestBodyForSignUp {
    name: string;
    contactNo: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface Token {
    accessToken: string;
    tokenType: string;
}
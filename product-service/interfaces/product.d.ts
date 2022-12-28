export interface NewProduct {
    title: string;
    description?: string;
    price?: number;
}

export interface BasicProduct {
    id: string;
    title: string;
    description: string;
    price: number;
}

export interface Stock {
    product_id: string;
    count: number;
}

export interface Product extends Product, Omit<Stock, 'product_id'> {}

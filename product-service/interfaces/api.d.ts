import { NewProduct, Product } from '@interfaces/product';

export interface ErrorResponse {
    message: string;
}

export interface GetProductsListResponse extends Array<Product> {}

export interface GetProductByIdResponse extends Product {}

export interface CreateProductRequestBody extends NewProduct {}

export interface CreateProductResponse extends Product {}

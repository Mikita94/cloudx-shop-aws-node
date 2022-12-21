export interface ErrorResponse {
    message: string;
}

export interface GetProductsListResponse extends Array<Product> {}

export interface GetProductByIdResponse extends Product {}

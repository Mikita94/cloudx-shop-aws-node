import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';

import productsMock from '@mocks/products.json';
import { ErrorResponse, GetProductByIdResponse } from '@interfaces/api';

export const getProductById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const requestedProduct = productsMock.products
            .find(product => product.id === event.pathParameters?.productId);
        if (requestedProduct) {
            const body: GetProductByIdResponse = requestedProduct;
            return {
                statusCode: 200,
                body: JSON.stringify(body),
            };
        }
        const body: ErrorResponse = { message: 'Product not found' };
        return {
            statusCode: 404,
            body: JSON.stringify(body),
        };
    } catch (error: unknown) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        const body: ErrorResponse = { message };
        return {
            statusCode: 500,
            body: JSON.stringify(body),
        };
    }
};

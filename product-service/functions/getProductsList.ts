import { APIGatewayProxyHandler } from 'aws-lambda';

import productsMock from '@mocks/products.json';
import { ErrorResponse, GetProductByIdResponse } from '@interfaces/api';

export const getProductsList: APIGatewayProxyHandler = async () => {
    try {
        const body: GetProductByIdResponse = productsMock.products;
        return {
            statusCode: 200,
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

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from 'uuid';

import { ErrorResponse } from '@interfaces/api';
import { BasicProduct } from '@interfaces/product';
import { DBClientProvider } from '@utils';

export const createProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        console.log('createProduct', JSON.stringify(event));
        const body = event.body && JSON.parse(event.body) || {};
        if (!isProductValid(body)) {
            const body: ErrorResponse = { message: 'Invalid Product structure' };
            return {
                statusCode: 400,
                body: JSON.stringify(body),
            };
        }
        const { title, description, price } = body;
        const id = uuid();
        const product = { id, title, description, price };
        const { REGION, PRODUCTS_TABLE } = process.env;
        const putProduct = new PutCommand({
            TableName: PRODUCTS_TABLE,
            Item: product,
        });
        const dbClientProvider = new DBClientProvider({ region: REGION });
        const result = await dbClientProvider.docClient.send(putProduct);
        if (result.$metadata.httpStatusCode !== 200) {
            throw new Error('DB error');
        }
        return {
            statusCode: 200,
            body: JSON.stringify(Object.assign(product, { count: 0 })),
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

const isCorrectType = (type: string, ...args: Array<unknown>): boolean => {
    return args.every(prop => !prop || typeof prop === type);
}

const isProductValid = (product: BasicProduct): boolean => {
    const { title, description, price } = product;
    return !!title
        && isCorrectType('string', title, description)
        && isCorrectType('number', price);
}

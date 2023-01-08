import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

import { ErrorResponse, GetProductByIdResponse } from '@interfaces/api';
import { BasicProduct, Stock } from '@interfaces/product';
import { DBClientProvider } from '@utils';

export const getProductById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        console.log('getProductById', JSON.stringify(event));
        const requestedProductId = event.pathParameters?.productId;
        const { REGION, PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
        const dbClientProvider = new DBClientProvider({ region: REGION });
        const productQuery = new GetCommand({
            TableName: PRODUCTS_TABLE,
            Key: { id: requestedProductId },
        });
        const stockQuery = new GetCommand({
            TableName: STOCKS_TABLE,
            Key: { product_id: requestedProductId },
        });
        const [ product, stock ] = await Promise.all([
            dbClientProvider.docClient.send(productQuery).then(res => res.Item as BasicProduct),
            dbClientProvider.docClient.send(stockQuery).then(res => res.Item as Stock)
        ]);
        dbClientProvider.destroyClients();
        if (product) {
            const body: GetProductByIdResponse = Object.assign(product, { count: stock?.count || 0 });
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

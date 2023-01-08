import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

import { ErrorResponse, GetProductsListResponse } from '@interfaces/api';
import { BasicProduct, Stock, Product } from '@interfaces/product';
import { DBClientProvider } from '@utils';

export const getProductsList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('getProductsList', JSON.stringify(event));
        const { REGION, PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
        const dbClientProvider = new DBClientProvider({ region: REGION });
        const scanProducts = new ScanCommand({ TableName: PRODUCTS_TABLE });
        const scanStocks = new ScanCommand({ TableName: STOCKS_TABLE });
        const [ products, stocks ] = await Promise.all([
            dbClientProvider.docClient.send(scanProducts).then(res => res.Items as Array<BasicProduct>),
            dbClientProvider.docClient.send(scanStocks).then(res => res.Items as Array<Stock>)
        ]);
        dbClientProvider.destroyClients();
        const fullProducts: Array<Product> = (products || []).map((product) => {
            const stock = stocks.find(stock => stock.product_id === product.id);
            return Object.assign(product, { count: stock?.count || 0 });
        });
        const body: GetProductsListResponse = fullProducts;
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
    }
};

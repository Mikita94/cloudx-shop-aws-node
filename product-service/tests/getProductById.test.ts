import { describe, expect, test } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { getProductById } from '@functions';

describe('Test getProductById lambda function', () => {
    test('Returns known product by id', async () => {
        const event = {
            pathParameters: {
                productId: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
            } as unknown,
        } as APIGatewayProxyEvent;
        const result = await getProductById(event, {} as Context, () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult).toBeDefined();
        expect(result.statusCode).toEqual(200);
    });

    test('Fails on retrieving unknown product by id', async () => {
        const event = {
            pathParameters: {
                productId: 'fakeId',
            } as unknown,
        } as APIGatewayProxyEvent;
        const result = await getProductById(event, {} as Context, () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult?.message).toBeDefined();
        expect(result.statusCode).toEqual(404);
    });
});

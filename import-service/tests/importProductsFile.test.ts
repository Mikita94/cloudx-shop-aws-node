import { describe, expect, test } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { importProductsFile } from '@functions';

describe('Test importProductsFile lambda function', () => {
    test('Returns signed url', async () => {
        const queryStringParameters = { name: 'test-file' };
        const event = {
            queryStringParameters,
        } as unknown as APIGatewayProxyEvent;
        const result = await importProductsFile(event, {} as Context, () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult).toBeDefined();
        expect(result.statusCode).toEqual(200);
    });

    test('Fails when no name provided', async () => {
        const event = {} as unknown as APIGatewayProxyEvent;
        const result = await importProductsFile(event, {} as Context, () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult?.message).toBeDefined();
        expect(result.statusCode).toEqual(400);
    });
});

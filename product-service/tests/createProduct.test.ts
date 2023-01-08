import { describe, expect, test } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWSMockLambdaContext from 'aws-lambda-mock-context';

import { createProduct } from '@functions';

describe('Test createProduct lambda function', () => {
    test('Creates product', async () => {
        const body = {
            title: 'Test product',
            description: 'Test description',
            price: 123,
        };
        const event = {
            body: JSON.stringify(body),
        } as APIGatewayProxyEvent;
        const result = await createProduct(event, AWSMockLambdaContext(), () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult).toBeDefined();
        expect(parsedResult.id).toBeDefined();
        expect(parsedResult.title).toBe(body.title);
        expect(parsedResult.description).toBe(body.description);
        expect(parsedResult.price).toBe(body.price);
        expect(parsedResult.count).toBe(0);
        expect(result.statusCode).toEqual(200);
    });

    test('Fails on creating the product with missing required fields', async () => {
        const body = {};
        const event = {
            body: JSON.stringify(body),
        } as APIGatewayProxyEvent;
        const result = await createProduct(event, AWSMockLambdaContext(), () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult?.message).toBeDefined();
        expect(result.statusCode).toEqual(400);
    });

    test('Fails on creating the product with wrong type fields', async () => {
        const body = {
            title: 123,
            description: 123,
            price: '123',
        };
        const event = {
            body: JSON.stringify(body),
        } as APIGatewayProxyEvent;
        const result = await createProduct(event, AWSMockLambdaContext(), () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect(parsedResult?.message).toBeDefined();
        expect(result.statusCode).toEqual(400);
    });
});

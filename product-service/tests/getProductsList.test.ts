import { describe, expect, test } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { getProductsList } from '@functions';

describe('Test getProductsList lambda function', () => {
    test('Returns products', async () => {
        const event = {} as APIGatewayProxyEvent;
        const result = await getProductsList(event, {} as Context, () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect((parsedResult || []).length).toBeGreaterThan(0);
        expect(result.statusCode).toEqual(200);
    });
});

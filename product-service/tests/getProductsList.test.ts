import { describe, expect, test } from '@jest/globals';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWSMockLambdaContext from 'aws-lambda-mock-context';

import { getProductsList } from '@functions';

describe('Test getProductsList lambda function', () => {
    test('Returns products', async () => {
        const event = {} as APIGatewayProxyEvent;
        const result = await getProductsList(event, AWSMockLambdaContext(), () => {}) as APIGatewayProxyResult;
        const parsedResult = JSON.parse(result.body);
        expect((parsedResult || []).length).toBeGreaterThan(0);
        expect(result.statusCode).toEqual(200);
    });
});

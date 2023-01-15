import { describe, expect, test } from '@jest/globals';
import { Context, SQSEvent } from 'aws-lambda';

import { catalogBatchProcess } from '@functions';

describe('Test catalogBatchProcess lambda function', () => {
    test('Doesnt fail when creating a product', async () => {
        const body = {
            title: 'Test product',
            description: 'Test description',
            price: 123,
        };
        const event = {
            Records: [{
                body: JSON.stringify(body),
            }]
        } as SQSEvent;
        const resultPromise = catalogBatchProcess(event, {} as Context, () => {});
        await expect(resultPromise).resolves.not.toThrow();
    });
});

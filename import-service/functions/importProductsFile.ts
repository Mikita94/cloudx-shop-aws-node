import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ErrorResponse } from '@interfaces/api';

export const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('importProductsFile', JSON.stringify(event));
        const fileName = event.queryStringParameters?.name;
        if (!fileName) {
            const body: ErrorResponse = { message: 'Query parameter \'name\' is missing' };
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            };
        }
        const { REGION, IMPORT_BUCKET } = process.env;
        const client = new S3Client({ region: REGION });
        const command = new PutObjectCommand({
            Bucket: IMPORT_BUCKET,
            Key: `uploaded/${fileName}`,
        });
        const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signedUrl),
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
}

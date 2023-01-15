import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { MetadataBearer } from '@aws-sdk/types';
import { S3Event, S3Handler } from 'aws-lambda/trigger/s3';
import { Stream } from 'stream';
import csv from 'csv-parser';

export const importFileParser: S3Handler = async (event: S3Event): Promise<void> => {
    try {
        console.log('importFileParser', JSON.stringify(event));
        const { REGION, IMPORT_BUCKET, LOOKUP_PREFIX, PARSED_PREFIX } = process.env;
        const client = new S3Client({ region: REGION });
        await Promise.all(event.Records.map(async (record) => {
            const objectKey = record.s3.object.key;
            await readCSVObject(client, IMPORT_BUCKET as string, objectKey);
            const destinationKey = objectKey.replace(LOOKUP_PREFIX as string, PARSED_PREFIX as string);
            await copyObject(client, IMPORT_BUCKET as string, `${IMPORT_BUCKET}/${objectKey}`, destinationKey);
            await deleteObject(client, IMPORT_BUCKET as string, objectKey);
        }));
    } catch (error: unknown) {
        console.log('Error', error);
    }
}

const readCSVObject = async (client: S3Client, bucket: string, key: string): Promise<void> => {
    console.log(`Reading ${key}`);
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    const readStream = (await client.send(command)).Body as Stream;
    await new Promise<void>((resolve, reject) => {
        readStream
            .pipe(csv())
            .on('data', (data: unknown) => sendResultToSQS(data))
            .on('end', resolve)
            .on('error', reject);
    });
}

const sendResultToSQS = async (data: unknown): Promise<MetadataBearer> => {
    const { REGION, IMPORT_QUEUE_URL } = process.env;
    const client = new SQSClient({ region: REGION });
    const command = new SendMessageCommand({
        QueueUrl: IMPORT_QUEUE_URL,
        MessageBody: JSON.stringify(data),
    });
    return await client.send(command);
}

const copyObject = async (client: S3Client, bucket: string, copySource: string, key: string): Promise<void> => {
    console.log(`Copying object ${copySource} to ${key}`);
    const command = new CopyObjectCommand({
        Bucket: bucket,
        Key: key,
        CopySource: copySource,
    });
    await client.send(command);
}

const deleteObject = async (client: S3Client, bucket: string, key: string): Promise<void> => {
    console.log(`Deleting object ${key}`);
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    await client.send(command);
}

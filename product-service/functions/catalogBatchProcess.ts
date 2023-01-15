import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { MetadataBearer } from '@aws-sdk/types/dist-types/response';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { isProductValid, uploadProductToDB } from '@functions/createProduct';
import { BasicProduct } from '@interfaces/product';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent): Promise<void> => {
    try {
        console.log('catalogBatchProcess', JSON.stringify(event));
        await Promise.all(event.Records.map(async (record) => {
            const { title, description, price } = JSON.parse(record.body);
            const id = uuid();
            const product = { id, title, description, price: +price };
            if (!isProductValid(product)) {
                console.log('Invalid product: ' + JSON.stringify(product));
                return;
            }
            await uploadProductToDB(product);
            await sendResultToSNS(product);
        }));
    } catch (error: unknown) {
        console.log('Error', error);
    }
};

const sendResultToSNS = async (product: BasicProduct): Promise<MetadataBearer> => {
    const { REGION, NEW_PRODUCT_SNS_TOPIC_ARN } = process.env;
    const client = new SNSClient({ region: REGION });
    const command = new PublishCommand({
        TopicArn: NEW_PRODUCT_SNS_TOPIC_ARN,
        Subject: 'New product',
        Message: `The following product has been added to the DB: ${JSON.stringify(product)}`,
        MessageAttributes: {
            price: {
                DataType: 'Number',
                StringValue: `${product.price}`,
            },
        },
    });
    return await client.send(command);
};

import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DBClientProvider {
    private readonly _client: DynamoDBClient;
    private readonly _docClient: DynamoDBDocumentClient;

    public get client(): DynamoDBClient {
        return this._client;
    }

    public get docClient(): DynamoDBDocumentClient {
        return this._docClient;
    }

    constructor(configuration: DynamoDBClientConfig) {
        this._client = new DynamoDBClient(configuration);
        this._docClient = DynamoDBDocumentClient.from(this._client);
    }

    public destroyClients(): void {
        this._client.destroy();
        this._docClient.destroy();
    }
}

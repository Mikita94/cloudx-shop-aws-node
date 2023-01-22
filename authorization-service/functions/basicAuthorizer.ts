import {
    APIGatewayAuthorizerResult,
    APIGatewayRequestAuthorizerEventV2,
    APIGatewayRequestIAMAuthorizerHandlerV2,
    Callback,
    Context,
} from 'aws-lambda';

export const basicAuthorizer: APIGatewayRequestIAMAuthorizerHandlerV2 = (
    event: APIGatewayRequestAuthorizerEventV2,
    ctx: Context,
    cb: Callback<APIGatewayAuthorizerResult>,
): void => {
    try {
        const { type, routeArn, identitySource } = event;
        const authorizationToken = (identitySource || [])[0];
        if (type !== 'REQUEST' || !authorizationToken) {
            cb('Unauthorized');
            return;
        }
        const encodedCredentials = authorizationToken.split(' ')[1];
        const [ username, password ] = Buffer
            .from(encodedCredentials, 'base64')
            .toString('utf-8')
            .split(':');
        const effect = isUserValid(username, password) ? 'Allow' : 'Deny';
        cb(null, generatePolicy(encodedCredentials, routeArn, effect));
        return;
    } catch (error: unknown) {
        console.log('error', error);
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        cb(`Error: ${message}`);
        return;
    }
};

const isUserValid = (username: string, password: string): boolean => {
    const storedUserPassword = process.env[username];
    return !!storedUserPassword && storedUserPassword === password;
}

const generatePolicy = (principalId: string, resource: string, effect: string = 'Deny'): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
}

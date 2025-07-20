import { Request } from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';

const isApiGatewayProxyResult = (response: unknown): response is APIGatewayProxyResult => {
  return (
    response !== null &&
    response !== undefined &&
    typeof response === 'object' &&
    'statusCode' in response &&
    typeof response.statusCode === 'number' &&
    'body' in response &&
    typeof response.body === 'string'
  );
};

/**
 * A middy middleware that serializes the handler's response into a valid
 * API Gateway Proxy Result object.
 */
export const httpResponseSerializer = () => {
  const httpResponseSerializerAfter = async (request: Request): Promise<void> => {
    if (request.response === undefined || request.response === null) {
      request.response = {
        statusCode: 204,
        body: '',
      };
      return;
    }

    if (isApiGatewayProxyResult(request.response)) {
      return;
    }

    request.response = {
      statusCode: 200,
      body: JSON.stringify(request.response),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  };

  return {
    after: httpResponseSerializerAfter,
  };
};

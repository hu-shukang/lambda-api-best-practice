import { Request } from '@middy/core';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { describe, expect, it } from 'vitest';

import { httpResponseSerializer } from '@/utils/http-response-serializer.util';

// Helper to create a mock Middy request object
const createMockRequest = (response?: unknown): Request<APIGatewayEvent, APIGatewayProxyResult | unknown> => ({
  event: {} as APIGatewayEvent,
  context: {} as any,
  response: response,
  error: null,
  internal: {},
});

describe('http-response-serializer util', () => {
  const { after: serializer } = httpResponseSerializer();

  it('should set a 204 No Content response if the response is null', async () => {
    const request = createMockRequest(null);

    await serializer(request);

    expect(request.response).toEqual({
      statusCode: 204,
      body: '',
    });
  });

  it('should set a 204 No Content response if the response is undefined', async () => {
    const request = createMockRequest(undefined);

    await serializer(request);

    expect(request.response).toEqual({
      statusCode: 204,
      body: '',
    });
  });

  it('should do nothing if the response is already a valid APIGatewayProxyResult', async () => {
    const existingResponse: APIGatewayProxyResult = {
      statusCode: 418,
      body: JSON.stringify({ message: "I'm a teapot" }),
      headers: { 'X-Custom-Header': 'true' },
    };
    const request = createMockRequest(existingResponse);

    await serializer(request);

    // The response should be the exact same object, not a new one.
    expect(request.response).toBe(existingResponse);
  });

  it('should serialize a plain object into a 200 OK response', async () => {
    const responseObject = { user: 'test', id: 123 };
    const request = createMockRequest(responseObject);

    await serializer(request);

    expect(request.response).toEqual({
      statusCode: 200,
      body: JSON.stringify(responseObject),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should serialize an array into a 200 OK response', async () => {
    const responseArray = [{ item: 1 }, { item: 2 }];
    const request = createMockRequest(responseArray);

    await serializer(request);

    expect(request.response).toEqual({
      statusCode: 200,
      body: JSON.stringify(responseArray),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

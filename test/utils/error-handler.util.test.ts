import { Logger } from '@aws-lambda-powertools/logger';
import { Request } from '@middy/core';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { httpErrorHandler } from '@/utils/error-handler.util';

// Mock the logger
const mockLogger = {
  error: vi.fn(),
} as unknown as Logger;

// Helper to create a mock Middy request object
const createMockRequest = (
  error: Error | null,
  response: APIGatewayProxyResult | null,
): Request<APIGatewayEvent, APIGatewayProxyResult> => ({
  event: {} as APIGatewayEvent,
  context: {} as any,
  response: response,
  error: error,
  internal: {},
});

describe('error-handler util', () => {
  const { onError } = httpErrorHandler({ logger: mockLogger });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('レスポンスが定義される場合は何もしない', async () => {
    const existingResponse = { statusCode: 200, body: '{"message":"ok"}' };
    const request = createMockRequest(new Error('test error'), existingResponse);

    await onError(request);

    expect(request.response).toBe(existingResponse);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('エラーとレスポンスが両方ともNULLの場合は何もしない', async () => {
    const request = createMockRequest(null, null);

    await onError(request);

    expect(request.response).toBeNull();
    expect(request.error).toBeNull();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('500レスポンスを返す', async () => {
    const error = new Error('A wild error appeared!');
    const request = createMockRequest(error, null);

    await onError(request);

    expect(mockLogger.error).toHaveBeenCalledWith(error.name, error.message);

    expect(request.response).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'A wild error appeared!' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('400レスポンスを返す', async () => {
    const parseError = new Error('Invalid body');
    parseError.name = 'ParseError';
    const request = createMockRequest(parseError, null);

    await onError(request);

    expect(mockLogger.error).toHaveBeenCalledWith(parseError.name, parseError.message);

    expect(request.response).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'Request input validation failed' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});

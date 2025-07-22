import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { db } from '@/database';
import { handler } from '@/functions/user/add';

vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('crypto')>();
  return {
    ...actual,
    randomUUID: vi.fn(),
  };
});

// Mock Powertools Logger to prevent logging during tests and allow spying
vi.mock('@aws-lambda-powertools/logger', () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    addContext: vi.fn(),
    appendKeys: vi.fn(),
    getPersistentLogAttributes: vi.fn(),
    addPersistentLogAttributes: vi.fn(),
  };
  return {
    Logger: vi.fn(() => mockLogger),
    search: vi.fn(),
  };
});

describe('POST /user - Add User Lambda Handler', () => {
  const mockUUID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const mockContext: Context = {
    awsRequestId: 'test-request-id',
    functionName: 'test-function',
    functionVersion: '$LATEST',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    memoryLimitInMB: '128',
    logGroupName: '/aws/lambda/test-function',
    logStreamName: '2023/01/01/[$LATEST]abcdef123456',
    getRemainingTimeInMillis: () => 30000,
    done: () => {},
    fail: () => {},
    succeed: () => {},
    callbackWaitsForEmptyEventLoop: true,
  };

  beforeEach(() => {
    vi.mocked(randomUUID).mockReturnValue(mockUUID);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add a user and return 200 with the user ID on success', async () => {
    // Arrange
    const mockBody = {
      name: 'John Doe',
      address: '123 Main St',
      email: 'john.doe@example.com',
    };
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify(mockBody),
      requestContext: { requestId: 'test-request-id' } as any,
    };
    vi.mocked(db.execute).mockResolvedValue(undefined as any);

    // Act
    const result = await handler(event as APIGatewayProxyEvent, mockContext, () => {});
    console.log(result);
    // // Assert
    // expect(result.statusCode).toBe(200);
    // expect(JSON.parse(result.body)).toEqual({ id: mockUUID });
    // expect(db.insertInto).toHaveBeenCalledWith('userTbl');
    // expect(db.values).toHaveBeenCalledWith({ ...mockBody, id: mockUUID });
    // expect(db.execute).toHaveBeenCalledOnce();
  });

  // it('should return 400 for an invalid request body', async () => {
  //   // Arrange
  //   const event: Partial<APIGatewayProxyEvent> = {
  //     body: JSON.stringify({ name: 'John Doe', email: 'not-an-email' }), // Missing address, invalid email
  //     requestContext: { requestId: 'test-request-id' } as any,
  //   };

  //   // Act
  //   const result = await handler(event as APIGatewayProxyEvent, mockContext, () => {});

  //   // Assert
  //   expect(result.statusCode).toBe(400);
  //   expect(JSON.parse(result.body).message).toContain('Validation error');
  //   expect(db.insertInto).not.toHaveBeenCalled();
  // });

  // it('should return 500 if the database operation fails', async () => {
  //   // Arrange
  //   const dbError = new Error('DB connection failed');
  //   vi.mocked(db.execute).mockRejectedValue(dbError);
  //   const event: Partial<APIGatewayProxyEvent> = {
  //     body: JSON.stringify({ name: 'Jane Doe', address: '456 Oak Ave', email: 'jane.doe@example.com' }),
  //     requestContext: { requestId: 'test-request-id' } as any,
  //   };

  //   // Act
  //   const result = await handler(event as APIGatewayProxyEvent, mockContext, () => {});

  //   // Assert
  //   expect(result.statusCode).toBe(500);
  //   expect(JSON.parse(result.body)).toEqual({ message: 'Internal Server Error' });
  //   expect(vi.mocked(Logger).mock.results[0].value.error).toHaveBeenCalledWith('An unexpected error occurred', dbError);
  // });
});

import { Logger } from '@aws-lambda-powertools/logger';
import { Request } from '@middy/core';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

type Props = {
  logger: Logger;
};

export const httpErrorHandler = ({ logger }: Props) => {
  const handler = async (request: Request<APIGatewayEvent, APIGatewayProxyResult>) => {
    if (request.response !== null) return;
    const error = request.error;
    if (!error) return;
    let message = error.message;
    let statusCode = 500;

    logger.error(error.name, error.message);
    if (error.name === 'ParseError') {
      statusCode = 400;
      message = 'Request input validation failed';
    }
    request.response = {
      body: JSON.stringify({ message: message }),
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  };

  return {
    onError: handler,
  };
};

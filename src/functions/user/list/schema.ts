import { APIGatewayProxyEventV2Schema } from '@aws-lambda-powertools/parser/schemas/api-gatewayv2';
import { z } from 'zod';

export const schema = APIGatewayProxyEventV2Schema.extend({
  queryStringParameters: z.object({
    name: z.string().nullable(),
    offset: z.number().nullable(),
    limit: z.number().nullable(),
  }),
});
export type ExtendedAPIGatewayEvent = z.infer<typeof schema>;

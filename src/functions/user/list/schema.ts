import { APIGatewayProxyEventSchema } from '@aws-lambda-powertools/parser/schemas/api-gateway';
import { z } from 'zod';

export const schema = APIGatewayProxyEventSchema.extend({
  queryStringParameters: z.object({
    name: z.string().nullish(),
    email: z.string().nullish(),
    address: z.string().nullish(),
    offset: z.number(),
    limit: z.number(),
  }),
});
export type ExtendedAPIGatewayEvent = z.infer<typeof schema>;

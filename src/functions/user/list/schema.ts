import { APIGatewayProxyEventSchema } from '@aws-lambda-powertools/parser/schemas/api-gateway';
import { z } from 'zod';

export const schema = APIGatewayProxyEventSchema.extend({
  queryStringParameters: z.object({
    name: z.string().nullish(),
    offset: z.number().nullish(),
    limit: z.number().nullish(),
  }),
});
export type ExtendedAPIGatewayEvent = z.infer<typeof schema>;

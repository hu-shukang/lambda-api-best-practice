import { JSONStringified } from '@aws-lambda-powertools/parser/helpers';
import { APIGatewayProxyEventSchema } from '@aws-lambda-powertools/parser/schemas/api-gateway';
import { z } from 'zod';

export const schema = APIGatewayProxyEventSchema.extend({
  body: JSONStringified(
    z.object({
      name: z.string(),
      age: z.number(),
    }),
  ),
});
export type ExtendedAPIGatewayEvent = z.infer<typeof schema>;

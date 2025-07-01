import { JSONStringified } from '@aws-lambda-powertools/parser/helpers';
import { APIGatewayProxyEventV2Schema } from '@aws-lambda-powertools/parser/schemas/api-gatewayv2';
import { z } from 'zod';

export const schema = APIGatewayProxyEventV2Schema.extend({
  body: JSONStringified(
    z.object({
      name: z.string(),
      age: z.number(),
    }),
  ),
});
export type ExtendedAPIGatewayEvent = z.infer<typeof schema>;

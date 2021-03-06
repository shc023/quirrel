import { FastifyPluginCallback } from "fastify";
import { UsageMeter } from "../../shared/usage-meter";

import * as DELETEUsageResponseSchema from "../schemas/usage/DELETE/response.json";
import { DELETEUsageResponse } from "../types/usage/DELETE/response";

const usageRoute: FastifyPluginCallback = async (fastify, opts, done) => {
  const usageMeter = new UsageMeter(fastify.redis);

  fastify.addHook("onRequest", fastify.basicAuth);

  fastify.delete<{ Reply: DELETEUsageResponse }>("/", {
    schema: {
      response: {
        data: DELETEUsageResponseSchema,
      },
    },
    async handler(request, reply) {
      const usage = await usageMeter.readAndReset();
      reply.status(200).send(usage);
    },
  });

  done();
};

export default usageRoute;

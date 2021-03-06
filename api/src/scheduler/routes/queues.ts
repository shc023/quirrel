import { FastifyPluginCallback } from "fastify";

import * as EndpointParamsSchema from "../schemas/queues/endpoint-params.json";
import * as SCANQueryStringSchema from "../schemas/queues/scan-querystring.json";
import * as EndpointJobIDParamsSchema from "../schemas/queues/endpoint-jobid-params.json";
import * as POSTQueuesEndpointBodySchema from "../schemas/queues/POST/body.json";
import { POSTQueuesEndpointBody } from "../types/queues/POST/body";
import { SCANQuerystringParams } from "../types/queues/scan-querystring";
import { QueuesEndpointParams } from "../types/queues/endpoint-params";
import { QueuesEndpointIdParams } from "../types/queues/endpoint-jobid-params";

import { JobsRepo } from "../jobs-repo";

const jobs: FastifyPluginCallback = (fastify, opts, done) => {
  const jobsRepo = new JobsRepo(fastify.redis);

  fastify.post<{ Body: POSTQueuesEndpointBody; Params: QueuesEndpointParams }>(
    "/:endpoint",
    {
      schema: {
        body: {
          data: POSTQueuesEndpointBodySchema,
        },
        params: {
          data: EndpointParamsSchema,
        },
      },

      async handler(request, reply) {
        const [tokenId, done] = await fastify.tokenAuth.authenticate(
          request,
          reply
        );
        if (done) {
          return;
        }

        const job = await jobsRepo.enqueue(
          tokenId,
          request.params.endpoint,
          request.body
        );

        reply.status(201).send(job);
      },
    }
  );

  fastify.get<{ Params: QueuesEndpointParams, Querystring: SCANQuerystringParams }>("/", {
    schema: {
      params: {
        data: EndpointParamsSchema,
      },
      querystring: {
        data: SCANQueryStringSchema
      }
    },
    async handler(request, reply) {
      const [tokenId, done] = await fastify.tokenAuth.authenticate(
        request,
        reply
      );
      if (done) {
        return;
      }

      const { cursor, jobs } = await jobsRepo.findByTokenId(tokenId, { cursor: request.query.cursor ?? 0});

      reply.status(200).send({
        cursor,
        jobs,
      });
    },
  });

  fastify.get<{ Params: QueuesEndpointParams, Querystring: SCANQuerystringParams }>("/:endpoint", {
    schema: {
      params: {
        data: EndpointParamsSchema,
      },
      querystring: {
        data: SCANQueryStringSchema
      }
    },
    async handler(request, reply) {
      const [tokenId, done] = await fastify.tokenAuth.authenticate(
        request,
        reply
      );
      if (done) {
        return;
      }

      const { cursor, jobs } = await jobsRepo.find(
        tokenId,
        request.params.endpoint,
        {
          cursor: request.query.cursor ?? 0
        }
      );

      reply.status(200).send({
        cursor,
        jobs,
      });
    },
  });

  fastify.get<{ Params: QueuesEndpointIdParams }>("/:endpoint/:id", {
    schema: {
      params: {
        data: EndpointJobIDParamsSchema,
      },
    },

    async handler(request, reply) {
      const [tokenId, done] = await fastify.tokenAuth.authenticate(
        request,
        reply
      );
      if (done) {
        return;
      }

      const { endpoint, id } = request.params;

      const job = await jobsRepo.findById(tokenId, endpoint, id);
      if (job) {
        reply.status(200).send(job);
      } else {
        reply.status(404).send("Not Found");
      }
    },
  });

  fastify.post<{ Params: QueuesEndpointIdParams }>("/:endpoint/:id", {
    schema: {
      params: {
        data: EndpointJobIDParamsSchema,
      },
    },

    async handler(request, reply) {
      const [tokenId, done] = await fastify.tokenAuth.authenticate(
        request,
        reply
      );
      if (done) {
        return;
      }

      const { endpoint, id } = request.params;

      const job = await jobsRepo.invoke(tokenId, endpoint, id);
      if (job) {
        reply.status(200).send(job);
      } else {
        reply.status(404).send("Not Found");
      }
    },
  });

  fastify.delete<{ Params: QueuesEndpointIdParams }>("/:endpoint/:id", {
    schema: {
      params: {
        data: EndpointJobIDParamsSchema,
      },
    },

    async handler(request, reply) {
      const [tokenId, done] = await fastify.tokenAuth.authenticate(
        request,
        reply
      );
      if (done) {
        return;
      }

      const { endpoint, id } = request.params;

      const deletedJob = await jobsRepo.delete(tokenId, endpoint, id);

      if (deletedJob) {
        reply.status(200).send(deletedJob);
      } else {
        reply.status(404).send("Not Found");
      }
    },
  });

  fastify.addHook("onClose", async () => {
    await jobsRepo.close();
  });

  done();
};

export default jobs;

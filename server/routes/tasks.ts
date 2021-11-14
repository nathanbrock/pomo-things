import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

require('dotenv').config()
const THINGS_AUTH_TOKEN = process.env.THINGS_AUTH_TOKEN;

const open = require('open');

import { getTasksByProject } from '../things';

type GetRequest = FastifyRequest<{
    Querystring: { projectId: String };
}>
const getHandler = async (request: GetRequest) => {
    const { projectId } = request.query
    const result = await getTasksByProject(projectId);
    return result || [];
}

type PatchRequest = FastifyRequest<{
    Params: { uuid: String };
}>
const patchHandler = async (request: PatchRequest, reply: FastifyReply) => {
    const { uuid } = request.params;
    open(`things:///update?auth-token=${THINGS_AUTH_TOKEN}&id=${uuid}&add-tags=%F0%9F%8D%85&reveal=true`);

    reply.code(202)
    return {};
}

const mountTaskEndppints = (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) => {
    const getOpts = {
        schema: {
            querystring: {
                type: "object",
                properties: {
                    projectId: {
                        type: "string",
                        pattern: "^[a-zA-Z0-9-]*$"
                    },
                },
                required: ["projectId"],
            },
        },
    };

    fastify.get('/tasks', getOpts, getHandler);
    fastify.patch('/tasks/:uuid', patchHandler);

    done();
}

export default mountTaskEndppints;
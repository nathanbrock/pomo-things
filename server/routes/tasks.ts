import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';

require('dotenv').config()
const THINGS_AUTH_TOKEN = process.env.THINGS_AUTH_TOKEN;

const open = require('open');

import { getDB } from '../things';

type GetRequest = FastifyRequest<{
    Querystring: { projectId: String };
}>
const getHandler = async (request: GetRequest) => {
    const db = await getDB();
    const { projectId } = request.query
    const result = await db.all(`
        SELECT uuid, title
        FROM TMTask
        WHERE(
        (project = '${projectId}' AND type = 0) OR
        (actionGroup IN(SELECT uuid FROM TMTask WHERE project = '${projectId}' and type = 2 ORDER BY \`index\` ASC))
        ) AND trashed = 0 AND status = 0
        ORDER BY \`index\` DESC`);

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

export default function (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) {
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
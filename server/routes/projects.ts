import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { getProjectByArea } from '../things';

type GetRequest = FastifyRequest<{
    Querystring: { areaId: String };
}>
const getHandler = async (request: GetRequest) => {
    const { areaId } = request.query
    const result = await getProjectByArea(areaId);
    return result;
}

const mountProjectEndpoints = (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) => {
    const getOpts = {
        schema: {
            querystring: {
                type: "object",
                properties: {
                    areaId: {
                        type: "string",
                        pattern: "^[a-zA-Z0-9-]*$"
                    },
                },
                required: ["areaId"],
            },
        },
    };

    fastify.get('/projects', getOpts, getHandler);
    done();
}

export default mountProjectEndpoints;
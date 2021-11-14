import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { getDB } from '../things';

type GetRequest = FastifyRequest<{
    Querystring: { areaId: String };
}>

const getHandler = async (request: GetRequest) => {
    const db = await getDB();
    const { areaId } = request.query

    let areaWhereCondition = areaId === "0" ? 'area IS NULL' : `area = '${areaId}'`;

    const result = await db.all(`SELECT uuid, type, title, area FROM TMTask WHERE type = 1 and status = 0 and trashed = 0 and ${areaWhereCondition} ORDER BY \`index\` ASC`);

    return result;
}

export default function (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) {
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

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getAreas } from '../things';

const getHandler = async () => {
    const result = await getAreas();
    return result;
}

const mountAreaEndpoints = (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) => {
    fastify.get('/areas', getHandler);
    done();
}

export default mountAreaEndpoints;
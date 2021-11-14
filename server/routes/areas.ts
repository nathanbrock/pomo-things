import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getAreas } from '../things';

type ThingsArea = {
    uuid: String,
    title: String
};
export const getHandler = async (): Promise<ThingsArea[]> => {
    const result: ThingsArea[] = await getAreas();
    return result;
}

const mountAreaEndpoints = (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) => {
    fastify.get('/areas', getHandler);
    done();
}

export default mountAreaEndpoints;
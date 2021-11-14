import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getDB } from '../things';

const getHandler = async () => {
    const db = await getDB();
    
    const result = await db.all('SELECT uuid, title FROM TMArea ORDER BY `index` ASC');
    const nonResult = await db.all(`SELECT uuid, type, title, area FROM TMTask WHERE type = 1 and status = 0 and trashed = 0 and area IS NULL`);

    if (nonResult.length > 0) {
        result.push({
            uuid: 0,
            title: 'Area-free projects'
        })
    }

    return result;
}

export default function (fastify: FastifyInstance, _: FastifyPluginOptions, done: () => void) {
    fastify.get('/areas', getHandler);
    done();
}

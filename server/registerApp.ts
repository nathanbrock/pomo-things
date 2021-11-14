import { FastifyInstance } from "fastify";

import areaRoutes from './routes/areas';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';

const registerApp = (fastify: FastifyInstance) => {
    const corsOptions = {
      origin: process.env.FASTIFY_CORS_ORIGIN,
      methods: "GET,PATCH,OPTIONS",
      allowedHeaders: ['Content-Type']
    }
    fastify.register(require('fastify-cors'), corsOptions)
    
    fastify.register(areaRoutes);
    fastify.register(projectRoutes);
    fastify.register(taskRoutes);
  
    return fastify;
}

export default registerApp;

import fastify from "fastify";

import areaRoutes from './routes/areas';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';

require('dotenv').config()
const app = fastify({ logger: true })

const corsOptions = {
  origin: process.env.FASTIFY_CORS_ORIGIN,
  methods: "GET,PATCH,OPTIONS",
  allowedHeaders: ['Content-Type']
}
app.register(require('fastify-cors'), corsOptions)

app.register(areaRoutes);
app.register(projectRoutes);
app.register(taskRoutes);

const start = async () => {
  const port = parseInt(process.env.FASTIFY_SERVER_PORT as string)

  try {
    await app.listen(port)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
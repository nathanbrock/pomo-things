import fastify from "fastify";
import registerApp from './registerApp';

require('dotenv').config()

const start = async () => {
  const app = fastify({ logger: true })
  registerApp(app);

  const port = parseInt(process.env.FASTIFY_SERVER_PORT as string)

  try {
    await app.listen(port)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
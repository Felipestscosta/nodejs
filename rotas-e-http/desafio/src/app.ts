import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { snacksRoutes } from './routes/snacks'
import { usersRoutes } from './routes/usersx'

export const app = fastify()

// Plugins
app.register(cookie)
app.register(usersRoutes, {
  prefix: 'users'
})
app.register(snacksRoutes, {
  prefix: 'snacks'
})
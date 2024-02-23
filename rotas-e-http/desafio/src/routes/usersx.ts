import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
    
  app.get('/', async () => {

    const users = await knex('users')
    .select()

    return {
      users
    }
  })

  app.get('/:id', async (req) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getUsersParamsSchema.parse(req.params)

    const user = await knex('users')
    .where('id', id)
    .first()

    return {
        user
    }
  })
  
  app.post('/', async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      avatar_url: z.string()
    })

    const { name, avatar_url } = createUserBodySchema.parse(req.body)
    
    await knex('users')
    .insert({
      id: crypto.randomUUID(),
      name,
      avatar_url
    })

    res.status(201).send()
    
  })

  app.delete('/:id', async (req, res) => {
    const getUsersParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getUsersParamsSchema.parse(req.params)

    await knex('users')
    .where('id', id)
    .del()

    res.status(204).send()
  })

}

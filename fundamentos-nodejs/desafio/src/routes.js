import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-routh-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      )

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body
      const currentDate = new Date()

      if(!title || !description){
        return res.writeHead(400).end()
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: currentDate,
        updated_at: null
      }

      database.insert("tasks", task)

      return res.writeHead(201).end()
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params

      const verifyIdExist = database.select('tasks', { id })

      if(verifyIdExist.length === 0){
        return res.writeHead(404).end(JSON.stringify('Sorry... Task not found.'))
      }

      database.delete("tasks", id)

      return res.writeHead(204).end()
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description, completed_at  } = req.body
      const currentDate =  new Date()

      if(!title || !description){
        return res.writeHead(400).end()
      }

      const verifyIdExist = database.select('tasks', { id })

      if(verifyIdExist.length === 0){
        return res.writeHead(404).end(JSON.stringify('Sorry... Task not found.'))
      }


      database.update("tasks", id, {
        title,
        description,
        completed_at: completed_at ? currentDate : null,
        updated_at: currentDate
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: async(req, res) => {
      const { id } = req.params
      const { completed_at } = req.body

      const currentDate =  new Date()

      const verifyIdExist = database.select('tasks', { id })

      if(verifyIdExist.length === 0){
        return res.writeHead(404).end(JSON.stringify('Sorry... Task not found.'))
      }

      database.update("tasks", id, {
        completed_at: completed_at ? currentDate : null
      })

      return res.writeHead(204).end()
    },
  },
]

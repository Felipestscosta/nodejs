import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { knex } from "../database";

export async function snacksRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const snacks = await knex("snacks").select();

    return {
      snacks,
    };
  });

  app.get("/:id", async (req) => {
    const getSnacksParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getSnacksParamsSchema.parse(req.params);

    const snack = await knex("snacks").where("id", id).first();

    return {
      snack,
    };
  });

  app.get("/user/:user_id/filter", async (req) => {
    const getSnacksParamsSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = getSnacksParamsSchema.parse(req.params);

    const getSnacksByUserSchema = z.object({
      total: z.string().optional(),
      diet_include: z.string().optional(),
      diet_not_include: z.string().optional(),
      best_sequence: z.string().optional(),
    });

    const { total, diet_include, diet_not_include, best_sequence } =
      getSnacksByUserSchema.parse(req.query);

    if (total === "true") {
      return await knex("snacks").where("user_id", user_id).count();
    }

    if (diet_include === "true") {
      return await knex("snacks")
        .where({ user_id, diet_include: true })
        .count();
    }

    if (diet_not_include === "true") {
      return await knex("snacks")
        .where({ user_id, diet_include: false })
        .count();
    }

    if (best_sequence === "true") {
      return await knex("snacks").where({ user_id, diet_include: true });
    }

    const snack = await knex("snacks").where("user_id", user_id);

    return {
      snack,
    };
  });

  app.post("/", async (req, res) => {
    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.number(),
      diet_include: z.boolean(),
      user_id: z.string().uuid(),
    });

    const { name, description, date, hour, diet_include, user_id } =
      createSnackBodySchema.parse(req.body);

    await knex("snacks").insert({
      id: crypto.randomUUID(),
      name,
      description,
      date,
      hour,
      diet_include,
      user_id,
    });

    res.status(201).send();
  });

  app.put("/:id", async (req, res) => {
    const createIdSnackSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = createIdSnackSchema.parse(req.params);

    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.number(),
      diet_include: z.boolean(),
    });

    const { name, description, date, hour, diet_include } =
      createSnackBodySchema.parse(req.body);

    await knex("snacks").where("id", id).update({
      id: crypto.randomUUID(),
      name,
      description,
      date,
      hour,
      diet_include,
    });

    res.status(201).send();
  });

  app.put("/:id/user/:user_id", async (req, res) => {
    const createIdUserSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = createIdUserSchema.parse(req.params);

    const createIdSnackSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = createIdSnackSchema.parse(req.params);

    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.number(),
      diet_include: z.boolean(),
    });

    const { name, description, date, hour, diet_include } =
      createSnackBodySchema.parse(req.body);

    const existSnackByUser = await knex("snacks")
      .where({
        id,
        user_id,
      })
      .count("", { as: "total" });

    if (existSnackByUser[0].total === 0) {
      return res.status(400).send('Sorry. This Snack does not belong to your user.')
    }

    await knex("snacks").where("id", id).update({
      name,
      description,
      date,
      hour,
      diet_include,
    });

    res.status(201).send();
  });

  app.delete("/:id", async (req, res) => {
    const getSnacksParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getSnacksParamsSchema.parse(req.params);

    await knex("snacks").where("id", id).del();

    res.status(204).send();
  });

  app.delete("/:id/user/:user_id", async (req, res) => {
    const createIdUserSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = createIdUserSchema.parse(req.params);

    const createIdSnackSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = createIdSnackSchema.parse(req.params);

    const existSnackByUser = await knex("snacks")
      .where({
        id,
        user_id,
      })
      .count("", { as: "total" });

    if (existSnackByUser[0].total === 0) {
      return res.status(400).send('Sorry. This Snack does not belong to your user.')
    }

    await knex("snacks").where("id", id).del();

    res.status(200).send();
  });
}

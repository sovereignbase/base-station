import type { Context } from "hono";

export type AppContext = Context<{ Bindings: Env }>;

export type CustomerData = {
  id: string;
  allowedOrigins: [];
};

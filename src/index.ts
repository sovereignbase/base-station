import { z } from "zod";
import { Hono } from "hono";
import { fromHono, OpenAPIRoute } from "chanfana";
import type { AppContext } from "./types.js";

export class ProxyResolver extends OpenAPIRoute {
  schema = {
    tags: ["Relay"],
    summary: "Upgrade to WebSocket for relay session",
    request: {
      headers: z.object({
        upgrade: z.string(),
        connection: z.string(),
        "sec-websocket-key": z.string().min(1),
        "sec-websocket-version": z.literal("13"),
      }),
    },
    responses: {
      "101": { description: "WebSocket upgrade" },
      "400": {
        description: "Not a WebSocket handshake",
        content: {
          "application/json": {
            schema: z.object({
              ok: z.literal(false),
              error: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(context: AppContext) {
    const validated = await this.getValidatedData<typeof this.schema>();

    const upgrade = validated.headers.upgrade.toLowerCase();
    const connection = validated.headers.connection.toLowerCase();
    if (upgrade !== "websocket" || !connection.includes("upgrade")) {
      return context.json(
        {
          ok: false,
          error: "Expected a WebSocket handshake (Upgrade headers).",
        },
        400,
      );
    }
    return context.env.USER_PROXY.get(
      context.env.USER_PROXY.newUniqueId(),
    ).fetch(context.req.raw);
  }
}

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/docs",
});

// Register OpenAPI endpoints
openapi.get("*", ProxyResolver);

// Export the Hono app
export default app;
export { UserProxy } from "./UserProxy/class.js";
export { ResourceProxy } from "./ResourceProxy/class.js";

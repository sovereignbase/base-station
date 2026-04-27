import { z } from "zod";
import { OpenAPIRoute } from "chanfana";
import type { AppContext } from "../.types/index.js";
import { fetchClientConfig, isAllowedOrigin } from "../.helpers/index.js";
import { Cryptographic } from "@sovereignbase/cryptosuite";

export class BaseStationResolver extends OpenAPIRoute {
  schema = {
    tags: ["Base station", "Sovereignbase"],
    summary: "Upgrade to WebSocket for base station session",
    request: {
      headers: z.object({
        origin: z.string(),
        upgrade: z.string(),
        connection: z.string(),
        "cf-connecting-ip": z.string(),
        "sec-websocket-key": z.string().min(1),
        "sec-websocket-version": z.literal("13"),
      }),
      params: z.object({
        clientId: z.string().min(64),
      }),
    },
    responses: {
      "101": { description: "WebSocket upgrade" },
      "404": {
        description: "Not found.",
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
    const clientId = validated.params.clientId;

    const billing = await fetchClientConfig(
      context.env,
      context.executionCtx,
      clientId,
    );
    if (!billing) return context.text("Not found", 404);

    if (!Cryptographic.identifier.validate(billing.clientId))
      return context.text("Not found", 404);

    const origin = validated.headers.origin.toLowerCase();
    if (!isAllowedOrigin(origin, billing.allowedOrigins))
      return context.text("Not found", 404);

    const upgrade = validated.headers.upgrade.toLowerCase();
    const connection = validated.headers.connection.toLowerCase();
    if (upgrade !== "websocket" || !connection.includes("upgrade"))
      return context.text("Not found", 404);

    return context.env.BASE_STATION.get(
      context.env.BASE_STATION.newUniqueId(),
    ).fetch(context.req.raw);
  }
}

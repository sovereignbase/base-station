import type { AppContext, IceServers } from "../types.js";
export async function generateIceServers(ctx: AppContext): Promise<IceServers> {
  return fetch(
    `https://rtc.live.cloudflare.com/v1/turn/keys/${ctx.env.TURN_TOKEN_ID}/credentials/generate-ice-servers`,
    {
      headers: {
        Authorization: `Bearer ${await ctx.env.TURN_API_TOKEN.get()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl: 86400 }),
    },
  ).then((raw) => raw.json());
}

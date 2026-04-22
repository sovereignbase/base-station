import type { AppContext, CustomerData } from "../types.js";
export async function generateIceServers(
  ctx: AppContext,
): Promise<RTCIceServer[] | false> {
  const raw = await fetch(
    `https://rtc.live.cloudflare.com/v1/turn/keys/${ctx.env.TURN_TOKEN_ID}/credentials/generate-ice-servers`,
    {
      headers: {
        Authorization: `Bearer ${await ctx.env.TURN_API_TOKEN.get()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl: 86400 }),
    },
  );
  const json = await raw.json();
  if (typeof json === "object" && Object.hasOwn(json, "iceServers")) {
    const { iceServers } = json as { iceServers: RTCIceServer[] };
    return iceServers;
  }
  return false;
}

async function fetchCustomerData(
  ctx: AppContext,
  id: string,
): Promise<CustomerData | false> {
  const speculativePromise = ctx.env.CUSTOMER_DATA.head(id);
  let data = await caches.default.match(
    `https://cache.sovereignbase.dev/${id}`,
  );
  if (!data) {
    if (!(await speculativePromise)) return false;
    data = await ctx.env.CUSTOMER_DATA.get(id);
    data.json();
  }
  return data as CustomerData;
}

/// <reference lib="dom" />

import type { Context } from "hono";

export type AppContext = Context<{ Bindings: Env }>;

export type BillingData = {
  id: string;
  allowedOrigins: string[];
  stripeCustomerId: string | undefined;
};

export type BaseStationMessage = {
  kind: "iceServers";
  detail: RTCIceServer[] | false;
};

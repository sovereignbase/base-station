import type { Context } from "hono";

export type AppContext = Context<{ Bindings: Env }>;

export type IceServers = {
  iceServers: [
    {
      urls: Array<string>;
      username: string;
      credential: string;
    },
  ];
};

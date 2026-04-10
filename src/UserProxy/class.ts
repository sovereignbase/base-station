// src/DurableObject/ResourceProxy.ts

import { DurableObject } from "cloudflare:workers";

export class UserProxy extends DurableObject<Env> {
  private topics = [];
  private peerOffer = null;
  async fetch(): Promise<Response> {
    const { 0: clientWebSocket, 1: serverWebSocket } = new WebSocketPair();
    this.ctx.acceptWebSocket(serverWebSocket);

    return new Response(null, { status: 101, webSocket: clientWebSocket });
  }

  async webSocketMessage(sender: WebSocket, message: ArrayBuffer | string) {}

  webSocketClose(socket: WebSocket) {}

  webSocketError(socket: WebSocket, error: unknown) {}
}

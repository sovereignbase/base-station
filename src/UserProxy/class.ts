import { DurableObject } from "cloudflare:workers";

export class UserProxy extends DurableObject<Env> {
  private topics = [];
  private peerOffer = null;
  private resourceProxy = this.env.RESOURCE_PROXY;
  async fetch(): Promise<Response> {
    const { 0: clientWebSocket, 1: serverWebSocket } = new WebSocketPair();
    this.ctx.acceptWebSocket(serverWebSocket);

    return new Response(null, { status: 101, webSocket: clientWebSocket });
  }

  async webSocketMessage(sender: WebSocket, message: ArrayBuffer) {
    this.resourceProxy.getByName("").subscribe(this.ctx.id.toString());
  }

  webSocketClose(socket: WebSocket) {}

  webSocketError(socket: WebSocket, error: unknown) {}
  async deliver() {}
}

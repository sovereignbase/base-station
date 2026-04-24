import { encode, decode } from "@msgpack/msgpack";
import { Cryptographic } from "@sovereignbase/cryptosuite";
import type {
  ActorMessage,
  ActorMessageHandlerEventMap,
  ActorMessageHandlerEventListenerFor,
} from "../.types/index.js";

/**
 * ANBS actor message handler.
 */
export class ActorMessageHandler {
  private static readonly eventTarget: EventTarget;

  /**
   * Ingests an encoded ANBS protocol message.
   *
   * @param message The encoded message.
   */
  static ingest(message: ArrayBuffer) {
    if (!(message instanceof ArrayBuffer))
      return void this.eventTarget.dispatchEvent(
        new CustomEvent("violation", { detail: "Wrong message encoding" }),
      );
    let decoded = undefined;

    try {
      decoded = decode(message) as ActorMessage;
    } catch {
      return void this.eventTarget.dispatchEvent(
        new CustomEvent("violation", { detail: "Wrong message encoding" }),
      );
    }

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !Object.hasOwn(decoded, "kind") ||
      !Object.hasOwn(decoded, "detail")
    )
      return void this.eventTarget.dispatchEvent(
        new CustomEvent("violation", { detail: "Wrong message shape" }),
      );

    switch (decoded.kind) {
      case "resourceBackup": {
        const { detail } = decoded;
        if (
          !Object.hasOwn(detail, "id") ||
          !Object.hasOwn(detail, "iv") ||
          !Object.hasOwn(detail, "ciphertext")
        )
          return void this.eventTarget.dispatchEvent(
            new CustomEvent("violation", { detail: "Wrong message shape" }),
          );
        const { id, iv, ciphertext } = detail;
        if (
          !Cryptographic.identifier.validate(id) ||
          !(iv instanceof Uint8Array) ||
          !(ciphertext instanceof ArrayBuffer)
        )
          return void this.eventTarget.dispatchEvent(
            new CustomEvent("violation", { detail: "Wrong message shape" }),
          );

        return void this.eventTarget.dispatchEvent(
          new CustomEvent("backup", {
            detail: { id, buffer: encode({ iv, ciphertext }) },
          }),
        );
      }
      case "iceServers": {
        return void this.eventTarget.dispatchEvent(
          new CustomEvent("iceServers"),
        );
      }
    }
  }

  /**
   * @param type The event type.
   * @param listener The listener callback.
   * @param options The listener options.
   */
  static addEventListener<K extends keyof ActorMessageHandlerEventMap>(
    type: K,
    listener: ActorMessageHandlerEventListenerFor<K> | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    void this.eventTarget.addEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options,
    );
  }

  /**
   * @param type The event type.
   * @param listener The listener to remove.
   * @param options The listener options.
   */
  static removeEventListener<K extends keyof ActorMessageHandlerEventMap>(
    type: K,
    listener: ActorMessageHandlerEventListenerFor<K> | null,
    options?: boolean | EventListenerOptions,
  ): void {
    void this.eventTarget.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options,
    );
  }
}

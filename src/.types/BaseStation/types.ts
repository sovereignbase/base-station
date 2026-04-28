/// <reference lib="dom" />

import type { StripeCheckoutStatus, StripeInvoiceStatus } from '../types.js'

/**
 * Message sent by the base station to a connected base station client (Usually a ANBS actor).
 */
export type BaseStationMessage =
  | {
      /**
       * Response containing generated WebRTC ICE servers.
       */
      kind: 'iceServers'

      /**
       * ICE server response details.
       */
      detail: {
        /**
         * Transaction id that correlates the response to a request.
         */
        id: string

        /**
         * Generated ICE servers, or `false` when they could not be generated.
         */
        iceServers: RTCIceServer[] | false
      }
    }
  | {
      /**
       * Response containing a Stripe Checkout Session payment status.
       */
      kind: 'checkoutStatus'

      /**
       * Checkout status response details.
       */
      detail: {
        /**
         * Transaction id that correlates the response to a request.
         */
        id: string

        /**
         * Stripe checkout payment status, or `false` when unavailable.
         */
        checkoutStatus: false | StripeCheckoutStatus
      }
    }
  | {
      /**
       * Response containing a Stripe invoice status.
       */
      kind: 'invoiceStatus'

      /**
       * Invoice status response details.
       */
      detail: {
        /**
         * Transaction id that correlates the response to a request.
         */
        id: string

        /**
         * Stripe invoice status, or `false` when unavailable.
         */
        invoiceStatus: false | StripeInvoiceStatus
      }
    }

/**
 * Maps `BaseStationMessageHandler` event names to DOM event objects.
 */
export type BaseStationMessageHandlerEventMap = {
  /**
   * Emitted for validated ICE server responses.
   */
  iceServers: CustomEvent<Extract<BaseStationMessage, { kind: 'iceServers' }>>

  /**
   * Emitted for validated Stripe Checkout Session status responses.
   */
  checkoutStatus: CustomEvent<
    Extract<BaseStationMessage, { kind: 'checkoutStatus' }>
  >

  /**
   * Emitted for validated Stripe invoice status responses.
   */
  invoiceStatus: CustomEvent<
    Extract<BaseStationMessage, { kind: 'invoiceStatus' }>
  >
}

/**
 * Listener accepted by `BaseStationMessageHandler`.
 */
export type BaseStationMessageHandlerEventListener<
  K extends keyof BaseStationMessageHandlerEventMap,
> =
  | ((event: BaseStationMessageHandlerEventMap[K]) => void)
  | { handleEvent(event: BaseStationMessageHandlerEventMap[K]): void }

/**
 * Resolves a `BaseStationMessageHandler` event name to its listener type.
 */
export type BaseStationMessageHandlerEventListenerFor<K extends string> =
  K extends keyof BaseStationMessageHandlerEventMap
    ? BaseStationMessageHandlerEventListener<K>
    : EventListenerOrEventListenerObject

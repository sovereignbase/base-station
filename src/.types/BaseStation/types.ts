/// <reference lib="dom" />

import type { StripeCheckoutStatus, StripeInvoiceStatus } from '../types.js'

/**
 * Message sent by the base station to a connected base station client (Usually a ANBS actor).
 */
export type BaseStationMessage =
  | {
      /**
       * Transaction id that correlates the response to a request.
       */
      id: string

      /**
       * Response containing generated WebRTC ICE servers.
       */
      kind: 'iceServers'

      /**
       * ICE server response details.
       */
      detail: {
        /**
         * Generated ICE servers, or `false` when they could not be generated.
         */
        iceServers: RTCIceServer[] | false
      }
    }
  | {
      /**
       * Transaction id that correlates the response to a request.
       */
      id: string
      /**
       * Response containing a Stripe Checkout Session payment status.
       */
      kind: 'checkoutStatus'

      /**
       * Checkout status response details.
       */
      detail: {
        /**
         * Stripe checkout payment status, or `false` when unavailable.
         */
        checkoutStatus: false | StripeCheckoutStatus
      }
    }
  | {
      /**
       * Transaction id that correlates the response to a request.
       */
      id: string
      /**
       * Response containing a Stripe invoice status.
       */
      kind: 'invoiceStatus'

      /**
       * Invoice status response details.
       */
      detail: {
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
  iceServers: CustomEvent<{
    id: string
    iceServers: Extract<
      BaseStationMessage,
      { kind: 'iceServers' }
    >['detail']['iceServers']
  }>

  /**
   * Emitted for validated Stripe Checkout Session status responses.
   */
  checkoutStatus: CustomEvent<{
    id: string
    checkoutStatus: Extract<
      BaseStationMessage,
      { kind: 'checkoutStatus' }
    >['detail']['checkoutStatus']
  }>

  /**
   * Emitted for validated Stripe invoice status responses.
   */
  invoiceStatus: CustomEvent<{
    id: string

    invoiceStatus: Extract<
      BaseStationMessage,
      { kind: 'invoiceStatus' }
    >['detail']['invoiceStatus']
  }>
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

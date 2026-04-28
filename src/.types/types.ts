import type { Context } from 'hono'

/**
 * Hono request context for the ANBS base station Worker.
 */
export type AppContext = Context<{ Bindings: Env }>

/**
 * Persisted configuration for one ANBS base station client.
 */
export type ClientConfig = {
  /**
   * Opaque client identifier used to resolve the base station configuration.
   */
  clientId: string

  /**
   * Origins that are allowed to open a base station WebSocket session.
   */
  allowedOrigins: string[]

  /**
   * Stripe customer identifier associated with the client, when available.
   */
  stripeCustomerId: string | undefined
}

/**
 * Stripe Checkout Session payment statuses exposed by base station responses.
 */
export type StripeCheckoutStatus = 'paid' | 'unpaid' | 'no_payment_required'

/**
 * Stripe invoice statuses exposed by base station responses.
 */
export type StripeInvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'uncollectible'
  | 'void'
  | null

export type * from './BaseStation/types.js'
export type * from './BaseStationClient/types.js'

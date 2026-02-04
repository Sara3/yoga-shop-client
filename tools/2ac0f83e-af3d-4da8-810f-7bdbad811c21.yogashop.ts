import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop",
   serverVersion: "1.0.0",
   description: "Custom MCP server",
} as const;

/**
 * The type of the input parameter for browse_classes tool.
 */
export type browse_classesParams = {

}

/**
 * The type of the output of the browse_classes tool.
 */
export type browse_classesOutput = any

/**
 * List available yoga classes (id, title, price).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function browse_classes(
  sdk: ServerSdk,
  params: browse_classesParams
): Promise<browse_classesOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/browse_classes", params) as browse_classesOutput;
}

/**
 * The type of the input parameter for get_class_preview tool.
 */
export type get_class_previewParams = {
  // Class id (e.g. "1", "2", "3")
  classId: string
}

/**
 * The type of the output of the get_class_preview tool.
 */
export type get_class_previewOutput = any

/**
 * Get the free preview URL for a yoga class.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_class_preview(
  sdk: ServerSdk,
  params: get_class_previewParams
): Promise<get_class_previewOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/get_class_preview", params) as get_class_previewOutput;
}

/**
 * The type of the input parameter for get_class_full tool.
 */
export type get_class_fullParams = {
  // Class id (e.g. "1", "2", "3")
  classId: string,
  // X-Payment header value after paying via x402
  xPayment?: string
}

/**
 * The type of the output of the get_class_full tool.
 */
export type get_class_fullOutput = any

/**
 * Get full video URL for a class. Without xPayment returns 402 payment requirements; with valid xPayment returns content_url and tx_hash.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_class_full(
  sdk: ServerSdk,
  params: get_class_fullParams
): Promise<get_class_fullOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/get_class_full", params) as get_class_fullOutput;
}

/**
 * The type of the input parameter for browse_products tool.
 */
export type browse_productsParams = {

}

/**
 * The type of the output of the browse_products tool.
 */
export type browse_productsOutput = any

/**
 * List physical products (yoga mat, strap) with id and price.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function browse_products(
  sdk: ServerSdk,
  params: browse_productsParams
): Promise<browse_productsOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/browse_products", params) as browse_productsOutput;
}

/**
 * The type of the input parameter for acp_create_checkout tool.
 */
export type acp_create_checkoutParams = {
  quantity?: number,
  // Product id
  product_id: ('mat' | 'strap')
}

/**
 * The type of the output of the acp_create_checkout tool.
 */
export type acp_create_checkoutOutput = any

/**
 * Create an ACP checkout session (cart). Returns checkout_session_id and total.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function acp_create_checkout(
  sdk: ServerSdk,
  params: acp_create_checkoutParams
): Promise<acp_create_checkoutOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/acp_create_checkout", params) as acp_create_checkoutOutput;
}

/**
 * The type of the input parameter for acp_update_checkout tool.
 */
export type acp_update_checkoutParams = {
  quantity?: number,
  shipping_address?: {

  },
  // Session id from acp_create_checkout
  checkout_session_id: string
}

/**
 * The type of the output of the acp_update_checkout tool.
 */
export type acp_update_checkoutOutput = any

/**
 * Update an open ACP checkout (quantity or shipping_address).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function acp_update_checkout(
  sdk: ServerSdk,
  params: acp_update_checkoutParams
): Promise<acp_update_checkoutOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/acp_update_checkout", params) as acp_update_checkoutOutput;
}

/**
 * The type of the input parameter for acp_complete_checkout tool.
 */
export type acp_complete_checkoutParams = {
  // Payment token (demo: use "demo_token")
  payment_token: string,
  // Session id from acp_create_checkout
  checkout_session_id: string
}

/**
 * The type of the output of the acp_complete_checkout tool.
 */
export type acp_complete_checkoutOutput = any

/**
 * Complete ACP checkout with payment token. Demo accepts any token (e.g. "demo_token"); charges via Stripe.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function acp_complete_checkout(
  sdk: ServerSdk,
  params: acp_complete_checkoutParams
): Promise<acp_complete_checkoutOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/acp_complete_checkout", params) as acp_complete_checkoutOutput;
}

/**
 * The type of the input parameter for acp_cancel_checkout tool.
 */
export type acp_cancel_checkoutParams = {
  // Session id from acp_create_checkout
  checkout_session_id: string
}

/**
 * The type of the output of the acp_cancel_checkout tool.
 */
export type acp_cancel_checkoutOutput = any

/**
 * Cancel an open ACP checkout session.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function acp_cancel_checkout(
  sdk: ServerSdk,
  params: acp_cancel_checkoutParams
): Promise<acp_cancel_checkoutOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/acp_cancel_checkout", params) as acp_cancel_checkoutOutput;
}

/**
 * The type of the input parameter for acp_get_order tool.
 */
export type acp_get_orderParams = {
  // Order id from acp_complete_checkout
  order_id: string
}

/**
 * The type of the output of the acp_get_order tool.
 */
export type acp_get_orderOutput = any

/**
 * Get order details by order_id (returned from acp_complete_checkout).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function acp_get_order(
  sdk: ServerSdk,
  params: acp_get_orderParams
): Promise<acp_get_orderOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/acp_get_order", params) as acp_get_orderOutput;
}

/**
 * The type of the input parameter for create_checkout tool.
 */
export type create_checkoutParams = {
  quantity?: number,
  // Product id
  productId: ('mat' | 'strap')
}

/**
 * The type of the output of the create_checkout tool.
 */
export type create_checkoutOutput = any

/**
 * Create a Stripe Checkout session (redirect URL). Returns checkout URL.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function create_checkout(
  sdk: ServerSdk,
  params: create_checkoutParams
): Promise<create_checkoutOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/create_checkout", params) as create_checkoutOutput;
}

/**
 * The type of the input parameter for health tool.
 */
export type healthParams = {

}

/**
 * The type of the output of the health tool.
 */
export type healthOutput = any

/**
 * Check if the yoga-commerce API is up.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function health(
  sdk: ServerSdk,
  params: healthParams
): Promise<healthOutput> {
  return await sdk.callTool("2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop/1.0.0/health", params) as healthOutput;
}



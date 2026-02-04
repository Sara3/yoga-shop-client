import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "Tesla-MCP",
   serverVersion: "0.1.0",
   description: "Custom MCP server",
} as const;

/**
 * The type of the input parameter for get_setup_url tool.
 */
export type get_setup_urlParams = {

}

/**
 * The type of the output of the get_setup_url tool.
 */
export type get_setup_urlOutput = any

/**
 * Get the URL to set up your Tesla Developer App credentials (Client ID and Secret). Open this link first if you haven't connected Tesla yet.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_setup_url(
  sdk: ServerSdk,
  params: get_setup_urlParams
): Promise<get_setup_urlOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/get_setup_url", params) as get_setup_urlOutput;
}

/**
 * The type of the input parameter for get_auth_url tool.
 */
export type get_auth_urlParams = {

}

/**
 * The type of the output of the get_auth_url tool.
 */
export type get_auth_urlOutput = any

/**
 * Get the URL to connect your Tesla account (log in with your Tesla email and password). Use this after you've set up credentials.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_auth_url(
  sdk: ServerSdk,
  params: get_auth_urlParams
): Promise<get_auth_urlOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/get_auth_url", params) as get_auth_urlOutput;
}

/**
 * The type of the input parameter for wake_up tool.
 */
export type wake_upParams = {
  // Vehicle to wake up (id, vehicle_id, or vin)
  vehicle_id: string
}

/**
 * The type of the output of the wake_up tool.
 */
export type wake_upOutput = any

/**
 * Wake up your Tesla vehicle from sleep mode. Requires vehicle_id (id, vehicle_id, or vin).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function wake_up(
  sdk: ServerSdk,
  params: wake_upParams
): Promise<wake_upOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/wake_up", params) as wake_upOutput;
}

/**
 * The type of the input parameter for refresh_vehicles tool.
 */
export type refresh_vehiclesParams = {

}

/**
 * The type of the output of the refresh_vehicles tool.
 */
export type refresh_vehiclesOutput = any

/**
 * Refresh the list of Tesla vehicles from the API.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function refresh_vehicles(
  sdk: ServerSdk,
  params: refresh_vehiclesParams
): Promise<refresh_vehiclesOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/refresh_vehicles", params) as refresh_vehiclesOutput;
}

/**
 * The type of the input parameter for debug_vehicles tool.
 */
export type debug_vehiclesParams = {

}

/**
 * The type of the output of the debug_vehicles tool.
 */
export type debug_vehiclesOutput = any

/**
 * Show debug information about your Tesla vehicles (ids, vins, state).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function debug_vehicles(
  sdk: ServerSdk,
  params: debug_vehiclesParams
): Promise<debug_vehiclesOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/debug_vehicles", params) as debug_vehiclesOutput;
}

/**
 * The type of the input parameter for get_vehicle_location tool.
 */
export type get_vehicle_locationParams = {
  // Vehicle to get location for (id, vehicle_id, or vin)
  vehicle_id: string
}

/**
 * The type of the output of the get_vehicle_location tool.
 */
export type get_vehicle_locationOutput = any

/**
 * Get your Tesla's current location (latitude, longitude). Like a parking monitor - where is my car right now. May wake the vehicle briefly.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_vehicle_location(
  sdk: ServerSdk,
  params: get_vehicle_locationParams
): Promise<get_vehicle_locationOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/get_vehicle_location", params) as get_vehicle_locationOutput;
}

/**
 * The type of the input parameter for list_vehicles tool.
 */
export type list_vehiclesParams = {

}

/**
 * The type of the output of the list_vehicles tool.
 */
export type list_vehiclesOutput = any

/**
 * List your Tesla vehicles and get their IDs (id, vehicle_id, vin). Use these with wake_up, get_vehicle_location, etc.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function list_vehicles(
  sdk: ServerSdk,
  params: list_vehiclesParams
): Promise<list_vehiclesOutput> {
  return await sdk.callTool("Tesla-MCP/0.1.0/list_vehicles", params) as list_vehiclesOutput;
}



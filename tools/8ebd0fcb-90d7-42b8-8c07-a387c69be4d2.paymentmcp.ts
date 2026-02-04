import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "8ebd0fcb-90d7-42b8-8c07-a387c69be4d2.paymentmcp",
   serverVersion: "1.0.0",
   description: "Custom MCP server",
} as const;

/**
 * The type of the input parameter for get_auth_status tool.
 */
export type get_auth_statusParams = {

}

/**
 * The type of the output of the get_auth_status tool.
 */
export type get_auth_statusOutput = any

/**
 * Check whether the current session is authenticated and what auth method is in use.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_auth_status(
  sdk: ServerSdk,
  params: get_auth_statusParams
): Promise<get_auth_statusOutput> {
  return await sdk.callTool("8ebd0fcb-90d7-42b8-8c07-a387c69be4d2.paymentmcp/1.0.0/get_auth_status", params) as get_auth_statusOutput;
}



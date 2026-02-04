import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "user-location",
   serverVersion: "1.0.0",
   description: "",
} as const;

/**
 * The type of the input parameter for get_location tool.
 */
export type get_locationParams = {
  // The type of location to retrieve: home, work, or latest
  type: ('home' | 'work' | 'latest')
}

/**
 * The type of the output of the get_location tool.
 */
export type get_locationOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  location?: {
    altitude?: number,
    latitude: number,
    provider: ('android' | 'ios' | 'browser' | 'manual'),
    longitude: number,
    timestamp: string,
    description: string,
    accuracyMeters: number,
    altitudeAccuracyMeters?: number
  },
  fetchedAt: string
}

/**
 * Get a user's saved location (home, work, or latest). Returns location coordinates, accuracy, timestamp, and description.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_location(
  sdk: ServerSdk,
  params: get_locationParams
): Promise<get_locationOutput> {
  return await sdk.callTool("user-location/1.0.0/get_location", params) as get_locationOutput;
}



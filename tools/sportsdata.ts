import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "sportsdata",
   serverVersion: "1.2.0",
   description: "Fresh NBA, NFL, MLB, international and other sports data.",
} as const;

/**
 * The type of the input parameter for sportsSearch tool.
 */
export type sportsSearchParams = {
  // The sports search query to execute. Handles various sports queries including team matchups, league standings, player stats, racing results, etc. All date/time results are automatically converted to your timezone.
  q: string
}

/**
 * The type of the output of the sportsSearch tool.
 */
export type sportsSearchOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  // The user's timezone used for date/time conversions (e.g., 'America/Los_Angeles', 'Europe/London')
  timezone: string,
  fetchedAt: string,
  sports_results?: any
}

/**
 * Search for sports data using Google search. Handles team sports results (Soccer, American Football, Basketball, Hockey, Baseball, Cricket), game spotlight results, sports results for athletes, auto and moto racing sports results, league standings, etc. Examples: 'Lakers vs Warriors', 'Premier League standings', 'NFL scores today', 'Messi career stats', 'Formula 1 championship results', 'World Cup matches', 'NBA playoffs bracket'
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function sportsSearch(
  sdk: ServerSdk,
  params: sportsSearchParams
): Promise<sportsSearchOutput> {
  return await sdk.callTool("sportsdata/1.2.0/sportsSearch", params) as sportsSearchOutput;
}

/**
 * The type of the input parameter for olympics_seasons tool.
 */
export type olympics_seasonsParams = {

}

/**
 * The type of the output of the olympics_seasons tool.
 */
export type olympics_seasonsOutput = {
  data?: any,
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  fetchedAt: string
}

/**
 * Get list of available Olympic Games seasons. Returns all Summer and Winter Olympics with their IDs and dates. Use this to find season IDs for medal table queries. All datetime fields are in UTC.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function olympics_seasons(
  sdk: ServerSdk,
  params: olympics_seasonsParams
): Promise<olympics_seasonsOutput> {
  return await sdk.callTool("sportsdata/1.2.0/olympics_seasons", params) as olympics_seasonsOutput;
}

/**
 * The type of the input parameter for olympics_countries tool.
 */
export type olympics_countriesParams = {

}

/**
 * The type of the output of the olympics_countries tool.
 */
export type olympics_countriesOutput = {
  data?: any,
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  fetchedAt: string
}

/**
 * Get list of countries/NOCs (National Olympic Committees) that participate in the Olympics. Returns country codes, names, and IOC codes.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function olympics_countries(
  sdk: ServerSdk,
  params: olympics_countriesParams
): Promise<olympics_countriesOutput> {
  return await sdk.callTool("sportsdata/1.2.0/olympics_countries", params) as olympics_countriesOutput;
}

/**
 * The type of the input parameter for olympics_medal_table tool.
 */
export type olympics_medal_tableParams = {
  // The season ID from Sportradar (obtained from olympics_seasons). Example: '5066d835-89a1-492f-9db0-37e06ebaa919' for Paris 2024 Summer Olympics.
  season_id: string
}

/**
 * The type of the output of the olympics_medal_table tool.
 */
export type olympics_medal_tableOutput = {
  data?: any,
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  fetchedAt: string
}

/**
 * Get the medal table/standings for a specific Olympic Games. Returns gold, silver, bronze, and total medal counts for each country, sorted by ranking. Use olympics_seasons first to get the season_id.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function olympics_medal_table(
  sdk: ServerSdk,
  params: olympics_medal_tableParams
): Promise<olympics_medal_tableOutput> {
  return await sdk.callTool("sportsdata/1.2.0/olympics_medal_table", params) as olympics_medal_tableOutput;
}



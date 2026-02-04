import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "sidekicktasks",
   serverVersion: "1.0.0",
   description: "Sidekick Tasks - Your Most Powerful Tool",
} as const;

/**
 * The type of the input parameter for create_sidekick_task tool.
 */
export type create_sidekick_taskParams = {
  // Whether the task should post to the feed. If completionCallback is not set, this must be true (defaults to true). If completionCallback is set, this defaults to false.
  postToFeed?: boolean,
  // A short description of what the sidekick task will do (e.g., 'Analyzing logs', 'Generating report')
  description: string,
  // Detailed instructions for the sidekick task to execute. Be very specific about what should be done.
  instructions: string,
  // The name of a server function on the calling agent (which receives string arguments called 'status' (status in active form, e.g. "Searching for events") and 'imperativeStatus' (e.g. "Search for events")) to call with updates on the progress of the sidekick task.
  progressCallback?: string,
  // The name of a server function on the calling agent (which can take any shape of typed data as input) to call with the final result of the sidekick task.
  completionCallback?: string
}

/**
 * The type of the output of the create_sidekick_task tool.
 */
export type create_sidekick_taskOutput = {
  message?: string,
  success: boolean,
  sandboxId?: string,
  // True if returning an existing running agent (e.g. if a sidekick task is already running for the same user and agent with the same instructions)
  isExisting?: boolean,
  ephemeralAgentId?: string
}

/**
 * Creates a sidekick task to execute a specific task autonomously in a sandboxed environment.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function create_sidekick_task(
  sdk: ServerSdk,
  params: create_sidekick_taskParams
): Promise<create_sidekick_taskOutput> {
  return await sdk.callTool("sidekicktasks/1.0.0/create_sidekick_task", params) as create_sidekick_taskOutput;
}

/**
 * The type of the input parameter for query_running_sidekick_tasks tool.
 */
export type query_running_sidekick_tasksParams = {

}

/**
 * The type of the output of the query_running_sidekick_tasks tool.
 */
export type query_running_sidekick_tasksOutput = {
  count: number,
  runningAgents: Array<{
    state: string,
    createdAt: string,
    sandboxId: string,
    description: string,
    ephemeralAgentId: string
  }>
}

/**
 * Queries for any currently running sidekick tasks created by this agent. Returns information about all sidekick tasks that were started by the calling agent and are in 'starting' or 'running' state.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function query_running_sidekick_tasks(
  sdk: ServerSdk,
  params: query_running_sidekick_tasksParams
): Promise<query_running_sidekick_tasksOutput> {
  return await sdk.callTool("sidekicktasks/1.0.0/query_running_sidekick_tasks", params) as query_running_sidekick_tasksOutput;
}

/**
 * The type of the input parameter for cancel_sidekick_task tool.
 */
export type cancel_sidekick_taskParams = {
  // The sandbox ID of the sidekick task to cancel
  sandboxId: string
}

/**
 * The type of the output of the cancel_sidekick_task tool.
 */
export type cancel_sidekick_taskOutput = {
  message?: string,
  success: boolean
}

/**
 * Cancels a running sidekick task that was created by this agent. The task will be stopped and its sandbox will be destroyed.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function cancel_sidekick_task(
  sdk: ServerSdk,
  params: cancel_sidekick_taskParams
): Promise<cancel_sidekick_taskOutput> {
  return await sdk.callTool("sidekicktasks/1.0.0/cancel_sidekick_task", params) as cancel_sidekick_taskOutput;
}



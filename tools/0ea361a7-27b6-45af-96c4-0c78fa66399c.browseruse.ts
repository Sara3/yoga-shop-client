import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse",
   serverVersion: "1.0.0",
   description: "Navigate web for you",
} as const;

/**
 * The type of the input parameter for browser_task tool.
 */
export type browser_taskParams = {
  // Detailed instructions for what you want the browser to do. Examples: "Go to hackernews.com and get the top 3 articles", "Fill out the contact form on example.com with my info", "Click the login button and enter credentials", "Navigate to Amazon and add a product to cart"
  task: string,
  // Maximum number of browser actions/steps to take. Must be between 1-100 (hard limit). Use 8-10 for simple tasks, higher values for complex multi-step workflows.
  max_steps?: number,
  // UUID of the cloud profile to use for any tasks that need authentication. Get this from list_browser_profiles tool after user selects a profile by name.
  profile_id?: string
}

/**
 * The type of the output of the browser_task tool.
 */
export type browser_taskOutput = any

/**
 * Create a browser automation task. This spins up a full cloud browser and executes steps. IMPORTANT: Before using this tool, FIRST check if a skill can accomplish the task: 1) Call list_skills with a relevant query 2) If a matching skill exists, use execute_skill instead (much faster) 3) Only use browser_task if no suitable skill exists OR for complex multi-step workflows that skills cannot handle. For tasks requiring authentication, use list_browser_profiles first to get a profile_id. After creating a task, call monitor_task with the task_id to watch real-time progress.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function browser_task(
  sdk: ServerSdk,
  params: browser_taskParams
): Promise<browser_taskOutput> {
  return await sdk.callTool("0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse/1.0.0/browser_task", params) as browser_taskOutput;
}

/**
 * The type of the input parameter for list_browser_profiles tool.
 */
export type list_browser_profilesParams = {

}

/**
 * The type of the output of the list_browser_profiles tool.
 */
export type list_browser_profilesOutput = any

/**
 * List all available cloud browser profiles for the authenticated project. Profiles store persistent authentication (cookies, sessions) for websites requiring login. Use this tool BEFORE attempting any authenticated tasks such as: posting on social media (X/Twitter, LinkedIn, Facebook), accessing email (Gmail, Outlook), online banking, shopping sites with saved accounts, or any action requiring a logged-in session. Show the profiles to the user and let them choose which one to use, then pass the selected profile_id to browser_task.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function list_browser_profiles(
  sdk: ServerSdk,
  params: list_browser_profilesParams
): Promise<list_browser_profilesOutput> {
  return await sdk.callTool("0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse/1.0.0/list_browser_profiles", params) as list_browser_profilesOutput;
}

/**
 * The type of the input parameter for monitor_task tool.
 */
export type monitor_taskParams = {
  // UUID of the task to monitor (returned by browser_task)
  task_id: string
}

/**
 * The type of the output of the monitor_task tool.
 */
export type monitor_taskOutput = any

/**
 * Get current status and progress of a browser automation task, including the most recent step with full agent reasoning (evaluation, memory, actions). Returns immediately with a snapshot of the current state. Call this tool repeatedly to track progress - the AI assistant should poll this every few seconds while a task is running to show live updates to the user. IMPORTANT: After calling this tool, ALWAYS provide a brief, conversational summary to the user explaining the current progress. Interpret the step data into natural language like: "The browser has completed step 2 of 8. It successfully navigated to x.com/home and is now working on clicking the Following tab." Do NOT just show the raw JSON - translate it into a user-friendly progress update. Shows: current status, most recent completed step with agent reasoning/thinking, task output if completed, and live session URL.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function monitor_task(
  sdk: ServerSdk,
  params: monitor_taskParams
): Promise<monitor_taskOutput> {
  return await sdk.callTool("0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse/1.0.0/monitor_task", params) as monitor_taskOutput;
}

/**
 * The type of the input parameter for list_skills tool.
 */
export type list_skillsParams = {

}

/**
 * The type of the output of the list_skills tool.
 */
export type list_skillsOutput = any

/**
 * PRIORITY: When the user asks to perform an action on a website (post to X, send email, etc.), FIRST check if a skill exists using this tool before falling back to browser_task. Skills are fast, pre-built automation workflows that execute in milliseconds without spinning up a browser. Flow: 1) Call list_skills to see all available skills 2) If a matching skill exists, check its parameters for type="cookie" fields 3) If cookie parameters exist, call get_cookies with the appropriate domain, then execute_skill 4) If no cookie parameters, call execute_skill directly 5) Only use browser_task if no suitable skill exists.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function list_skills(
  sdk: ServerSdk,
  params: list_skillsParams
): Promise<list_skillsOutput> {
  return await sdk.callTool("0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse/1.0.0/list_skills", params) as list_skillsOutput;
}

/**
 * The type of the input parameter for get_cookies tool.
 */
export type get_cookiesParams = {
  // Filter cookies by domain. Use the cookie_domain from the skill parameter schema (e.g., ["x.com"] for X/Twitter skills).
  domains?: Array<string>,
  // UUID of the browser profile to get cookies from (get this from list_browser_profiles)
  profile_id: string
}

/**
 * The type of the output of the get_cookies tool.
 */
export type get_cookiesOutput = any

/**
 * Extract cookies from a browser profile for authenticated skill execution. When to use: A skill has parameters with type="cookie" and you need to pass authentication cookies to execute_skill. The cookie_domain field in the skill's parameter schema tells you which domain to filter by. Match the parameter name (e.g., "auth_token") to a cookie name from the returned cookies.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_cookies(
  sdk: ServerSdk,
  params: get_cookiesParams
): Promise<get_cookiesOutput> {
  return await sdk.callTool("0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse/1.0.0/get_cookies", params) as get_cookiesOutput;
}

/**
 * The type of the input parameter for execute_skill tool.
 */
export type execute_skillParams = {
  // UUID of the skill to execute (get from list_skills)
  skill_id: string,
  parameters?: {

  }
}

/**
 * The type of the output of the execute_skill tool.
 */
export type execute_skillOutput = any

/**
 * Execute a skill with provided parameters. Skills are fast automation workflows that run in milliseconds without browser overhead. IMPORTANT: Before calling this tool: 1) Use list_skills to find the skill and check its parameters 2) If any parameter has type="cookie", you must first call get_cookies with the profile_id and the cookie's domain (from cookie_domain field), then pass the cookie values as parameters 3) Parameters with type="cookie" expect the cookie VALUE, not the full cookie object. Example flow: list_skills() → finds skill with auth_token (type=cookie, cookie_domain=x.com) → get_cookies(profile_id="...", domains=["x.com"]) → execute_skill(skill_id="...", parameters={"tweet_text": "Hello", "auth_token": "<value from cookies>"})
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function execute_skill(
  sdk: ServerSdk,
  params: execute_skillParams
): Promise<execute_skillOutput> {
  return await sdk.callTool("0ea361a7-27b6-45af-96c4-0c78fa66399c.browseruse/1.0.0/execute_skill", params) as execute_skillOutput;
}



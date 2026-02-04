import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts",
   serverVersion: "1.26.0",
   description: "Custom MCP server",
} as const;

/**
 * The type of the input parameter for list_contacts tool.
 */
export type list_contactsParams = {
  // Max results
  max_results?: number,
  // Optional filter by name
  name_filter?: string,
  // Your authentication session token from /auth
  session_token: string
}

/**
 * The type of the output of the list_contacts tool.
 */
export type list_contactsOutput = any

/**
 * List all contacts or filter by name. First authenticate at http://localhost:8000/auth
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function list_contacts(
  sdk: ServerSdk,
  params: list_contactsParams
): Promise<list_contactsOutput> {
  return await sdk.callTool("f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts/1.26.0/list_contacts", params) as list_contactsOutput;
}

/**
 * The type of the input parameter for get_contact tool.
 */
export type get_contactParams = {
  // Resource name or email
  identifier: string,
  // Your authentication session token
  session_token: string
}

/**
 * The type of the output of the get_contact tool.
 */
export type get_contactOutput = any

/**
 * Get a contact by resource name or email
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_contact(
  sdk: ServerSdk,
  params: get_contactParams
): Promise<get_contactOutput> {
  return await sdk.callTool("f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts/1.26.0/get_contact", params) as get_contactOutput;
}

/**
 * The type of the input parameter for create_contact tool.
 */
export type create_contactParams = {
  // Email address
  email?: string,
  // Phone number
  phone?: string,
  // First name
  given_name: string,
  // Last name
  family_name?: string,
  // Your authentication session token
  session_token: string
}

/**
 * The type of the output of the create_contact tool.
 */
export type create_contactOutput = any

/**
 * Create a new contact
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function create_contact(
  sdk: ServerSdk,
  params: create_contactParams
): Promise<create_contactOutput> {
  return await sdk.callTool("f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts/1.26.0/create_contact", params) as create_contactOutput;
}

/**
 * The type of the input parameter for update_contact tool.
 */
export type update_contactParams = {
  // City
  city?: string,
  // Email address to add
  email?: string,
  // Notes/biography
  notes?: string,
  // Phone number to add
  phone?: string,
  // State/Region
  state?: string,
  // Street address
  address?: string,
  // Country
  country?: string,
  // Job title
  job_title?: string,
  // First name
  given_name?: string,
  // Last name
  family_name?: string,
  // Postal/ZIP code
  postal_code?: string,
  // Birthday day (1-31)
  birthday_day?: number,
  // Company/Organization name
  organization?: string,
  // Birthday year (optional)
  birthday_year?: number,
  // Contact resource name (people/c...)
  resource_name: string,
  // Your authentication session token
  session_token: string,
  // Birthday month (1-12)
  birthday_month?: number
}

/**
 * The type of the output of the update_contact tool.
 */
export type update_contactOutput = any

/**
 * Update/enrich an existing contact with new information. Only provided fields will be updated.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function update_contact(
  sdk: ServerSdk,
  params: update_contactParams
): Promise<update_contactOutput> {
  return await sdk.callTool("f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts/1.26.0/update_contact", params) as update_contactOutput;
}

/**
 * The type of the input parameter for delete_contact tool.
 */
export type delete_contactParams = {
  // Contact resource name
  resource_name: string,
  // Your authentication session token
  session_token: string
}

/**
 * The type of the output of the delete_contact tool.
 */
export type delete_contactOutput = any

/**
 * Delete a contact
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function delete_contact(
  sdk: ServerSdk,
  params: delete_contactParams
): Promise<delete_contactOutput> {
  return await sdk.callTool("f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts/1.26.0/delete_contact", params) as delete_contactOutput;
}

/**
 * The type of the input parameter for search_contacts tool.
 */
export type search_contactsParams = {
  // Search term
  query: string,
  // Max results
  max_results?: number,
  // Your authentication session token
  session_token: string
}

/**
 * The type of the output of the search_contacts tool.
 */
export type search_contactsOutput = any

/**
 * Search contacts by name, email, or phone
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function search_contacts(
  sdk: ServerSdk,
  params: search_contactsParams
): Promise<search_contactsOutput> {
  return await sdk.callTool("f2b5652a-eb91-4e1e-9eae-50f8cd6d4046.contacts/1.26.0/search_contacts", params) as search_contactsOutput;
}



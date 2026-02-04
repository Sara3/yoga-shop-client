import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "Text-and-Call",
   serverVersion: "1.0.0",
   description: "twilio mcp gateway",
} as const;

/**
 * The type of the input parameter for twilio_send_sms_verification tool.
 */
export type twilio_send_sms_verificationParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_send_sms_verification tool.
 */
export type twilio_send_sms_verificationOutput = any

/**
 * Send an SMS verification to a phone number. [See the documentation](https://www.twilio.com/docs/verify/api)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_send_sms_verification(
  sdk: ServerSdk,
  params: twilio_send_sms_verificationParams
): Promise<twilio_send_sms_verificationOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-send-sms-verification", params) as twilio_send_sms_verificationOutput;
}

/**
 * The type of the input parameter for twilio_send_message tool.
 */
export type twilio_send_messageParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_send_message tool.
 */
export type twilio_send_messageOutput = any

/**
 * Send an SMS text with optional media files. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_send_message(
  sdk: ServerSdk,
  params: twilio_send_messageParams
): Promise<twilio_send_messageOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-send-message", params) as twilio_send_messageOutput;
}

/**
 * The type of the input parameter for twilio_phone_number_lookup tool.
 */
export type twilio_phone_number_lookupParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_phone_number_lookup tool.
 */
export type twilio_phone_number_lookupOutput = any

/**
 * Lookup information about a phone number. [See the documentation](https://www.twilio.com/docs/lookup/v2-api/line-type-intelligence) for more information
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_phone_number_lookup(
  sdk: ServerSdk,
  params: twilio_phone_number_lookupParams
): Promise<twilio_phone_number_lookupOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-phone-number-lookup", params) as twilio_phone_number_lookupOutput;
}

/**
 * The type of the input parameter for twilio_make_phone_call tool.
 */
export type twilio_make_phone_callParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_make_phone_call tool.
 */
export type twilio_make_phone_callOutput = any

/**
 * Make a phone call passing text, a URL, or an application that Twilio will use to handle the call. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#create-a-call-resource)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_make_phone_call(
  sdk: ServerSdk,
  params: twilio_make_phone_callParams
): Promise<twilio_make_phone_callOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-make-phone-call", params) as twilio_make_phone_callOutput;
}

/**
 * The type of the input parameter for twilio_list_transcripts tool.
 */
export type twilio_list_transcriptsParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_list_transcripts tool.
 */
export type twilio_list_transcriptsOutput = any

/**
 * Return a list of transcripts. [See the documentation](https://www.twilio.com/docs/voice/intelligence/api/transcript-resource#fetch-multiple-transcripts)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_list_transcripts(
  sdk: ServerSdk,
  params: twilio_list_transcriptsParams
): Promise<twilio_list_transcriptsOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-list-transcripts", params) as twilio_list_transcriptsOutput;
}

/**
 * The type of the input parameter for twilio_list_messages tool.
 */
export type twilio_list_messagesParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_list_messages tool.
 */
export type twilio_list_messagesOutput = any

/**
 * Return a list of messages associated with your account. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#read-multiple-message-resources)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_list_messages(
  sdk: ServerSdk,
  params: twilio_list_messagesParams
): Promise<twilio_list_messagesOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-list-messages", params) as twilio_list_messagesOutput;
}

/**
 * The type of the input parameter for twilio_list_message_media tool.
 */
export type twilio_list_message_mediaParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_list_message_media tool.
 */
export type twilio_list_message_mediaOutput = any

/**
 * Return a list of media associated with your message. [See the documentation](https://www.twilio.com/docs/sms/api/media-resource#read-multiple-media-resources)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_list_message_media(
  sdk: ServerSdk,
  params: twilio_list_message_mediaParams
): Promise<twilio_list_message_mediaOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-list-message-media", params) as twilio_list_message_mediaOutput;
}

/**
 * The type of the input parameter for twilio_list_calls tool.
 */
export type twilio_list_callsParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_list_calls tool.
 */
export type twilio_list_callsOutput = any

/**
 * Return a list of calls associated with your account. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#read-multiple-call-resources)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_list_calls(
  sdk: ServerSdk,
  params: twilio_list_callsParams
): Promise<twilio_list_callsOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-list-calls", params) as twilio_list_callsOutput;
}

/**
 * The type of the input parameter for twilio_get_transcripts tool.
 */
export type twilio_get_transcriptsParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_get_transcripts tool.
 */
export type twilio_get_transcriptsOutput = any

/**
 * Retrieves full transcripts for the specified transcript SIDs. [See the documentation](https://www.twilio.com/docs/voice/intelligence/api/transcript-sentence-resource#get-transcript-sentences)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_get_transcripts(
  sdk: ServerSdk,
  params: twilio_get_transcriptsParams
): Promise<twilio_get_transcriptsOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-get-transcripts", params) as twilio_get_transcriptsOutput;
}

/**
 * The type of the input parameter for twilio_get_message tool.
 */
export type twilio_get_messageParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_get_message tool.
 */
export type twilio_get_messageOutput = any

/**
 * Return details of a message. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#fetch-a-message-resource)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_get_message(
  sdk: ServerSdk,
  params: twilio_get_messageParams
): Promise<twilio_get_messageOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-get-message", params) as twilio_get_messageOutput;
}

/**
 * The type of the input parameter for twilio_get_call tool.
 */
export type twilio_get_callParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_get_call tool.
 */
export type twilio_get_callOutput = any

/**
 * Return call resource of an individual call. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#fetch-a-call-resource)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_get_call(
  sdk: ServerSdk,
  params: twilio_get_callParams
): Promise<twilio_get_callOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-get-call", params) as twilio_get_callOutput;
}

/**
 * The type of the input parameter for twilio_download_recording_media tool.
 */
export type twilio_download_recording_mediaParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_download_recording_media tool.
 */
export type twilio_download_recording_mediaOutput = any

/**
 * Download a recording media file. [See the documentation](https://www.twilio.com/docs/voice/api/recording#fetch-a-recording-media-file)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_download_recording_media(
  sdk: ServerSdk,
  params: twilio_download_recording_mediaParams
): Promise<twilio_download_recording_mediaOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-download-recording-media", params) as twilio_download_recording_mediaOutput;
}

/**
 * The type of the input parameter for twilio_delete_message tool.
 */
export type twilio_delete_messageParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_delete_message tool.
 */
export type twilio_delete_messageOutput = any

/**
 * Delete a message record from your account. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#delete-a-message-resource)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_delete_message(
  sdk: ServerSdk,
  params: twilio_delete_messageParams
): Promise<twilio_delete_messageOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-delete-message", params) as twilio_delete_messageOutput;
}

/**
 * The type of the input parameter for twilio_delete_call tool.
 */
export type twilio_delete_callParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_delete_call tool.
 */
export type twilio_delete_callOutput = any

/**
 * Remove a call record from your account. [See the documentation](https://www.twilio.com/docs/voice/api/call-resource#delete-a-call-resource)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_delete_call(
  sdk: ServerSdk,
  params: twilio_delete_callParams
): Promise<twilio_delete_callOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-delete-call", params) as twilio_delete_callOutput;
}

/**
 * The type of the input parameter for twilio_create_verification_service tool.
 */
export type twilio_create_verification_serviceParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_create_verification_service tool.
 */
export type twilio_create_verification_serviceOutput = any

/**
 * Create a verification service for sending SMS verifications. [See the documentation](https://www.twilio.com/docs/verify/api/service#create-a-verification-service)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_create_verification_service(
  sdk: ServerSdk,
  params: twilio_create_verification_serviceParams
): Promise<twilio_create_verification_serviceOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-create-verification-service", params) as twilio_create_verification_serviceOutput;
}

/**
 * The type of the input parameter for twilio_check_verification_token tool.
 */
export type twilio_check_verification_tokenParams = {
  // Very detailed instructions describing the action to be taken. Include any information that might be useful.
  instruction: string
}

/**
 * The type of the output of the twilio_check_verification_token tool.
 */
export type twilio_check_verification_tokenOutput = any

/**
 * Check if user-provided token is correct. [See the documentation](https://www.twilio.com/docs/verify/api)
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function twilio_check_verification_token(
  sdk: ServerSdk,
  params: twilio_check_verification_tokenParams
): Promise<twilio_check_verification_tokenOutput> {
  return await sdk.callTool("Text-and-Call/1.0.0/twilio-check-verification-token", params) as twilio_check_verification_tokenOutput;
}



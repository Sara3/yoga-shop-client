import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "speechtotext",
   serverVersion: "1.0.0",
   description: "Transcribe spoken audio files to text",
} as const;

/**
 * The type of the input parameter for transcribeAudio tool.
 */
export type transcribeAudioParams = {
  // The URL of the audio file to transcribe. Must be a publicly accessible URL or a pre-signed URL.
  audioUrl: string
}

/**
 * The type of the output of the transcribeAudio tool.
 */
export type transcribeAudioOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  transcription?: string
}

/**
 * Transcribe audio from a URL. Supports files of any size - large files are automatically downsampled and split into chunks for processing. Returns the transcribed text.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function transcribeAudio(
  sdk: ServerSdk,
  params: transcribeAudioParams
): Promise<transcribeAudioOutput> {
  return await sdk.callTool("speechtotext/1.0.0/transcribeAudio", params) as transcribeAudioOutput;
}

/**
 * The type of the input parameter for diarizeAudio tool.
 */
export type diarizeAudioParams = {
  // The URL of the audio file to diarize. Must be a publicly accessible URL or a pre-signed URL.
  audioUrl: string,
  // Optional array of known speaker names (up to 4). If provided, the model will attempt to map segments to these speakers. Example: ['Alice', 'Bob']
  knownSpeakers?: Array<string>
}

/**
 * The type of the output of the diarizeAudio tool.
 */
export type diarizeAudioOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  fullText?: string,
  segments?: Array<{
    end?: number,
    text: string,
    start?: number,
    speaker: string
  }>
}

/**
 * Transcribe and diarize audio from a URL, identifying different speakers. Supports files of any size - large files are automatically downsampled and split into chunks for processing. Returns segments with speaker labels and timestamps.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function diarizeAudio(
  sdk: ServerSdk,
  params: diarizeAudioParams
): Promise<diarizeAudioOutput> {
  return await sdk.callTool("speechtotext/1.0.0/diarizeAudio", params) as diarizeAudioOutput;
}

/**
 * The type of the input parameter for translateAudio tool.
 */
export type translateAudioParams = {
  // The URL of the audio file to translate. Must be a publicly accessible URL or a pre-signed URL. Audio can be in any supported language.
  audioUrl: string
}

/**
 * The type of the output of the translateAudio tool.
 */
export type translateAudioOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  translation?: string
}

/**
 * Translate audio from any language to English. Supports files of any size - large files are automatically downsampled and split into chunks for processing. Returns the translated text in English.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function translateAudio(
  sdk: ServerSdk,
  params: translateAudioParams
): Promise<translateAudioOutput> {
  return await sdk.callTool("speechtotext/1.0.0/translateAudio", params) as translateAudioOutput;
}

/**
 * The type of the input parameter for translateLargeAudioFile tool.
 */
export type translateLargeAudioFileParams = {
  // The URL of the large audio file to translate
  audioUrl: string
}

/**
 * The type of the output of the translateLargeAudioFile tool.
 */
export type translateLargeAudioFileOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  ticketId?: string
}

/**
 * Process a large audio file (>25MB) asynchronously by translating it to English. Returns a ticket ID immediately that can be used to check the status. Processing runs in the background via Lambda and may take several minutes depending on file size. Use checkAudioProcessingStatus to get the result.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function translateLargeAudioFile(
  sdk: ServerSdk,
  params: translateLargeAudioFileParams
): Promise<translateLargeAudioFileOutput> {
  return await sdk.callTool("speechtotext/1.0.0/translateLargeAudioFile", params) as translateLargeAudioFileOutput;
}

/**
 * The type of the input parameter for transcribeLargeAudioFile tool.
 */
export type transcribeLargeAudioFileParams = {
  // The URL of the large audio file to transcribe
  audioUrl: string
}

/**
 * The type of the output of the transcribeLargeAudioFile tool.
 */
export type transcribeLargeAudioFileOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  ticketId?: string
}

/**
 * Process a large audio file (>25MB) asynchronously by transcribing it. Returns a ticket ID immediately that can be used to check the status. Processing runs in the background via Lambda and may take several minutes depending on file size. Use checkAudioProcessingStatus to get the result.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function transcribeLargeAudioFile(
  sdk: ServerSdk,
  params: transcribeLargeAudioFileParams
): Promise<transcribeLargeAudioFileOutput> {
  return await sdk.callTool("speechtotext/1.0.0/transcribeLargeAudioFile", params) as transcribeLargeAudioFileOutput;
}

/**
 * The type of the input parameter for diarizeLargeAudioFile tool.
 */
export type diarizeLargeAudioFileParams = {
  // The URL of the large audio file to diarize
  audioUrl: string,
  // Optional array of known speaker names to help with identification
  knownSpeakers?: Array<string>
}

/**
 * The type of the output of the diarizeLargeAudioFile tool.
 */
export type diarizeLargeAudioFileOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  ticketId?: string
}

/**
 * Process a large audio file (>25MB) asynchronously by diarizing it to identify speakers. Returns a ticket ID immediately that can be used to check the status. Processing runs in the background via Lambda and may take several minutes depending on file size. Use checkAudioProcessingStatus to get the result.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function diarizeLargeAudioFile(
  sdk: ServerSdk,
  params: diarizeLargeAudioFileParams
): Promise<diarizeLargeAudioFileOutput> {
  return await sdk.callTool("speechtotext/1.0.0/diarizeLargeAudioFile", params) as diarizeLargeAudioFileOutput;
}

/**
 * The type of the input parameter for checkAudioProcessingStatus tool.
 */
export type checkAudioProcessingStatusParams = {
  // The ticket ID returned from the large audio processing tool
  ticketId: string
}

/**
 * The type of the output of the checkAudioProcessingStatus tool.
 */
export type checkAudioProcessingStatusOutput = {
  error?: {
    type: string,
    message: string
  },
  result?: {
    fullText?: string,
    segments?: Array<{
      end?: number,
      text: string,
      start?: number,
      speaker: string
    }>,
    translation?: string,
    transcription?: string
  },
  status?: ('pending' | 'completed' | 'failed'),
  success: boolean
}

/**
 * Check the status of a large audio file processing job using the ticket ID returned from translateLargeAudioFile, transcribeLargeAudioFile, or diarizeLargeAudioFile. Returns the status (pending/completed/failed) and the result if completed.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function checkAudioProcessingStatus(
  sdk: ServerSdk,
  params: checkAudioProcessingStatusParams
): Promise<checkAudioProcessingStatusOutput> {
  return await sdk.callTool("speechtotext/1.0.0/checkAudioProcessingStatus", params) as checkAudioProcessingStatusOutput;
}



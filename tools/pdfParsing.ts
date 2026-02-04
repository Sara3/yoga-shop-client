import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "pdfParsing",
   serverVersion: "1.0.0",
   description: "This tool can can process documents in PDF format, using native vision to understand entire document contexts. This goes beyond simple text extraction:\n- Analyze and interpret content, including text, images, diagrams, charts, and tables, even in long documents up to 1000 pages.\n- Summarize and answer questions based on both the visual and textual elements in a document.\n- Transcribe document content (e.g. to HTML), preserving layouts and formatting, for use in downstream applications.",
} as const;

/**
 * The type of the input parameter for parsePdf tool.
 */
export type parsePdfParams = {
  // The URL of the PDF document to parse and analyze
  pdfUrl: string,
  // The question or instruction for analyzing the PDF. Be specific about what you want to extract or understand (e.g., summarization, key points, specific data extraction, etc.).
  prompt: string
}

/**
 * The type of the output of the parsePdf tool.
 */
export type parsePdfOutput = {
  error?: {
    type: string,
    message: string
  },
  success: boolean,
  analysis?: string
}

/**
 * Parse and analyze a PDF document using AI. Provide a PDF URL and a text prompt describing what you want to extract or understand about the document (e.g., 'Summarize this document', 'Extract key findings', 'List all the main topics discussed').
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function parsePdf(
  sdk: ServerSdk,
  params: parsePdfParams
): Promise<parsePdfOutput> {
  return await sdk.callTool("pdfParsing/1.0.0/parsePdf", params) as parsePdfOutput;
}



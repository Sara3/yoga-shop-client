import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "sheets",
   serverVersion: "1.0.0",
   description: "Use Google Sheets as a store for data from your agents / Sidekick",
} as const;

/**
 * The type of the input parameter for listAccounts tool.
 */
export type listAccountsParams = {

}

/**
 * The type of the output of the listAccounts tool.
 */
export type listAccountsOutput = {
  accounts: Array<{
    type: 'gsheets',
    email: string
  }>
}

/**
 * List available Google accounts with Sheets access
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function listAccounts(
  sdk: ServerSdk,
  params: listAccountsParams
): Promise<listAccountsOutput> {
  return await sdk.callTool("sheets/1.0.0/listAccounts", params) as listAccountsOutput;
}

/**
 * The type of the input parameter for createSheet tool.
 */
export type createSheetParams = {
  // Title for the new spreadsheet
  title: string,
  // Google account email
  account: string,
  // CSV data to populate the sheet with (inline)
  csvData?: string,
  // Optional Google Drive folder ID to create the spreadsheet in
  folderId?: string,
  // Google Drive file ID containing CSV data
  csvDataFile?: string
}

/**
 * The type of the output of the createSheet tool.
 */
export type createSheetOutput = {
  sheet: {
    title: string,
    spreadsheetId: string,
    spreadsheetUrl: string
  },
  // Whether the operation succeeded
  success: boolean,
  // Timestamp when spreadsheet was created (ISO 8601)
  createdAt: string
}

/**
 * Create a new Google Sheet from CSV data.  This tool creates a new Google Sheet with the specified title and populates it with data from CSV format. You can provide CSV data in two ways: 1. Inline CSV data using the 'csvData' parameter 2. Reference a Google Drive file containing CSV data using the 'csvDataFile' parameter (file ID)  You must provide exactly one of 'csvData' or 'csvDataFile'.  The CSV data should be properly formatted with commas separating columns and newlines separating rows. Quoted values are supported for cells containing commas or quotes.  You can optionally specify a folder ID to create the spreadsheet in a specific folder. If no folder ID is provided, the spreadsheet will be created in the root of My Drive.  Returns the spreadsheet ID and a web link to view the sheet.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function createSheet(
  sdk: ServerSdk,
  params: createSheetParams
): Promise<createSheetOutput> {
  return await sdk.callTool("sheets/1.0.0/createSheet", params) as createSheetOutput;
}

/**
 * The type of the input parameter for createTable tool.
 */
export type createTableParams = {
  // Google account email
  account: string,
  // Column names for the table header row (e.g., ['id', 'name', 'email', 'created_at'])
  columns: Array<string>,
  // Name for the new sheet/table (e.g., 'users', 'transactions')
  tableName: string,
  // Spreadsheet ID from URL (e.g., '1ABC...')
  spreadsheetId: string
}

/**
 * The type of the output of the createTable tool.
 */
export type createTableOutput = {
  // Column headers that were created
  columns: Array<string>,
  // Internal sheet ID
  sheetId: number,
  success: boolean,
  createdAt: string,
  // Name of the created sheet/table
  sheetName: string,
  spreadsheetId: string
}

/**
 * Create a new empty table (sheet tab) with specified columns in an existing spreadsheet. Use this to set up database-like tables with defined column structure. Example: tableName='users', columns=['id', 'name', 'email', 'created_at'] creates a new sheet with those headers.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function createTable(
  sdk: ServerSdk,
  params: createTableParams
): Promise<createTableOutput> {
  return await sdk.callTool("sheets/1.0.0/createTable", params) as createTableOutput;
}

/**
 * The type of the input parameter for getSheetMetadata tool.
 */
export type getSheetMetadataParams = {
  // Google account email
  account: string,
  // Spreadsheet ID from URL (returns info about all sheets/tabs)
  spreadsheetId: string
}

/**
 * The type of the output of the getSheetMetadata tool.
 */
export type getSheetMetadataOutput = {
  success: boolean,
  fetchedAt: string,
  spreadsheet: {
    id: string,
    url: string,
    title: string,
    sheets: Array<{
      name: string,
      index: number,
      sheetId: number,
      rowCount: number,
      columnCount: number
    }>
  }
}

/**
 * Get spreadsheet info: title, URL, all sheet names/IDs, row/column counts
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function getSheetMetadata(
  sdk: ServerSdk,
  params: getSheetMetadataParams
): Promise<getSheetMetadataOutput> {
  return await sdk.callTool("sheets/1.0.0/getSheetMetadata", params) as getSheetMetadataOutput;
}

/**
 * The type of the input parameter for getSheetData tool.
 */
export type getSheetDataParams = {
  // A1 notation range (optional, e.g., 'A1:D10' or 'Sheet1!A1:D10')
  range?: (string | null),
  // Google account email
  account: string,
  // Sheet tab name (optional, defaults to first sheet)
  sheetName?: (string | null),
  // Format: 'structured' = objects with first row as headers (default, recommended), 'raw' = 2D string array (note: cells with newlines will be incorrectly split into multiple rows)
  returnFormat?: ('raw' | 'structured'),
  // Spreadsheet ID from URL (e.g., '1ABC...')
  spreadsheetId: string
}

/**
 * The type of the output of the getSheetData tool.
 */
export type getSheetDataOutput = {
  // Sheet data in requested format
  data: (Array<Array<string>> | Array<{

  }>),
  // Column headers (if structured format)
  headers?: Array<string>,
  // Whether the operation succeeded
  success: boolean,
  metadata: {
    rowCount: number,
    columnCount: number
  },
  fetchedAt: string,
  sheetName: string,
  spreadsheetId: string
}

/**
 * Read sheet data. Returns structured objects with first row as headers by default. Use returnFormat='raw' for 2D arrays (not recommended: cells with newlines will be incorrectly parsed).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function getSheetData(
  sdk: ServerSdk,
  params: getSheetDataParams
): Promise<getSheetDataOutput> {
  return await sdk.callTool("sheets/1.0.0/getSheetData", params) as getSheetDataOutput;
}

/**
 * The type of the input parameter for updateRows tool.
 */
export type updateRowsParams = {
  // Google account email
  account: string,
  // Array of row updates, each with rowIndex and data object with columns to update
  updates: Array<{
    data: {

    },
    rowIndex: number
  }>,
  // Sheet tab name (optional, defaults to first sheet)
  sheetName?: (string | null),
  // Spreadsheet ID from URL (e.g., '1ABC...')
  spreadsheetId: string,
  // How to interpret input values: 'literal' = store exactly as text, 'automatic' = parse formulas (must start with '=', e.g. '=SUM(A1:A10)' or '=SQRT(144)') and convert dates (e.g. '1/1/2024') automatically (default: 'automatic')
  valueInputOption?: ('literal' | 'automatic')
}

/**
 * The type of the output of the updateRows tool.
 */
export type updateRowsOutput = {
  success: boolean,
  sheetName: string,
  updatedAt: string,
  updatedRows: number,
  spreadsheetId: string
}

/**
 * Update specific columns in specific rows. IMPORTANT: This is a partial/selective update - only the columns you specify in the 'data' object will be changed, all other columns in the row remain unchanged. Use queryRows to find rows and get their rowIndex, then update specific fields. Example: {rowIndex: 2, data: {exchangeRate: '91'}} updates ONLY the exchangeRate column in row 2, leaving country, name, capital, etc. untouched.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function updateRows(
  sdk: ServerSdk,
  params: updateRowsParams
): Promise<updateRowsOutput> {
  return await sdk.callTool("sheets/1.0.0/updateRows", params) as updateRowsOutput;
}

/**
 * The type of the input parameter for appendRows tool.
 */
export type appendRowsParams = {
  // Rows: [['a','b']] OR [{col1:'a', col2:'b'}] - objects use first row headers
  rows: (Array<Array<string>> | Array<{

  }>),
  // Google account email
  account: string,
  // Sheet tab name (optional, defaults to first sheet)
  sheetName?: (string | null),
  // Spreadsheet ID from URL
  spreadsheetId: string,
  // How to interpret input values: 'literal' = store exactly as text, 'automatic' = parse formulas (must start with '=', e.g. '=SUM(A1:A10)' or '=SQRT(144)') and convert dates (e.g. '1/1/2024') automatically (default: 'automatic')
  valueInputOption?: ('literal' | 'automatic')
}

/**
 * The type of the output of the appendRows tool.
 */
export type appendRowsOutput = {
  success: boolean,
  sheetName: string,
  updatedAt: string,
  appendedRows: number,
  updatedRange: string,
  spreadsheetId: string
}

/**
 * Append rows to sheet end. Pass rows as [['a','b']] or [{col1:'a',col2:'b'}] - objects match first row headers
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function appendRows(
  sdk: ServerSdk,
  params: appendRowsParams
): Promise<appendRowsOutput> {
  return await sdk.callTool("sheets/1.0.0/appendRows", params) as appendRowsOutput;
}

/**
 * The type of the input parameter for queryRows tool.
 */
export type queryRowsParams = {
  // Max rows to return
  limit?: (number | null),
  filter: {
    value: string,
    column: string,
    operator: ('equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan')
  },
  // Rows to skip before returning results
  offset?: (number | null),
  // Google account email
  account: string,
  // Sheet tab name (defaults to first sheet)
  sheetName?: (string | null),
  // Spreadsheet ID from URL
  spreadsheetId: string
}

/**
 * The type of the output of the queryRows tool.
 */
export type queryRowsOutput = {
  headers: Array<string>,
  success: boolean,
  fetchedAt: string,
  sheetName: string,
  matchedRows: Array<{
    data: {

    },
    rowIndex: number
  }>,
  totalMatched: number,
  spreadsheetId: string
}

/**
 * Query and filter rows from a Google Sheet. Returns matched rows with their row indices (1-based, where row 1 is header). Filter must be an object with column (header name), operator (equals/contains/startsWith/greaterThan/lessThan), and value (string). Use rowIndex from results with deleteRows to remove specific rows.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function queryRows(
  sdk: ServerSdk,
  params: queryRowsParams
): Promise<queryRowsOutput> {
  return await sdk.callTool("sheets/1.0.0/queryRows", params) as queryRowsOutput;
}

/**
 * The type of the input parameter for deleteRows tool.
 */
export type deleteRowsParams = {
  // End row index (1-based, inclusive). Must be >= startRow.
  endRow: number,
  // Google account email
  account: string,
  // Start row index (1-based, inclusive). Row 1 is the header row.
  startRow: number,
  // Sheet tab name (optional, defaults to first sheet)
  sheetName?: (string | null),
  // Spreadsheet ID from URL (e.g., '1ABC...')
  spreadsheetId: string
}

/**
 * The type of the output of the deleteRows tool.
 */
export type deleteRowsOutput = {
  success: boolean,
  deletedAt: string,
  sheetName: string,
  deletedRows: number,
  spreadsheetId: string
}

/**
 * Delete rows from a sheet by row index range. Uses 1-based indexing where row 1 is the header. Example: startRow=2, endRow=5 deletes rows 2-5 (4 rows total). To delete specific rows matching criteria: (1) Use queryRows to find matching rows and get their rowIndex values, (2) Use those rowIndex values with deleteRows. Note: When deleting multiple non-contiguous rows, delete from highest index to lowest to avoid index shifts.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function deleteRows(
  sdk: ServerSdk,
  params: deleteRowsParams
): Promise<deleteRowsOutput> {
  return await sdk.callTool("sheets/1.0.0/deleteRows", params) as deleteRowsOutput;
}



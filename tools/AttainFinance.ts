import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "AttainFinance",
   serverVersion: "1.0.0",
   description: "Connect to your personal financial accounts, context, and our expert tools to improve your financial health.",
} as const;

/**
 * The type of the input parameter for connect_account tool.
 */
export type connect_accountParams = {
  options?: {

  }
}

/**
 * The type of the output of the connect_account tool.
 */
export type connect_accountOutput = any

/**
 * Connect a bank, credit card, or investment account to get started. Opens a secure browser window where the user can safely authenticate with their financial institution. IMPORTANT: Only call this tool one at a time - wait for the user to complete the connection before calling again. Encourage users to connect multiple institutions (checking, savings, credit cards, investments) to get the full value of budgeting, transaction tracking, and financial insights across all their accounts.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function connect_account(
  sdk: ServerSdk,
  params: connect_accountParams
): Promise<connect_accountOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/connect-account", params) as connect_accountOutput;
}

/**
 * The type of the input parameter for get_account_status tool.
 */
export type get_account_statusParams = {
  options?: {

  }
}

/**
 * The type of the output of the get_account_status tool.
 */
export type get_account_statusOutput = any

/**
 * View connected institutions with balance details, connection health, and last sync timestamps. Use this before updating or disconnecting an institution.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_account_status(
  sdk: ServerSdk,
  params: get_account_statusParams
): Promise<get_account_statusOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-account-status", params) as get_account_statusOutput;
}

/**
 * The type of the input parameter for update_account_link tool.
 */
export type update_account_linkParams = {
  // The account's item_id to update (get this from get-account-status)
  item_id: string,
  options?: {

  }
}

/**
 * The type of the output of the update_account_link tool.
 */
export type update_account_linkOutput = any

/**
 * IMPORTANT: Only use this tool when an account connection is broken. ALWAYS call get-account-status FIRST to verify the connection shows an error status before calling this tool. This tool updates a broken or expired account connection by re-authenticating with the financial institution. Returns a secure link for the user to complete re-authentication. After the user completes the update, they should say 'I've updated it, please refresh my transactions' to sync their data.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function update_account_link(
  sdk: ServerSdk,
  params: update_account_linkParams
): Promise<update_account_linkOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/update-account-link", params) as update_account_linkOutput;
}

/**
 * The type of the input parameter for disconnect_account tool.
 */
export type disconnect_accountParams = {
  // The account's item_id to disconnect (get this from get-account-status)
  item_id: string,
  options?: {

  }
}

/**
 * The type of the output of the disconnect_account tool.
 */
export type disconnect_accountOutput = any

/**
 * Remove a connected account and revoke access. This will delete all stored connection data for the specified account.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function disconnect_account(
  sdk: ServerSdk,
  params: disconnect_accountParams
): Promise<disconnect_accountOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/disconnect-account", params) as disconnect_accountOutput;
}

/**
 * The type of the input parameter for get_financial_summary tool.
 */
export type get_financial_summaryParams = {
  options?: {

  }
}

/**
 * The type of the output of the get_financial_summary tool.
 */
export type get_financial_summaryOutput = {
  // View type identifier
  view: 'financial-summary',
  summary?: {
    netWorth: number,
    assetsTotal: number,
    liabilitiesTotal: number
  },
  // Array of account details with balances and metadata
  accounts?: Array<any>,
  dashboard: {
    hero: {
      hasData: boolean,
      netWorth: number,
      assetsTotal: number,
      liabilitiesTotal: number
    }
  },
  // Historical net worth snapshots (up to 8, ordered newest to oldest). Expected fields: id (string), snapshot_date (ISO date), net_worth_amount (number), user_id (string), assets_total (number), liabilities_total (number), created_at (string|null), updated_at (string|null). Additional fields may be present.
  snapshots?: Array<{
    id: string,
    snapshot_date: string,
    net_worth_amount: number
  }>
}

/**
 * Get a comprehensive overview of your financial status including net worth, assets, liabilities, and week-over-week trends. Shows account balances grouped by type and provides suggested next steps. This is a read-only tool that provides instant access to your financial data stored in the database.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_financial_summary(
  sdk: ServerSdk,
  params: get_financial_summaryParams
): Promise<get_financial_summaryOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-financial-summary", params) as get_financial_summaryOutput;
}

/**
 * The type of the input parameter for batch_update_categories tool.
 */
export type batch_update_categoriesParams = {
  options?: {

  },
  // Array of transaction updates (recommended batch size: 30)
  updates: Array<{
    category: string,
    confidence?: number,
    transaction_id: string
  }>
}

/**
 * The type of the output of the batch_update_categories tool.
 */
export type batch_update_categoriesOutput = {
  success: boolean,
  updatedCount: number
}

/**
 * Update categories for multiple transactions at once. Use this when the user asks you to recategorize transactions.  Process transactions in batches of ~30 at a time. For each transaction, assign an appropriate category.  These updates do NOT mark transactions as manually categorized - they can still be recategorized by background sync if the user updates their categorization rules.  Common categories: - FOOD_AND_DRINK_COFFEE, FOOD_AND_DRINK_RESTAURANT, FOOD_AND_DRINK_GROCERIES - TRANSPORTATION_GAS, TRANSPORTATION_TAXIS_AND_RIDE_SHARES - ENTERTAINMENT_TV_AND_MOVIES, ENTERTAINMENT_MUSIC_AND_AUDIO - GENERAL_MERCHANDISE_ONLINE_MARKETPLACES, GENERAL_MERCHANDISE_ELECTRONICS - RENT_AND_UTILITIES_INTERNET_AND_CABLE, RENT_AND_UTILITIES_GAS_AND_ELECTRICITY
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function batch_update_categories(
  sdk: ServerSdk,
  params: batch_update_categoriesParams
): Promise<batch_update_categoriesOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/batch-update-categories", params) as batch_update_categoriesOutput;
}

/**
 * The type of the input parameter for update_transaction_category tool.
 */
export type update_transaction_categoryParams = {
  options?: {
    category?: string
  },
  // The transaction ID to update
  transaction_id: string
}

/**
 * The type of the output of the update_transaction_category tool.
 */
export type update_transaction_categoryOutput = {
  success: boolean,
  // The final category after update
  category: string,
  transactionId: string
}

/**
 * Confirm or change a SINGLE transaction's category and mark it as manually categorized. Use this when the user explicitly confirms a category for one transaction. The transaction will NOT be changed by future background recategorizations. Pass category in options.category.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function update_transaction_category(
  sdk: ServerSdk,
  params: update_transaction_categoryParams
): Promise<update_transaction_categoryOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/update-transaction-category", params) as update_transaction_categoryOutput;
}

/**
 * The type of the input parameter for get_financial_context tool.
 */
export type get_financial_contextParams = {
  options?: {

  }
}

/**
 * The type of the output of the get_financial_context tool.
 */
export type get_financial_contextOutput = {
  // The Financial Context content, or null if not created yet
  content: (string | null),
  // When the context was last updated (ISO format)
  updatedAt: (string | null)
}

/**
 * Retrieve the user's Financial Context - their personal financial document.  This document contains important information about the user's financial situation that you should reference when: - Providing personalized financial advice - Understanding spending patterns and goals - Making budget recommendations - Analyzing transactions in context - Discussing financial planning  If empty or not yet created, consider asking the user about their financial goals, income, expenses, and situation, then save it using update-financial-context.  Returns the document content and last updated timestamp, or null if not yet created.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_financial_context(
  sdk: ServerSdk,
  params: get_financial_contextParams
): Promise<get_financial_contextOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-financial-context", params) as get_financial_contextOutput;
}

/**
 * The type of the input parameter for update_financial_context tool.
 */
export type update_financial_contextParams = {
  // The complete Financial Context content (replaces existing)
  content: string,
  options?: {

  }
}

/**
 * The type of the output of the update_financial_context tool.
 */
export type update_financial_contextOutput = {
  // Whether the update was successful
  success: boolean,
  // Length of saved content in characters
  contentLength: number
}

/**
 * Update the user's Financial Context - their personal financial situation document.  Use this to record important information learned during conversations: - Financial goals (retirement, house purchase, debt payoff, emergency fund) - Income sources and approximate amounts - Regular expenses and financial commitments - Investment preferences and risk tolerance - Life circumstances affecting finances (dependents, job situation, location) - Spending habits and patterns observed - Budget preferences and constraints - Specific merchant context (e.g., "Locale near my house is a grocery store, not a restaurant")  The content should be free-form text written in a way that helps future conversations understand the user's complete financial picture. Think of it like a CLAUDE.md file but for personal finance.  IMPORTANT: This REPLACES the entire document. Always call get-financial-context first to preserve existing content and append/update it rather than overwriting.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function update_financial_context(
  sdk: ServerSdk,
  params: update_financial_contextParams
): Promise<update_financial_contextOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/update-financial-context", params) as update_financial_contextOutput;
}

/**
 * The type of the input parameter for get_opinion tool.
 */
export type get_opinionParams = {
  options?: {

  },
  // The ID of the opinion to retrieve (e.g., 'graham-20-percent-rule')
  opinion_id: string
}

/**
 * The type of the output of the get_opinion tool.
 */
export type get_opinionOutput = any

/**
 * Get an expert opinion prompt to apply to your financial analysis. Returns the full analysis instructions for a specific methodology (e.g., Graham Stephan's 20% Rule, Minimalist budgeting).
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_opinion(
  sdk: ServerSdk,
  params: get_opinionParams
): Promise<get_opinionOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-opinion", params) as get_opinionOutput;
}

/**
 * The type of the input parameter for get_budgets tool.
 */
export type get_budgetsParams = {
  // Maximum number of budgets to return (for pagination)
  limit?: number,
  // Number of budgets to skip (for pagination)
  offset?: number,
  options?: {
    show_transactions?: boolean
  },
  // Optional: Get specific budget by ID. If omitted, returns all budgets.
  budget_id?: string
}

/**
 * The type of the output of the get_budgets tool.
 */
export type get_budgetsOutput = {
  // List of budget objects. Expected fields: id (string), amount (number), title (string), period (string), spent (number), remaining (number), percentage (number), status (string), transactionCount (number), dateRange (object), processingStatus (string), transactions (array, optional). Additional fields may be present.
  budgets: Array<{
    id: string,
    amount: number
  }>,
  // Example budget descriptions to help users create their first budget
  exampleBudgets: Array<string>,
  // Detailed guidance for creating and managing budgets
  widgetInstructions: string
}

/**
 * CALL THIS FIRST when user asks about budgets, wants to create a budget, or view budget status. Shows existing budgets with spending progress or provides creation guidance if no budgets exist. Use show_transactions=true to include matching transactions, or false (default) to get just spending totals. Optionally filter by budget_id to get a specific budget. Returns widget visualization showing budget progress bars.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_budgets(
  sdk: ServerSdk,
  params: get_budgetsParams
): Promise<get_budgetsOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-budgets", params) as get_budgetsOutput;
}

/**
 * The type of the input parameter for create_budget tool.
 */
export type create_budgetParams = {
  options: {
    title: string,
    time_period: ('rolling' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'),
    budget_amount: number,
    filter_prompt: string,
    custom_period_days?: number,
    fixed_period_start_date?: string
  }
}

/**
 * The type of the output of the create_budget tool.
 */
export type create_budgetOutput = any

/**
 * Create a new budget after calling get-budgets first. Two budget types: ROLLING (last N days, continuously rolling) or FIXED (calendar-based with custom start date). For rolling budgets: provide time_period='rolling' and custom_period_days in options. For fixed budgets: provide time_period (weekly/biweekly/monthly/quarterly/yearly) and fixed_period_start_date in options.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function create_budget(
  sdk: ServerSdk,
  params: create_budgetParams
): Promise<create_budgetOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/create-budget", params) as create_budgetOutput;
}

/**
 * The type of the input parameter for update_budget_rules tool.
 */
export type update_budget_rulesParams = {
  options?: {
    title?: string,
    time_period?: ('rolling' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'),
    budget_amount?: number,
    filter_prompt?: string,
    custom_period_days?: number,
    fixed_period_start_date?: string
  },
  // Budget ID to update (required - get from get-budgets tool)
  budget_id: string
}

/**
 * The type of the output of the update_budget_rules tool.
 */
export type update_budget_rulesOutput = any

/**
 * Update an existing budget's configuration (title, filter rules, amount, or time period). Call get-budgets first to get the budget ID. Provide 'budget_id' at top level, and any fields to change in 'options'. After updating, transactions will be re-matched against the new rules.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function update_budget_rules(
  sdk: ServerSdk,
  params: update_budget_rulesParams
): Promise<update_budget_rulesOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/update-budget-rules", params) as update_budget_rulesOutput;
}

/**
 * The type of the input parameter for delete_budget tool.
 */
export type delete_budgetParams = {
  options?: {

  },
  // Budget ID to delete
  budget_id: string
}

/**
 * The type of the output of the delete_budget tool.
 */
export type delete_budgetOutput = any

/**
 * Delete a budget by ID. Use get-budgets to find the budget ID.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function delete_budget(
  sdk: ServerSdk,
  params: delete_budgetParams
): Promise<delete_budgetOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/delete-budget", params) as delete_budgetOutput;
}

/**
 * The type of the input parameter for get_transactions tool.
 */
export type get_transactionsParams = {
  // Maximum number of transactions to return (for pagination)
  limit?: number,
  // Number of transactions to skip (for pagination)
  offset?: number,
  options?: {
    budget_id?: string,
    categories?: Array<string>,
    pending_only?: boolean,
    exclude_pending?: boolean
  },
  // End date in YYYY-MM-DD format (default: today)
  end_date?: string,
  // Start date in YYYY-MM-DD format (default: all available data)
  start_date?: string,
  // Filter transactions by account IDs (exact match). Get account IDs by calling get-account-status tool first. Example: ['account_123', 'account_456']
  account_ids?: Array<string>
}

/**
 * The type of the output of the get_transactions tool.
 */
export type get_transactionsOutput = {
  summary: {
    transactionCount: number
  },
  // Array of transaction objects. Expected fields: transaction_id (string), date (YYYY-MM-DD), amount (number), description (string), category (string), category_confidence (number|null), account_name (string), pending (boolean). Additional fields may be present.
  transactions: Array<{
    date: string,
    amount: number,
    transaction_id: string
  }>,
  // Guidelines for analyzing transaction data
  dataInstructions: string,
  availableCategories: {

  },
  // Recommendations for visualizing transaction data
  visualizationInstructions: string
}

/**
 * Retrieve categorized transaction data from the user's connected financial institution. Returns structured transaction data with AI-powered categorization, along with analysis and visualization guidance. Use options.categories, options.budget_id, options.pending_only, or options.exclude_pending for filtering.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_transactions(
  sdk: ServerSdk,
  params: get_transactionsParams
): Promise<get_transactionsOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-transactions", params) as get_transactionsOutput;
}

/**
 * The type of the input parameter for get_raw_transactions tool.
 */
export type get_raw_transactionsParams = {
  options?: {

  },
  // End date in YYYY-MM-DD format (default: today)
  end_date?: string,
  // Start date in YYYY-MM-DD format (default: 90 days ago)
  start_date?: string
}

/**
 * The type of the output of the get_raw_transactions tool.
 */
export type get_raw_transactionsOutput = any

/**
 * Download raw transaction data as CSV without AI categorization. Use this when you need the pure data export for external analysis or spreadsheet tools. For analyzed data with categories, use 'get-transactions' instead.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_raw_transactions(
  sdk: ServerSdk,
  params: get_raw_transactionsParams
): Promise<get_raw_transactionsOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-raw-transactions", params) as get_raw_transactionsOutput;
}

/**
 * The type of the input parameter for get_investment_holdings tool.
 */
export type get_investment_holdingsParams = {
  options?: {

  }
}

/**
 * The type of the output of the get_investment_holdings tool.
 */
export type get_investment_holdingsOutput = {
  summary: {
    totalValue: number,
    holdingCount: number
  },
  // Array of investment holdings. Expected fields: security_id (string), quantity (number), institution_value (number), account_id (string), account_name (string), ticker_symbol (string|null), security_name (string|null), institution_price (number), cost_basis (number|null), gain_loss (number|null), gain_loss_percentage (number|null). Additional fields may be present.
  holdings: Array<{
    quantity: number,
    security_id: string,
    institution_value: number
  }>
}

/**
 * View your investment portfolio across all connected investment accounts (401k, IRA, brokerage, crypto exchange). Shows total portfolio value, breakdown by security with current prices, quantity held, and gain/loss if cost basis is available. This is a read-only tool that provides instant access to your holdings data stored in the database.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_investment_holdings(
  sdk: ServerSdk,
  params: get_investment_holdingsParams
): Promise<get_investment_holdingsOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-investment-holdings", params) as get_investment_holdingsOutput;
}

/**
 * The type of the input parameter for get_liabilities tool.
 */
export type get_liabilitiesParams = {
  // Optional filter by liability type: 'credit' (credit cards), 'mortgage' (home loans), or 'student' (student loans)
  type?: ('credit' | 'mortgage' | 'student'),
  options?: {

  }
}

/**
 * The type of the output of the get_liabilities tool.
 */
export type get_liabilitiesOutput = {
  summary: {
    totalLiabilities: number
  },
  // Array of liability objects. Expected fields: account_id (string), type ('credit'|'mortgage'|'student'), account_name (string|null), data (object with liability-specific details). Additional fields may be present.
  liabilities: Array<{
    type: ('credit' | 'mortgage' | 'student'),
    account_id: string
  }>,
  // Guidelines for analyzing liability data
  dataInstructions: string
}

/**
 * View your liabilities across all connected accounts including credit cards, mortgages, and student loans. Shows payment schedules, interest rates, balances, and overdue status. Optionally filter by liability type (credit, mortgage, or student). Data is fetched from Plaid on first call and then cached in the database for instant access.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_liabilities(
  sdk: ServerSdk,
  params: get_liabilitiesParams
): Promise<get_liabilitiesOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-liabilities", params) as get_liabilitiesOutput;
}

/**
 * The type of the input parameter for get_recurring_transactions tool.
 */
export type get_recurring_transactionsParams = {
  // Optional filter by transaction type: 'inflow' (income like payroll), 'outflow' (expenses like rent, subscriptions)
  type?: ('inflow' | 'outflow'),
  options?: {

  }
}

/**
 * The type of the output of the get_recurring_transactions tool.
 */
export type get_recurring_transactionsOutput = {
  summary: {
    totalInflows: number,
    totalOutflows: number
  },
  // Recurring income streams (payroll, deposits, etc.). Expected fields: stream_id (string), average_amount (number), account_id (string), description (string), merchant_name (string|null), frequency ('WEEKLY'|'BIWEEKLY'|'SEMI_MONTHLY'|'MONTHLY'|'ANNUALLY'|'UNKNOWN'), status (string), is_active (boolean), last_amount (number), first_date (YYYY-MM-DD), last_date (YYYY-MM-DD), predicted_next_date (string|null), transaction_count (number), category_primary (string|null), category_detailed (string|null), category_confidence ('VERY_HIGH'|'HIGH'|'MEDIUM'|'LOW'|'UNKNOWN'|null). Additional fields may be present.
  inflowStreams: Array<{
    stream_id: string,
    average_amount: number
  }>,
  // Recurring expense streams (subscriptions, bills, etc.). Expected fields: stream_id (string), average_amount (number), account_id (string), description (string), merchant_name (string|null), frequency ('WEEKLY'|'BIWEEKLY'|'SEMI_MONTHLY'|'MONTHLY'|'ANNUALLY'|'UNKNOWN'), status (string), is_active (boolean), last_amount (number), first_date (YYYY-MM-DD), last_date (YYYY-MM-DD), predicted_next_date (string|null), transaction_count (number), category_primary (string|null), category_detailed (string|null), category_confidence ('VERY_HIGH'|'HIGH'|'MEDIUM'|'LOW'|'UNKNOWN'|null). Additional fields may be present.
  outflowStreams: Array<{
    stream_id: string,
    average_amount: number
  }>,
  // Guidelines for analyzing recurring transaction data
  dataInstructions: string
}

/**
 * view your recurring transactions from all connected accounts
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_recurring_transactions(
  sdk: ServerSdk,
  params: get_recurring_transactionsParams
): Promise<get_recurring_transactionsOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-recurring-transactions", params) as get_recurring_transactionsOutput;
}

/**
 * The type of the input parameter for get_inbox tool.
 */
export type get_inboxParams = {
  options?: {

  }
}

/**
 * The type of the output of the get_inbox tool.
 */
export type get_inboxOutput = any

/**
 * Your inbox is a queue of actions you can take to improve your personal financial situation. If you're unsure what to do next, check your inbox. Returns the next step in your onboarding journey or active state recommendations. Call this tool when starting a session or after completing any financial action.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function get_inbox(
  sdk: ServerSdk,
  params: get_inboxParams
): Promise<get_inboxOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/get-inbox", params) as get_inboxOutput;
}

/**
 * The type of the input parameter for update_inbox tool.
 */
export type update_inboxParams = {
  // Action to take: update, complete, dismiss, or snooze
  action: ('update' | 'complete' | 'dismiss' | 'snooze'),
  // ID of the inbox item to update
  item_id: string,
  options?: {
    snooze_days?: number
  }
}

/**
 * The type of the output of the update_inbox tool.
 */
export type update_inboxOutput = any

/**
 * Update, complete, dismiss, or snooze an inbox item. Use 'update' for generic updates (behavior defined by options), 'complete' when the user has finished the action, 'dismiss' to permanently hide an item they don't want to do, or 'snooze' to temporarily hide it for a number of days.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function update_inbox(
  sdk: ServerSdk,
  params: update_inboxParams
): Promise<update_inboxOutput> {
  return await sdk.callTool("AttainFinance/1.0.0/update-inbox", params) as update_inboxOutput;
}



import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "news",
   serverVersion: "1.1.0",
   description: "Access news headlines and summaries from a wide range of sources",
} as const;

/**
 * The type of the input parameter for headlines tool.
 */
export type headlinesParams = {
  // The news topic to get headlines for (e.g., 'artificial intelligence', 'politics', 'climate change', 'tech industry', 'sports')
  topic: string,
  // Optional: Filter to specific sources. Available: ars_technica, axios, bbc, cnn, fox_news, guardian, hacker_news, nypost, nytimes, semafor, techmeme.
  sources?: Array<('hacker_news' | 'cnn' | 'bbc' | 'nytimes' | 'nypost' | 'guardian' | 'fox_news' | 'axios' | 'semafor' | 'techmeme' | 'ars_technica')>
}

/**
 * The type of the output of the headlines tool.
 */
export type headlinesOutput = {
  // Number of stories returned
  count?: number,
  error?: {
    type: string,
    message: string
  },
  // The topic that was searched
  topic?: string,
  // Sources that returned results
  sources?: Array<string>,
  // Whether the request succeeded
  success: boolean,
  // When data was fetched (ISO 8601 UTC)
  fetchedAt: string,
  // Stories sorted by rankScore descending
  headlines?: Array<{
    url: string,
    score?: number,
    title: string,
    author?: string,
    source: string,
    content?: string,
    pubDate?: string,
    summary?: string,
    imageUrl?: string,
    sourceId: ('hacker_news' | 'cnn' | 'bbc' | 'nytimes' | 'nypost' | 'guardian' | 'fox_news' | 'axios' | 'semafor' | 'techmeme' | 'ars_technica'),
    rankScore: number,
    description?: string,
    sourceLogoUrl?: string
  }>
}

/**
 * PRIMARY TOOL FOR BREAKING NEWS AND CURRENT EVENTS: Fetches today's headlines from 10+ live news sources (Ars Technica, Axios, BBC, CNN, Fox News, Guardian, Hacker News, NY Post, NYTimes, Semafor, Techmeme) filtered by topic. Use for: 'What's happening with X?', 'Latest news about Y', breaking stories, current events. Results include summaries when available; use webcrawl's 'crawlUrl' tool to fetch full article content when needed. For searching archives, use 'searchNews' instead. All timestamps are in UTC.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function headlines(
  sdk: ServerSdk,
  params: headlinesParams
): Promise<headlinesOutput> {
  return await sdk.callTool("news/1.1.0/headlines", params) as headlinesOutput;
}

/**
 * The type of the input parameter for searchNews tool.
 */
export type searchNewsParams = {
  // Maximum number of results to return (1-100, default: 30)
  limit?: number,
  // Search query - keywords to search for in article archives
  query: string,
  // Optional: Topic for AI relevance filtering to improve result quality (e.g., 'artificial intelligence', 'politics').
  topic?: string,
  // Optional: End date in YYYY-MM-DD format (UTC).
  toDate?: string,
  // Optional: Which search sources to use. Available: 'nytimes' (NYTimes Article Search API), 'hacker_news' (Algolia HN Search). Default: both.
  sources?: Array<('nytimes' | 'hacker_news')>,
  // Optional: Start date in YYYY-MM-DD format (UTC).
  fromDate?: string
}

/**
 * The type of the output of the searchNews tool.
 */
export type searchNewsOutput = {
  // Number of stories returned
  count?: number,
  error?: {
    type: string,
    message: string
  },
  // The search query used
  query: string,
  // Topic filter applied (if any)
  topic?: string,
  // End date filter applied (YYYY-MM-DD UTC)
  toDate?: string,
  // Stories sorted by rankScore descending
  results?: Array<{
    url: string,
    score?: number,
    title: string,
    author?: string,
    source: string,
    content?: string,
    pubDate?: string,
    summary?: string,
    imageUrl?: string,
    sourceId: ('hacker_news' | 'cnn' | 'bbc' | 'nytimes' | 'nypost' | 'guardian' | 'fox_news' | 'axios' | 'semafor' | 'techmeme' | 'ars_technica'),
    rankScore: number,
    sourceLogoUrl?: string
  }>,
  // Sources that returned results
  sources?: Array<string>,
  // Whether the request succeeded
  success: boolean,
  // Start date filter applied (YYYY-MM-DD UTC)
  fromDate?: string,
  // When data was fetched (ISO 8601 UTC)
  fetchedAt: string
}

/**
 * ARCHIVE SEARCH: Search news archives using sources with real search APIs (New York Times Article Search API, Hacker News Algolia). Best for finding specific stories, historical news, or searching by keywords with date ranges. Results include summaries when available; use webcrawl's 'crawlUrl' tool to fetch full article content when needed. For current/breaking news on a topic, use the 'headlines' tool instead. All timestamps are in UTC.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function searchNews(
  sdk: ServerSdk,
  params: searchNewsParams
): Promise<searchNewsOutput> {
  return await sdk.callTool("news/1.1.0/searchNews", params) as searchNewsOutput;
}

/**
 * The type of the input parameter for hackerNewsTopStories tool.
 */
export type hackerNewsTopStoriesParams = {
  // Number of top stories to fetch (1-30, default: 30)
  limit?: number
}

/**
 * The type of the output of the hackerNewsTopStories tool.
 */
export type hackerNewsTopStoriesOutput = {
  count?: number,
  error?: {
    type: string,
    message: string
  },
  stories?: Array<{
    id: number,
    url: string,
    score: number,
    title: string
  }>,
  success: boolean,
  fetchedAt: string
}

/**
 * Fetch top stories from Hacker News with scores and URLs. Consider using the 'headlines' tool instead for multi-source news.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function hackerNewsTopStories(
  sdk: ServerSdk,
  params: hackerNewsTopStoriesParams
): Promise<hackerNewsTopStoriesOutput> {
  return await sdk.callTool("news/1.1.0/hackerNewsTopStories", params) as hackerNewsTopStoriesOutput;
}

/**
 * The type of the input parameter for cnnTopStories tool.
 */
export type cnnTopStoriesParams = {

}

/**
 * The type of the output of the cnnTopStories tool.
 */
export type cnnTopStoriesOutput = {
  count?: number,
  error?: {
    type: string,
    message: string
  },
  stories?: Array<{
    url: string,
    title: string
  }>,
  success: boolean,
  fetchedAt: string
}

/**
 * Fetch top stories from CNN Lite by parsing the homepage. Consider using the 'headlines' tool instead for multi-source news.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function cnnTopStories(
  sdk: ServerSdk,
  params: cnnTopStoriesParams
): Promise<cnnTopStoriesOutput> {
  return await sdk.callTool("news/1.1.0/cnnTopStories", params) as cnnTopStoriesOutput;
}

/**
 * The type of the input parameter for bbcNewsHeadlines tool.
 */
export type bbcNewsHeadlinesParams = {
  // Number of headlines to fetch (1-50, default: 20)
  limit?: number
}

/**
 * The type of the output of the bbcNewsHeadlines tool.
 */
export type bbcNewsHeadlinesOutput = {
  count?: number,
  error?: {
    type: string,
    message: string
  },
  stories?: Array<{
    link: string,
    title: string,
    pubDate: string,
    imageUrl?: string,
    description: string
  }>,
  success: boolean,
  fetchedAt: string
}

/**
 * Fetch news headlines from BBC News RSS feed with descriptions and publication dates. Consider using the 'headlines' tool instead for multi-source news.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function bbcNewsHeadlines(
  sdk: ServerSdk,
  params: bbcNewsHeadlinesParams
): Promise<bbcNewsHeadlinesOutput> {
  return await sdk.callTool("news/1.1.0/bbcNewsHeadlines", params) as bbcNewsHeadlinesOutput;
}



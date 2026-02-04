---
name: sidekick-tasks
description: create_sidekick_task for autonomous multi-step workflows. Runs asynchronously with NO user interaction possible—handle all user input before creating the task. Use for complex research, synthesis, and background processing requiring intelligence.
---

# Sidekick Tasks

Sidekick tasks are powerful, autonomous agents that can handle complex multi-step tasks on behalf of your users. They have access to the user's context, a wide range of tools, and can make intelligent decisions to accomplish tasks.

They are different from simply calling sidekick with a prompt - only sidekick tasks can run the powerful agentic harness.

**Important:** Sidekick tasks run asynchronously in the background and CANNOT interact with the user. They cannot ask clarifying questions, request user input, or have a conversation. If your workflow requires user interaction, handle it in your agent code before creating the sidekick task.

```typescript
import { create_sidekick_task, query_running_sidekick_tasks } from "../tools/sidekicktasks";
```

## ⚠️ CRITICAL: Always Use Prompt Templates

**Every example in this skill shows inline instructions for brevity. In your actual code, you MUST use Handlebars templates from the `src/prompts/` directory.**

### Required Pattern

```typescript
// 1. Import and compile template
import Handlebars from "handlebars";
import taskPromptSource from "./prompts/prepare-briefing.handlebars";

const taskTemplate = Handlebars.compile(taskPromptSource);

// 2. Use with create_sidekick_task
await create_sidekick_task(sdk, {
  instructions: taskTemplate({ date: today, context: userContext }),
  description: "Prepare daily briefing"
});
```

### Why This Matters

- **Never inline instructions** - Sidekick Task prompts are complex and need iteration
- **Version control** - Track prompt evolution and improvements
- **Maintainability** - Update prompts without touching code
- **Testing** - Easy to test different instruction variations

❌ **All code examples below show inline strings for readability only. In real code, use templates.**

See `skills/prompt-templates/SKILL.md` for comprehensive guidance.

---

## Overview

**Always use sidekick tasks when a task requires:**
- Multiple steps with decision-making between them
- Access to user context (preferences, history, relationships)
- Synthesis across multiple data sources (email + calendar, web search + tools)
- Natural language understanding and generation
- Content creation (reports, summaries, podcasts, briefings)

**Key Tradeoff:** sidekick tasks are extremely capable but have 1-2 minute latency. Use them for workflows where intelligence matters more than speed.

## Quick Reference: Sidekick Tasks vs CallLLM+Tool Calls

| Use Sidekick Tasks | Use CallLLM + Direct Tool Calls |
|---|---|
| "Research cheap flights for a vacation to Portugal in spring" | "What's the weather in San Francisco?" |
| "Find restaurants for my anniversary considering my dietary restrictions" | "Crawl a website and categorize the content" |
| "Prepare a brief on each of the public figured in the board meeting tomorrow" | "Classify the unread emails are important / not-important" |

**Sidekick Tasks**: Open-ended research, multi-step reasoning, iterating on queries, synthesizing across sources.

**CallLLM + Tools**: Workflow with only a few, known steps, direct lookups, straightforward transformations, summarization of provided content.

## Quick Decision Tree

**Should I use a sidekick task?**

1. Does the task require multiple steps with decisions? → **Yes, use sidekick task**
2. Might the approach need to change based on what's discovered? → **Yes, use sidekick task**
3. Can the task be done with a single tool call? → **No, use tool directly**
4. Does it require < 5 second response time? → **No, use tool/LLM directly**
5. Does it need user context or synthesis? → **Yes, use sidekick task**
6. Is it a simple transformation/formatting? → **No, use sdk.callLLM**
7. Does handling intermediate results require judgment about next steps? → **Yes, use sidekick task**

**When in doubt:** If you find yourself writing complex orchestration code with multiple tool calls and decision logic, use a sidekick task instead. Sidekick tasks can adapt their approach based on what they find - you don't need to anticipate every scenario.

## 🎯 Perfect Use Case: Background Triggers

**Email triggers and cron triggers are background operations with NO latency requirements. This makes them PERFECT for Sidekick Tasks when you need intelligence.**

If you're implementing a background trigger (email or cron) that needs to:
- **Understand** what content means
- **Decide** what's relevant or important
- **Analyze** across multiple pieces of information
- **Exercise judgment** about what to do

→ **Use Sidekick Tasks. This is your default choice.**

The 1-2 minute latency is completely acceptable for background operations, and you get deep understanding of content, access to user context and memory, intelligent decision-making, and autonomous workflow execution.

**Don't overthink it:** Background operations + need for intelligence = Sidekick Tasks.

## When to Use sidekick tasks

### ✅ Perfect Use Cases

**Complex Data Gathering & Analysis**
```typescript
// NOTE: In real code, instructions MUST be in src/prompts/*.handlebars
// This example shows inline strings for readability only

// User asks: "What's on my calendar tomorrow and what do I need to prepare?"
// This requires: calendar lookup, email context search, synthesis
const result = await create_sidekick_task(sdk, {
  instructions: "Prepare a briefing for tomorrow. Check my calendar, search for relevant emails from attendees, and provide context for each meeting.",
  description: "Prepare briefing"
});
```

**Multi-Source Research**
```typescript
// NOTE: In real code, instructions MUST be in src/prompts/*.handlebars
// This example shows inline strings for readability only

// Finding the best restaurant for a specific occasion
// Requires: web search, filtering, understanding user preferences
const result = await create_sidekick_task(sdk, {
  instructions: "Find 3 romantic Italian restaurants in San Francisco with outdoor seating, under $100 per person. Check reviews and make recommendations.",
  description: "Find romantic restaurants in SF"
});
```

**Content Creation**
```typescript
// Creating a podcast from multiple articles
// Requires: web fetching, synthesis, narrative creation
const result = await create_sidekick_task(sdk, {
  instructions: "Create a podcast discussing these three articles about AI: [urls]. Synthesize the key themes, contrasting viewpoints, and create conversational dialogue.",
  description: "Create AI podcast"
});
```

**Intelligent Automation**
```typescript
// Processing email with context-aware actions
// Requires: reading email, understanding intent, taking appropriate actions
const result = await create_sidekick_task(sdk, {
  instructions: "Process this support email: [content]. Search for similar past tickets, check our knowledge base, and draft a response.",
  description: "Handle support email"
});
```

### ❌ Don't Use sidekick tasks For

**Simple Tool Calls**
```typescript
// BAD: Sidekick Task for straightforward tool call
const result = await create_sidekick_task(sdk, {
  instructions: "Get my calendar events for today"
});

// GOOD: Direct tool call - no intelligence needed
const events = await calendar_getUpcomingEvents(sdk, { startDate: today });
```

**Simple Data Transformations**
```typescript
// BAD: Sidekick Task for basic formatting
const result = await create_sidekick_task(sdk, {
  instructions: "Convert this JSON to CSV: [data]"
});

// GOOD: Use sdk.callLLM for simple transformations
const csv = await sdk.callLLM(`Convert to CSV: ${data}`, outputSchema);
```

**Retrieving Structured User Information**
```typescript
// BAD: Sidekick Task just to get user context
const result = await create_sidekick_task(sdk, {
  instructions: "What is the user's preferred city for weather?"
});

// GOOD: Use sdk.sidekickWithSchema for structured user information
const userInfo = await sdk.sidekickWithSchema(
  "What is the user's preferred city for weather updates?",
  Type.Object({ city: Type.String() })
);
```

**Real-Time Interactions**
```typescript
// BAD: User is waiting for immediate response
// The 1-2 minute latency is unacceptable here
const result = await create_sidekick_task(sdk, {
  instructions: "What's the weather right now?"
});

// GOOD: Direct tool call for immediate response
// import { getCurrentWeather } from "@tools/weather";
const weather = await getCurrentWeather(sdk, { location });
```

**Key Distinction:** Sidekick Tasks are for **autonomous intelligence**, not just tool orchestration. If you know exactly which tools to call in what order, write that code directly.

## Implementation Patterns

### Basic sidekick task Creation

Be clear with your instructions for the sidekick task but don't be overly prescriptive about exactly how it should accomplish the goal as it is capable of adapting behavior based on the real data it sees.

```typescript
import { create_sidekick_task, query_running_sidekick_tasks } from "../tools/sidekicktasks";
import { Type } from "@dev-agents/sdk-shared";

export const prepareDailyBriefing = backgroundFunction({
  description: "Prepare a comprehensive briefing for the user's day",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    // Create the sidekick task
    const agentResult = await create_sidekick_task(sdk, {
      instructions: `Prepare my daily briefing:
1. Check my calendar for today and tomorrow
2. For each significant meeting, search for recent emails from attendees
3. Check for any urgent emails in my inbox
4. Summarize everything in a clear, actionable briefing
5. Post the briefing as a post with priority: urgent`,
      description: "Prepare daily briefing"
    });

    // No callback, so task will post results automatically when done
    // No need to wait for completion - it will notify the user
    console.log(`Started sidekick task: ${agentResult.agentId}`);
  },
});
```

### Monitoring Agent Status

```typescript
export const checkBriefingStatus = serverFunction({
  description: "Check if the daily briefing agent is still running",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const runningAgents = await query_running_sidekick_tasks(sdk, {});

    const briefingAgents = runningAgents.agents.filter(
      agent => agent.description.includes("daily briefing")
    );

    if (briefingAgents.length > 0) {
      return {
        status: "running",
        agents: briefingAgents.map(a => ({
          id: a.agentId,
          startedAt: a.createdAt
        }))
      };
    }

    return { status: "complete" };
  },
});
```

### Tracking Agent Invocations

When creating sidekick tasks from background functions, store the invocation context so you can track related work:

```typescript
export const processSharedContent = backgroundFunction({
  description: "Process content shared via share extension",
  params: InputTriggerParamsSchema,
  execute: async (sdk: ServerSdk, params: InputTriggerParams) => {
    const invocationId = await sdk.currentInvocationId();

    // Store that we're processing this
    await sdk.setValue(`processing_${invocationId}`, {
      status: "started",
      timestamp: Date.now()
    });

    // ⚠️ If params.attachments contains file URLs (images, PDFs), persist them
    // BEFORE creating the sidekick task - attachment URLs expire.
    // See skills/file-storage/SKILL.md

    // Create sidekick task to do the actual work
    const agentResult = await create_sidekick_task(sdk, {
      instructions: `Process this shared content: ${params.message}
Attachments: ${JSON.stringify(params.attachments)}

Analyze the content, extract key information, and add it to the user's reading list with appropriate tags and summary.`,
      description: "Analyse article"
    });

    // Update status with agent ID
    await sdk.setValue(`processing_${invocationId}`, {
      status: "agent_created",
      agentId: agentResult.agentId,
      timestamp: Date.now()
    });
  },
});
```

## Prompt Engineering for sidekick tasks

### Clear Structure

sidekick tasks work best with clear, step-by-step instructions:

```typescript
// ✅ GOOD: Clear steps and expectations
const instructions = `Prepare a meeting intelligence report:

1. Check my calendar for meetings today with external attendees
2. For each meeting:
   - Search for recent emails from the company/attendees (last 7 days)
   - Check memory.txt for any relevant context about this company
   - Look for same-day news announcements about the company
3. Create a briefing with:
   - Meeting time and attendees
   - Recent email context
   - Relevant news or announcements
   - Suggested talking points
4. Create as a post with priority: urgent

Focus on meetings that would benefit from intelligence prep - skip internal 1:1s.`;

// ❌ BAD: Vague and unclear
const instructions = "Tell me about my meetings today";
```

### Getting Output from a Sidekick Task

By default, sidekick tasks automatically create a post to the user's feed when complete. This behavior is controlled by the `postToFeed` flag.

#### Controlling Feed Posts

The `postToFeed` flag controls whether the task creates a feed post when complete:

| Scenario | `postToFeed` default | Behavior |
|----------|---------------------|----------|
| No `completionCallback` | `true` (required) | Task posts results automatically |
| With `completionCallback` | `false` | You handle results programmatically |

**Pick ONE notification strategy:**

| Let task post | You handle posting |
|---------------|-------------------|
| Simple cases where task can generate good content | Need custom formatting, conditional logic, or batched notifications |
| No callback, or callback + `postToFeed: true` | Use callback, let `postToFeed` default to false, call `create_agent_post` yourself |

⚠️ **Avoid setting `postToFeed: true` AND creating a post in your callback with similar content** - this creates redundant notifications.

To trigger a notification (email or mobile push), instruct the task to "set priority to urgent when posting."

#### Using Callbacks

For most use cases, you'll want to capture the output programmatically. Use callbacks:

- **`completionCallback`** (recommended): Name of an exported server function to receive the final result. Can accept any typed data shape.
- **`progressCallback`** (optional): Name of an exported server function that receives progress updates as the task works through its todo list. Arguments: `status` (active form, e.g., "Searching for events") and `imperativeStatus` (imperative form, e.g., "Search for events").

**Setup:**
1. Write an exported server function to receive the output
2. Run `dreamer push` so the function is visible to the sidekick task
3. Pass the function name in `completionCallback` when calling `create_sidekick_task`
```typescript
export const onCompletion = serverFunction({
  description: "Called by sidekick task when complete with the final results",
  params: Type.Object({
    summary: Type.String(),
    items: Type.Array(Type.Object({
      title: Type.String(),
      url: Type.Optional(Type.String()),
    })),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { summary, items }) => {
    // Store results, update UI state, trigger follow-up actions, etc.
    // ...
  },
});

export const onProgress = serverFunction({
  description: "Updates the progress status for a running task",
  params: Type.Object({
    status: Type.String({ minLength: 1, description: "Current status in active form (e.g., 'Searching for events')" }),
    imperativeStatus: Type.String({ minLength: 1, description: "Current status in imperative form (e.g., 'Search for events')" }),
  }),
  exported: true,
  execute: async (sdk: ServerSdk, { status, imperativeStatus }) => {
    // Update UI with current progress etc
    // ...
  },
});

// Create the task with callbacks
const result = await create_sidekick_task(sdk, {
  description: "Research competitors",
  instructions: `Research our top 3 competitors and summarize their recent product launches.
    
When complete, call onCompletion with:
- summary: A brief overview of findings
- items: Array of products found with title and url`,
  progressCallback: "onProgress",
  completionCallback: "onCompletion",
});
```

Note that your instructions should tell the sidekick task what shape of data to pass to the callback - it will read the function's schema but explicit instructions help ensure you get the output format you need.

### Showing continuous progress

If you would like to show the continuous progress of a sidekick task in your UI, you may define an exported server function to be called during task execution to provide status updates in `progressCallback` as shown. This function is called with the current task status each time its internal todo list is updated, providing both the active form (`status`: "Searching for events") and imperative form (`imperativeStatus`: "Search for events") for flexible UI display.


### Leverage Agent Capabilities

sidekick tasks have access to powerful tools - use them:

```typescript
const instructions = `Create a podcast about recent AI developments:

1. Use WebSearch to find 3-5 significant AI announcements from the past week
2. Use WebFetch or crawlUrl tools to read the full articles in parallel
3. Synthesize the key themes:
   - What are the major developments?
   - How do they relate to each other?
   - What are the implications?
4. Create a natural, conversational podcast script
5. Use createMultiVoiceAudio to generate the podcast with multiple voices
6. Create a post with:
   - Short message: "Your AI News Podcast is Ready"
   - Audio attachment
   - Markdown summary of key points
   - Priority: normal`;
```

## Cost Considerations

sidekick tasks use LLM calls, tool calls, and compute time. Use them judiciously:

### Concurrency and Idempotency

**Multiple tasks are supported:** You can create multiple concurrent sidekick tasks for the same agent with different instructions. Each task runs independently.

**Idempotency:** If you call `create_sidekick_task()` with the exact same instructions while a task with those instructions is still running, it returns the existing task with `isExisting: true`. This prevents duplicate work when the same operation is requested multiple times.

**Cost considerations:** While multiple tasks are allowed, each task costs money. Combine related work when possible:

```typescript
// ⚠️ ACCEPTABLE: Multiple tasks with different instructions
// Creates separate tasks - each incurs costs but runs concurrently
// Running tasks may complete in any order.
await create_sidekick_task(sdk, { instructions: "Analyze emails", ... });
await create_sidekick_task(sdk, { instructions: "Analyze calendar", ... });

// ✅ BETTER: Single task with all instructions (more efficient)
await create_sidekick_task(sdk, {
  instructions: "Analyze my emails and calendar, then create a combined summary", ...
});
```

When processing multiple items, include them all in one task. If more items may arrive soon and immediate action isn't required, consider batching before creating the task.

### Cache Results When Appropriate

```typescript
export const getDailyBriefing = serverFunction({
  description: "Get today's briefing (cached)",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const today = dayjs().tz(getUserTimeZone()).format('YYYY-MM-DD');
    const cacheKey = `briefing_${today}`;

    // Check cache first
    const cached = await db.select()...; // query the db using cacheKey
    if (cached) {
      return cached;
    }

    // Create agent to generate briefing
    await create_sidekick_task(sdk, {
      instructions: `Create daily briefing...`,
      completionCallback: "onBriefingComplete"
    });

    return { status: "generating" };
  },
});
```

## Guiding Automatic Post Content

When relying on automatic posts (`postToFeed: true` or no callback), shape the output via instructions:

```typescript
const instructions = `Research restaurants for date night:

1. Use web search to find romantic restaurants in [city]
2. Check reviews and ratings
3. Filter for restaurants with:
   - Outdoor seating
   - Good for couples
   - Under $100 per person
4. Create recommendations with:
   - Restaurant name and location
   - Why it's a good choice
   - Reservation link if available

When posting results:
- Short message: Summarize the top recommendation
- Include markdown with all options and reasoning
- Priority: normal`;

// No callback - task will post results automatically
await create_sidekick_task(sdk, {
  instructions,
  description: "Find date night restaurants"
});
```

## Common Pitfalls

### Don't Wait for Agent Completion

```typescript
// ❌ BAD: Trying to wait for agent results inline
const result = await create_sidekick_task(sdk, { instructions: "..." });
return result.data; // This won't work - agent runs asynchronously

// ✅ GOOD: Use completionCallback to receive results
await create_sidekick_task(sdk, {
  instructions: "...",
  completionCallback: "onTaskComplete"
});
// Your callback function will be called when the task finishes
```

### Don't Use for Simple Tasks

```typescript
// ❌ BAD: sidekick task for simple lookup
await create_sidekick_task(sdk, {
  instructions: "What's the current temperature in San Francisco?"
});

// ✅ GOOD: Direct tool call
// import { getCurrentWeather } from "@tools/weather";
const weather = await getCurrentWeather(sdk, {
  location: "San Francisco, CA"
});
```

### Don't Create Agents in Tight Loops

```typescript
// ❌ BAD: Creating an agent for each item is inefficient and expensive
for (const email of emails) {
  await create_sidekick_task(sdk, {
    instructions: `Summarize this email: ${email.body}`
  });
}

// ✅ GOOD: Single agent processes all emails (more efficient)
await create_sidekick_task(sdk, {
  instructions: `Summarize these emails: ${JSON.stringify(emails)}`
});

// ✅ EVEN BETTER: Use sdk.callLLM for simple transformations
const summaries = await sdk.callLLM(
  `Summarize each email: ${JSON.stringify(emails)}`,
  Type.Object({
    summaries: Type.Array(Type.Object({
      id: Type.String(),
      summary: Type.String()
    }))
  })
);
```

### Avoid Redundant Posts

If you enable `postToFeed: true` AND create a post in your callback, make sure they serve different purposes. Don't post similar content twice.

```typescript
// ❌ BAD: Both posts contain the same results
await create_sidekick_task(sdk, {
  instructions: "Find restaurants and post results...",
  completionCallback: "onComplete",
  postToFeed: true,  // Task posts results
});

export const onComplete = serverFunction({
  execute: async (sdk, results) => {
    // Callback ALSO posts the same results → redundant!
    await create_agent_post(sdk, {
      shortMessage: "Found restaurants",
      content: results.summary
    });
  }
});

// ✅ GOOD Option A: Let task handle posting (simplest)
await create_sidekick_task(sdk, {
  instructions: "Process and post summary...",
  // No callback - task posts automatically
});

// ✅ GOOD Option B: Handle posting yourself (most control)
await create_sidekick_task(sdk, {
  instructions: "Process and return structured data...",
  completionCallback: "onComplete",
  // postToFeed defaults to false - no automatic post
});

export const onComplete = serverFunction({
  execute: async (sdk, results) => {
    // You control the post: conditional, custom format, batched, etc.
    if (results.hasUrgentItems) {
      await create_agent_post(sdk, { priority: "urgent", ... });
    }
  }
});
```

## Performance Optimization

### Batch Related Work

```typescript
// ✅ GOOD: Single agent handles related tasks efficiently
const prompt = `Morning routine tasks:

1. Check calendar for today and tomorrow (run in parallel)
2. Search inbox for urgent emails (while calendar loads)
3. Check for important notifications
4. Synthesize into briefing

Work efficiently - use parallel tool calls where possible.`;
```

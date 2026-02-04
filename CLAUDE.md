# High-level Architecture

This application consists of a React frontend (`src/App.tsx`) and a backend (`src/server.ts`). The server calls tools and persists data. The frontend calls server functions and does not persist data or call remote APIs directly—all persistent state lives in the server's database.

- **Frontend SDK**: `@dev-agents/sdk-client`
- **Server SDK**: `@dev-agents/sdk-server`
- **Tools**: Individual modules in `tools/` (server-only)

Only edit files in the `src` directory.

# Server

The server runs in Bun and is composed of entry-points that call tools and persist data.

## Entry-points

Define entry points using `serverFunction` or `backgroundFunction` from `@dev-agents/sdk-server`:

- **`serverFunction`** — Fast operations returning data immediately to the client
- **`backgroundFunction`** — Long-running async operations (see below)

Both are called from the frontend using `call()` from `@dev-agents/sdk-client`.

```ts
export const setUserLocation = serverFunction({
  description: "Sets the user's location",
  params: Type.Object({
    location: Type.String({ minLength: 1, description: "Geocodable string e.g. San Francisco, CA" }),
  }),
  execute: async (sdk: ServerSdk, { location }) => {
    const db = sdk.db<typeof schema>();
    // Database operations...
  },
});
```

### Background Functions

Use `backgroundFunction` for operations that:
- Call external APIs multiple times
- Use `sdk.callLLM` or `sdk.sidekickWithSchema` (especially processing multiple items)
- Could take >30 seconds

Use `serverFunction` instead for fast, predictable operations (DB queries, single API calls).

**Background function constraints:**
- Must return void (store results in database)
- Can be invoked from client via `call()` or via triggers
- Use `sdk.currentInvocationId()` to track execution
- Check status with `sdk.getInvocationStatus(invocationId)`
- MUST NOT call background functions from server functions

**Defensive programming:** Wrap non-critical tool/LLM calls in try/catch:
```ts
try {
  const result = await someToolCall();
} catch (error) {
  console.error("Failed to call someToolCall", error);
}
```

### Exported Functions

Export functions for integration with Sidekick and other agents using `exported: true`. Design exported functions as good public interfaces—think about what external callers need.

```ts
export const getTodos = serverFunction({
  description: "Retrieves all todos for the current user",
  params: Type.Object({}),
  exported: true, // Callable by Sidekick
  execute: async (sdk: ServerSdk) => { /* ... */ },
});
```

**DO export functions that:**
- Provide core functionality other agents or Sidekick might need
- Have clear, well-defined inputs and outputs (CRUD operations, data retrieval, status checks)
- Include comprehensive descriptions for the function AND all parameters—if a param needs markdown, say so
- Handle errors gracefully and return meaningful error messages

**DON'T export functions that:**
- Perform internal housekeeping (data cleanup, syncing, migrations)
- Have side effects that could be dangerous if called unexpectedly
- Require complex setup/teardown that external callers won't understand
- Depend on specific timing or ordering that external callers can't guarantee

### `main` Function (Optional)

Special entry point for scheduled background work:

```ts
export const main = backgroundFunction({
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    // Periodic work...
  },
});
```

### Triggers

Triggers define entry points for external systems to invoke your agent's background functions—scheduled events, user input from share sheets, incoming emails, etc. Configure published triggers in `agent.yaml`:

```yaml
triggers:
  - type: cron
    defaultSchedule: "0 */2 * * *"  # Every 2 hours (user's timezone)
    entrypoint: checkUpdates
    name: "Check for Updates"

  - type: input
    contentTypes: ["text/uri-list", "text/markdown"]
    entrypoint: processText
    name: "Process URLs and Markdown"

  - type: email
    entrypoint: handleEmail
    name: "Process Support Emails"
    filters:
      from: "support@example.com"
      subject: "urgent"
```

**Trigger types:** `cron` (scheduled), `input` (user-initiated via share sheet), `email` (Gmail)

**See `skills/triggers/SKILL.md`** for handler implementation, personal triggers (including webhooks), testing, and troubleshooting. See `skills/email-triggers/SKILL.md` for email-specific patterns.

### Testing Functions

```bash
# Call a server function with no parameters
dreamer call-server myFunction '{}'

# Call a server function with parameters
dreamer call-server addUser '{"name": "John", "email": "john@example.com"}'
```

## Database

SQLite via Drizzle ORM. Define schema in `src/schema.ts` and use the typed `sdk.db()` method to execute queries. The database is scoped per agent and per user—data persists between function calls and sessions.

**User Data:** Always include an `owner` column in tables storing user-specific data—this makes your agent secure-by-default and safely shareable. Use `sdk.getUser().email` to filter queries accordingly.

```ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

Query via CLI after first push:
```bash
dreamer database --query "SELECT * FROM todos"
```

You can use this command for querying, updating, deleting, and inserting rows. Confirm with the user before destructive operations.

**For schema changes:** See `skills/database-migrations/SKILL.md`.

## Tools

Tools are external APIs and services your server can call. They're defined in individual modules in the `tools/` directory (e.g., `tools/github.ts`, `tools/slack.ts`), auto-generated based on the account's available integrations.

If you need to call an external API, check `tools/` first to see if a tool already exists before using `fetch`.

### Exploring Tools

Call tools directly from CLI using `dreamer call-tool -s <server> -n <toolname> '<params>'`:

```bash
dreamer call-tool -s gmail -n getgmailmessages '{"labelIds":["INBOX"],"maxResults":5}'
```

**Notes:**
- Params must be a JSON-stringified object (quote appropriately for your shell)
- For tools with no parameters, use an empty object: `{}`
- If a tool clearly does mutations, don't test without asking the user

### Using Tools

Tools can be used in two ways:

**1. Runtime Integration (Primary)** — Import and call tools from `serverFunction` or `backgroundFunction` handlers:

```ts
import { some_api_tool } from "@tools/some-api";

export const myFunction = serverFunction({
  execute: async (sdk: ServerSdk) => {
    const result = await some_api_tool(sdk, { param: "value" });
    // Process result...
  }
});
```

**2. Build-Time Configuration** — Some tools configure the agent during development. When the user asks to set up triggers, webhooks, or other configuration, call these tools directly via CLI:

```bash
# Example: Add a personal trigger at build time
dreamer call-tool -s triggers -n add_personal '{
  "trigger": { "type": "webhook", "name": "My Webhook", "entrypoint": "handleWebhook" }
}'
```

Use your judgment: if the user wants configuration set up now, use the tool directly. If they want the agent to configure itself dynamically at runtime, call the tool from code.

**Explore tools before integrating** to understand their outputs. Run tools directly to see real responses, which helps you pick the right arguments and design appropriate schemas.

**Schema design:** Use `Type` from `@dev-agents/sdk-shared` (NOT `@sinclair/typebox` directly).

**For external data:** Follow `CLAUDE-DATA-PLANNING.md` to create a data plan.

### Special Tools

#### Agent Posts

Notify users of important information with `create_agent_post`:

```ts
await create_agent_post(sdk, {
  shortMessage: "Brief notification",
  attachments: [{ type: "markdown", content: "**Details** here" }],
  duration: "read_once",
  priority: "normal" // "urgent" for push notifications
});
```

## Sidekick Tasks

**GOLDEN RULE: Background operations requiring intelligence → Sidekick Tasks**

Background functions (email triggers, cron jobs) run asynchronously with no latency constraints. When these operations require **understanding, judgment, or decision-making**, use Sidekick Tasks.

**ALWAYS use Sidekick Tasks for background operations that require:**
- Understanding natural language (emails, documents, web content)
- Contextual decision-making (what's relevant? what's urgent? what matters to THIS user?)
- Intelligent extraction (finding meaning, not just pattern matching)
- Synthesis and analysis (combining information from multiple sources)
- Multi-step workflows with decision points (if X then Y, considering context)
- Access to user context and memory (personalizing based on what Sidekick knows)

**DON'T use Sidekick Tasks for:**
- Real-time user interactions (user is actively waiting)
- Simple deterministic transformations (formatting, parsing with no decisions)
- Operations with fixed logic (if you can write it as straightforward code, do that)

### The Intelligence Test

Ask: **"Does this require understanding and judgment, or just execution?"**

| Understanding/Judgment → Sidekick Task | Just Execution → Direct code/tools/LLM |
|----------------------------------------|----------------------------------------|
| "Read these emails and tell me what's important" | "Format this date string" |
| "Analyze my calendar and prepare briefing" | "Get calendar events for today" |
| "Find articles about X and create a summary" | "Convert this JSON to markdown" |

### Decision Tree

```
Is this a background function (email trigger, cron)?
├─ YES → Does it need judgment, adaptation, or synthesis?
│  ├─ YES → Use Sidekick Tasks ✓
│  └─ NO (just data operations, simple parsing, purely mechanical) → Direct code + sdk.callLLM
└─ NO (user is waiting) → Direct tools or sdk.callLLM
```

**Anti-pattern:** Don't avoid Sidekick Tasks because you can enumerate the steps. "Get calendar → get weather → search events → filter by preferences → synthesize recommendations" still requires judgment at each step. Being able to describe the workflow ≠ the workflow being mechanical.

**Key insight:** Sidekick Tasks can adapt their approach based on what they discover (e.g., search finds nothing → try different query). Background operations have time for this intelligence—use that capability.

**Not sure?** Check the Quick Decision Tree in `skills/sidekick-tasks/SKILL.md` to help decide. The skill also covers implementation patterns, callbacks, and examples.

## Prompt Templates (REQUIRED)

**All prompts for `sdk.callLLM`, `sdk.sidekickWithSchema`, and `create_sidekick_task` MUST be Handlebars templates in `src/prompts/`.**

```ts
import Handlebars from "handlebars";
import promptSource from "./prompts/classify-email.handlebars";

const template = Handlebars.compile(promptSource);
const result = await sdk.callLLM(template({ subject, from }), schema);
```

**Never inline prompts.** Store them in `src/prompts/` as `.handlebars` files.

## Calling LLMs

Use `sdk.callLLM` for transformations, classification, and extraction:

```ts
const result = await sdk.callLLM(
  template({ data: JSON.stringify(toolOutput) }),
  Type.Object({ items: Type.Array(Type.String()) }),
  { modelVariant: "FAST" }
);
```

**Model variants:** `FAST` (cheap, quick), `STANDARD` (default, more capable), `POWERFUL` (most capable, slowest)

### Sidekick Queries

Use `sdk.sidekickWithSchema` to access user context and memory:

```ts
const city = await sdk.sidekickWithSchema(
  template({ context: "weather preferences" }),
  Type.Object({ city: Type.String() })
);
```

**Updating Sidekick's memory:** When your agent learns new information about the user (profile updates, preferences, personal details), keep Sidekick's memory synchronized so other agents benefit.

## Costs

Tool calls, LLM calls, and Sidekick calls cost money; database queries are free. Think carefully about how to achieve the user's goals while minimizing paid calls by using deterministic code and caching. Skip LLM calls when there are no changes.

# Client

React SPA communicating with server via React Query and `call()`. No routing—use React state for views. No direct API calls or data persistence.

## React Query Setup

**Required:** Wrap App in `QueryClientProvider` with SDK's pre-configured client:

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { agentQueryClient } from '@dev-agents/sdk-client';

export default function App({ renderContext }: { renderContext: RenderContext }) {
  return (
    <QueryClientProvider client={agentQueryClient}>
      {/* Components */}
    </QueryClientProvider>
  );
}
```

**Never create your own QueryClient**—`agentQueryClient` has automatic refetch and invalidation listeners.

## Calling Server Functions

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { call } from '@dev-agents/sdk-client';
import type { getTodos, addTodo } from './server';

function TodoList() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => call<typeof getTodos>('getTodos', {}),
  });

  const addTodoMutation = useMutation({
    mutationFn: (title: string) => call<typeof addTodo>('addTodo', { title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}
```

## Optimistic Updates

For instant feedback, update cache before server responds:

```tsx
const mutation = useMutation({
  mutationFn: (title) => call<typeof addTodo>('addTodo', { title }),
  onMutate: async (title) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, { id: Date.now(), title }]);
    return { previous };
  },
  onError: (err, title, context) => queryClient.setQueryData(['todos'], context.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

**Use optimistic updates for:** Predictable user-initiated mutations
**Use simple invalidation for:** Unpredictable server responses, background updates

## State Management

- **Local UI state:** React state (expanded panels, form inputs, modals)
- **Server state:** React Query + server functions
- **Never:** Store transient UI state on server

## User Interface

Renders via `renderContext.type`:
- `"widget"`: ~300x300px dashboard widget
- `"app"` / `"feed_item"`: Full screen, responsive

```tsx
export default function App({ renderContext }: { renderContext: RenderContext }) {
  if (renderContext.type === "widget") return <WidgetView />;
  return <FullView />;
}
```

**Technical notes:**
- Static assets: Use relative paths like `static/image.png` (**not** absolute paths like `/static/...`). Don't create custom path logic.
- Examples in `examples/`, including `LoadingIcon.tsx`
- No marketing taglines in UI

# Time and Timezones

Server and client run in user's timezone. **Use Day.js (`bun add dayjs`) with explicit timezone handling.**

**Critical rules:**
1. Always chain `.tz(getUserTimeZone())` immediately: `dayjs(input).tz(getUserTimeZone())`
2. Store timestamps as UTC: `.utc().toISOString()`
3. Store calendar dates as `YYYY-MM-DD` strings
4. Use Day.js methods for date math: `.add()`, `.subtract()`, `.diff()`, `startOf()`, `endOf()`
5. Never use native `Date` objects

**See `skills/dates-times-timezones/SKILL.md`** for detailed patterns and pitfalls.

# TypeScript Strict Mode

Uses `noUncheckedIndexedAccess: true`—array access returns `T | undefined`. Handle explicitly:

```typescript
const results = await db.select().from(users).limit(1);

// ✅ Truthy check narrows the type
if (results[0]) {
  return results[0]; // narrowed to User
}

// ✅ Non-null assertion when you're certain
const inserted = await db.insert(users).values({...}).returning();
return inserted[0]!;

// ✅ Assign and check
const user = results[0];
if (!user) throw new Error("Not found");
return user;
```

Uses `verbatimModuleSyntax: true`—use `import type` for types:
```typescript
import { serverFunction, type ServerSdk } from "@dev-agents/sdk-server";
```

# Building

```bash
bun run build          # Build everything
bun run build:server   # Server only
bun run build:frontend # Frontend only
```

# Development Steps

1. Create data plan per `CLAUDE-DATA-PLANNING.md` for any required external data
2. Define database schema in `src/schema.ts`
3. Implement server functions
4. Verify: `bun run typecheck` and `bun run build`
5. Implement client using server functions. Make liberal use of console.log messages in server and client code to help you and other developers to understand what's going on. Err on the side of lots of logging.
6. Check logs: `dreamer logs` and `dreamer logs --run <runId>` (find run IDs with `dreamer runs`). `console.log` invocations in both UI and server functions will show up in these logs.

## Data Sources

If a task requires external data, and is not information that can be obtained from another tool, explore available tools (web search, web crawling, etc.) using `dreamer call-tool` to identify a reliable source or query. **Keep trying until you find a useable source—DO NOT give up and hardcode information.**

- Check `tools/` for existing integrations before using `fetch`
- If using `fetch`, test the URL with `curl` first to verify results
- **Never use mock or simulated data** unless explicitly instructed
- **Never use APIs requiring API keys** unless instructed—prefer websites you can crawl and extract information from
- **Deduplicate similar content** when gathering from web (e.g., filter out news articles about the same event)

Repeat the discovery process until you find a source that works reliably.

## Final Steps

1. `bun run typecheck`
2. `bun run build`
3. Verify client calls match server function names exactly
4. `dreamer push` (Push at each complete increment, the user can see a live update on each push and will appreciate seeing changes as you complete them.)

## Skills

Skills provide specialized domain knowledge that helps you complete tasks more effectively. The `skills/` directory contains `SKILL.md` files with critical patterns, pitfalls, and implementation guidance.

### When to Read Skills

**Planning:** Scan skill descriptions in the table below to identify relevant skills. If a skill affects your architecture, you may skim it during planning—but you'll still need to re-read it for implementation.

**Implementation (BLOCKING):** When you mark a TODO as in_progress, read the full `SKILL.md` for any relevant skills BEFORE writing code—even if you read them during planning. Implementation details are easy to forget.

**Troubleshooting:** If you hit errors or unexpected behavior, check if a skill addresses the problem (e.g., database-troubleshooting for migration errors).

### Function-Specific Skills (Mandatory)

Always read before using:

| Function | Required Skills |
|----------|-----------------|
| `sdk.callLLM` | `skills/using-callllm-function/SKILL.md` AND `skills/prompt-templates/SKILL.md` |
| `sdk.sidekickWithSchema` | `skills/prompt-templates/SKILL.md` |
| `create_sidekick_task` | `skills/sidekick-tasks/SKILL.md` AND `skills/prompt-templates/SKILL.md` |
| UI / `App.tsx` | `skills/frontend-design/SKILL.md` |

### Available Skills

| Skill | Description |
|-------|-------------|
| `skills/database-migrations/SKILL.md` | Required reading before modifying database schema. Explains how to safely add, remove, or rename columns/tables via schema.ts without triggering ambiguous migration errors. |
| `skills/database-troubleshooting/SKILL.md` | Recovering from failed migrations using "dreamer database restore". Use when drizzle-kit errors occur during push - restores migration files to last successful state. |
| `skills/dates-times-timezones/SKILL.md` | MANDATORY for any date/time handling. All date parsing, formatting, storage, and timezone conversion must use Day.js with explicit getUserTimeZone(). Covers UTC storage patterns and common pitfalls. |
| `skills/email-triggers/SKILL.md` | Essential guide for email triggers - covers substring filter matching (NOT wildcards!), using email.account for multi-account handling, deduplication, personal vs published triggers, and building user-facing email pattern UIs |
| `skills/file-storage/SKILL.md` | Persisting files to cloud storage and UI guidance for file uploads. File attachments from share sheet/extension have expiring URLs - persist them using the filestorage tool. |
| `skills/frontend-design/SKILL.md` | REQUIRED for all UI work. Design patterns and aesthetic guidelines for App.tsx—covers typography, color themes, responsive design, dark/light mode, and creative direction. |
| `skills/mail-and-calendar/SKILL.md` | REQUIRED when using mail or calendar tools. Covers multi-account handling, account selection priority, filtering resource calendars from attendees, and querying all calendars for availability. |
| `skills/maps-integration/SKILL.md` | Patterns for adding interactive maps to agents. Use when displaying locations, routes, or geographic data. Covers Leaflet and Google Maps. |
| `skills/prompt-templates/SKILL.md` | MANDATORY for all LLM interactions. How to structure and use Handlebars templates in src/prompts/ instead of inline prompt strings. |
| `skills/reading-container-dimensions/SKILL.md` | ResizeObserver patterns for tracking container dimensions. Use when components need pixel-accurate sizing across widget/app/feed_item render contexts, or for canvas/WebGL/chart rendering. |
| `skills/sidekick-tasks/SKILL.md` | create_sidekick_task for autonomous multi-step workflows. Runs asynchronously with NO user interaction possible—handle all user input before creating the task. Use for complex research, synthesis, and background processing requiring intelligence. |
| `skills/slow-tool-caching/SKILL.md` | Patterns for caching data from slow external tools to improve UI responsiveness. Use when you see performance warnings from dreamer CLI or when building dashboards/widgets that display external data. |
| `skills/text-to-speech/SKILL.md` | Formatting text for TTS synthesis. Use when generating audio output - covers number/time conversion, removing visual elements, and cleaning text via callLLM before createMultiVoiceAudio. |
| `skills/triggers/SKILL.md` | Implementing cron, email, input, and webhook triggers. Covers personal vs published triggers, agent.yaml configuration, trigger removal matching, and backgroundFunction handler setup. |
| `skills/user-profiles/SKILL.md` | Managing per-user profile data with Sidekick sync. Covers one-time initialization via sidekickWithSchema, database-as-source-of-truth pattern, and syncing updates back to Sidekick memory. |
| `skills/using-callllm-function/SKILL.md` | Using sdk.callLLM for LLM-powered transformations. Covers choosing between model variants for cost/speed/quality tradeoffs and when to use callLLM vs sidekickWithSchema vs Sidekick Tasks. |

# Product Requirements (PRD.md)

Read `PRD.md` in the root directory and follow its instructions unless given detailed instructions to the contrary.

# Toolchain Error Handling

If you see errors from `dreamer` or `bun` commands unrelated to your code (auth issues, service errors), just tell the user—don't try to work around them. Fix code-related issues (typecheck errors, imports, etc.) yourself.

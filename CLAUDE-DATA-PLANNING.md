
# Data Planning Phase
Before implementing any agent that requires external data, you MUST complete a data planning phase. This is not optional - it ensures reliable data access and prevents common pitfalls.

## Data Planning Requirements
1. **Enumerate all external data dependencies** from the product requirements
2. **Test each data-fetching tool** using `dreamer call-tool` with -S (server) and -N (tool name) options (never test mutation tools)
3. **Document the data plan** in `planning/DATA-PLAN.md`

## Sidekick Integration

### Sidekick Tasks
- **Before planning direct tool usage, evaluate whether parts of your workflow should be delegated to a sidekick task instead.** Sidekick tasks are autonomous agents that can combine multiple data-gathering and reasoning steps into a single intelligent workflow. They're the right choice when a group of steps involves judgment, synthesis across sources, or decisions that depend on what's discovered along the way — especially in background operations where latency is not a concern. Refer to the Sidekick Tasks section in CLAUDE.md for the decision tree and intelligence test.
- For parts of your workflow you decide to implement as sidekick tasks, you can skip tool testing and output analysis — sidekick tasks do their own data planning and can access a wide variety of tools. Plan to give them complete and detailed instructions.

### ⚠️ User Profile Pattern
**If your agent collects user profile data (location, interests, family, preferences):**

See the `skills/user-profiles/SKILL.md` for the complete implementation pattern. Key points:
1. **Initialize ONCE**: Use `sdk.sidekickWithSchema` to get initial profile data
2. **Store in database**: Profile is the highest priority data source
3. **Update ALWAYS**: When the user changes their profile, sync to Sidekick's memory via backgroundFunction

This keeps Sidekick's cross-agent memory synchronized with your agent's data.

## Approved Data Sources
**ALLOWED:**
- Tools defined in the `tools/` directory (weather, email, calendar, web readers, search tools, etc.)
- Data persisted in the database from previous tool calls

**FORBIDDEN:**
- Direct REST API calls using `fetch` (even if you found the API via search)
- Hardcoded/mocked data (unless explicitly requested by user)
- APIs requiring API keys not provided through tools
- Any data source not accessible through the `tools/` directory

## Exception handling
Sometimes, the user will ask you to make use of data you simply do not have access to. Never try to generate fake, example or synthetic data. If you cannot find a good strategy to apply real data to the problem you MUST stop the whole task you've been assigned and tell the user that it is not possible to find real data to complete the task. The user will be able to select additional tools to help you out.

## Data Planning Process
0. **Consult Existing Plan (if any)**: If there is already a plan under `planning/DATA-PLAN.md`
keep it in mind for the next steps. It may already fulfill the data requirements.
1. **Identify Requirements**: List every piece of external data needed
2. **Tool Discovery**: Review the `tools/` directory for relevant tools. There may be multiple tools available which could satisfy your requirements, if so follow steps 3. and 4. for each relevant tool and choose the best one(s) for your precise task.
3. **Tool Testing**: Use `dreamer call-tool` with -S (server) and -N (tool name) options to test ONLY data-fetching tools (never test mutation tools like send_email, create_task, etc.)
4. **Output Analysis**: Examine actual outputs to understand data structure
5. **Check for Latency Warnings**: After each `dreamer call-tool` invocation, check stderr for performance warnings. If you see a warning about slow tool calls and this data will be displayed in a user-facing UI, consider caching. See the `slow-tool-caching` skill for patterns.
6. **Strategy**: Determine how you will use the the different tools in sequence to acheive the desired end result.
7. **Processing Strategy**: Determine if you need:
   - Direct property access
   - Data transformation
   - LLM inference (via `sdk.callLLM`) for extraction/classification/summarization
   - **NOTE:** Use cases involving creating summaries, digests or transcripts from various data sources should use an LLM to process the results to avoid repetition and make the final result more concise.
8. **Sidekick Task Evaluation**: Look at your workflow as a whole and ask: are there groups of steps that together require understanding, judgment, or synthesis across multiple data sources? If so, those steps are strong candidates to be combined into a sidekick task rather than implemented as direct tool calls and `sdk.callLLM`. This is especially true for background operations where latency is acceptable. Document your decision and reasoning in the data plan.
9. When building a multi-step workflow, break it down into separate server functions for each step. Document the planned implementation sequence in `planning/DATA-PLAN.md`. During implementation, you should proceed to implement the server functions in sequence and test each one before moving on to the next. You can test a server function that has just been implemented by first running `dreamer push` (gets your code on the server) and then running `dreamer call-server <functionName> <params>`. Remind yourself to test them as you go in `planning/DATA-PLAN.md`.
10. **Documentation**: Create DATA-PLAN.md under `planning/DATA-PLAN.md`
*** DON'T FORGET that if you cannot make a plan with real data you MUST stop and ask the user for further guidance. ***

## DATA-PLAN.md Structure
Create this file before implementing server functions under `planning/DATA-PLAN.md`:

```md
# Data Plan for [Agent Name]

## External Data Requirements
1. [Requirement 1 description]
2. [Requirement 2 description]
...

## User Profile (if applicable)
**Does this agent collect user profile data?** [Yes/No]

If Yes:
- Fields needed: [location, interests, family, etc.]
- **Implementation**: See `skills/user-profiles/SKILL.md` for complete pattern
- **Sidekick Sync**: Profile changes must sync to Sidekick memory (see skill for details)

## Data Sources

### [Data Requirement 1]
**Tool**: [tool_name from tools/ directory]
**Test Command**: `dreamer call-tool -S [server_name] -N [tool_name] '[params]'`
**Sample Arguments**:
[Actual examples of successful arguments from testing]
**Sample Output**:
[Actual output from testing]

**Processing Strategy**:
- [How to extract needed data]
- [Any LLM processing required]

[Repeat for other tools needed for this Data Requrement...]

### [Data Requirement 2]
[Same structure...]

## Sidekick Task Evaluation
**Are there workflow steps that should be combined into a sidekick task?**

For each group of steps that involves judgment, synthesis, or adaptive decision-making, document your evaluation:

### [Step group description, e.g. "Gather meeting context and prepare briefing"]
**Steps involved**: [Which steps from the workflow would be handled by this task]
**Why sidekick task**: [What makes this require intelligence rather than mechanical execution — e.g. selecting relevant emails, synthesizing across sources, editorial judgment]
**Instructions summary**: [Brief description of what the sidekick task instructions will cover]

### Steps kept as direct implementation
**Steps**: [Which steps remain as direct tool calls / sdk.callLLM]
**Why direct**: [e.g. single tool call, deterministic transformation, user is waiting for response]

## Caching Requirements (if UI-displayed data is slow)
List any slow tools where the data will be displayed in a user-facing UI:

### [Tool that was slow]
**Latency observed**: [X.Xs]
**Displayed in UI**: [Yes - describe where]
**Caching strategy**: [Describe cache table, TTL, invalidation approach]
**Skill reference**: See `slow-tool-caching` skill for patterns

## Rejected Approaches
### [Approach that didn't work]
**Why Tested**: [Reasoning]
**Why Rejected**: [Specific failure reason]
```

## Common Data Planning Mistakes to Avoid

### ❌ DON'T: Use fetch() with discovered APIs
```typescript
// WRONG - Even if you found this API through web search
const weather = await fetch('https://api.weather.com/v1/...');
```

### ✅ DO: Use tools from tools/ directory
```typescript
// CORRECT - Use tools from the tools/ directory
import { getCurrentWeather } from "@tools/weather";
const weather = await getCurrentWeather(sdk, { location: city });
```

### ❌ DON'T: Hardcode fallback data
```typescript
// WRONG - Using mock data as fallback
const weather = toolResult || { temp: 72, condition: "sunny" };
```

### ✅ DO: Handle missing data gracefully
```typescript
// CORRECT - Show loading or error states
if (!weather) return { error: "Weather data unavailable" };
```

### ❌ DON'T: Make up mock or sample data if you can't find real data.
```
// WRONG - Instead, stop, tell the user the problem and ask for their guidance.
Since the PRD requires implementing a specific API that doesn't seem to exist, I'll create a
mock implementation that simulates what such a service would provide
```

## Costs

Tool calls, LLM calls and sidekick calls cost real money, whereas database queries are free. Therefore, think carefully about how to achieve the users goal while minimizing tool calls. For instance, if you are implementing a workflow that parses data from a feed on a cron trigger, make use of deterministic code and database queries to find what changed since the previous invocation. Skip LLM calls when there are no changes and process only what did change via paid-for functions. Include a section "Controlling Costs" in your data plan.

## Data Processing
In your data plan, you may need to use `sdk.callLLM` (see `sdk/server/index.ts`) to extract structured information from data, summarize results, and more. For example, if you are trying to extract relevant results for "hiking in SF" from a set of search results, you can use `sdk.callLLM` to:

```ts
const relevantTrails = await sdk.callLLM(
  `Extract hiking trails in San Francisco from these search results: ${JSON.stringify(searchResults)}. Only include trails that are close to San Francisco (within the city limits or nearby areas like Marin County, Peninsula, or East Bay within reasonable driving distance). Exclude trails that are far from the San Francisco area.`,
  Type.Object({
    trails: Type.Array(Type.Object({
      name: Type.String(),
      location: Type.String(),
      url: Type.String(),
    }))
  }),
  { modelVariant: "STANDARD" }
);

// You get structured output back that obeys your schema and can access the properties
for (const trail of relevantTrails.trails) {
  console.log(`${trail.name} - ${trail.location} - ${trail.url}`);
}
```

For fast tasks like classification or data extraction, you should use the FAST model variant of `sdk.callLLM` to minimize costs and speed up execution.
```ts
const result = await sdk.callLLM(
  `Classify this text as spam or not: "${text}"`,
  Type.Object({
    isSpam: Type.Boolean(),
    reason: Type.String()
  }),
  { modelVariant: "FAST" }
);
```
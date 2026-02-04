---
name: prompt-templates
description: MANDATORY for all LLM interactions. How to structure and use Handlebars templates in src/prompts/ instead of inline prompt strings.
---

# Prompt Templates

**MANDATORY: All prompts for `sdk.callLLM`, `sdk.sidekickWithSchema`, and Sidekick Tasks must be stored as Handlebars templates in `src/prompts/`.**

## The Rule

🚫 **NEVER write prompts inline in your TypeScript code**
✅ **ALWAYS create a `.handlebars` file in `src/prompts/`**

## Directory Structure

```
src/
├── prompts/
│   ├── classify-email-priority.handlebars
│   ├── extract-calendar-events.handlebars
│   ├── analyze-school-email-task.handlebars
│   └── get-user-city-sidekick.handlebars
├── server.ts
└── schema.ts
```

## Complete Example

### 1. Create the template file

```handlebars
{{!-- src/prompts/classify-email-priority.handlebars --}}
Classify the priority of this email.

Subject: {{subject}}
From: {{from}}
Received: {{receivedDate}}

Consider:
- Sender importance
- Subject urgency keywords
- Time sensitivity

Respond with priority level: urgent, normal, or low.
```

### 2. Import and use in server.ts

```typescript
import Handlebars from "handlebars";
import classifyPromptSource from "./prompts/classify-email-priority.handlebars";

const classifyTemplate = Handlebars.compile(classifyPromptSource);

export const classifyEmail = serverFunction({
  params: Type.Object({
    subject: Type.String(),
    from: Type.String(),
    receivedDate: Type.String()
  }),
  execute: async (sdk: ServerSdk, { subject, from, receivedDate }) => {
    const result = await sdk.callLLM(
      classifyTemplate({ subject, from, receivedDate }),
      Type.Object({
        priority: Type.Union([
          Type.Literal("urgent"),
          Type.Literal("normal"),
          Type.Literal("low")
        ])
      }),
      { modelVariant: "FAST" }
    );

    return result;
  }
});
```

## For Sidekick Tasks

### Template file

```handlebars
{{!-- src/prompts/process-school-email-task.handlebars --}}
Analyze this school email and take appropriate action:

From: {{from}}
Subject: {{subject}}
Body: {{body}}

Our students and their grades are in the database. Please:
1. Understand what this email is about (events, announcements, etc.)
2. Determine which students this is relevant for based on grades/classes mentioned
3. Create calendar events for relevant students with complete details
4. Send a post summary of what was added

Use your judgment - skip generic emails that don't have actionable events.
```

### Usage in code

```typescript
import Handlebars from "handlebars";
import taskPromptSource from "./prompts/process-school-email-task.handlebars";

const taskTemplate = Handlebars.compile(taskPromptSource);

export const handleEmail = backgroundFunction({
  params: EmailTriggerParamsSchema,
  execute: async (sdk: ServerSdk, params: EmailTriggerParams) => {
    for (const email of params.messages) {
      await create_sidekick_task(sdk, {
        instructions: taskTemplate({
          from: email.from,
          subject: email.subject,
          body: email.body
        }),
        description: "Process school email"
      });
    }
  },
});
```

## For Sidekick Queries

### Template file

```handlebars
{{!-- src/prompts/get-user-preferences.handlebars --}}
What are the user's preferences for {{category}}?

{{#if context}}
Context: {{context}}
{{/if}}

Please provide their preferences, defaults, or any relevant information you have stored about their {{category}} preferences.
```

### Usage in code

```typescript
import Handlebars from "handlebars";
import sidekickPromptSource from "./prompts/get-user-preferences.handlebars";

const sidekickTemplate = Handlebars.compile(sidekickPromptSource);

export const getUserPreferences = serverFunction({
  params: Type.Object({
    category: Type.String()
  }),
  execute: async (sdk: ServerSdk, { category }) => {
    const preferences = await sdk.sidekickWithSchema(
      sidekickTemplate({ category, context: "weather and location" }),
      Type.Object({
        preferences: Type.Array(Type.String()),
        defaultValue: Type.Optional(Type.String())
      })
    );

    return preferences;
  }
});
```

## Benefits

1. **Reviewability**: See all prompt changes in git diffs
2. **Iteration**: Update prompts without touching code
3. **Testing**: Easy to test different prompt variations
4. **Organization**: All prompts in one logical place
5. **Reusability**: Share templates across functions
6. **Documentation**: Prompts serve as documentation of AI behavior

## Common Mistake

❌ **This will fail code review:**
```typescript
const result = await sdk.callLLM(
  `Classify this email: ${subject}`, // NO!
  schema
);
```

✅ **This is correct:**
```typescript
import Handlebars from "handlebars";
import promptSource from "./prompts/classify.handlebars";

const template = Handlebars.compile(promptSource);

const result = await sdk.callLLM(
  template({ subject }),
  schema
);
```

## Naming Convention

Use descriptive names that indicate purpose:
- `classify-email-priority.handlebars` - for sdk.callLLM classification
- `extract-event-details.handlebars` - for sdk.callLLM extraction
- `analyze-user-message-task.handlebars` - for create_sidekick_task
- `get-user-preferences-sidekick.handlebars` - for sdk.sidekickWithSchema

## Handlebars Features

### Variables

```handlebars
Subject: {{subject}}
From: {{from}}
```

### Conditionals

```handlebars
{{#if hasAttachments}}
This email has {{attachmentCount}} attachments.
{{else}}
No attachments.
{{/if}}
```

### Loops

```handlebars
{{#each items}}
- {{this.title}}: {{this.description}}
{{/each}}
```

### Comments

```handlebars
{{!-- This is a comment that won't appear in output --}}
```

## Advanced Pattern: Reusable Partials

For complex prompts with shared sections, you can use Handlebars partials:

```typescript
import Handlebars from "handlebars";

// Register a partial
Handlebars.registerPartial('emailContext', `
Email Details:
- From: {{from}}
- Subject: {{subject}}
- Received: {{date}}
`);

// Use in templates with {{> emailContext}}
```

## Summary

**Every prompt must be a template. No exceptions.**

- ✅ DO: Create `.handlebars` files in `src/prompts/`
- ✅ DO: Import and compile templates at module level
- ✅ DO: Use templates with `sdk.callLLM`, `sdk.sidekickWithSchema`, and `create_sidekick_task`
- ❌ DON'T: Inline prompts as string literals
- ❌ DON'T: Use template literals or string concatenation for prompts
- ❌ DON'T: Build prompts dynamically in code (use Handlebars variables instead)

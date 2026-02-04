#!/usr/bin/env bun
/**
 * Skills reminder hook
 * Reminds agents to read relevant skills when marking a TODO as in_progress
 */

interface Todo {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm?: string;
}

interface HookInput {
  tool_name?: string;
  tool_input?: {
    todos?: Todo[];
  };
}

async function main() {
  try {
    // Read JSON input from stdin
    let inputData = "";
    for await (const chunk of process.stdin) {
      inputData += chunk;
    }

    const input: HookInput = JSON.parse(inputData);

    // Only process TodoWrite calls
    if (input.tool_name !== "TodoWrite") {
      process.exit(0);
    }

    const todos = input.tool_input?.todos || [];

    // Find tasks being marked as in_progress
    const inProgressTasks = todos.filter((t) => t.status === "in_progress");

    if (inProgressTasks.length > 0) {
      const taskNames = inProgressTasks.map((t) => t.content).join(", ");
      console.log(
        `\n📚 SKILL REMINDER: Before starting "${taskNames}", check if any skills in CLAUDE.md are relevant and read them now.\n`,
      );
    }

    // Always allow the operation (this is just a reminder, not a blocker)
    process.exit(0);
  } catch {
    // On error, silently allow the operation
    process.exit(0);
  }
}

main();

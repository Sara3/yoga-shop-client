---
name: slow-tool-caching
description: Patterns for caching data from slow external tools to improve UI responsiveness. Use when you see performance warnings from dreamer CLI or when building dashboards/widgets that display external data.
---

# Caching Slow Tool Data

## When Caching Helps

Caching is most useful when **data is displayed in a UI** and you want to avoid slow load times.

**Decision guide:**

1. **Is this data displayed in a UI where users wait for it?**
   - Yes → Caching improves perceived performance. Continue.
   - No → Caching is optional. Background jobs can tolerate latency.

2. **Is a 1-2 second loading spinner acceptable?**
   - Yes → You may not need caching. The spinner shows on first load, then cache speeds up subsequent loads.
   - No → Use the simple caching pattern below.

3. **Do you need instant display with background refresh?**
   - No → Simple pattern is enough.
   - Yes → Use the stale-while-revalidate pattern (advanced section).

## Simple Caching Pattern

Store data in your database. Check if it's fresh. Return it or fetch new data.

```ts
// src/server.ts
import { eq } from "drizzle-orm";
import { serverFunction, type ServerSdk } from "@dev-agents/sdk-server";
import { Type } from "@dev-agents/sdk-shared";
import { get_items } from "@tools/some-slow-service";
import * as schema from "./schema";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const getItems = serverFunction({
  description: "Get items for dashboard",
  params: Type.Object({}),
  execute: async (sdk: ServerSdk) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();

    // Check cache
    const cached = await db
      .select()
      .from(schema.cachedItems)
      .where(eq(schema.cachedItems.owner, user.email))
      .limit(1);

    const entry = cached[0];
    if (entry && Date.now() - entry.fetchedAt.getTime() < CACHE_TTL_MS) {
      return { items: entry.items };
    }

    // Fetch fresh
    const result = await get_items(sdk, { limit: 50 });
    const items = result.items ?? [];

    // Upsert cache
    if (entry) {
      await db
        .update(schema.cachedItems)
        .set({ items, fetchedAt: new Date() })
        .where(eq(schema.cachedItems.owner, user.email));
    } else {
      await db
        .insert(schema.cachedItems)
        .values({ owner: user.email, items, fetchedAt: new Date() });
    }

    return { items };
  },
});
```

```ts
// src/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Store the actual data you need, not generic JSON blobs
export const cachedItems = sqliteTable("cached_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull().unique(),
  items: text("items", { mode: "json" }).$type<Array<{ id: string; title: string }>>().notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).notNull(),
});
```

That's it. The client just calls `getItems({})` normally. First call may be slow, subsequent calls are fast.

## Invalidate After Mutations

When you mutate data, delete the cache so the next fetch is fresh:

```ts
export const createItem = serverFunction({
  params: Type.Object({ title: Type.String() }),
  execute: async (sdk: ServerSdk, { title }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();

    const result = await create_item(sdk, { title });

    // Invalidate cache
    await db.delete(schema.cachedItems).where(eq(schema.cachedItems.owner, user.email));

    return result;
  },
});
```

## Advanced: Stale-While-Revalidate

Use this only if you need **instant display** and can tolerate showing stale data while refreshing.

**Server:** Add a `forceRefresh` param and return a `fromCache` flag:

```ts
export const getItems = serverFunction({
  params: Type.Object({
    forceRefresh: Type.Optional(Type.Boolean()),
  }),
  execute: async (sdk: ServerSdk, { forceRefresh }) => {
    const db = sdk.db<typeof schema>();
    const user = sdk.getUser();

    if (!forceRefresh) {
      const cached = await db
        .select()
        .from(schema.cachedItems)
        .where(eq(schema.cachedItems.owner, user.email))
        .limit(1);

      const entry = cached[0];
      if (entry && Date.now() - entry.fetchedAt.getTime() < CACHE_TTL_MS) {
        return { items: entry.items, fromCache: true };
      }
    }

    const result = await get_items(sdk, { limit: 50 });
    const items = result.items ?? [];
    // ... upsert cache ...
    return { items, fromCache: false };
  },
});
```

**Client:** Show cached data immediately, refresh in background:

```tsx
function ItemsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => call<typeof getItems>("getItems", {}),
  });

  useEffect(() => {
    if (data?.fromCache) {
      call<typeof getItems>("getItems", { forceRefresh: true }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["items"] });
      });
    }
  }, [data?.fromCache, queryClient]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {data?.fromCache && <span className="text-xs text-muted">Updating...</span>}
      {data?.items.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

## TTL Guidelines

| Data Type | Suggested TTL |
|-----------|---------------|
| Fast-changing (tasks, messages) | 5 minutes |
| Moderate (profiles, preferences) | 15-30 minutes |
| Slow-changing (analytics, history) | 1 hour |

## Summary

1. **Caching helps most for UI-displayed data** where users wait for it
2. **Simple pattern:** Check freshness, return cached or fetch new
3. **Invalidate after mutations**
4. **Stale-while-revalidate is optional** - only if you need instant display

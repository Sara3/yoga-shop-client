---
name: file-storage
description: Persisting files to cloud storage and UI guidance for file uploads. File attachments from share sheet/extension have expiring URLs - persist them using the filestorage tool.
---

# File Storage

## Overview

The `filestorage` tool provides persistent file storage for agents. Files are organized by user and agent, and URLs returned by the tool are stable and can be stored directly in your database.

## Basic Usage

```typescript
import { uploadFile, listFiles, getFile, deleteFile } from "../tools/filestorage";

// Upload a file from a URL
const result = await uploadFile(sdk, {
  fileName: "report.pdf",
  sourceUrl: "https://example.com/document.pdf",
  mimeType: "application/pdf",
});
// result.url - stable URL to access the file
// result.fileName - sanitized filename

// Upload with direct content
const result = await uploadFile(sdk, {
  fileName: "data.json",
  content: JSON.stringify({ key: "value" }),
  mimeType: "application/json",
});

// Upload binary content (base64 encoded)
const result = await uploadFile(sdk, {
  fileName: "image.png",
  content: base64ImageData,
  isBase64: true,
  mimeType: "image/png",
});
```

## File Organization

Files are stored as: `{userId}/{agentDirectory}/{fileName}`

- **Agents** upload to their own directory (named by vanityId or agent name)
- **Sidekick** uploads to `_sidekick/` directory
- **Sidekick** can access files from any agent directory; agents can only access their own

## Listing and Retrieving Files

```typescript
// List your files
const files = await listFiles(sdk, {});
// Returns: { files: [{ fileName, url, mimeType, size }], hasMore, totalCount }

// Search for files by name
const files = await listFiles(sdk, { search: "report" });

// Get a specific file by name
const file = await getFile(sdk, { fileName: "report.pdf" });
// Returns: { url, mimeType, fileName }

// Delete a file
await deleteFile(sdk, { fileName: "old-file.pdf" });
```

**When to use `getFile`:**
- Retrieve URL and metadata for a specific file you know exists
- Verify a file exists before using it
- Get file info when you only stored the filename (not the full URL)

**When to use `listFiles`:**
- Display all files uploaded by your agent
- Search for files matching a pattern
- Build file browsers or galleries

## Handling Input Trigger Attachments

When users share files via mobile share sheet, Chrome extension, or web drag-drop:

1. File is uploaded to a **temporary** S3 bucket (`agentMetadata`)
2. The URL in `attachment.data` **expires in 24 hours**

If you need to keep the file, persist it to cloud storage immediately:

```typescript
import { uploadFile } from "../tools/filestorage";

export const handleSharedContent = backgroundFunction({
  params: InputTriggerParamsSchema,
  exported: true,
  execute: async (sdk: ServerSdk, params: InputTriggerParams) => {
    for (const attachment of params.attachments || []) {
      // Text content - use directly, no persistence needed
      if (attachment.contentType.startsWith("text/")) {
        continue;
      }
      
      // Files with URLs - persist to cloud storage
      if (attachment.data.startsWith("http")) {
        const result = await uploadFile(sdk, {
          fileName: attachment.name || `file-${Date.now()}`,
          sourceUrl: attachment.data,  // The expiring URL
          mimeType: attachment.contentType,
        });
        
        if (result.success) {
          // Store the stable URL in your database
          await db.insert(myFiles).values({
            name: result.fileName,
            url: result.url,
            mimeType: result.mimeType,
          });
        }
      }
    }
  },
});
```

## When to Persist Input Attachments

| Content Type | `data` Contains | Action |
|-------------|-----------------|--------|
| `text/uri-list` | URLs to fetch | Use directly |
| `text/plain`, `text/markdown`, `text/html` | Text content | Use directly |
| `image/*`, `application/pdf`, other files | Presigned URL (expires 24h) | **Persist to cloud storage** |

## Frontend: File Upload UI

If your agent accepts file input, provide upload guidance for both empty and populated states:

- **Empty state:** Show prominent instructions on how to add files
- **Populated state:** Include a way to access upload instructions (e.g., help icon, "Add more" button, or collapsible section)

Use device detection to show the right flow:

- **Desktop:** Drag-drop onto Dreamer dashboard, or share via [Chrome extension](https://dreamer.com/extension)
- **Mobile:** Share from Photos, Files, or any app → select this agent

Files arrive at your input trigger handler - persist them immediately (see patterns above).

## Key Points

1. **Persist input attachments immediately** - URLs from input triggers (share sheet, extension) expire in 24 hours
2. **Store the URL from `uploadFile`** - It's stable and can be used directly
3. **Use `getFile` for lookups** - When you need to retrieve a file by name or verify it exists
4. **Files are world-readable** - Anyone with the URL can access the file

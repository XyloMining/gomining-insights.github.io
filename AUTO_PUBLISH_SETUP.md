# Auto-Publishing System Setup Guide

## Overview

The Auto-Publishing System automatically publishes weekly crypto market posts to your blog. Posts are stored in the database and can be published via the API endpoint.

## Database Schema

A new `posts` table has been added to store published blog posts with the following fields:

- `id`: Unique post identifier
- `title`: Post title
- `excerpt`: Short excerpt/summary
- `content`: Full markdown content
- `image`: Featured image URL
- `publishedAt`: Publication timestamp
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Publishing a Post

### Via API (tRPC)

Posts can be published programmatically using the `posts.publish` mutation:

```typescript
const result = await trpc.posts.publish.mutate({
  title: "Weekly Crypto Market & GoMining Update - April 19, 2026",
  excerpt: "Bitcoin breaks $77K as institutional adoption accelerates...",
  content: "## The Macro Market...",
  image: "https://example.com/image.jpg"
});
```

### Via Email Integration

The weekly email posts can be automatically converted to blog posts by:

1. Extracting the email content
2. Parsing the markdown
3. Calling the `posts.publish` API endpoint
4. The post appears on the Blog page and Archive

## Retrieving Posts

### Get All Posts

```typescript
const posts = await trpc.posts.getAll.query();
```

### Get Single Post

```typescript
const post = await trpc.posts.getById.query({ id: 1 });
```

### Search Posts

```typescript
const results = await trpc.posts.search.query({ 
  query: "Bitcoin", 
  limit: 10 
});
```

## Database Migration

To apply the schema changes to your database:

```bash
pnpm db:push
```

This will:
1. Generate migration files
2. Apply the schema to your database
3. Create the `posts` table

## Integration with Email System

To automatically publish posts from your weekly email:

1. Extract the post content from the email
2. Parse the markdown formatting
3. Call the `posts.publish` endpoint with the extracted data
4. The post will be immediately available on the Blog page

## Next Steps

1. Run `pnpm db:push` to create the posts table
2. Test the API by publishing a sample post
3. Integrate with your email automation system
4. Posts will automatically appear on the Blog and Archive pages

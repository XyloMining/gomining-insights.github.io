# AI-Powered Blog Automation System

## Overview

The GoMining Crypto Insights blog now features a fully automated content generation system powered by OpenAI models. Every Sunday, the system automatically generates and publishes a new blog post with a unique idea, compelling title, and well-researched content—all without manual intervention. This update introduces **template-based generation** to ensure a consistent style and format, specifically for your "Weekly Recap of Crypto and GoMining" posts.

## How It Works

### The Sunday Automation Flow

1. **Scheduler Activation**: Every Sunday at midnight UTC, the blog scheduler checks for pending tasks.

2. **Manual Post Check**: The system first checks if there are any manually scheduled posts waiting to be published. If found, these are published first.

3. **AI Generation Trigger**: If no manually scheduled posts exist, the system automatically initiates AI content generation.

4. **Idea & Title Generation**: The AI generates a relevant blog post idea and catchy title based on current cryptocurrency trends and GoMining platform insights, adhering to the defined style guide.

5. **Content Creation**: Using the generated idea and title, the AI writes a comprehensive, well-structured blog post (approximately 800-1200 words) in Markdown format, strictly following the "Weekly Recap" template.

6. **Excerpt Generation**: The AI creates a concise excerpt (100-150 words) that summarizes the post and entices readers, maintaining the defined style.

7. **Automatic Publishing**: The complete blog post is encrypted and stored in the database, then made immediately available on the blog.

8. **Logging & Monitoring**: All generation steps are logged for debugging and monitoring purposes.

## Configuration

### Prerequisites

1. **OpenAI API Key**: You need an active OpenAI account with API access.
   - Sign up at [https://platform.openai.com](https://platform.openai.com)
   - Generate an API key from your account settings
   - Ensure your account has sufficient credits for API calls

### Environment Setup

Add the following to your `.env` and `.env.local` files:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important**: Never commit your API key to version control. Use environment variables or secrets management in production.

### Cost Estimation

Using GPT-4o Mini (the cost-effective variant):

- **Idea & Title Generation**: ~$0.001-0.002 per post
- **Content Generation**: ~$0.01-0.02 per post
- **Excerpt Generation**: ~$0.001-0.002 per post
- **Total per Sunday post**: ~$0.015-0.025 (approximately 1-2 cents)

**Weekly cost**: ~$0.10-0.20 (10-20 cents)
**Monthly cost**: ~$0.40-0.80 (40-80 cents)
**Yearly cost**: ~$5-10

These are estimates based on current OpenAI pricing. Actual costs may vary based on content length and model efficiency.

## System Components

### 1. AI Configuration (`aiConfig.ts`)

This new module defines the global style guide and specific templates for AI generation, ensuring consistency across all generated content.

#### `AI_STYLE_GUIDE`

Defines the overall tone and writing style for all AI-generated content. This ensures posts are professional, data-driven, informative, and accessible.

#### `AI_BLOG_TEMPLATES`

Contains specific prompt structures for each generation step:

-   **`ideaAndTitle`**: Guides the AI to generate relevant ideas and catchy titles for weekly recaps.
-   **`blogPostContent`**: Provides a detailed Markdown structure for the main blog post, including sections like "Market Overview," "Bitcoin (BTC) Analysis," "GoMining Platform Updates," and "Weekly Outlook & Conclusion." This ensures adherence to your "weekly recap of crypto and gomining" format.
-   **`excerpt`**: Directs the AI to create concise and engaging summaries that fit the weekly recap nature.

### 2. AI Generator Module (`aiGenerator.ts`)

The core module that interfaces with OpenAI's API, now utilizing the templates from `aiConfig.ts`:

#### `generateIdeaAndTitle()`
Generates a blog post idea and title based on cryptocurrency trends, using the `ideaAndTitle` template.

**Returns**: `{ idea: string; title: string }`

**Example Output**:
```json
{
  "idea": "Exploring the impact of Bitcoin's halving cycle on mining profitability and how GoMining adapts to market changes",
  "title": "Bitcoin Halving 2024: What Miners Need to Know"
}
```

#### `generateBlogPostContent(idea, title)`
Creates a full blog post in Markdown format based on the idea and title, strictly following the `blogPostContent` template.

**Parameters**:
- `idea` (string): The core concept for the post
- `title` (string): The post title

**Returns**: Full blog post content in Markdown

#### `generateExcerpt(content)`
Generates a concise excerpt from the full blog post content, using the `excerpt` template.

**Parameters**:
- `content` (string): The full blog post content

**Returns**: 100-150 word excerpt

### 3. Enhanced Scheduler (`scheduler.ts`)

The scheduler now handles both manual and automatic blog publishing:

- **Manual Posts**: Publishes any posts you schedule through the admin dashboard
- **Automatic Generation**: If no manual posts are scheduled, generates a new one using AI
- **Logging**: Comprehensive logging of all actions for monitoring and debugging
- **Error Handling**: Graceful error handling with detailed error messages

### 4. Content Store (`contentStore.ts`)

Manages all blog post storage with encryption:

- All generated posts are encrypted using AES-256-GCM
- Posts include automatically generated slugs for clean URLs
- Read time is calculated based on 238 WPM average reading speed

## Usage

### Automatic Operation

Once configured with a valid OpenAI API key, the system operates automatically:

1. **Start the server**: `pnpm dev` or `npm run dev`
2. **Wait for Sunday**: The scheduler runs every hour and checks if it's Sunday
3. **Automatic generation**: On Sunday at midnight UTC, a new post is generated and published
4. **Monitor logs**: Check server logs for generation status and any errors

### Manual Override

You can still manually schedule posts through the admin dashboard:

1. Go to `/admin/dashboard`
2. Create a new blog post with your custom content
3. Optionally schedule it for a future date
4. The scheduler will publish it when the time arrives

**Note**: If you manually publish a post on Sunday, the automatic AI generation will be skipped for that week.

### Monitor Scheduler Status

Check the scheduler status via the admin API:

```bash
curl http://localhost:3000/api/trpc/admin.getSchedulerStatus
```

**Response**:
```json
{
  "isRunning": true,
  "nextSunday": "2026-05-03T00:00:00.000Z"
}
```

## Customization

### Adjusting Content Generation Parameters

Edit `aiGenerator.ts` to customize the generation behavior:

```typescript
// Adjust temperature for more/less creativity (0.0-2.0)
temperature: 0.8, // Higher = more creative, Lower = more focused

// Adjust max_tokens for longer/shorter content
max_tokens: 2000, // Increase for longer posts

// Change the model if needed
model: "gpt-4o-mini", // Or use "gpt-4", "gpt-3.5-turbo", etc.
```

### Customizing Generation Prompts and Format

Modify the `AI_STYLE_GUIDE` and `AI_BLOG_TEMPLATES` in **`aiConfig.ts`** to change the style, tone, or specific format of generated content:

```typescript
// server/_core/aiConfig.ts

export const AI_STYLE_GUIDE = `
Your writing style should be: [YOUR CUSTOM STYLE GUIDELINES HERE]
`;

export const AI_BLOG_TEMPLATES = {
  ideaAndTitle: {
    systemPrompt: `[YOUR CUSTOM SYSTEM PROMPT HERE] ${AI_STYLE_GUIDE}`,
    userPrompt: `[YOUR CUSTOM USER PROMPT HERE]`,
  },
  blogPostContent: {
    systemPrompt: `[YOUR CUSTOM SYSTEM PROMPT HERE] ${AI_STYLE_GUIDE}`,
    userPrompt: (idea: string, title: string) => `[YOUR CUSTOM USER PROMPT HERE, INCLUDING MARKDOWN STRUCTURE]

Title: ${title}
Idea: ${idea}

## Your Custom Section 1 Title
[Content for Section 1]

## Your Custom Section 2 Title
[Content for Section 2]
`,
  },
  excerpt: {
    systemPrompt: `[YOUR CUSTOM SYSTEM PROMPT HERE] ${AI_STYLE_GUIDE}`,
    userPrompt: (content: string) => `[YOUR CUSTOM USER PROMPT HERE, REFERENCING CONTENT]

Content: ${content}`,
  },
};
```

### Scheduling Frequency

To change from weekly to a different frequency, modify `scheduler.ts`:

```typescript
// Check every 24 hours instead of every hour
schedulerIntervalId = setInterval(checkAndPublishScheduledPosts, 86400000);

// Modify the day check (0 = Sunday, 1 = Monday, etc.)
if (dayOfWeek !== 0) return; // Change 0 to your preferred day
```

## Monitoring & Debugging

### Server Logs

The scheduler outputs detailed logs to the console:

```
[Blog Scheduler] Starting blog post scheduler
[Blog Scheduler] Running Sunday check for scheduled posts...
[Blog Scheduler] Generated idea: "...", title: "..."
[Blog Scheduler] Generated blog post content.
[Blog Scheduler] Generated blog post excerpt.
[Blog Scheduler] Successfully generated and published new AI post: "..."
```

### Error Handling

If generation fails, you'll see detailed error messages:

```
[Blog Scheduler] Error during Sunday blog automation: Error: Failed to generate idea and title.
```

**Common Issues**:

1. **Missing API Key**: Ensure `OPENAI_API_KEY` is set in your environment
2. **Invalid API Key**: Verify your OpenAI API key is correct and active
3. **Insufficient Credits**: Check your OpenAI account has sufficient API credits
4. **Rate Limiting**: If you hit rate limits, the system will retry on the next hour

### Testing Generation Manually

To test the AI generation without waiting for Sunday, you can call the functions directly:

```typescript
import { generateIdeaAndTitle, generateBlogPostContent, generateExcerpt } from "./server/_core/aiGenerator";

// Test idea generation
const { idea, title } = await generateIdeaAndTitle();
console.log(idea, title);

// Test content generation
const content = await generateBlogPostContent(idea, title);
console.log(content);

// Test excerpt generation
const excerpt = await generateExcerpt(content);
console.log(excerpt);
```

## Security Considerations

1. **API Key Protection**: Never expose your OpenAI API key in client-side code or version control
2. **Content Encryption**: All generated posts are encrypted at rest using AES-256-GCM
3. **Rate Limiting**: Implement rate limiting on your API endpoints to prevent abuse
4. **Input Validation**: The system validates all generated content before publishing
5. **Audit Logging**: Consider adding audit logs for compliance and monitoring

## Advanced Features

### Future Enhancements

1. **AI Image Generation**: Automatically generate featured images using DALL-E
2. **Multi-Language Support**: Generate posts in multiple languages
3. **SEO Optimization**: Automatically optimize titles and content for search engines
4. **Sentiment Analysis**: Analyze generated content for tone and sentiment
5. **Custom Themes**: Allow users to specify content themes or topics
6. **A/B Testing**: Test different content styles and measure engagement
7. **Trending Topics Integration**: Pull trending topics from external APIs

### Integration with Other Services

The system can be extended to integrate with:

- **Social Media**: Auto-post to Twitter, LinkedIn, etc.
- **Email Newsletters**: Send generated posts to subscribers
- **Analytics**: Track engagement metrics for generated content
- **Feedback Loop**: Use reader feedback to improve future generations

## Troubleshooting

### Post Not Generated on Sunday

**Possible Causes**:
1. Server not running at midnight UTC
2. OpenAI API key not set or invalid
3. API rate limit exceeded
4. Manually scheduled post exists (skips auto-generation)

**Solution**: Check server logs and verify OpenAI API configuration.

### Generated Content Quality Issues

**Possible Causes**:
1. Prompts too generic or unclear
2. Model not suitable for the task
3. Temperature settings too high/low

**Solution**: Adjust prompts and model parameters in `aiGenerator.ts`.

### API Rate Limiting

**Possible Causes**:
1. Too many API calls in short period
2. Account quota exceeded

**Solution**: Implement exponential backoff retry logic or upgrade your OpenAI plan.

## Best Practices

1. **Monitor Costs**: Regularly check your OpenAI API usage and costs
2. **Review Generated Content**: Periodically review AI-generated posts for quality
3. **Maintain Backups**: Keep encrypted backups of your content store
4. **Update Prompts**: Regularly update generation prompts to improve quality
5. **Test Changes**: Test any modifications to generation logic before deploying
6. **Document Customizations**: Keep notes on any customizations you make
7. **Security Updates**: Keep Node.js and dependencies updated

## References

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GPT-4 Model Information](https://platform.openai.com/docs/models)
- [OpenAI Pricing](https://openai.com/pricing)
- [Node.js OpenAI Client](https://github.com/openai/node-sdk)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify OpenAI API configuration
4. Check OpenAI API status page for service issues
5. Contact OpenAI support for API-related issues

---

**Last Updated**: May 2026
**Version**: 1.1

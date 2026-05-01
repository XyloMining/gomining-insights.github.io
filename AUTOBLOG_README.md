# Auto Blog Generator

The Auto Blog Generator is a powerful script that automatically generates and publishes blog posts to your GoMining Crypto Insights platform. It includes pre-built templates for crypto market analysis, updates, and news.

## Features

- **One-Click Publishing**: Generate and publish blog posts instantly
- **Scheduled Posts**: Schedule posts for future publication
- **Batch Generation**: Create multiple posts with automatic scheduling intervals
- **Professional Templates**: Pre-built, SEO-optimized blog post templates
- **Flexible Scheduling**: Control when posts go live

## Installation

The script is already included in your project. No additional installation needed!

## Usage

### 1. Publish a Single Post Immediately

```bash
npx tsx scripts/auto-blog-generator.ts single
```

This will generate and publish a blog post immediately.

### 2. Schedule a Post for Later

```bash
npx tsx scripts/auto-blog-generator.ts scheduled 24
```

This schedules a post to be published 24 hours from now. You can replace `24` with any number of hours.

### 3. Generate Multiple Posts with Intervals

```bash
npx tsx scripts/auto-blog-generator.ts multiple 5 12
```

This generates 5 blog posts, each scheduled 12 hours apart. This is perfect for:
- Building up a content calendar
- Maintaining consistent posting schedule
- Planning ahead for weeks

### 4. View Help

```bash
npx tsx scripts/auto-blog-generator.ts
```

Shows all available commands and options.

## Examples

### Generate 3 posts, one per day
```bash
npx tsx scripts/auto-blog-generator.ts multiple 3 24
```

### Generate 7 posts for a week, twice daily
```bash
npx tsx scripts/auto-blog-generator.ts multiple 7 12
```

### Schedule a post for tomorrow at this time
```bash
npx tsx scripts/auto-blog-generator.ts scheduled 24
```

### Schedule a post for 3 days from now
```bash
npx tsx scripts/auto-blog-generator.ts scheduled 72
```

## Available Templates

The script includes professional templates for:

1. **Bitcoin Market Update** - Weekly Bitcoin analysis and mining insights
2. **Ethereum & Alt-Coins** - Analysis of Ethereum and other cryptocurrencies
3. **Crypto Adoption News** - Regulatory and institutional adoption updates

Templates are automatically rotated when generating multiple posts.

## Customization

To customize the templates, edit `scripts/auto-blog-generator.ts`:

1. Open the file in your text editor
2. Find the `marketTemplates` array
3. Modify or add new templates with your content
4. Save and run the script

Each template has:
- `title`: The blog post title
- `excerpt`: Short summary for the blog archive
- `content`: Full markdown content (supports all markdown formatting)

## Admin Dashboard Integration

All generated posts appear in your Admin Dashboard:

1. Navigate to `http://localhost:3000/admin/dashboard`
2. Scroll to "Recent Posts" to see all posts
3. Scroll to "Scheduled Posts" to see upcoming posts
4. Delete any post using the trash icon

## Monitoring Scheduled Posts

Check your dashboard to see:
- **Recent Posts**: All published posts
- **Scheduled Posts**: Posts waiting to be published
- **Publication Time**: Exact date and time each post will go live

## Automatic Publishing

Scheduled posts are automatically published when their scheduled time arrives. The system checks for scheduled posts whenever:
- Someone visits the blog page
- The admin dashboard is accessed
- A new post is published

## Tips for Best Results

1. **Consistent Schedule**: Use `multiple` command to maintain a regular posting schedule
2. **Mix Templates**: Posts rotate through different templates automatically
3. **Monitor Performance**: Check your blog page to see how posts are performing
4. **Customize Content**: Edit templates to match your brand voice
5. **Plan Ahead**: Generate posts for the entire week or month

## Troubleshooting

### "Command not found: npx"
Make sure Node.js is installed. Download from https://nodejs.org/

### "tsx: command not found"
Run `pnpm install` first to install dependencies

### Posts not appearing
- Check that the server is running (`pnpm dev`)
- Verify the post was created in the Admin Dashboard
- Check scheduled posts if the post was scheduled for the future

## Advanced Usage

### Generate posts programmatically

You can also use the auto-blog generator in your own scripts:

```typescript
import { publishPost } from "./server/_core/contentStore";

await publishPost({
  title: "Your Custom Title",
  excerpt: "Your custom excerpt",
  content: "Your markdown content",
  image: "https://your-image-url.com/image.jpg",
  scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
});
```

## Support

For issues or questions:
1. Check the Admin Dashboard for post status
2. Review the blog page to see published posts
3. Check the console output for any error messages

## Next Steps

1. Run your first auto-generated post: `npx tsx scripts/auto-blog-generator.ts single`
2. Visit your blog at `http://localhost:3000/blog` to see it
3. Schedule posts for the future: `npx tsx scripts/auto-blog-generator.ts multiple 7 24`
4. Customize templates to match your brand

Happy blogging! 🚀

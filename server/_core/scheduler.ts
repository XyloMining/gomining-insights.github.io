/**
 * Blog Post Scheduler
 * Automatically publishes scheduled blog posts every Sunday at midnight UTC
 * Uses Node.js setInterval to check for posts that need publishing
 */

import { publishScheduledPosts, getScheduledPosts, publishPost } from "./contentStore";
import { generateIdeaAndTitle, generateBlogPostContent, generateExcerpt } from "./aiGenerator";

// Store the interval ID so we can clear it if needed
let schedulerIntervalId: NodeJS.Timeout | null = null;

/**
 * Get the next Sunday at midnight UTC
 */
function getNextSunday(): Date {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  
  // Calculate days until next Sunday (0 = Sunday)
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  
  const nextSunday = new Date(now);
  nextSunday.setUTCDate(nextSunday.getUTCDate() + daysUntilSunday);
  nextSunday.setUTCHours(0, 0, 0, 0);
  
  return nextSunday;
}

/**
 * Check if it's Sunday and publish any scheduled posts, or generate a new one if none are scheduled.
 */
async function checkAndPublishScheduledPosts(): Promise<void> {
  try {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    
    // Only check on Sundays (0 = Sunday)
    if (dayOfWeek !== 0) {
      return;
    }
    
    console.log("[Blog Scheduler] Running Sunday check for scheduled posts...");

    // First, publish any manually scheduled posts
    const publishedManualPosts = await publishScheduledPosts();
    if (publishedManualPosts.length > 0) {
      console.log(
        `[Blog Scheduler] Published ${publishedManualPosts.length} manually scheduled post(s) on Sunday:`,
        publishedManualPosts.map(p => p.title)
      );
    }

    // If no manually scheduled posts were published, and no scheduled posts are pending, generate a new one
    const pendingScheduledPosts = await getScheduledPosts();
    if (publishedManualPosts.length === 0 && pendingScheduledPosts.length === 0) {
      console.log("[Blog Scheduler] No manually scheduled posts found. Generating a new AI blog post...");
      
      const { idea, title } = await generateIdeaAndTitle();
      console.log(`[Blog Scheduler] Generated idea: "${idea}", title: "${title}"`);

      const content = await generateBlogPostContent(idea, title);
      console.log("[Blog Scheduler] Generated blog post content.");

      const excerpt = await generateExcerpt(content);
      console.log("[Blog Scheduler] Generated blog post excerpt.");

      const newPost = await publishPost({
        title,
        excerpt,
        content,
        image: "", // AI image generation can be added here in the future
        publishedAt: now.toISOString(),
      });
      console.log(`[Blog Scheduler] Successfully generated and published new AI post: "${newPost.title}"`);
    }

  } catch (error) {
    console.error("[Blog Scheduler] Error during Sunday blog automation:", error);
  }
}

/**
 * Start the blog post scheduler
 * Checks every hour if it's Sunday and publishes scheduled posts
 */
export function startBlogScheduler(): void {
  if (schedulerIntervalId !== null) {
    console.warn("[Blog Scheduler] Scheduler is already running");
    return;
  }
  
  console.log("[Blog Scheduler] Starting blog post scheduler");
  
  // Check every hour (3600000 ms)
  schedulerIntervalId = setInterval(checkAndPublishScheduledPosts, 3600000);
  
  // Also run immediately on startup to catch any missed posts or generate if needed
  checkAndPublishScheduledPosts().catch(console.error);
  
  // Log next Sunday for debugging
  const nextSunday = getNextSunday();
  console.log(
    `[Blog Scheduler] Next scheduled publish time: ${nextSunday.toISOString()}`
  );
}

/**
 * Stop the blog post scheduler
 */
export function stopBlogScheduler(): void {
  if (schedulerIntervalId !== null) {
    clearInterval(schedulerIntervalId);
    schedulerIntervalId = null;
    console.log("[Blog Scheduler] Blog post scheduler stopped");
  }
}

/**
 * Get the status of the scheduler
 */
export function getSchedulerStatus(): {
  isRunning: boolean;
  nextSunday: string;
} {
  return {
    isRunning: schedulerIntervalId !== null,
    nextSunday: getNextSunday().toISOString(),
  };
}

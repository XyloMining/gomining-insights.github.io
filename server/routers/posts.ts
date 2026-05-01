import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  getPostById,
  getPosts,
  publishPost,
  searchPosts,
  deletePost,
  getAllPosts,
  getScheduledPosts,
} from "../_core/contentStore";

/**
 * Posts Router
 * Handles blog post operations including publishing, scheduling, and retrieval
 */

export const postsRouter = router({
  /**
   * Get all published posts (excludes scheduled posts)
   */
  getAll: publicProcedure.query(async () => getPosts()),

  /**
   * Get all posts including scheduled ones (admin only)
   */
  getAllIncludingScheduled: adminProcedure.query(async () => getAllPosts()),

  /**
   * Get only scheduled posts (admin only)
   */
  getScheduled: adminProcedure.query(async () => getScheduledPosts()),

  /**
   * Get a single post by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => getPostById(input.id)),

  /**
   * Search posts by title or content
   */
  search: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => searchPosts(input.query, input.limit)),

  /**
   * Publish a new post (immediately or scheduled for future)
   */
  publish: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().min(1),
        image: z.string().optional(),
        scheduledFor: z.string().optional(), // ISO string for scheduled posts
      })
    )
    .mutation(async ({ input }) => {
      const post = await publishPost(input);
      if (post.isScheduled) {
        return { 
          success: true, 
          message: `Post scheduled for ${new Date(post.scheduledFor!).toLocaleString()}`,
          post 
        };
      }
      return { success: true, message: "Post published successfully", post };
    }),

  /**
   * Delete a post by ID (admin only)
   */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const success = await deletePost(input.id);
      if (success) {
        return { success: true, message: "Post deleted successfully" };
      }
      return { success: false, message: "Post not found" };
    }),
});

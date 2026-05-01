import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export type SiteSettings = {
  showGoMiningNavLink: boolean;
  showAds: boolean;
  homeCtaText: string;
};

export type ContentPost = {
  id: number;
  title: string;
  slug: string; // URL-friendly slug for navigation
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string; // ISO string for scheduled posts
  isScheduled?: boolean; // true if post is scheduled for future
};

/**
 * Calculate read time based on average reading speed of 238 WPM
 * @param content - The post content in markdown/text format
 * @returns Read time in minutes (minimum 1 minute)
 */
export function calculateReadTime(content: string): number {
  const WORDS_PER_MINUTE = 238;
  const wordCount = content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(1, readTimeMinutes); // Minimum 1 minute
}

/**
 * Generate URL-friendly slug from title
 * @param title - The post title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ContentStore = {
  settings: SiteSettings;
  posts: ContentPost[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "..", "..", ".data");
const STORE_PATH = path.join(DATA_DIR, "content-store.json");

const DEFAULT_STORE: ContentStore = {
  settings: {
    showGoMiningNavLink: true,
    showAds: true,
    homeCtaText: "Join GoMining Community",
  },
  posts: [],
};

async function readStore(): Promise<ContentStore> {
  try {
    const content = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(content) as Partial<ContentStore>;
    return {
      settings: {
        ...DEFAULT_STORE.settings,
        ...(parsed.settings ?? {}),
      },
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

async function writeStore(store: ContentStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const store = await readStore();
  return store.settings;
}

export async function updateSiteSettings(
  next: Partial<SiteSettings>
): Promise<SiteSettings> {
  const store = await readStore();
  store.settings = {
    ...store.settings,
    ...next,
  };
  await writeStore(store);
  return store.settings;
}

export async function getPosts(): Promise<ContentPost[]> {
  const store = await readStore();
  // Only return posts that are published (not scheduled for future)
  const publishedPosts = store.posts.filter(post => {
    if (!post.isScheduled) return true;
    if (!post.scheduledFor) return true;
    return new Date(post.scheduledFor) <= new Date();
  });
  return [...publishedPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getAllPosts(): Promise<ContentPost[]> {
  const store = await readStore();
  return [...store.posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getScheduledPosts(): Promise<ContentPost[]> {
  const store = await readStore();
  return store.posts
    .filter(post => post.isScheduled && post.scheduledFor)
    .sort(
      (a, b) =>
        new Date(b.scheduledFor || "").getTime() -
        new Date(a.scheduledFor || "").getTime()
    );
}

export async function getPostById(id: number): Promise<ContentPost | null> {
  const posts = await getPosts();
  return posts.find(post => post.id === id) ?? null;
}

export async function searchPosts(query: string, limit = 10): Promise<ContentPost[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const posts = await getPosts();
  return posts
    .filter(
      post =>
        post.title.toLowerCase().includes(normalized) ||
        post.content.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized)
    )
    .slice(0, limit);
}

export async function publishPost(input: {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  scheduledFor?: string; // ISO string for scheduled posts
}): Promise<ContentPost> {
  const store = await readStore();
  const now = new Date().toISOString();
  const nextId = store.posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;
  
  const isScheduled = input.scheduledFor && new Date(input.scheduledFor) > new Date();
  
  const post: ContentPost = {
    id: nextId,
    title: input.title,
    slug: generateSlug(input.title),
    excerpt: input.excerpt,
    content: input.content,
    image: input.image || "",
    publishedAt: isScheduled ? input.scheduledFor! : now,
    createdAt: now,
    updatedAt: now,
    scheduledFor: input.scheduledFor,
    isScheduled: isScheduled,
  };
  store.posts.push(post);
  await writeStore(store);
  return post;
}

export async function deletePost(id: number): Promise<boolean> {
  const store = await readStore();
  const initialLength = store.posts.length;
  store.posts = store.posts.filter(post => post.id !== id);
  
  if (store.posts.length < initialLength) {
    await writeStore(store);
    return true;
  }
  return false;
}

export async function publishScheduledPosts(): Promise<ContentPost[]> {
  const store = await readStore();
  const now = new Date();
  const published: ContentPost[] = [];

  store.posts = store.posts.map(post => {
    if (post.isScheduled && post.scheduledFor && new Date(post.scheduledFor) <= now) {
      post.isScheduled = false;
      published.push(post);
    }
    return post;
  });

  if (published.length > 0) {
    await writeStore(store);
  }

  return published;
}

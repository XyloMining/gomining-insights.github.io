import { generateIdeaAndTitle, generateBlogPostContent, generateExcerpt } from "../server/_core/aiGenerator";
import { publishPost, getPosts } from "../server/_core/contentStore";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, "../.env");
console.log(`Loading env from: ${envPath}`);
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

async function runTest() {
  console.log("🚀 Starting Test AI Generation with Gemini...");
  console.log(`Using Gemini API Key: ${process.env.GEMINI_API_KEY?.substring(0, 10)}...`);
  
  try {
    console.log("\n1. Generating Idea and Title...");
    const { idea, title } = await generateIdeaAndTitle();
    console.log(`   ✅ Title: ${title}`);
    console.log(`   ✅ Idea: ${idea}`);

    console.log("\n2. Generating Full Blog Post Content...");
    const content = await generateBlogPostContent(idea, title);
    console.log("   ✅ Content generated successfully.");
    console.log(`   Content length: ${content.length} characters`);

    console.log("\n3. Generating Excerpt...");
    const excerpt = await generateExcerpt(content);
    console.log("   ✅ Excerpt generated successfully.");
    console.log(`   Excerpt: ${excerpt.substring(0, 100)}...`);

    console.log("\n4. Publishing Test Post...");
    const post = await publishPost({
      title,
      excerpt,
      content,
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663573433862/mJ8agoE5WoX36zzaB4BV5u/hero-market-data-fEzvJjmCGAML7wmbHLybid.webp"
    });

    console.log(`\n✅ Success! Test post published with ID: ${post.id}`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Published At: ${post.publishedAt}`);
    console.log(`   URL: /blog/${post.publishedAt.split('T')[0]}/${post.slug}`);
    
    const readTimeMinutes = Math.ceil(post.content.trim().split(/\s+/).length / 238);
    console.log(`   Read Time: ${readTimeMinutes} minutes`);

    // Verify the post was saved
    console.log("\n5. Verifying post was saved...");
    const allPosts = await getPosts();
    console.log(`   Total posts in store: ${allPosts.length}`);
    const savedPost = allPosts.find(p => p.id === post.id);
    if (savedPost) {
      console.log(`   ✅ Post verified in store!`);
    } else {
      console.log(`   ❌ Post NOT found in store!`);
    }

    console.log("\n--- PREVIEW OF GENERATED CONTENT (First 1000 chars) ---");
    console.log(content.substring(0, 1000) + "...");
    console.log("\n--- END OF PREVIEW ---");

  } catch (error) {
    console.error("\n❌ Error during test generation:");
    console.error(error);
    process.exit(1);
  }
}

runTest();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env";
import { AI_BLOG_TEMPLATES } from "./aiConfig";
import { fetchCryptoMarketData, fetchGoMiningData, formatMarketData, formatGoMiningData } from "./cryptoDataFetcher";

let geminiInstance: GoogleGenerativeAI | null = null;

/**
 * Get or initialize the Gemini client instance.
 * This ensures that environment variables are loaded before the client is created.
 */
function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiInstance) {
    const apiKey = ENV.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please set GEMINI_API_KEY in your .env file.");
    }
    geminiInstance = new GoogleGenerativeAI(apiKey);
  }
  return geminiInstance;
}

/**
 * Generates a blog post idea and title based on current crypto trends and a specific template.
 * @returns An object containing the idea and title.
 */
export async function generateIdeaAndTitle(): Promise<{ idea: string; title: string }> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `${AI_BLOG_TEMPLATES.ideaAndTitle.systemPrompt}

${AI_BLOG_TEMPLATES.ideaAndTitle.userPrompt}

Respond ONLY with a valid JSON object (no markdown, no code blocks) in this format:
{
  "idea": "string",
  "title": "string"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from the response (handle potential markdown code blocks)
  let jsonText = text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonText = jsonMatch[0];
  }

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    throw new Error(`Failed to parse idea and title response: ${text}`);
  }
}

/**
 * Generates the full content of a blog post based on an idea and title, following a specific format.
 * Uses real-time crypto market data to ensure accuracy.
 * @param idea - The core idea for the blog post.
 * @param title - The title of the blog post.
 * @returns The full blog post content in Markdown format.
 */
export async function generateBlogPostContent(idea: string, title: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Fetch real-time data
  console.log("  📡 Fetching real-time crypto market data...");
  const marketData = await fetchCryptoMarketData();
  const goMiningData = await fetchGoMiningData();

  // Format data for the prompt
  const formattedMarketData = formatMarketData(marketData);
  const formattedGoMiningData = formatGoMiningData(goMiningData);

  // Get current date for the prompt
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Calculate the week range (7 days ago to today)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekRange = `${lastWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${dateString}`;

  console.log(`  📅 Using date range: ${weekRange}`);

  const prompt = `${AI_BLOG_TEMPLATES.blogPostContent.systemPrompt}

${AI_BLOG_TEMPLATES.blogPostContent.userPrompt(idea, title, formattedMarketData, formattedGoMiningData, weekRange)}`;

  const result = await model.generateContent(prompt);
  const content = result.response.text();

  if (!content) {
    throw new Error("Failed to generate blog post content.");
  }
  return content;
}

/**
 * Generates a concise excerpt from the full blog post content, following a specific style.
 * @param content - The full blog post content.
 * @returns A concise excerpt.
 */
export async function generateExcerpt(content: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `${AI_BLOG_TEMPLATES.excerpt.systemPrompt}

${AI_BLOG_TEMPLATES.excerpt.userPrompt(content)}`;

  const result = await model.generateContent(prompt);
  const excerpt = result.response.text();

  if (!excerpt) {
    throw new Error("Failed to generate excerpt.");
  }
  return excerpt;
}

import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../.env");
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig["OPENAI_API_KEY"];

console.log(`Testing API Key: ${apiKey?.substring(0, 15)}...`);

const openai = new OpenAI({ apiKey });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello" }],
    });
    console.log("Response:", response.choices[0].message.content);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();

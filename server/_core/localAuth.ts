import { randomBytes, createCipheriv, createDecipheriv, createHash, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { User } from "../../drizzle/schema";
import { ENV } from "./env";

type LocalAuthRecord = {
  id: number;
  openId: string;
  email: string;
  passwordHash: string;
  name: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  lastSignedIn: string;
};

type LocalAuthStore = {
  users: LocalAuthRecord[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "..", "..", ".data");
const STORE_PATH = path.join(DATA_DIR, "local-auth.enc");

function getSecretKey() {
  const secretSource = ENV.localAuthSecret || ENV.cookieSecret || "change-me-local-auth-secret";
  return createHash("sha256").update(secretSource).digest();
}

function encryptStore(payload: string): string {
  const iv = randomBytes(12);
  const key = getSecretKey();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decryptStore(encoded: string): string {
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const key = getSecretKey();
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

async function readStore(): Promise<LocalAuthStore> {
  try {
    const encoded = await readFile(STORE_PATH, "utf8");
    const decoded = decryptStore(encoded);
    const parsed = JSON.parse(decoded) as LocalAuthStore;
    return { users: Array.isArray(parsed.users) ? parsed.users : [] };
  } catch {
    return { users: [] };
  }
}

async function writeStore(store: LocalAuthStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const payload = JSON.stringify(store, null, 2);
  const encoded = encryptStore(payload);
  await writeFile(STORE_PATH, encoded, "utf8");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getOpenIdFromEmail(email: string) {
  const digest = createHash("sha256").update(normalizeEmail(email)).digest("hex");
  return `local:${digest}`;
}

function hashPassword(password: string, salt: Buffer) {
  return scryptSync(password, salt, 64);
}

function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  const hash = hashPassword(password, salt);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyPassword(password: string, encodedHash: string) {
  const [saltHex, hashHex] = encodedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = hashPassword(password, Buffer.from(saltHex, "hex"));
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

function toUser(record: LocalAuthRecord): User {
  return {
    id: record.id,
    openId: record.openId,
    name: record.name,
    email: record.email,
    loginMethod: "email",
    role: record.role,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    lastSignedIn: new Date(record.lastSignedIn),
  };
}

export async function registerLocalUser(input: {
  email: string;
  password: string;
  name?: string;
  role?: "user" | "admin";
}): Promise<User> {
  const email = normalizeEmail(input.email);
  const now = new Date().toISOString();
  const store = await readStore();

  if (store.users.some(u => u.email === email)) {
    throw new Error("Email already registered");
  }

  const nextId = store.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
  const record: LocalAuthRecord = {
    id: nextId,
    openId: getOpenIdFromEmail(email),
    email,
    passwordHash: createPasswordHash(input.password),
    name: input.name?.trim() || null,
    role: input.role ?? "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };

  store.users.push(record);
  await writeStore(store);
  return toUser(record);
}

export async function loginLocalUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const email = normalizeEmail(input.email);
  const store = await readStore();
  const user = store.users.find(u => u.email === email);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!verifyPassword(input.password, user.passwordHash)) {
    throw new Error("Invalid email or password");
  }
  user.lastSignedIn = new Date().toISOString();
  user.updatedAt = user.lastSignedIn;
  await writeStore(store);
  return toUser(user);
}

export async function getLocalUserByOpenId(openId: string): Promise<User | null> {
  const store = await readStore();
  const user = store.users.find(u => u.openId === openId);
  return user ? toUser(user) : null;
}

export async function getOrCreateLocalAdminByUsername(
  username: string
): Promise<User> {
  const normalized = username.trim().toLowerCase();
  if (!normalized) {
    throw new Error("Username is required");
  }

  const openIdDigest = createHash("sha256").update(normalized).digest("hex");
  const openId = `local-admin:${openIdDigest}`;
  const now = new Date().toISOString();
  const store = await readStore();
  const existing = store.users.find(u => u.openId === openId);

  if (existing) {
    existing.role = "admin";
    existing.name = username.trim();
    existing.updatedAt = now;
    existing.lastSignedIn = now;
    await writeStore(store);
    return toUser(existing);
  }

  const nextId = store.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
  const created: LocalAuthRecord = {
    id: nextId,
    openId,
    email: `${normalized}@local.admin`,
    // Not used for secret-based admin login, kept as a placeholder.
    passwordHash: createPasswordHash(randomBytes(24).toString("hex")),
    name: username.trim(),
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
  store.users.push(created);
  await writeStore(store);
  return toUser(created);
}

/**
 * Encryption Utility Module
 * Provides AES-256-GCM encryption/decryption for sensitive data
 * Uses the same pattern as localAuth.ts for consistency
 */

import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";
import { ENV } from "./env";

/**
 * Get the encryption key from environment secrets
 * Falls back to cookie secret if content encryption secret is not set
 */
function getEncryptionKey(): Buffer {
  const secretSource = ENV.contentEncryptionSecret || ENV.cookieSecret || "change-me-content-encryption-secret";
  return createHash("sha256").update(secretSource).digest();
}

/**
 * Encrypt a string payload using AES-256-GCM
 * @param payload - The string to encrypt
 * @returns Base64 encoded encrypted data (IV + auth tag + ciphertext)
 */
export function encryptData(payload: string): string {
  const iv = randomBytes(12);
  const key = getEncryptionKey();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

/**
 * Decrypt a base64 encoded encrypted payload using AES-256-GCM
 * @param encoded - Base64 encoded encrypted data
 * @returns Decrypted string
 * @throws Error if decryption fails (tampered data)
 */
export function decryptData(encoded: string): string {
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const key = getEncryptionKey();
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

/**
 * Encrypt a JSON object
 * @param data - The object to encrypt
 * @returns Base64 encoded encrypted JSON
 */
export function encryptJSON<T extends Record<string, any>>(data: T): string {
  const payload = JSON.stringify(data, null, 2);
  return encryptData(payload);
}

/**
 * Decrypt a JSON object
 * @param encoded - Base64 encoded encrypted JSON
 * @returns Decrypted object
 * @throws Error if decryption fails or JSON is invalid
 */
export function decryptJSON<T extends Record<string, any>>(encoded: string): T {
  const payload = decryptData(encoded);
  return JSON.parse(payload) as T;
}

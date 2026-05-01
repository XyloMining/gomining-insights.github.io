import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import {
  getOrCreateLocalAdminByUsername,
  loginLocalUser,
  registerLocalUser,
} from "./localAuth";
import { sdk } from "./sdk";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100).optional(),
  adminSecret: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const adminLoginSchema = z.object({
  username: z.string().min(1).max(100),
  secret: z.string().min(1),
});

function toSafeUser(user: { id: number; openId: string; email: string | null; name: string | null; role: string }) {
  return {
    id: user.id,
    openId: user.openId,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function registerLocalAuthRoutes(app: Express) {
  app.post("/api/local-auth/register", async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid registration payload" });
      return;
    }

    try {
      const wantsAdmin = Boolean(parsed.data.adminSecret);
      const canBecomeAdmin =
        wantsAdmin &&
        ENV.localAdminSecret.length > 0 &&
        parsed.data.adminSecret === ENV.localAdminSecret;
      if (wantsAdmin && !canBecomeAdmin) {
        res.status(403).json({ error: "Invalid admin secret" });
        return;
      }
      const user = await registerLocalUser({
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
        role: canBecomeAdmin ? "admin" : "user",
      });
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || user.email || "Local User",
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.status(201).json({ success: true, user: toSafeUser(user) });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/local-auth/login", async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid login payload" });
      return;
    }
    try {
      const user = await loginLocalUser(parsed.data);
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || user.email || "Local User",
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.status(200).json({ success: true, user: toSafeUser(user) });
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : "Login failed" });
    }
  });

  app.post("/api/local-auth/admin-login", async (req: Request, res: Response) => {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid admin login payload" });
      return;
    }
    if (!ENV.localAdminSecret || parsed.data.secret !== ENV.localAdminSecret) {
      res.status(403).json({ error: "Invalid admin secret" });
      return;
    }

    try {
      const user = await getOrCreateLocalAdminByUsername(parsed.data.username);
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || parsed.data.username,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.status(200).json({ success: true, user: toSafeUser(user) });
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : "Admin login failed" });
    }
  });
}

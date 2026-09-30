import express from "express";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createStore } from "./store.js";
import { token, digest, verifyPassword, hashPassword } from "./auth.js";

const text = (min = 1, max = 500) => z.string().trim().min(min).max(max);
const lines = z.array(text(1, 500)).min(1).max(30);
const link = z.union([
  z.literal(""),
  z
    .string()
    .url()
    .max(1000)
    .refine((v) => new URL(v).protocol === "https:", "Use an HTTPS URL"),
]);
const courseSchema = z.object({
  id: text(1, 80).regex(/^[\w-]+$/),
  name: text(2, 150),
  description: text(10, 3000),
  duration: text(1, 80),
  mode: z.enum(["onsite", "online", "both"]),
  modules: lines,
  outcomes: lines,
  requirements: lines,
  published: z.boolean(),
});
const facultySchema = z.object({
  id: text(1, 80).regex(/^[\w-]+$/),
  name: text(2, 150),
  role: text(2, 150),
  badge: text(1, 80),
  image: z
    .string()
    .max(1000)
    .refine(
      (v) => /^\/(?!\/)[^<>]+$/.test(v) || /^https:\/\//.test(v),
      "Use a local path or HTTPS image URL",
    ),
  bio: text(10, 2000),
  tags: lines,
  published: z.boolean(),
});
const settingsSchema = z.object({
  announcement: text(0, 200),
  heroTitle: text(5, 200),
  heroIntro: text(10, 1000),
  mission: text(10, 1000),
  aboutTitle: text(3, 200),
  aboutBody: text(10, 5000),
  address: text(5, 500),
  email: z.string().email().max(200),
  phone: text(7, 30),
  whatsapp: text(8, 16).regex(/^\d+$/),
  mapQuery: text(3, 500),
  mapConfirmed: z.boolean(),
  facebook: link,
  instagram: link,
  linkedin: link,
  youtube: link,
});
const contentSchema = z
  .object({
    revision: z.number().int().positive(),
    settings: settingsSchema,
    courses: z.array(courseSchema).max(100),
    faculty: z.array(facultySchema).max(100),
  })
  .superRefine((value, ctx) => {
    for (const key of ["courses", "faculty"])
      if (new Set(value[key].map((x) => x.id)).size !== value[key].length)
        ctx.addIssue({ code: "custom", message: `Duplicate ${key} IDs` });
    if (
      new Set(value.courses.map((x) => x.name.toLowerCase())).size !==
      value.courses.length
    )
      ctx.addIssue({ code: "custom", message: "Course names must be unique" });
  });
const inquirySchema = z.object({
  type: z.enum(["contact", "admission"]),
  name: text(2, 120),
  email: z.string().trim().email().max(200),
  phone: text(7, 30).regex(/^[+\d\s()-]+$/),
  message: text(0, 3000).default(""),
  course: text(0, 150).default(""),
  batch: text(0, 150).default(""),
  mode: z.enum(["onsite", "online", "both"]).optional(),
  consent: z.literal(true),
  website: z.literal("").optional(),
});
const certificateSchema = z.object({
  id: text(3, 80).regex(/^[A-Za-z0-9-]+$/),
  student: text(2, 150),
  course: text(2, 200),
  issued: text(10, 10)
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (v) =>
        !Number.isNaN(Date.parse(v)) &&
        new Date(v).toISOString().slice(0, 10) === v,
      "Use a valid date",
    ),
  status: z.enum(["valid", "revoked"]),
  consent: z.literal(true),
});

export function createApp({
  directory = path.resolve(process.env.DATA_DIR || ".data"),
  production = process.env.NODE_ENV === "production",
  origins = (
    process.env.APP_ORIGINS ||
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3001"
  ).split(","),
  limits = true,
} = {}) {
  const app = express();
  const store = createStore(directory);
  const sessions = new Map();
  const authFile = path.join(directory, "admin.json");
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdnjs.cloudflare.com",
          ],
          fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://cdnjs.cloudflare.com",
            "data:",
          ],
          imgSrc: ["'self'", "https:", "data:"],
          frameSrc: ["https://www.google.com"],
          connectSrc: ["'self'"],
          upgradeInsecureRequests: production ? [] : null,
        },
      },
      strictTransportSecurity: production ? undefined : false,
    }),
  );
  app.use(compression());
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "256kb" }));
  app.use("/api", (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    if (!req.is("application/json"))
      return res.status(415).json({ error: "Send JSON data." });
    if (req.headers.origin && !origins.includes(req.headers.origin))
      return res.status(403).json({ error: "This origin is not allowed." });
    next();
  });
  const limiter = (limit, windowMs) =>
    limits
      ? rateLimit({
          windowMs,
          limit,
          standardHeaders: "draft-7",
          legacyHeaders: false,
          message: { error: "Too many requests. Please try again shortly." },
        })
      : (_req, _res, next) => next();
  app.use("/api", limiter(300, 60_000));
  const session = (req) => {
    const raw = (req.headers.cookie || "")
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith("rb_session="))
      ?.slice(11);
    if (!raw) return null;
    const key = digest(raw),
      current = sessions.get(key);
    if (!current || current.expires < Date.now()) {
      sessions.delete(key);
      return null;
    }
    return { ...current, key };
  };
  const requireAdmin = (req, res, next) => {
    const current = session(req);
    if (!current) return res.status(401).json({ error: "Please sign in." });
    if (
      !["GET", "HEAD"].includes(req.method) &&
      req.headers["x-csrf-token"] !== current.csrf
    )
      return res
        .status(403)
        .json({ error: "Session verification failed. Sign in again." });
    req.admin = current;
    next();
  };
  const parse = (schema, body) => {
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = new Error(
        result.error.issues
          .map((i) => `${i.path.join(".") || "Data"}: ${i.message}`)
          .join("; "),
      );
      error.status = 400;
      throw error;
    }
    return result.data;
  };
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.get("/api/content", (_req, res) => {
    const { content, revision } = store.read();
    res.json({
      ...content,
      revision,
      courses: content.courses.filter((x) => x.published),
      faculty: content.faculty.filter((x) => x.published),
    });
  });
  app.post("/api/inquiries", limiter(8, 15 * 60_000), (req, res) => {
    const data = parse(inquirySchema, req.body);
    if (
      data.type === "admission" &&
      (!data.batch ||
        !store
          .read()
          .content.courses.some((c) => c.published && c.name === data.course))
    )
      return res
        .status(400)
        .json({ error: "Choose an available course and batch." });
    if (data.type === "contact" && data.message.length < 10)
      return res
        .status(400)
        .json({ error: "Please write a message of at least 10 characters." });
    const inquiry = {
      ...data,
      id: randomUUID(),
      status: "new",
      notes: "",
      createdAt: new Date().toISOString(),
    };
    delete inquiry.website;
    store.update((state) => state.inquiries.unshift(inquiry));
    res
      .status(201)
      .json({ id: inquiry.id, message: "Your inquiry has been received." });
  });
  app.post("/api/admin/login", limiter(8, 15 * 60_000), async (req, res) => {
    const data = parse(
      z.object({ email: z.string().email().max(200), password: text(1, 200) }),
      req.body,
    );
    const admin = fs.existsSync(authFile)
      ? JSON.parse(fs.readFileSync(authFile, "utf8"))
      : null;
    const valid = admin
      ? await verifyPassword(data.password, admin.passwordHash)
      : (await hashPassword(data.password), false);
    if (!admin || data.email.toLowerCase() !== admin.email || !valid)
      return res.status(401).json({ error: "Email or password is incorrect." });
    for (const [key, value] of sessions)
      if (value.expires < Date.now()) sessions.delete(key);
    const old = session(req);
    if (old) sessions.delete(old.key);
    const raw = token(),
      current = {
        email: admin.email,
        csrf: token(),
        expires: Date.now() + 8 * 60 * 60_000,
      };
    sessions.set(digest(raw), current);
    res.cookie("rb_session", raw, {
      httpOnly: true,
      sameSite: "strict",
      secure: production,
      maxAge: 8 * 60 * 60_000,
      path: "/api",
    });
    res.json({ email: current.email, csrf: current.csrf });
  });
  app.get("/api/admin/session", requireAdmin, (req, res) =>
    res.json({ email: req.admin.email, csrf: req.admin.csrf }),
  );
  app.post("/api/admin/logout", requireAdmin, (req, res) => {
    sessions.delete(req.admin.key);
    res.clearCookie("rb_session", {
      path: "/api",
      httpOnly: true,
      sameSite: "strict",
      secure: production,
    });
    res.json({ ok: true });
  });
  app.get("/api/admin/content", requireAdmin, (_req, res) => {
    const state = store.read();
    res.json({ ...state.content, revision: state.revision });
  });
  app.put("/api/admin/content", requireAdmin, (req, res) => {
    const { revision, ...content } = parse(contentSchema, req.body);
    if (store.read().revision !== revision)
      return res
        .status(409)
        .json({
          error:
            "Content was changed in another session. Reload before saving.",
        });
    const state = store.update((s) => {
      s.content = content;
      s.revision++;
    });
    res.json({ ...state.content, revision: state.revision });
  });
  app.get("/api/admin/inquiries", requireAdmin, (_req, res) =>
    res.json(store.read().inquiries),
  );
  app.patch("/api/admin/inquiries/:id", requireAdmin, (req, res) => {
    const data = parse(
      z.object({
        status: z.enum(["new", "contacted", "enrolled", "closed"]),
        notes: text(0, 3000),
      }),
      req.body,
    );
    if (!store.read().inquiries.some((x) => x.id === req.params.id))
      return res.status(404).json({ error: "Inquiry not found." });
    store.update((s) =>
      Object.assign(
        s.inquiries.find((x) => x.id === req.params.id),
        data,
      ),
    );
    res.json({ ok: true });
  });
  app.get("/api/admin/certificates", requireAdmin, (_req, res) =>
    res.json(store.read().certificates),
  );
  app.put("/api/admin/certificates/:id", requireAdmin, (req, res) => {
    const data = parse(certificateSchema, req.body);
    if (data.id !== req.params.id)
      return res.status(400).json({ error: "Certificate ID does not match." });
    store.update((s) => {
      const index = s.certificates.findIndex((x) => x.id === data.id);
      if (index < 0) s.certificates.push(data);
      else s.certificates[index] = data;
    });
    res.json({ ok: true });
  });
  app.get("/api/certificates/:id", limiter(15, 60_000), (req, res) => {
    const id = parse(text(3, 80).regex(/^[A-Za-z0-9-]+$/), req.params.id);
    const certificate = store.read().certificates.find((x) => x.id === id);
    if (!certificate)
      return res
        .status(404)
        .json({
          error:
            "No matching certificate was found. Contact the institute for assistance.",
        });
    const { consent, ...publicRecord } = certificate;
    res.json(publicRecord);
  });
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "API route not found." }),
  );
  const dist = path.resolve("dist");
  if (fs.existsSync(dist)) {
    app.use(
      "/assets",
      express.static(path.join(dist, "assets"), {
        immutable: true,
        maxAge: "1y",
      }),
    );
    app.use(express.static(dist, { index: false }));
    app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }
  app.use((error, _req, res, _next) => {
    if (!error.status && error.type !== "entity.parse.failed")
      console.error("Request failed:", error.message);
    res
      .status(
        error.status || (error.type === "entity.parse.failed" ? 400 : 500),
      )
      .json({
        error: error.status
          ? error.message
          : error.type === "entity.parse.failed"
            ? "Invalid JSON."
            : "The request could not be completed. Please retry.",
      });
  });
  return app;
}

import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../server/auth.js";
const directory = path.resolve(process.env.DATA_DIR || ".data");
fs.mkdirSync(directory, { recursive: true });
const file = path.join(directory, "admin.json");
if (fs.existsSync(file) && !process.argv.includes("--reset"))
  throw new Error(
    "Admin already exists. Use --reset only to replace its credentials, then restart the API to invalidate sessions.",
  );
const email = process.env.ADMIN_EMAIL || "admin@rbukhari.com";
const password =
  process.env.ADMIN_PASSWORD || randomBytes(20).toString("base64url");
if (password.length < 14)
  throw new Error("Use a password of at least 14 characters.");
fs.writeFileSync(
  file,
  JSON.stringify({
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
  }),
  { mode: 0o600 },
);
const note = path.resolve(".local-admin.txt");
fs.writeFileSync(
  note,
  `Local admin login\nURL: http://localhost:5173/admin\nEmail: ${email}\nPassword: ${password}\n\nKeep this file private. Delete it after storing the credentials securely.\n`,
  { mode: 0o600 },
);
console.log(
  "Admin created. Credentials are in .local-admin.txt (excluded from Git).",
);

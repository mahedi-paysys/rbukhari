import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { initialContent } from "../src/siteData.js";

// Single-process, local-file persistence. No database installation or configuration.
export function createStore(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const file = path.join(directory, "site.json");
  let state = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : {
        version: 1,
        revision: 1,
        content: structuredClone(initialContent),
        inquiries: [],
        certificates: [],
      };
  function write(next) {
    const temporary = `${file}.${randomUUID()}.tmp`;
    try {
      fs.writeFileSync(temporary, JSON.stringify(next, null, 2), {
        mode: 0o600,
      });
      fs.renameSync(temporary, file);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
    state = next;
  }
  if (!fs.existsSync(file)) write(state);
  return {
    read: () => structuredClone(state),
    update(change) {
      const next = structuredClone(state);
      change(next);
      write(next);
      return structuredClone(next);
    },
  };
}

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
function appSource(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? appSource(path) : /\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

test("the dialogue application has no automatic transmission or persistent storage code", () => {
  for (const path of appSource(root)) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(|\bsendBeacon\s*\(|\b(localStorage|sessionStorage|indexedDB)\b|document\.cookie|["']use server["']|@vercel\/analytics/, path);
  }
});

test("the candidate is a static export without the previous analytics dependency", () => {
  const config = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
  assert.match(config, /output:\s*["']export["']/);
  const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.dependencies["@vercel/analytics"], undefined);
  assert.equal(pkg.version, "1.9.1-dialogue-rc.1");
});

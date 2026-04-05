#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const WIKI_DIR = resolve(".claude/wiki");
const SCHEMA_PATH = resolve(WIKI_DIR, "WIKI-SCHEMA.md");
const OVERVIEW_PATH = resolve(WIKI_DIR, "overview.md");
const INDEX_PATH = resolve(WIKI_DIR, "index.md");

async function main() {
  try {
    // Silent if wiki directory doesn't exist
    if (!existsSync(WIKI_DIR) || !existsSync(SCHEMA_PATH)) {
      console.log(JSON.stringify({}));
      return 0;
    }

    const contentParts = [];

    // Read overview.md — only include if it has real data (wikilinks or list items)
    if (existsSync(OVERVIEW_PATH)) {
      const overview = readFileSync(OVERVIEW_PATH, "utf-8").trim();
      const hasData = overview.includes("[[") || /^- .+/m.test(overview);
      if (hasData) {
        contentParts.push("### Project Status");
        contentParts.push(overview);
        contentParts.push("");
      }
    }

    // Read index.md
    if (existsSync(INDEX_PATH)) {
      const index = readFileSync(INDEX_PATH, "utf-8").trim();
      // Only include if there are actual entries (not empty categories)
      const hasEntries = index.includes("[[");
      if (hasEntries) {
        contentParts.push("### Page Index");
        contentParts.push(index);
        contentParts.push("");
      }
    }

    if (contentParts.length > 0) {
      const parts = [
        "## Wiki Knowledge Base",
        "Wiki lives under `.claude/wiki/`. Follows WIKI-SCHEMA.md rules.",
        "Commands: /wiki-ingest, /wiki-query, /wiki-lint",
        "",
        ...contentParts
      ];
      console.log(JSON.stringify({
        decision: "block",
        reason: parts.join("\n")
      }));
    } else {
      console.log(JSON.stringify({}));
    }

    return 0;
  } catch (error) {
    // Silent on error, never block the session
    console.error("[wiki-context-injector] failed:", error.message);
    console.log(JSON.stringify({}));
    return 0;
  }
}

const exitCode = await main();
process.exit(exitCode);

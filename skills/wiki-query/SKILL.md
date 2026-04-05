---
name: wiki-query
description: Search and synthesize answers from the LLM Wiki knowledge base. Use when running /wiki-query, or when asking questions about past bugs, investigations, features, or patterns.
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Wiki Query

Searches the wiki and synthesizes answers with citations.

## Usage

```
/wiki-query What Room bugs have we seen?
/wiki-query Most problematic modules
/wiki-query IAP module recent issues
```

## Flow

1. Read schema: `.claude/wiki/WIKI-SCHEMA.md`
2. Read query rules: `.claude/skills/wiki-query/rules/query-flow.md`
3. Read `index.md` → find relevant pages → read pages → synthesize
4. Offer to save good answers as wiki pages (uses templates from `.claude/skills/wiki-ingest/templates/`)

## Related Files

- Schema: `.claude/wiki/WIKI-SCHEMA.md`
- Rules: `.claude/skills/wiki-query/rules/query-flow.md`
- Templates (for saving): `.claude/skills/wiki-ingest/templates/`

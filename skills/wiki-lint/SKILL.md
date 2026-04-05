---
name: wiki-lint
description: Run health checks on the LLM Wiki knowledge base. Use when running /wiki-lint, or to check for stale pages, broken links, contradictions, and pattern opportunities.
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Wiki Lint

Runs 10 health checks on the wiki and reports issues.

## Usage

```
/wiki-lint
```

## Flow

1. Read schema: `.claude/wiki/WIKI-SCHEMA.md`
2. Read lint rules: `.claude/skills/wiki-lint/rules/lint-flow.md`
3. Scan all pages → generate report → offer to fix issues

## Checks

1. Stale pages
2. Superseded claims
3. Orphan pages
4. Broken links
5. Low confidence pages
6. Missing references
7. Pattern opportunities
8. Contradictions
9. Missing entity/concept pages
10. Schema compliance

## Related Files

- Schema: `.claude/wiki/WIKI-SCHEMA.md`
- Rules: `.claude/skills/wiki-lint/rules/lint-flow.md`

# Wiki Schema

This file defines how the wiki is structured, its rules, and workflows for the LLM.
It co-evolves with the LLM over time. Changes are recorded in log.md.

## Three Layers

1. **Raw Sources** — Immutable sources: Jira, Git, session transcripts, crash logs. LLM reads, does not modify.
2. **Wiki** — Markdown pages produced and managed by the LLM. LLM writes, humans read.
3. **Schema** — This file. Defines rules and workflows.

## Roles

- **Human:** Provides sources, guides analysis, asks good questions.
- **LLM:** Summarizes, cross-references, files — responsible for all writing and maintenance of the wiki.
- Do not manually edit the wiki. Consistency will break.

## Page Types

| Type | Directory | type value | Purpose |
|------|-----------|------------|---------|
| Bug | `bugs/` | `bug` | Resolved bugs — root cause, fix |
| Investigation | `investigations/` | `investigation` | Debug sessions |
| Feature | `features/` | `feature` | Feature decisions, trade-offs |
| Pattern | `patterns/` | `pattern` | Synthesis of recurring issues |
| Entity | `entities/` | `entity` | Module/component references |
| Concept | `concepts/` | `concept` | Architectural concepts and principles |

## Frontmatter Rules

Every page must have the following frontmatter:

```yaml
---
title: "Page title"
type: bug | investigation | feature | pattern | entity | concept
status: active | resolved | investigating | concluded | completed | deprecated | mitigated | stale
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: high | medium | low
sources:
  - type: jira | commit | session | crash_log | pr | slack | external
    ref: "reference info"
modules: [affected/modules]
tags: [tags]
---
```

## File Naming

| Type | Format | Example |
|------|--------|---------|
| Bug | `<topic>-<description>.md` | `room-migration-v94-crash.md` |
| Investigation | `<date>-<topic>.md` | `2026-04-04-telco-state-loss.md` |
| Feature | `<feature-name>.md` | `telco-notification-mvi-refactor.md` |
| Pattern | `<pattern-name>.md` | `room-migration-pitfalls.md` |
| Entity | `<module-name>.md` | `plugin-iap.md` |
| Concept | `<concept-name>.md` | `mvi-pattern.md` |

## Source Citation Rules

- Every page MUST have at least one entry in the `sources` frontmatter field. Empty `sources: []` is not allowed.
- Claims in page body should reference their source: `(Source: GT-5769)` or `(Source: commit abc1234)`.
- When a claim cannot be traced to a source, mark it: `(Source: unverified)` — lint will flag these.

## Wikilink Rules

- Format: `[[file-name]]` (without extension)
- Used only within page body (no `related` field in frontmatter)
- Broken link: lint warns if `[[target]]` exists but `target.md` does not

## Cascade Update Rules

On every page change (create, update, query→wiki) a three-phase cascade is triggered:

### Phase 1: Mechanical (Deterministic)
- index.md → add/update entry
- log.md → chronological record
- overview.md → update module metrics

### Phase 2: Semantic (LLM Judgment)
- Find related pages (same modules, same tags, existing wikilinks)
- Is existing content still correct? → Strengthened / weakened / stale / superseded
- Is there a new cross-type connection? → Bug↔Pattern, Feature→Pattern mitigation
- Is there a missing wikilink target? → Suggest creating the page

### Phase 3: Holistic
- 3+ similar bugs, no pattern → suggest pattern
- New case for pattern → strengthen synthesis (not just incrementing a counter)
- Write changed pages to log.md

## Contradiction vs Superseded

- **Contradiction:** Two sources say different things → ⚠️ mark both pages
- **Superseded:** New information definitively invalidates old → revise the old page

## Expected Impact

A typical ingest can create or update 5-15 wiki pages.

## Navigation

- `index.md` — Wiki's search engine. LLM reads this first during queries.
- `log.md` — Chronological change log. Strict parseable format:
  ```
  ## [YYYY-MM-DD] ingest | Bug: Room Migration Crash
  ## [YYYY-MM-DD] query | What Room bugs have we seen?
  ## [YYYY-MM-DD] lint | Health check: 2 stale, 1 orphan, 0 broken
  ## [YYYY-MM-DD] schema | Added source citation rules
  ```
  Parse examples: `grep "^## \[" log.md | tail -5` (last 5 entries), `grep "ingest | Bug" log.md` (all bug ingests).
- `overview.md` — Project health status, module metrics, contradictions, open questions.

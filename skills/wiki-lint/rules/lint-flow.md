# Lint Flow

## Trigger

```
/wiki-lint
```

## Checks

All checks are run in order. Each check result is reported.

### 1. Stale Pages
- `status` = active/investigating but `updated` date is 30+ days ago → stale
- Report: page name, last update date, suggested action

### 2. Superseded Claims
- Different from stale: a page may be current but still conflict with new information
- Compare pages affecting the same module
- Report if information in a newer page supersedes a claim in an older page

### 3. Orphan Pages
- Pages that receive no `[[wikilink]]` from any other page
- References in index.md and log.md do not count (these are navigation files)
- References in overview.md do not count

### 4. Broken Links
- `[[target]]` exists but `target.md` file does not
- Scan wikilinks in all pages, check existence of target files

### 5. Low Confidence Pages
- Pages with `confidence: low` need verification
- Report: page name, reason for low confidence, suggested verification method

### 6. Missing References
- Pages sharing the same `modules` value but not linking to each other
- Suggest potential connections

### 7. Pattern Opportunities
- If 3+ bugs in the same module and no pattern page for that module → suggest
- If 3+ bugs share the same tag → suggest

### 8. Contradictions
- Detect conflicting information across two pages
- Compare pages affecting the same module

### 9. Missing Entity/Concept Pages
- Module/concept name appears in pages but has no dedicated page
- Modules appearing in `modules` frontmatter but lacking an entity page

### 10. Schema Compliance
- Differences between WIKI-SCHEMA.md rules and actual wiki practice
- Frontmatter format compliance, file naming conventions

### 11. Missing Citations
- Pages with empty `sources: []` in frontmatter
- Claims marked `(Source: unverified)` in page body
- Pages with no source references at all in body text

## Report Format

```
# Wiki Lint Report — YYYY-MM-DD

## Summary
- Total pages: X
- Stale: Y
- Orphan: Z
- Broken links: W
- Low confidence: V

## Details

### Stale Pages
- [[page-1]] — last updated: 2026-01-15, 80 days ago

### Broken Links
- [[source-page]] → [[missing-target]] (target file not found)

...

## Suggested Actions
1. [[page-1]] should be updated or status set to stale
2. [[missing-target]] should be created or references removed
3. Pattern page for plugin/iap module should be created (4 bugs present)
```

## After

- Ask "Would you like me to fix these?"
- Apply fixes if user confirms
- Record lint pass in log.md: `- [LINT] Health check: X stale, Y orphan, Z broken links`

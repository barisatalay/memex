# Ingest Flow

## Trigger

```
/wiki-ingest [type] [jira-ticket] [--batch] [--quick]
```

## Modes

| Mode | Flag | Behavior |
|------|------|----------|
| Interactive | (default) | Discussion step, user guides |
| Quick | `--quick` | Discussion skipped, quick capture |
| Batch | `--batch` | Multiple sources, less interaction, batch summary at end |

## Interactive Flow

### Step 1: Context Analysis
- Analyze session context: what was done? debug? feature? research?
- Determine page type: bug / investigation / feature / entity / concept

### Step 2: Source Collection
- If Jira ticket exists → fetch details with Atlassian MCP
- Collect relevant commits from git log: `git log --oneline -20`
- Analyze changes made during the session

### Step 3: Discussion (Interactive mode)
- Summarize key takeaways and present to user
- Get confirmation and guidance from user:
  - Which points should be emphasized?
  - Is anything missing?
  - Is the type correct?

### Step 4: Page Creation
- Read appropriate template: `.claude/skills/wiki-ingest/templates/<type>.md`
- Fill in frontmatter (title, type, status, sources, modules, tags)
- **Sources field MUST NOT be empty.** Every page needs at least one source (jira ticket, commit, session, etc.)
- Write content sections — claims should reference their source: `(Source: GT-5769)` or `(Source: commit abc1234)`
- Add wikilinks: reference existing related pages

### Step 5: Trigger Cascade
Apply the three-phase cascade from Spec Section 6:

**Phase 1 — Mechanical:**
- `index.md` → add new entry, increment category count
- `log.md` → add `- [TYPE] [[page]] — description` under `## YYYY-MM-DD`
- `overview.md` → update module health map

**Phase 2 — Semantic:**
- Find related pages: same `modules`, same `tags`, existing wikilinks
- For each related page:
  - Is content still correct? Strengthened / weakened / stale / superseded?
  - Should the entity page's "Known Issues" or "History" section be updated?
  - Is there a pattern match? → increment occurrences, strengthen synthesis
  - Is there a contradiction? → ⚠️ mark, add to overview.md
- Missing wikilink target → if `[[page]]` exists but file does not, suggest creating it

**Phase 3 — Holistic:**
- 3+ similar bugs, no pattern → suggest creating pattern
- New case for pattern → strengthen synthesis (update confidence, Common Cause, Prevention)
- Write all changed pages to log.md

### Step 6: Summary
- Present list of created/updated pages to user
- Total impact: "X pages created, Y pages updated"

## Batch Flow

1. Run Steps 1-2 for each source
2. Skip discussion step
3. Run Steps 4-5 for each source
4. Present batch summary at end

## Quick Flow

1. Run Steps 1-2
2. Skip discussion step
3. Run Steps 4-6

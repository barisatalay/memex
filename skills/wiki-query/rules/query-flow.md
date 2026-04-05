# Query Flow

## Trigger

```
/wiki-query <question>
```

## Flow

### Step 1: Index Reading
- Read `.claude/wiki/index.md`
- index.md acts as the wiki's search engine — no RAG infrastructure required
- Identify pages matching the question: tags, modules, title matching

### Step 2: Page Reading
- Read relevant pages (typically 3-10 pages)
- Also read overview.md if needed (for general status questions)

### Step 3: Synthesis
- Generate synthesized answer in format appropriate to the question:

| Question type | Format |
|---------------|--------|
| General question | Markdown page (default) |
| Comparison | Comparison table |
| Metric/statistics | Module health report |
| List/scan | Summary list |

- Reference the answer's source pages: `Source: [[page-1]], [[page-2]]`

### Step 4: Save to Wiki Suggestion
- Suggest "Would you like me to save this to the wiki?"
- Compounding principle: good answers should accumulate in the wiki
- Especially worth saving:
  - Comparisons
  - Analyses
  - Newly discovered connections
  - Cross-module syntheses

### Step 5: Save (if user confirms)
- Determine appropriate page type (usually concept, pattern, or entity)
- Use template from `.claude/skills/wiki-ingest/templates/<type>.md`, fill in frontmatter
- Trigger cascade (same as ingest-flow.md Step 5)
- Add `[QUERY→WIKI]` entry to log.md

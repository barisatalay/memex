# Memex

A persistent, compounding knowledge base for AI-assisted development.

Instead of re-deriving knowledge from scratch on every query (like RAG), the LLM incrementally builds and maintains a structured wiki. Every source added and every question asked makes the wiki richer. The LLM handles all the tedious bookkeeping — cross-references, summaries, contradictions, consistency — so the knowledge base actually stays maintained.

Inspired by [Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) and [Vannevar Bush's Memex (1945)](https://en.wikipedia.org/wiki/Memex).

**[Türkçe README](README.tr.md)**

## Why

Humans abandon wikis because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass. The wiki stays maintained because the cost of maintenance is near zero.

**Problems this solves:**

- **Scattered Jira tickets** — Cross-references connect related bugs, features, and investigations
- **Lost debug sessions** — Every debug session becomes a permanent investigation page
- **Missing feature context** — Why was this built this way? What alternatives were rejected?
- **Invisible patterns** — "We've had 5 Room migration bugs in 6 months" emerges automatically

### Installation

#### 1. Add Marketplace
```
/plugin marketplace add barisatalay/memex
```

#### 2. Install Plugin
```
/plugin install barisatalay/memex
```

#### 3. Update
```
/plugin marketplace update
```

### First Use

After installation, run any of the three commands in your project:

```
/wiki-ingest                    # Capture current session's knowledge
/wiki-query Room migration bugs # Search the wiki
/wiki-lint                      # Health check
```

On first `/wiki-ingest`, the plugin initializes `.claude/wiki/` in your project with the schema and empty navigation files.

## Commands

### `/wiki-ingest [type] [jira-ticket] [--batch] [--quick]`

Captures knowledge from the current session into wiki pages.

```
/wiki-ingest                      # Auto-detect type, interactive mode
/wiki-ingest bug GT-5769          # Create a bug page for this ticket
/wiki-ingest investigation        # Capture a debug session
/wiki-ingest feature GT-5769      # Document feature decisions
/wiki-ingest --quick              # Skip discussion, quick capture
/wiki-ingest --batch GT-1 GT-2    # Multiple sources, less interaction
```

**Interactive mode** (default): The LLM presents key takeaways and you guide what to emphasize before it writes.

### `/wiki-query <question>`

Searches the wiki and synthesizes answers with citations.

```
/wiki-query What Room bugs have we seen?
/wiki-query Most problematic modules
/wiki-query Coroutines vs RxJava comparison
```

Good answers can be saved back to the wiki — your explorations compound just like ingested sources.

### `/wiki-lint`

Runs 10 health checks: stale pages, superseded claims, orphan pages, broken links, low confidence, missing references, pattern opportunities, contradictions, missing pages, schema compliance.

## Architecture

### Three Layers

```
Raw Sources          Wiki                    Schema
(immutable)          (LLM-managed)           (co-evolving)
─────────────        ─────────────           ─────────────
Jira tickets    →    bugs/                   WIKI-SCHEMA.md
Git history     →    investigations/         defines rules,
Sessions        →    features/              workflows, and
Crash logs      →    patterns/              cascade behavior
                     concepts/
                     entities/
                     index.md
                     log.md
                     overview.md
```

- **Raw Sources** — Immutable. The LLM reads but never modifies. Jira, Git, sessions, crash logs.
- **Wiki** — LLM-generated markdown pages. The LLM owns this layer entirely.
- **Schema** — `WIKI-SCHEMA.md` defines conventions and workflows. Co-evolves with the LLM over time.

### Roles

- **Human:** Curates sources, directs analysis, asks good questions, thinks about meaning.
- **LLM:** Summarizes, cross-references, files, bookkeeps — responsible for all wiki writing and maintenance.

### Cascade Updates

When a page is created or updated, a three-phase cascade triggers:

1. **Mechanical** — Update `index.md`, `log.md`, `overview.md` (deterministic)
2. **Semantic** — Review related pages: strengthen/weaken/revise/flag contradictions (LLM judgment)
3. **Holistic** — Detect pattern opportunities, strengthen syntheses (LLM judgment)

A single ingest typically touches 5-15 wiki pages.

### Context Injection

A hook script runs on `SessionStart` and `PreCompact` events. It reads `overview.md` and `index.md`, injecting wiki context into every session — but only when there's actual content. Empty wikis produce zero overhead.

## Page Types

| Type | Directory | Purpose |
|------|-----------|---------|
| Bug | `bugs/` | Resolved bugs — root cause, fix, references |
| Investigation | `investigations/` | Debug sessions — may or may not reach conclusion |
| Feature | `features/` | Feature decisions — why, alternatives, trade-offs |
| Pattern | `patterns/` | Recurring issue synthesis (living documents) |
| Entity | `entities/` | Module/component reference pages |
| Concept | `concepts/` | Architectural concepts and principles |

Each page has YAML frontmatter with `type`, `status`, `confidence`, `sources`, `modules`, and `tags`.

Pages link to each other using `[[wikilinks]]` — creating an interconnected knowledge graph.

## Plugin Structure

```
memex/
├── .claude-plugin/
│   ├── plugin.json                 # Plugin manifest
│   └── hooks/hooks.json            # Hook registration
├── hooks/
│   └── wiki-context-injector.mjs   # Context injection script
├── skills/
│   ├── wiki-ingest/                # /wiki-ingest command
│   │   ├── SKILL.md
│   │   ├── rules/ingest-flow.md
│   │   └── templates/              # Page templates (bug, investigation, etc.)
│   ├── wiki-query/                 # /wiki-query command
│   │   ├── SKILL.md
│   │   └── rules/query-flow.md
│   └── wiki-lint/                  # /wiki-lint command
│       ├── SKILL.md
│       └── rules/lint-flow.md
├── wiki-init/                      # Templates copied to project on first use
│   ├── WIKI-SCHEMA.md
│   ├── index.md
│   ├── log.md
│   └── overview.md
├── README.md
├── README.tr.md
└── LICENSE
```

## Scaling

| Scale | Strategy |
|-------|----------|
| Small (~50 pages) | `index.md` is sufficient. LLM reads it directly. |
| Medium (~100-300 pages) | `index.md` + tags/modules filtering. Regular lint runs. |
| Large (300+ pages) | (TODO) Integrate a local search engine (FTS5, qmd) via MCP server. |

## Optional: Obsidian Integration

The wiki is just markdown files in a git repo. Open it in [Obsidian](https://obsidian.md/) for:

- **Graph view** — See wiki shape, hubs, and orphans
- **Wikilink navigation** — Click `[[links]]` to navigate
- **Dataview plugin** — Dynamic tables from frontmatter queries

## Credits

- [Andrej Karpathy](https://github.com/karpathy) — LLM Wiki pattern
- [Vannevar Bush](https://en.wikipedia.org/wiki/As_We_May_Think) — Memex concept (1945)

## License

MIT

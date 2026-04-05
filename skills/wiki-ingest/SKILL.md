---
name: wiki-ingest
description: Capture knowledge from debug sessions, bug fixes, and feature work into the LLM Wiki. Use when running /wiki-ingest, or at the end of a session to capture what was learned.
user-invocable: true
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Wiki Ingest

Captures knowledge from the current session into the LLM Wiki.

## Usage

```
/wiki-ingest                      # Auto-detect type, interactive mode
/wiki-ingest bug GT-5769          # Create a bug page
/wiki-ingest investigation        # Capture a debug session
/wiki-ingest feature GT-5769      # Document feature decisions
/wiki-ingest --quick              # Skip discussion, quick capture
/wiki-ingest --batch GT-1 GT-2    # Multiple sources, less interaction
```

## Flow

1. **Init check:** If `.claude/wiki/` directory does not exist, initialize it by copying templates from `wiki-init/` in the plugin root (`${CLAUDE_PLUGIN_ROOT}/wiki-init/`). Create subdirectories: `bugs/`, `investigations/`, `features/`, `patterns/`, `concepts/`, `entities/`, `assets/`. Skip this step if `.claude/wiki/` already exists.
2. Read schema: `.claude/wiki/WIKI-SCHEMA.md`
3. Read ingest rules: `.claude/skills/wiki-ingest/rules/ingest-flow.md`
4. Read appropriate template: `.claude/skills/wiki-ingest/templates/<type>.md`
5. Follow the flow

## Related Files

- Schema: `.claude/wiki/WIKI-SCHEMA.md`
- Rules: `.claude/skills/wiki-ingest/rules/ingest-flow.md`
- Templates: `.claude/skills/wiki-ingest/templates/`

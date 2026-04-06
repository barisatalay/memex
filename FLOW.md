# Memex - Flow Diagram

This document illustrates the flow diagrams for Memex plugin's three core operations: ingest, query, and lint.

## Overview

```
                          +---------------------+
                          |     Claude Code      |
                          |      Session         |
                          +----------+----------+
                                     |
                     +---------------+---------------+
                     |               |               |
                     v               v               v
              /wiki-ingest     /wiki-query      /wiki-lint
                     |               |               |
                     v               v               v
              +-----------+   +-----------+   +-----------+
              | Knowledge |   | Search &  |   | Health    |
              | Capture   |   | Synthesis |   | Check     |
              +-----------+   +-----------+   +-----------+
                     |               |               |
                     +-------+-------+-------+-------+
                             |               |
                             v               v
                      .claude/wiki/     index.md
                      (in project)      log.md
                                        overview.md
```

---

## 1. Wiki Ingest Flow

Captures knowledge into wiki pages and triggers cascade updates.

```
  User
     |
     |  /wiki-ingest [type] [ticket] [--batch] [--quick]
     v
+--------------------+
| Wiki exists?       |-----> No -----> Copy wiki-init/ templates
| (.claude/wiki/)    |                 into .claude/wiki/
+--------------------+                          |
     | Yes                                      |
     v <----------------------------------------+
+--------------------+
| Read               |
| WIKI-SCHEMA.md and |
| ingest rules       |
+--------------------+
     |
     v
+--------------------+
| Determine page type |
| bug / investigation |
| feature / pattern   |
| concept / entity    |
+--------------------+
     |
     v
+--------------------+     +------------------+
| --quick flag?      |---->| Yes: Create page |
|                    |     | directly         |
+--------------------+     +------------------+
     |                              |
     | No (interactive)             |
     v                              |
+--------------------+              |
| Present key        |              |
| findings to user,  |              |
| ask what to        |              |
| emphasize          |              |
+--------------------+              |
     |                              |
     v                              |
+--------------------+ <-----------+
| Create page from   |
| template           |
| (YAML frontmatter) |
| title, type,       |
| status, confidence,|
| sources, modules,  |
| tags               |
+--------------------+
     |
     v
+==============================================+
|           CASCADE UPDATE                      |
|           (3 Phases)                          |
|                                               |
|  +----------------------------------------+  |
|  | PHASE 1: Mechanical (Deterministic)    |  |
|  | - Update index.md                      |  |
|  | - Update log.md                        |  |
|  | - Update overview.md                   |  |
|  +----------------------------------------+  |
|                    |                          |
|                    v                          |
|  +----------------------------------------+  |
|  | PHASE 2: Semantic (LLM Judgment)       |  |
|  | - Find related pages                   |  |
|  |   (same module/tag/wikilink)           |  |
|  | - Strengthen/weaken connections         |  |
|  | - Flag contradictions                   |  |
|  | - Suggest missing entity pages          |  |
|  +----------------------------------------+  |
|                    |                          |
|                    v                          |
|  +----------------------------------------+  |
|  | PHASE 3: Holistic (LLM Judgment)       |  |
|  | - Detect pattern opportunities          |  |
|  | - Strengthen syntheses                  |  |
|  | - Update related pages                  |  |
|  +----------------------------------------+  |
|                                               |
|  Typical impact: 5-15 pages updated          |
+==============================================+
```

---

## 2. Wiki Query Flow

Searches the wiki and synthesizes answers with citations.

```
  User
     |
     |  /wiki-query <question>
     v
+--------------------+
| Read index.md      |
| (page map)         |
+--------------------+
     |
     v
+--------------------+
| Find relevant      |
| pages via          |
| wikilinks          |
+--------------------+
     |
     v
+--------------------+
| Select format      |
| based on question  |
| type:              |
| - Markdown         |
| - Comparison table |
| - Health report    |
| - List             |
+--------------------+
     |
     v
+--------------------+
| Synthesize answer  |
| with citations     |
| (Source: GT-XXXX)  |
+--------------------+
     |
     v
+--------------------+     +------------------+
| Save answer to     |---->| Yes: Create new  |
| wiki?              |     | page via /wiki-  |
| (ask user)         |     | ingest           |
+--------------------+     +------------------+
     |                     
     | No
     v
  [Done]
```

---

## 3. Wiki Lint Flow

Runs 11 health checks and reports issues.

```
  User
     |
     |  /wiki-lint
     v
+--------------------+
| Scan all wiki      |
| pages              |
+--------------------+
     |
     v
+------------------------------------------------------+
|                  11 HEALTH CHECKS                     |
|                                                       |
|  +--------------------------------------------------+|
|  | 1. Stale Pages                                   ||
|  |    Pages not updated for 30+ days                ||
|  +--------------------------------------------------+|
|  | 2. Superseded Claims                             ||
|  |    Old claims conflicting with newer information ||
|  +--------------------------------------------------+|
|  | 3. Orphan Pages                                  ||
|  |    Pages with no incoming links                  ||
|  +--------------------------------------------------+|
|  | 4. Broken Links                                  ||
|  |    [[wikilinks]] pointing to non-existent pages  ||
|  +--------------------------------------------------+|
|  | 5. Low Confidence                                ||
|  |    Pages with confidence: low                    ||
|  +--------------------------------------------------+|
|  | 6. Missing References                            ||
|  |    Claims without cited sources                  ||
|  +--------------------------------------------------+|
|  | 7. Pattern Opportunities                         ||
|  |    3+ similar bugs -> suggest pattern page       ||
|  +--------------------------------------------------+|
|  | 8. Contradictions                                ||
|  |    Conflicting claims across pages               ||
|  +--------------------------------------------------+|
|  | 9. Missing Entity/Concept Pages                  ||
|  |    Frequently referenced but no page exists      ||
|  +--------------------------------------------------+|
|  | 10. Schema Compliance                            ||
|  |     Pages violating frontmatter rules            ||
|  +--------------------------------------------------+|
|  | 11. Missing Citations                            ||
|  |     Claims without (Source: ...) tags             ||
|  +--------------------------------------------------+|
+------------------------------------------------------+
     |
     v
+--------------------+
| Report issues      |
| by priority        |
+--------------------+
     |
     v
+--------------------+
| Suggest fixes      |
+--------------------+
```

---

## Context Injection (Automatic)

Wiki context is automatically injected into every session.

```
+------------------+     +------------------------+
| SessionStart     |     | PreCompact             |
| (session began)  |     | (context shrinking)    |
+--------+---------+     +-----------+------------+
         |                           |
         +-------------+-------------+
                       |
                       v
          +------------------------+
          | wiki-context-          |
          | injector.mjs           |
          +------------------------+
                       |
                       v
          +------------------------+
          | .claude/wiki/          |
          | exists?                |----> No -----> [Do nothing]
          +------------------------+
                       |
                       | Yes
                       v
          +------------------------+
          | Read overview.md and   |
          | index.md               |
          +------------------------+
                       |
                       v
          +------------------------+
          | Has content?           |
          | (wikilinks or          |----> No -----> [Zero overhead]
          | list items)            |
          +------------------------+
                       |
                       | Yes
                       v
          +------------------------+
          | Inject wiki context    |
          | into session           |
          +------------------------+
```

---

## Roles

```
+---------------------------+          +---------------------------+
|         HUMAN             |          |          LLM              |
+---------------------------+          +---------------------------+
| - Curates sources         |  ------> | - Summarizes             |
| - Directs analysis        |          | - Cross-references       |
| - Asks good questions     |          | - Files and organizes    |
| - Thinks about meaning    |          | - Ensures consistency    |
|                           |  <------ | - Writes/maintains wiki  |
+---------------------------+          +---------------------------+
```

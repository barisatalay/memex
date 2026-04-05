# Wiki Ingest

Captures knowledge from the current Claude Code session into the LLM Wiki.

## Usage

```
/wiki-ingest                      # Auto-detect type, interactive mode
/wiki-ingest bug GT-5769          # Create a bug page
/wiki-ingest investigation        # Capture a debug session
/wiki-ingest feature GT-5769      # Document feature decisions
/wiki-ingest --quick              # Skip discussion, quick capture
/wiki-ingest --batch GT-1 GT-2    # Multiple sources, less interaction
```

## Modes

| Mode | Flag | Behavior |
|------|------|----------|
| Interactive | (default) | LLM presents key takeaways, you guide what to emphasize |
| Quick | `--quick` | Skips discussion, captures directly |
| Batch | `--batch` | Multiple sources, less interaction, summary at end |

## What Happens

1. Analyzes the session context (what was done — debug, feature, investigation)
2. Pulls data from Jira (via Atlassian MCP) and Git history
3. Discusses findings with you (interactive mode)
4. Creates wiki page using the appropriate template
5. Triggers three-phase cascade: mechanical → semantic → holistic

A single ingest typically touches 5-15 wiki pages.

## Page Types

| Type | When to use |
|------|-------------|
| `bug` | You fixed a bug — root cause, fix, impact |
| `investigation` | You debugged something — may or may not have found a fix |
| `feature` | You made a feature decision — why, alternatives, trade-offs |

## File Structure

```
.claude/skills/wiki-ingest/
├── SKILL.md              # Skill definition
├── README.md             # This file
├── rules/
│   └── ingest-flow.md    # Detailed ingest workflow and cascade rules
└── templates/
    ├── bug.md            # Bug page template
    ├── investigation.md  # Investigation page template
    ├── feature.md        # Feature page template
    ├── pattern.md        # Pattern page template
    ├── entity.md         # Entity page template
    └── concept.md        # Concept page template
```

## Related

- Wiki schema: `.claude/wiki/WIKI-SCHEMA.md`
- Query skill: `.claude/skills/wiki-query/`
- Lint skill: `.claude/skills/wiki-lint/`

---

# Wiki Ingest (TR)

Mevcut Claude Code oturumundaki bilgiyi LLM Wiki'ye yakalar.

## Kullanim

```
/wiki-ingest                      # Tipi otomatik belirle, etkilesimli mod
/wiki-ingest bug GT-5769          # Bug sayfasi olustur
/wiki-ingest investigation        # Debug oturumunu kaydet
/wiki-ingest feature GT-5769      # Feature kararlarini dokumante et
/wiki-ingest --quick              # Tartisma atlaniyor, hizli kayit
/wiki-ingest --batch GT-1 GT-2    # Coklu kaynak, az etkilesim
```

## Ne Olur

1. Oturum context'ini analiz eder (ne yapildi — debug, feature, investigation)
2. Jira'dan ve Git gecmisinden veri ceker
3. Bulgulari sizinle tartisir (etkilesimli mod)
4. Uygun sablonu kullanarak wiki sayfasi olusturur
5. Uc fazli cascade tetikler: mekanik → semantik → butunsel

Tek bir ingest tipik olarak 5-15 wiki sayfasina dokunur.

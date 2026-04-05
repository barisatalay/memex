# LLM Wiki — Knowledge Base

A persistent, compounding knowledge base powered by LLM. Based on [Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

Instead of re-deriving knowledge from scratch on every query (like RAG), the LLM incrementally builds and maintains a structured wiki — updating entity pages, revising summaries, flagging contradictions, and strengthening the evolving synthesis with every source added and every question asked.

## Quick Start

| Command | What it does |
|---------|-------------|
| `/wiki-ingest` | Capture knowledge from the current session (bugs, features, investigations) |
| `/wiki-query <question>` | Search and synthesize answers from the wiki |
| `/wiki-lint` | Run a health check on wiki pages |

## Directory Structure

```
.claude/wiki/
├── WIKI-SCHEMA.md      # Rules, workflows, cascade definitions
├── index.md            # Categorized page index (wiki's search engine)
├── log.md              # Chronological changelog
├── overview.md         # Project health, module metrics, contradictions
├── bugs/               # Resolved bugs — root cause, fix, references
├── investigations/     # Debug sessions — may or may not reach a conclusion
├── features/           # Feature decisions — why, alternatives, trade-offs
├── patterns/           # Recurring issue syntheses (living documents)
├── concepts/           # Architectural concepts and principles
├── entities/           # Module/component/service reference pages
├── assets/             # Images (crash screenshots, diagrams, UI mockups)
└── raw/                # [Optional] Physical raw sources (session transcripts, external articles)
```

## Three-Layer Architecture

1. **Raw Sources** — Immutable source documents: Jira tickets, Git history, session transcripts, crash logs. The LLM reads but never modifies these.
2. **Wiki** — LLM-generated markdown pages. The LLM owns this layer entirely — creates, updates, and maintains cross-references.
3. **Schema** — `WIKI-SCHEMA.md` defines rules and workflows. Co-evolves with the LLM over time.

## Roles

- **Human:** Curates sources, directs analysis, asks good questions, thinks about meaning.
- **LLM:** Summarizes, cross-references, files, bookkeeps — responsible for all wiki writing and maintenance.

Avoid manual edits to wiki pages. The LLM maintains consistency; human intervention breaks it.

## How It Works

When you run `/wiki-ingest`, the LLM:
1. Analyzes the session context
2. Pulls data from Jira (via Atlassian MCP) and Git history
3. Discusses key takeaways with you (interactive mode)
4. Creates wiki pages using templates
5. Triggers a three-phase cascade: mechanical updates (index, log, overview) → semantic review (related pages) → holistic check (pattern detection)

A single ingest typically touches 5-15 wiki pages.

## Page Types

| Type | Directory | Purpose |
|------|-----------|---------|
| Bug | `bugs/` | Resolved bugs with root cause and fix |
| Investigation | `investigations/` | Debug sessions, may not reach conclusion |
| Feature | `features/` | Feature decisions, rejected alternatives, trade-offs |
| Pattern | `patterns/` | Recurring issue synthesis (living documents) |
| Entity | `entities/` | Module/component reference pages |
| Concept | `concepts/` | Architectural concepts and principles |

## Related Files

- Schema: `.claude/wiki/WIKI-SCHEMA.md`
- Skill: `.claude/skills/wiki/SKILL.md`
- Rules: `.claude/skills/wiki/rules/`
- Templates: `.claude/skills/wiki/templates/`
- Hook: `.claude/hooks/wiki-context-injector.mjs`

---

# LLM Wiki — Bilgi Tabanı

LLM tarafından desteklenen, kalıcı ve biriken bir bilgi tabanı. [Karpathy'nin LLM Wiki pattern'ine](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) dayanır.

RAG gibi her sorguda bilgiyi sıfırdan türetmek yerine, LLM yapılandırılmış bir wiki'yi adım adım oluşturur ve bakımını yapar — entity sayfalarını günceller, özetleri revize eder, çelişkileri işaretler ve eklenen her kaynak ve sorulan her soruyla sentezi güçlendirir.

## Hızlı Başlangıç

| Komut | Ne yapar |
|-------|----------|
| `/wiki-ingest` | Mevcut oturumdan bilgi yakala (bug, feature, investigation) |
| `/wiki-query <soru>` | Wiki'den arama yap ve sentezlenmiş cevap al |
| `/wiki-lint` | Wiki sayfalarında sağlık kontrolü çalıştır |

## Üç Katmanlı Mimari

1. **Raw Sources** — Değişmez kaynak belgeler: Jira ticket'ları, Git geçmişi, oturum transcript'leri, crash log'lar. LLM bunları okur ama asla değiştirmez.
2. **Wiki** — LLM'in ürettiği markdown sayfaları. LLM bu katmanın sahibidir — oluşturur, günceller ve çapraz referansları korur.
3. **Schema** — `WIKI-SCHEMA.md` kuralları ve iş akışlarını tanımlar. LLM ile birlikte zamanla evrilir.

## Roller

- **İnsan:** Kaynak sağlar, analizi yönlendirir, iyi sorular sorar, anlamını düşünür.
- **LLM:** Özetler, çapraz referanslar, dosyalar, defter tutar — wiki'nin tüm yazımından ve bakımından sorumludur.

Wiki sayfalarını elle düzenlemekten kaçının. LLM tutarlılığı korur; insan müdahalesi bozar.

## Nasıl Çalışır

`/wiki-ingest` çalıştırdığınızda LLM:
1. Oturum context'ini analiz eder
2. Jira'dan (Atlassian MCP ile) ve Git geçmişinden veri çeker
3. Anahtar çıkarımları sizinle tartışır (etkileşimli mod)
4. Şablonları kullanarak wiki sayfaları oluşturur
5. Üç fazlı cascade tetikler: mekanik güncellemeler (index, log, overview) → semantik inceleme (ilgili sayfalar) → bütünsel kontrol (pattern tespiti)

Tek bir ingest tipik olarak 5-15 wiki sayfasına dokunur.

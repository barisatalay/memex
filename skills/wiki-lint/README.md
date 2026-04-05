# Wiki Lint

Runs 10 health checks on the LLM Wiki and reports issues with suggested fixes.

## Usage

```
/wiki-lint
```

Run periodically (e.g., monthly) to keep the wiki healthy.

## Checks

| # | Check | What it detects |
|---|-------|----------------|
| 1 | Stale Pages | `status=active` but not updated in 30+ days |
| 2 | Superseded Claims | New info invalidates old claims (different from stale) |
| 3 | Orphan Pages | Pages with no inbound wikilinks |
| 4 | Broken Links | `[[target]]` exists but `target.md` doesn't |
| 5 | Low Confidence | `confidence: low` pages needing verification |
| 6 | Missing References | Same-module pages not linking to each other |
| 7 | Pattern Opportunities | 3+ bugs in same module with no pattern page |
| 8 | Contradictions | Two pages with conflicting information |
| 9 | Missing Pages | Module/concept mentioned but no dedicated page |
| 10 | Schema Compliance | Frontmatter format, naming convention violations |

## What Happens

1. Scans all wiki pages
2. Runs all 10 checks
3. Generates a health report with summary + details
4. Asks "Want me to fix these?" — fixes on approval
5. Logs the lint run to `log.md`

## File Structure

```
.claude/skills/wiki-lint/
├── SKILL.md              # Skill definition
├── README.md             # This file
└── rules/
    └── lint-flow.md      # Detailed lint checks and report format
```

## Related

- Wiki schema: `.claude/wiki/WIKI-SCHEMA.md`
- Ingest skill: `.claude/skills/wiki-ingest/`
- Query skill: `.claude/skills/wiki-query/`

---

# Wiki Lint (TR)

LLM Wiki uzerinde 10 saglik kontrolu calistirir ve onerilen duzeltmelerle raporlar.

## Kullanim

```
/wiki-lint
```

Wiki'yi saglikli tutmak icin periyodik olarak (ornegin ayda bir) calistirin.

## Kontroller

| # | Kontrol | Ne tespit eder |
|---|---------|----------------|
| 1 | Stale Sayfalar | `status=active` ama 30+ gundur guncellenmemis |
| 2 | Gecersiz Kilinmis Iddialar | Yeni bilgi eski iddialari gecersiz kilmis |
| 3 | Yetim Sayfalar | Hicbir sayfadan link almayan sayfalar |
| 4 | Kirik Linkler | `[[hedef]]` var ama `hedef.md` yok |
| 5 | Dusuk Guven | `confidence: low` sayfalar dogrulanmali |
| 6 | Eksik Referanslar | Ayni modulu etkileyen ama birbirine link vermeyen sayfalar |
| 7 | Pattern Firsatlari | Ayni modulde 3+ bug, pattern sayfasi yok |
| 8 | Celiskiler | Iki sayfada birbiriyle celisen bilgi |
| 9 | Eksik Sayfalar | Modul/kavram adi geciyor ama sayfasi yok |
| 10 | Schema Uyumu | Frontmatter format, dosya adlandirma kurali ihlalleri |

## Ne Olur

1. Tum wiki sayfalarini tarar
2. 10 kontrolu calistirir
3. Ozet + detayli saglik raporu uretir
4. "Bunlari duzeltmemi ister misin?" diye sorar
5. Lint gecisini `log.md`'ye kaydeder

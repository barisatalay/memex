# Wiki Query

Searches the LLM Wiki and synthesizes answers with citations.

## Usage

```
/wiki-query What Room bugs have we seen?
/wiki-query Most problematic modules
/wiki-query IAP module recent issues
/wiki-query Coroutines vs RxJava comparison
```

## What Happens

1. Reads `index.md` to find relevant pages (the wiki's search engine — no RAG needed)
2. Reads the relevant pages (typically 3-10)
3. Synthesizes an answer in the appropriate format:
   - **Markdown page** (default) — for general questions
   - **Comparison table** — when comparing two things
   - **Health report** — for metric/statistics questions
   - **Summary list** — when multiple results are returned
4. Offers to save good answers back to the wiki

## Compounding Knowledge

Good answers can be saved as new wiki pages. A comparison you asked for, an analysis, a connection you discovered — these compound in the knowledge base just like ingested sources.

## File Structure

```
.claude/skills/wiki-query/
├── SKILL.md              # Skill definition
├── README.md             # This file
└── rules/
    └── query-flow.md     # Detailed query workflow
```

## Related

- Wiki schema: `.claude/wiki/WIKI-SCHEMA.md`
- Ingest skill: `.claude/skills/wiki-ingest/`
- Lint skill: `.claude/skills/wiki-lint/`
- Templates (for saving): `.claude/skills/wiki-ingest/templates/`

---

# Wiki Query (TR)

LLM Wiki'de arama yapar ve kaynaklarla birlikte sentezlenmis cevap uretir.

## Kullanim

```
/wiki-query Room ile ilgili bilinen sorunlar neler?
/wiki-query En sorunlu moduller hangileri?
/wiki-query IAP modulunde son bug'lar
```

## Ne Olur

1. `index.md`'yi okuyarak ilgili sayfalari bulur (RAG altyapisi gerekmez)
2. Ilgili sayfalari okur (genellikle 3-10 sayfa)
3. Uygun formatta sentezlenmis cevap uretir
4. Iyi cevaplari wiki'ye kaydetmeyi onerir

## Biriken Bilgi

Iyi cevaplar wiki'ye geri kaydedilebilir. Sordugumuz sorular da ingest edilen kaynaklar gibi bilgi tabaninda birikerek buyur.

# Memex

Yapay zeka destekli geliştirme için kalıcı ve biriken bir bilgi tabanı.

RAG gibi her sorguda bilgiyi sıfırdan türetmek yerine, LLM yapılandırılmış bir wiki'yi adım adım oluşturur ve bakımını yapar. Eklenen her kaynak ve sorulan her soru wiki'yi daha zengin yapar. LLM tüm sıkıcı defter tutma işlerini üstlenir — çapraz referanslar, özetler, çelişkiler, tutarlılık — böylece bilgi tabanı gerçekten bakımlı kalır.

[Karpathy'nin LLM Wiki pattern'inden](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) ve [Vannevar Bush'un Memex vizyonundan (1945)](https://en.wikipedia.org/wiki/Memex) esinlenmiştir.

**[English README](README.md)**

## Neden

İnsanlar wiki'leri terk eder çünkü bakım yükü değerinden hızlı büyür. LLM'ler sıkılmaz, çapraz referans güncellemeyi unutmaz ve tek seferde 15 dosyaya dokunabilir. Wiki bakımlı kalır çünkü bakım maliyeti neredeyse sıfırdır.

**Çözdüğü sorunlar:**

- **Dağınık Jira ticket'ları** — Çapraz referanslar ilgili bug'ları, feature'ları ve araştırmaları bağlar
- **Kaybolan debug oturumları** — Her debug oturumu kalıcı bir investigation sayfası olur
- **Eksik feature context'i** — Bu neden böyle yapıldı? Hangi alternatifler reddedildi?
- **Görünmeyen pattern'ler** — "Son 6 ayda 5 Room migration bug'ı yaşadık" otomatik ortaya çıkar

## Hızlı Başlangıç

### Önkoşullar

- [Claude Code](https://claude.ai/code) (CLI, Desktop veya IDE extension)
- Node.js 18+ (hook script için)

### Kurulum

```bash
claude plugins install github:barisatalay/memex
```

### İlk Kullanım

Kurulumdan sonra projenizde üç komuttan birini çalıştırın:

```
/wiki-ingest                    # Mevcut oturumun bilgisini yakala
/wiki-query Room migration bugs # Wiki'de ara
/wiki-lint                      # Sağlık kontrolü
```

İlk `/wiki-ingest`'te plugin projenizde `.claude/wiki/` dizinini schema ve boş navigasyon dosyalarıyla oluşturur.

## Komutlar

### `/wiki-ingest [tip] [jira-ticket] [--batch] [--quick]`

Mevcut oturumdan bilgiyi wiki sayfalarına yakalar.

```
/wiki-ingest                      # Tipi otomatik belirle, etkileşimli mod
/wiki-ingest bug GT-5769          # Bu ticket için bug sayfası oluştur
/wiki-ingest investigation        # Debug oturumunu kaydet
/wiki-ingest feature GT-5769      # Feature kararlarını dokümante et
/wiki-ingest --quick              # Tartışma atla, hızlı kayıt
/wiki-ingest --batch GT-1 GT-2    # Çoklu kaynak, az etkileşim
```

**Etkileşimli mod** (varsayılan): LLM anahtar çıkarımlarını sunar, siz neyin vurgulanacağını yönlendirirsiniz.

### `/wiki-query <soru>`

Wiki'de arama yapar ve kaynaklarla birlikte sentezlenmiş cevap üretir.

```
/wiki-query Room ile ilgili bilinen sorunlar neler?
/wiki-query En sorunlu modüller hangileri?
/wiki-query Coroutines vs RxJava karşılaştırması
```

İyi cevaplar wiki'ye geri kaydedilebilir — keşifleriniz de ingest edilen kaynaklar gibi birikir.

### `/wiki-lint`

10 sağlık kontrolü çalıştırır: stale sayfalar, geçersiz kılınmış iddialar, yetim sayfalar, kırık linkler, düşük güven, eksik referanslar, pattern fırsatları, çelişkiler, eksik sayfalar, schema uyumu.

## Mimari

### Üç Katman

```
Ham Kaynaklar        Wiki                    Schema
(değişmez)           (LLM yönetir)           (birlikte evrilir)
─────────────        ─────────────           ─────────────
Jira ticket'ları →   bugs/                   WIKI-SCHEMA.md
Git geçmişi     →    investigations/         kuralları,
Oturumlar       →    features/              iş akışlarını ve
Crash log'lar   →    patterns/              cascade davranışını
                     concepts/              tanımlar
                     entities/
                     index.md
                     log.md
                     overview.md
```

- **Ham Kaynaklar** — Değişmez. LLM okur ama asla değiştirmez. Jira, Git, oturumlar, crash log'lar.
- **Wiki** — LLM'in ürettiği markdown sayfalar. LLM bu katmanın tamamen sahibidir.
- **Schema** — `WIKI-SCHEMA.md` kuralları ve iş akışlarını tanımlar. LLM ile birlikte zamanla evrilir.

### Roller

- **İnsan:** Kaynak sağlar, analizi yönlendirir, iyi sorular sorar, anlamını düşünür.
- **LLM:** Özetler, çapraz referanslar, dosyalar, defter tutar — wiki'nin tüm yazımından ve bakımından sorumludur.

### Cascade Güncellemeler

Bir sayfa oluşturulduğunda veya güncellendiğinde üç fazlı cascade tetiklenir:

1. **Mekanik** — `index.md`, `log.md`, `overview.md` güncelle (deterministik)
2. **Semantik** — İlgili sayfaları incele: güçlendir/zayıflat/revize et/çelişkileri işaretle (LLM yargısı)
3. **Bütünsel** — Pattern fırsatlarını tespit et, sentezleri güçlendir (LLM yargısı)

Tek bir ingest tipik olarak 5-15 wiki sayfasına dokunur.

### Context Enjeksiyonu

Hook script `SessionStart` ve `PreCompact` event'lerinde çalışır. `overview.md` ve `index.md` okuyarak wiki context'ini her oturuma enjekte eder — sadece gerçek içerik olduğunda. Boş wiki'ler sıfır overhead üretir.

## Sayfa Tipleri

| Tip | Dizin | Amaç |
|-----|-------|------|
| Bug | `bugs/` | Çözülmüş bug'lar — root cause, fix, referanslar |
| Investigation | `investigations/` | Debug oturumları — sonuca ulaşmamış da olabilir |
| Feature | `features/` | Feature kararları — neden, alternatifler, trade-off'lar |
| Pattern | `patterns/` | Tekrarlayan sorun sentezleri (yaşayan belgeler) |
| Entity | `entities/` | Modül/component referans sayfaları |
| Concept | `concepts/` | Mimari kavramlar ve prensipler |

Her sayfanın `type`, `status`, `confidence`, `sources`, `modules` ve `tags` içeren YAML frontmatter'ı vardır.

Sayfalar `[[wikilink]]`'ler ile birbirine bağlanır — birbirine bağlı bir bilgi grafı oluşturur.

## Ölçeklenme

| Ölçek | Strateji |
|-------|----------|
| Küçük (~50 sayfa) | `index.md` yeterli. LLM doğrudan okur. |
| Orta (~100-300 sayfa) | `index.md` + tags/modules filtreleme. Düzenli lint çalıştırma. |
| Büyük (300+ sayfa) | MCP server üzerinden lokal arama motoru (FTS5, qmd) entegre et. |

## Opsiyonel: Obsidian Entegrasyonu

Wiki sadece git repo'sundaki markdown dosyalarıdır. [Obsidian](https://obsidian.md/)'da açarak:

- **Graph view** — Wiki'nin şeklini, hub'ları ve yetimleri görün
- **Wikilink navigasyonu** — `[[link]]`'lere tıklayarak gezinin
- **Dataview plugin** — Frontmatter sorgularıyla dinamik tablolar

## Katkıda Bulunanlar

- [Andrej Karpathy](https://github.com/karpathy) — LLM Wiki pattern
- [Vannevar Bush](https://en.wikipedia.org/wiki/As_We_May_Think) — Memex konsepti (1945)

## Lisans

MIT

# Memex - Flow Diagram

Bu dokuman, Memex plugin'inin uc temel isleminin (ingest, query, lint) akis semasini gosterir.

## Genel Bakis

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
              | Bilgi     |   | Arama &   |   | Saglik    |
              | Yakalama  |   | Sentez    |   | Kontrolu  |
              +-----------+   +-----------+   +-----------+
                     |               |               |
                     +-------+-------+-------+-------+
                             |               |
                             v               v
                      .claude/wiki/     index.md
                      (proje icinde)    log.md
                                        overview.md
```

---

## 1. Wiki Ingest Akisi

Bilgiyi yakalayip wiki sayfasina donusturur ve cascade guncelleme tetikler.

```
  Kullanici
     |
     |  /wiki-ingest [type] [ticket] [--batch] [--quick]
     v
+--------------------+
| Wiki mevcut mu?    |-----> Hayir ----> wiki-init/ sablonlarini
| (.claude/wiki/)    |                   .claude/wiki/ icine kopyala
+--------------------+                          |
     | Evet                                     |
     v <----------------------------------------+
+--------------------+
| WIKI-SCHEMA.md ve  |
| ingest kurallarini |
| oku                |
+--------------------+
     |
     v
+--------------------+
| Sayfa tipini belirle|
| bug / investigation |
| feature / pattern   |
| concept / entity    |
+--------------------+
     |
     v
+--------------------+     +------------------+
| --quick mi?        |---->| Evet: Direkt     |
|                    |     | sayfa olustur    |
+--------------------+     +------------------+
     |                              |
     | Hayir (interaktif)           |
     v                              |
+--------------------+              |
| Kullaniciya anahtar|              |
| bulgulari sun,     |              |
| ne vurgulanacagini |              |
| sor                |              |
+--------------------+              |
     |                              |
     v                              |
+--------------------+ <-----------+
| Sablondan sayfa    |
| olustur            |
| (YAML frontmatter) |
| title, type,       |
| status, confidence,|
| sources, modules,  |
| tags               |
+--------------------+
     |
     v
+==============================================+
|           CASCADE GUNCELLEME                  |
|           (3 Faz)                             |
|                                               |
|  +----------------------------------------+  |
|  | FAZ 1: Mekanik (Deterministik)         |  |
|  | - index.md guncelle                    |  |
|  | - log.md guncelle                      |  |
|  | - overview.md guncelle                 |  |
|  +----------------------------------------+  |
|                    |                          |
|                    v                          |
|  +----------------------------------------+  |
|  | FAZ 2: Semantik (LLM Yargilama)       |  |
|  | - Ilgili sayfalari bul                 |  |
|  |   (ayni modul/tag/wikilink)            |  |
|  | - Baglantilari guclendir/zayiflat      |  |
|  | - Celiskileri isaretle                  |  |
|  | - Eksik entity sayfalarini oner        |  |
|  +----------------------------------------+  |
|                    |                          |
|                    v                          |
|  +----------------------------------------+  |
|  | FAZ 3: Holistik (LLM Yargilama)       |  |
|  | - Patern firsatlarini tespit et        |  |
|  | - Sentezleri guclendir                 |  |
|  | - Iliskili sayfalari guncelle          |  |
|  +----------------------------------------+  |
|                                               |
|  Tipik etki: 5-15 sayfa guncellenir          |
+==============================================+
```

---

## 2. Wiki Query Akisi

Wiki'yi arar ve kaynakli cevaplar sentezler.

```
  Kullanici
     |
     |  /wiki-query <soru>
     v
+--------------------+
| index.md oku       |
| (sayfa haritasi)   |
+--------------------+
     |
     v
+--------------------+
| Wikilink'ler ile   |
| ilgili sayfalari   |
| bul                |
+--------------------+
     |
     v
+--------------------+
| Soru tipine gore   |
| format sec:        |
| - Markdown         |
| - Karsilastirma    |
|   tablosu          |
| - Saglik raporu    |
| - Liste            |
+--------------------+
     |
     v
+--------------------+
| Kaynakli cevap     |
| sentezle           |
| (Source: GT-XXXX)  |
+--------------------+
     |
     v
+--------------------+     +------------------+
| Cevap wiki'ye      |---->| Evet: /wiki-     |
| kaydedilsin mi?    |     | ingest ile       |
| (kullaniciya sor)  |     | yeni sayfa       |
+--------------------+     | olustur          |
     |                     +------------------+
     | Hayir
     v
  [Bitti]
```

---

## 3. Wiki Lint Akisi

11 saglik kontrolu calistirir ve sorunlari raporlar.

```
  Kullanici
     |
     |  /wiki-lint
     v
+--------------------+
| Tum wiki           |
| sayfalarini tara   |
+--------------------+
     |
     v
+------------------------------------------------------+
|                  11 SAGLIK KONTROLU                   |
|                                                       |
|  +--------------------------------------------------+|
|  | 1. Bayat Sayfalar                                ||
|  |    30+ gun guncellenmemis sayfalar               ||
|  +--------------------------------------------------+|
|  | 2. Gecersiz Killinmis Iddialar                   ||
|  |    Daha yeni bilgiyle celisen eski iddialar      ||
|  +--------------------------------------------------+|
|  | 3. Yetim Sayfalar                                ||
|  |    Hicbir sayfadan baglanti almayan sayfalar     ||
|  +--------------------------------------------------+|
|  | 4. Kirik Baglantilar                             ||
|  |    Var olmayan sayfalara [[wikilink]]'ler        ||
|  +--------------------------------------------------+|
|  | 5. Dusuk Guvenilirlik                            ||
|  |    confidence: low olan sayfalar                 ||
|  +--------------------------------------------------+|
|  | 6. Eksik Referanslar                             ||
|  |    Kaynak belirtilmemis iddialar                 ||
|  +--------------------------------------------------+|
|  | 7. Patern Firsatlari                             ||
|  |    3+ benzer bug -> patern sayfasi onerisi       ||
|  +--------------------------------------------------+|
|  | 8. Celiskiler                                    ||
|  |    Birbiriyle celisen iddialar                   ||
|  +--------------------------------------------------+|
|  | 9. Eksik Entity/Concept Sayfalari                ||
|  |    Cok referans edilen ama sayfasi olmayan       ||
|  +--------------------------------------------------+|
|  | 10. Sema Uyumlulugu                              ||
|  |     Frontmatter kurallarini ihlal eden sayfalar  ||
|  +--------------------------------------------------+|
|  | 11. Eksik Kaynaklar                              ||
|  |     (Source: ...) etiketi olmayan iddialar       ||
|  +--------------------------------------------------+|
+------------------------------------------------------+
     |
     v
+--------------------+
| Sorunlari          |
| oncelik sirasina   |
| gore raporla       |
+--------------------+
     |
     v
+--------------------+
| Duzeltme onerileri |
| sun                |
+--------------------+
```

---

## Context Injection (Otomatik)

Her oturumda wiki baglami otomatik olarak enjekte edilir.

```
+------------------+     +------------------------+
| SessionStart     |     | PreCompact             |
| (oturum basladi) |     | (context daraliyor)    |
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
          | mevcut mu?             |----> Hayir ----> [Hicbir sey yapma]
          +------------------------+
                       |
                       | Evet
                       v
          +------------------------+
          | overview.md ve         |
          | index.md oku           |
          +------------------------+
                       |
                       v
          +------------------------+
          | Icerik var mi?         |
          | (wikilink veya         |----> Hayir ----> [Sifir ek yuk]
          | liste ogesi)           |
          +------------------------+
                       |
                       | Evet
                       v
          +------------------------+
          | Wiki baglamini         |
          | oturuma enjekte et     |
          +------------------------+
```

---

## Roller

```
+---------------------------+          +---------------------------+
|         INSAN             |          |          LLM              |
+---------------------------+          +---------------------------+
| - Kaynaklari yonlendirir  |  ------> | - Ozetler                |
| - Analizi yonlendirir     |          | - Capraz referans yapar  |
| - Iyi sorular sorar       |          | - Dosyalar ve duzenler   |
| - Anlam uzerine dusunur   |          | - Tutarlilik saglar      |
|                           |  <------ | - Wiki'yi yazar/bakar    |
+---------------------------+          +---------------------------+
```

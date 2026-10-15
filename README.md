# ANKU EEE Materials

1. sınıf öğrencileri için sade bir materyal portalı. Dersler ve dosyalar doğrudan **"ANKU EEE Materials"** Google Drive klasöründen okunur. Site Drive'da hiçbir şeyi değiştirmez.

## Nasıl çalışır?
- Sol menü = Drive klasöründeki **ders klasörleri** (alt klasörleriyle birlikte). Boş klasörler "Henüz dosya yok" olarak gösterilir.
- Bir dosyaya tıklayınca ortada büyük olarak açılır: PDF, Word/Google Docs, PowerPoint/Google Slides, video, resim.
- **YouTube videoları** şu durumlarda site içinde oynatılır:
  - dosya adında veya Drive açıklamasında YouTube linki varsa,
  - `.url` / `.webloc` / `.txt` dosyasının içinde YouTube linki varsa,
  - Google Docs belgesinin içinde YouTube linkleri varsa (üstte "Video 1, Video 2…" butonları çıkar).

## Kurulum (bir kerelik)
1. Drive'da klasörün paylaşımı: **Bağlantıya sahip olan herkes – Görüntüleyen**.
2. Google Cloud Console'da **Google Drive API**'yi etkinleştirip bir **API anahtarı** oluşturun.
3. Siteyi açın → ⚙️ Ayarlar → klasör linki + API anahtarı → Kaydet.
   Sınıfla paylaşacaksanız bu iki değeri `index.html` içindeki `CONFIG` bölümüne yazın; böylece kimse ayar yapmak zorunda kalmaz.

## Açma
- **Bilgisayarda:** `baslat.command` dosyasına çift tıklayın (siteyi `http://localhost` üzerinden açar).
  `index.html`'e doğrudan çift tıklarsanız YouTube videoları oynamaz (YouTube Error 153).
- **Sınıfla paylaşma:** Depoyu GitHub'a yükleyip GitHub Pages'i açın. Herkes tek bir linkle erişir.

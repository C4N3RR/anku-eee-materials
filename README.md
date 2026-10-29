# ANKU EEE Materials

1. sınıf öğrencileri için sade bir materyal portalı. Dersler ve dosyalar doğrudan **"ANKU EEE Materials"** Google Drive klasöründen okunur. Site Drive'da hiçbir şeyi değiştirmez.

## Nasıl çalışır?
- Sol menü = Drive klasöründeki **ders klasörleri** (alt klasörleriyle birlikte). Boş klasörler "Henüz dosya yok" olarak gösterilir.
- Bir dosyaya tıklayınca ortada büyük olarak açılır: PDF, Word/Google Docs, PowerPoint/Google Slides, video, resim.
- **YouTube videoları** şu durumlarda site içinde oynatılır:
  - dosya adında veya Drive açıklamasında YouTube linki varsa,
  - `.url` / `.webloc` / `.txt` dosyasının içinde YouTube linki varsa,
  - Google Docs belgesinin içinde YouTube linkleri varsa (üstte "Video 1, Video 2…" butonları çıkar).



## İstekler ve yönetim paneli

Site ve öneri formu öğrenciler için hesapsız açıktır. Sağ üstteki **Ayarlar → Admin girişi** üzerinden yetkili yönetici hesabı e-posta ve şifreyle giriş yapar.

Panelde dersler, sınıf/dönem yerleşimi, kitap/not/site bağlantıları, öğretim görevlileri, takvim, sol menü bağlantıları ve site adı/açıklaması düzenlenebilir. **Taslağa kaydet** düzenlemeyi panelde tutar; **Değişiklikleri yayımla** tüm ziyaretçilere açar. Gelen öneriler yalnızca yöneticiye görünür; durumları ayrıca kaydedilir. Drive materyallerinin portalda görünen adı değiştirilebilir, materyaller gizlenip yeniden gösterilebilir; Drive'daki asıl dosyalar değiştirilmez. Yeni dosyalar mevcut Drive klasörüne yüklenebilir veya panelden paylaşıma açık bağlantı olarak eklenebilir.

`portal-config.js` yalnızca Supabase proje URL'sini ve herkese açık publishable anahtarını içerir. Yönetici şifresi, oturum anahtarları veya service-role anahtarı repoya yazılmaz. Veritabanı yapısı `admin/schema.sql` içindedir; bu dosya yeni bir proje için ilk kurulumdur. Yönetici e-postaları `portal_admins` tablosunda tutulur ve ziyaretçilerce okunamaz. Satır güvenliği ve sunucudaki fonksiyonlar yazma yetkisini denetler. İçerikler revizyon kontrolüyle yayımlanır; aynı anda yapılan değişiklikler sessizce birbirinin üzerine yazılmaz.

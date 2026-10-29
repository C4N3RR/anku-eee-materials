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


## Google Drive sunucu aracısı

Google Drive API anahtarı yalnızca Supabase Edge Function Secrets içindeki `GOOGLE_DRIVE_API_KEY` (bu projede `Google_Drive_API` adı da desteklenir) değerinde saklanır. Anahtar Google Cloud'da yalnızca Google Drive API'ye izin vermelidir; web sitesi/referrer kısıtı sunucudan gelen çağrıları engeller. Anahtarı HTML, JavaScript, SQL tabloları, Git veya `.env` dosyalarıyla yayımlamayın. Önceden istemcide kullanılmış anahtarın Git geçmişindeki kopyalarını geçersiz kılmak için Google Cloud'da eski anahtarı devre dışı bırakın.

`supabase/functions/drive-proxy/index.ts`, portalın sabit kök klasörünü tarar ve yalnızca bu ağaçtaki dosyalar için okuma/akış sağlar. İstemci Google sorgusu, kök klasör veya anahtar belirleyemez. Sunucu kısa süreli önbellek, istek sınırı ve eşzamanlılık sınırı uygular; Google hata ayrıntılarını istemciye iletmez. Materyaller herkese açık olduğu için bu fonksiyonun JWT doğrulaması kapalıdır; yönetim panelinin veritabanı yetkileri aynı şekilde korunur.

CLI ile yayımlama: `supabase functions deploy drive-proxy --project-ref heuxjlefnwxdqfskriso`. Secrets değerini Supabase panelinden girin. Kontroller: `deno check supabase/functions/drive-proxy/index.ts` ve `deno test --allow-env supabase/functions/drive-proxy/index_test.ts`.

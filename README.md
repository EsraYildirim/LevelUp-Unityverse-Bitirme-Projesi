# LevelUp — Unityverse Bitirme Projesi

Konsol, oyun ve aksesuar satan bir e-ticaret sitesi. Vue 3 arayüz, Express API
ve MySQL veritabanından oluşur. Ziyaretçi ürünleri gezip sipariş verebilir,
yönetici ise paneli üzerinden ürün, kullanıcı, sipariş ve mesajları yönetir.

## Giriş bilgileri

| Rol | E-posta | Parola |
|---|---|---|
| Yönetici (`/admin`) | `admin@example.com` | `admin1234` |
| Kullanıcı (`/hesabim`) | `zeynep.aydin@example.com` | `zeynep2026` |

Okul projesi olduğu için veriler örnek kayıtlardır, parolalar düz metin tutulur.

## Teknolojiler

Vue 3 (Composition API), Vue Router, Vite, Bootstrap 5 · Node.js, Express 5,
mysql2 · MySQL

## Kurulum

Gereken: Node.js 18+ ve MySQL.

```bash
# 1. Veritabanı (tablolar + örnek veriler)
mysql -u root -p < backend/database.sql

# 2. Sunucu → localhost:3001
cd backend && npm install
cp .env.example .env      # MySQL kullanıcı adı ve parolanızı yazın
npm start

# 3. Arayüz → localhost:5173
cd frontend && npm install && npm run dev
```

## Sayfalar

`/` anasayfa · `/urunler` arama ve kategori filtresi · `/odeme` sepet ve sipariş ·
`/hakkimizda` · `/iletisim` harita ve mesaj formu · `/giris` `/kayit` ·
`/hesabim` kullanıcının siparişleri · `/admin` yönetim paneli

Yönlendirici koruması var: `/admin` yalnızca yöneticiye, `/hesabim` yalnızca
kullanıcıya açık; yetkisiz giriş 403 sayfasına düşer.

## API uçları

Sunucu `localhost:3001` üzerinde çalışır. `GET` uçları tarayıcıdan açılabilir
(örn. <http://localhost:3001/api/products>).

| Kaynak | Uçlar |
|---|---|
| Ürünler | `GET /api/products` · `GET /api/products/:id` · `POST /api/products` · `PUT /api/products/:id` · `DELETE /api/products/:id` |
| Kullanıcılar | `GET /api/users` · `GET /api/users/:id` · `POST /api/register` · `POST /api/login` · `POST /api/users` · `PUT /api/users/:id` · `DELETE /api/users/:id` |
| Siparişler | `GET /api/orders` · `POST /api/orders` · `PUT /api/orders/:id` · `DELETE /api/orders/:id` |
| Mesajlar | `GET /api/messages` · `POST /api/contact` · `PUT /api/messages/:id` · `DELETE /api/messages/:id` |
| Diğer | `POST /api/upload` görsel yükleme · `GET /api/hello` · `GET /api/students` |

Sipariş oluşturulurken sunucu stoğu doğrular, yetmiyorsa reddeder; kaydettikten
sonra satılan adedi stoktan düşer.

## Veritabanı

Veritabanı adı `levelup`. Tablolar: `products` (9), `users` (5), `orders` (4),
`messages` (4), `students` (3).

Her sütun ait olduğu tablonun baş harfiyle başlar — `p_` ürünler, `u_`
kullanıcılar, `o_` siparişler, `m_` mesajlar. Böylece `JOIN` yaparken isim
çakışması olmaz.

```bash
mysql -u root -p levelup
SHOW TABLES;  DESCRIBE products;  SELECT * FROM products;
```

| Dosya | Açıklama |
|---|---|
| `database.sql` | Sıfırdan kurulum: şema + örnek veriler |
| `sorgu-ornekleri.sql` | Ders örnekleri. **Tek tek** çalıştırın, toptan değil |
| `migration-*.sql` | Veritabanının adım adım gelişimi (dosya adlarındaki sıraya göre) |

## Klasör yapısı

```
backend/    server.js (API) · db.js (bağlantı) · *.sql
frontend/src/
  views/        sayfalar          components/admin/  panel sekmeleri
  components/   ortak bileşenler  components/examples/  ders örnekleri
  utils/        fiyat, tarih, doğrulama, oturum, iletişim yardımcıları
```

## Notlar

- Bu README yapay zekâ ile yazılmıştır.
- Arayüzdeki bazı görsel düzenlemeler ve fikirler yapay zekâdan alınmıştır.
- Ürün görselleri Nintendo'nun ürün sayfalarından alınmıştır; yalnızca bu okul
  projesi kapsamında, ilgili ürünü göstermek için kullanılmıştır.

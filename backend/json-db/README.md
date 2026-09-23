# json-db (arşiv)

Bu klasördeki JSON dosyaları, proje **MySQL'e geçmeden önceki** veri kaynağıydı.
Backend o zaman `fs.readFileSync("products.json")` ile bu dosyaları okuyordu.

Artık kullanılmıyorlar — veriler `levelup` veritabanında tutuluyor.
Derste ilk halini karşılaştırabilmek için saklanıyorlar.

Şemayı görmek için: [`../database.sql`](../database.sql)

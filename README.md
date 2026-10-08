# Triple Biotix: Landing Page

Laman statik (HTML/CSS/JS sahaja). Buka `index.html` terus, atau upload seluruh folder ke mana-mana hosting.

## Perkara yang perlu diedit
- **Nombor WhatsApp, harga & pakej**: `assets/js/main.js` → objek `CONFIG` di bahagian atas.
- **Tempoh countdown**: `CONFIG.promoSeconds` (lalai 1j 32m 10s). Countdown dikira untuk setiap pelawat dan berulang dari awal bila tamat.

## Gambar yang perlu ditambah (letak dalam `assets/img/`)
| Fail | Kegunaan |
|---|---|
| `sijil-kkm.webp` | Sijil KKM (bahagian Solusi) |
| `sijil-halal.webp` | Sijil HALAL (bahagian Solusi) |
| `luckydraw.webp` | Poster Lucky Draw |
| `testimoni-2.webp`, `testimoni-3.webp`, ... | Testimoni. Tambah satu `<figure class="tcard reveal" data-lightbox="...">` dalam `#testiGrid` di `index.html` dan buang kad placeholder |

Gambar sijil & lucky draw akan muncul secara automatik sebaik sahaja fail diletakkan dengan nama di atas.

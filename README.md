# Vương Giả Vạn Tượng Kỳ Quán

Wiki cộng đồng Việt hóa cho game 王者万象棋. Trang tĩnh (HTML/CSS/JS thuần), không cần cài Node.

## Chạy thử

Chạy `serve.bat` (cần Python 3) rồi mở http://localhost:8080. Không mở trực tiếp file `index.html` vì trang đọc dữ liệu bằng `fetch`.

## Cấu trúc

```
index.html              Tra cứu (trang chủ)
ky-thu/                 Kỳ thủ (nhân vật người chơi): hồ sơ, năng lực, bài riêng, trang phục
doi-hinh/               Đội hình hot (đang chờ dữ liệu)
xep-doi-hinh/           Xếp đội hình (đang chờ luật game)
cap-nhat/               Cập nhật (đang chờ tin)
assets/css/             tokens.css (màu, chữ) · base.css · codex.css (Tra cứu) · kythu.css (Kỳ thủ) · page.css
assets/js/main.js       Điểm khởi chạy của Tra cứu: nơi duy nhất tạo và nối các lớp (composition root)
assets/js/ky-thu-main.js Điểm khởi chạy của trang Kỳ thủ (cùng vai trò)
assets/js/core/         Emitter (sự kiện), dom (hàm DOM dùng chung)
assets/js/domain/       Card, CardGroup, CardKind, Catalog, Player, PlayerCard: mô hình dữ liệu thuần, không biết DOM hay mạng
assets/js/data/         Đọc và dựng dữ liệu: HttpJsonSource, JsonCatalogRepository, CardMapper, ImageUrlPolicy; JsonPlayerRepository, PlayerMapper
assets/js/services/     Định tuyến (Route, PlayerRoute, HashRouter), tìm kiếm (CardSearch), clipboard, tiêu đề trang, phím tắt
assets/js/ui/           Thành phần giao diện: TabBar, SearchBox, ChapterRail, CardList, CardTile, CardViewer, BottomSheet...; PlayerRoster (carousel), PlayerBanner, PlayerAbilities, PlayerCardGrid, PlayerCardTile, PlayerCardDetail
assets/js/app/          WikiApp (Tra cứu), PlayersApp (Kỳ thủ): điều phối trạng thái và nối các thành phần
assets/vendor/swiper/    Swiper 11 (MIT), thư viện carousel; chính trang chính thức cũng dùng Swiper. Chép sẵn vào dự án, không tải từ CDN
assets/img/             mark-192/384.webp (huy hiệu logo), poster-640.webp, favicon-64.png
assets/img/source/      logo-poster.png: ảnh logo gốc do chủ site cung cấp (crop ra các bản trên)
data/bai/               Dữ liệu bài gốc: anh-hung, hieu-ung, thien-phu, trang-bi (.json)
data/dich/              Bản dịch tiếng Việt, cùng tên file với data/bai; README.md (quy tắc dịch), thuat-ngu.json
data/anh/               Ảnh bài tải về (PNG gốc cho agent, web/ là webp cho trang), manifest.json, theo-url.json, README.md
scripts/                tai_anh.py (tải ảnh bài), crawl_ky_thu.py (lấy dữ liệu và ảnh Kỳ thủ), tao_anh_web.py (tạo webp cho trang), gop_ban_dich.py và gop_ky_thu.py (gộp, kiểm tra bản dịch), serve.py (máy chủ thử)
data/nhom.json          Tên tiếng Việt của khu vực / bậc / nhóm
data/ky-thu.json        Dữ liệu Kỳ thủ (chữ Trung) do scripts/crawl_ky_thu.py sinh; bản dịch ở data/dich/ky-thu.json
data/ref/ky-thu/        Bản gốc lấy từ trang chính thức, để tham chiếu (không dùng trực tiếp)
PRODUCT.md              Bối cảnh sản phẩm (cho công cụ thiết kế)
```

## Kỳ thủ

Thanh chọn kỳ thủ dùng Swiper (kéo, vuốt, mũi tên); các thành phần còn lại là JS thuần như trang Tra cứu. Bài của kỳ thủ hiện dạng lưới icon, bấm một icon thì mô tả hiện ngay phía trên lưới, nên kỳ thủ có hàng chục bài (Hương Hương, Doanh Luật) cũng không kéo trang dài ra.

Trang `ky-thu/` lấy từ trang 3 của wxq.qq.com. Dữ liệu do `py scripts/crawl_ky_thu.py` lấy (danh sách kỳ thủ, kỹ năng, bí kỹ, bài riêng, trang phục; nguồn ghi trong đầu script), rồi `py scripts/tao_anh_web.py` tạo webp. Chạy lại hai lệnh này khi game cập nhật kỳ thủ mới, sau đó dịch phần mới (`py scripts/gop_ky_thu.py --kiem-tra` cho biết còn thiếu gì; định dạng ở `data/dich/README.md`, mục Kỳ thủ).

## Bản dịch

Đã dịch đủ 511 lá bài (Anh Hùng 85, Hiệu Ứng 98, Thiên Phú 255, Trang Bị 73) từ chữ in trên ảnh, do agent dịch và **chưa có người duyệt**. Mở `data/dich/<loai>.json` để sửa; khóa là **tên tiếng Trung** của bài:

```json
{
  "干将莫邪": {
    "ten": "Can Tương Mạc Tà",
    "mo_ta": "Khi Can Tương Mạc Tà có mặt trên sân, nhận Trang bị thường Song Kiếm · Hùng.",
    "ban": { "2": { "ten": "Song Kiếm · Hùng", "mo_ta": "Tốc độ đánh +30%. ..." } }
  }
}
```

- `ten` là tên Việt. Thiếu thì trang hiện tên Trung và nhãn "Chưa Việt hóa".
- `mo_ta` là mô tả in trên bản 1. `ban` (tùy chọn) là mô tả của các bản ảnh còn lại (số bản là khóa); bản đó có `ten` khi tên in trên ảnh khác tên lá bài. Trang đổi mô tả theo bản đang xem.
- `ghi_chu` là chỗ agent không chắc, để người duyệt tìm (`grep ghi_chu`). Trang không hiển thị.
- Quy tắc dịch, thuật ngữ, cách agent làm việc: `data/dich/README.md`. Bảng tên đã chốt: `data/dich/thuat-ngu.json`.
- Khi sửa tay xong, chạy `py scripts/gop_ban_dich.py --kiem-tra` để kiểm tra khóa, số bản, và ảnh dùng chung có cùng bản dịch (bỏ `--kiem-tra` để ghi).
- Tên khu vực/bậc/nhóm sửa trong `data/nhom.json` (các nhóm của Trang Bị là đề xuất, chưa được duyệt).

## Ảnh

Toàn bộ ảnh (962 PNG, khoảng 190 MB) được lưu ở `data/anh/` bằng `py scripts/tai_anh.py` (chỉ dùng thư viện chuẩn của Python; chạy lại để tải phần còn thiếu, `--lai` để tải lại tất cả). Quy tắc đặt tên và cách tra qua `data/anh/manifest.json` nằm ở `data/anh/README.md`.

Trang web dùng bản webp nhẹ trong `data/anh/web/` (khoảng 40 MB, tạo bằng `py scripts/tao_anh_web.py`, cần Pillow), không còn gắn ảnh từ Tencent. Lưới dùng ảnh thu nhỏ 320px, khung xem dùng ảnh đầy đủ. `LocalImagePolicy` (`assets/js/data/LocalImagePolicy.js`) đổi link Tencent trong `data/bai` sang ảnh cục bộ qua `data/anh/theo-url.json`; link nào chưa có bản cục bộ thì vẫn dùng link gốc. Khi đưa site lên host chỉ cần `data/anh/web/` và `theo-url.json`, không cần PNG gốc. `TencentImagePolicy` vẫn còn nếu muốn quay lại gắn ảnh từ Tencent (đổi một dòng trong `main.js`).

## Chữ

Anton (tiêu đề in hoa), Lobster (chữ viết tay điểm nhấn, đi cặp với Anton như trên logo), Chakra Petch (chú thích nhỏ và số), Be Vietnam Pro (nội dung). Tất cả tải từ Google Fonts và có đủ dấu tiếng Việt.

## Kiến trúc mã (OOP, SOLID)

- **Một lớp một việc.** Mô hình dữ liệu (`domain`), đọc dữ liệu (`data`), dịch vụ (`services`), giao diện (`ui`) và điều phối (`app`) tách riêng. Mỗi thành phần giao diện chỉ lo một vùng của trang.
- **Phụ thuộc vào hợp đồng, không vào chi tiết.** `WikiApp` nhận mọi thứ qua hàm khởi tạo (repository, router, tìm kiếm, clipboard...), không tự gọi `fetch`, `location` hay `querySelector`. Các thành phần giao diện không biết ai đang nghe, chúng chỉ phát sự kiện (`Emitter`).
- **Mở rộng không sửa mã cũ.**
  - Thêm loại bài mới: thêm một khối vào `data/nhom.json` cùng hai file trong `data/bai/` và `data/dich/`. `anhDaiDien` là `"icon"` nếu `anh_icon` là icon thật, `"card"` nếu chỉ là huy hiệu bậc.
  - Đổi cách lấy ảnh (ví dụ sang CDN khác): viết một lớp mới kế thừa `ImageUrlPolicy` (thumb, full, icon) rồi đổi một dòng trong `main.js`.
  - Đổi nguồn dữ liệu: viết lớp kế thừa `CatalogRepository`.
- **Chuỗi hiển thị** nằm ở `assets/js/ui/strings.js`.

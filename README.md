# Vương Giả Vạn Tượng Kỳ Quán

Wiki cộng đồng Việt hóa cho game 王者万象棋. Trang tĩnh (HTML/CSS/JS thuần), không cần cài Node.

## Chạy thử

Chạy `serve.bat` (cần Python 3) rồi mở http://localhost:8080. Không mở trực tiếp file `index.html` vì trang đọc dữ liệu bằng `fetch`.

## Cấu trúc

```
index.html              Tra cứu (trang chủ)
ky-thu/                 Kỳ thủ (nhân vật người chơi): hồ sơ, năng lực, bài riêng, trang phục
doi-hinh/               Đội hình đề xuất: danh sách, sơ đồ bàn cờ, lộ trình, mã đội hình
xep-doi-hinh/           Xếp đội hình (đang chờ luật game)
cap-nhat/               Cập nhật (đang chờ tin)
assets/css/             tokens.css (màu, chữ) · base.css · codex.css (Tra cứu) · kythu.css (Kỳ thủ) · doihinh.css (Đội hình) · page.css
assets/js/main.js       Điểm khởi chạy của Tra cứu: nơi duy nhất tạo và nối các lớp (composition root)
assets/js/ky-thu-main.js, doi-hinh-main.js  Điểm khởi chạy của trang Kỳ thủ và Đội hình (cùng vai trò)
assets/js/core/         Emitter (sự kiện), dom (hàm DOM dùng chung)
assets/js/domain/       Card, CardGroup, CardKind, Catalog, Player, PlayerCard, Lineup, LineupGroup: mô hình dữ liệu thuần, không biết DOM hay mạng
assets/js/data/         Đọc và dựng dữ liệu: HttpJsonSource, JsonCatalogRepository, CardMapper, ImageUrlPolicy; JsonPlayerRepository, PlayerMapper; JsonLineupRepository, LineupMapper; JsonKeywordRepository
assets/js/services/     Định tuyến (Route, PlayerRoute, HashRouter), tìm kiếm (CardSearch), clipboard, tiêu đề trang, phím tắt
assets/js/ui/           Thành phần giao diện: TabBar, SearchBox, ChapterRail, CardList, CardTile, CardViewer, BottomSheet...; PlayerRoster (carousel), PlayerBanner, PlayerAbilities, PlayerCardGrid, PlayerCardTile, PlayerCardDetail; LineupList, LineupRow, LineupDetail, LineupBoard, LineupHeroChip
assets/js/app/          WikiApp (Tra cứu), PlayersApp (Kỳ thủ), LineupApp (Đội hình): điều phối trạng thái và nối các thành phần
assets/vendor/swiper/    Swiper 11 (MIT), thư viện carousel; chính trang chính thức cũng dùng Swiper. Chép sẵn vào dự án, không tải từ CDN
assets/img/             mark-192/384.webp (huy hiệu logo), poster-640.webp, favicon-64.png
assets/img/source/      logo-poster.png: ảnh logo gốc do chủ site cung cấp (crop ra các bản trên)
data/bai/               Dữ liệu bài gốc: anh-hung, hieu-ung, thien-phu, trang-bi (.json)
data/dich/              Bản dịch tiếng Việt, cùng tên file với data/bai; README.md (quy tắc dịch), thuat-ngu.json
data/anh/               Ảnh bài tải về (PNG gốc cho agent, web/ là webp cho trang), manifest.json, theo-url.json, README.md
scripts/                tai_anh.py (tải ảnh bài), crawl_ky_thu.py, crawl_doi_hinh.py, crawl_anh_hung.py (lấy dữ liệu Kỳ thủ, Đội hình, chi tiết Anh Hùng), tao_anh_web.py (tạo webp cho trang), gop_ban_dich.py, gop_ky_thu.py, gop_doi_hinh.py, gop_ky_nang.py (gộp, kiểm tra bản dịch), thong_nhat_thuat_ngu.py và gop_ten_moi.py (thống nhất từ khóa và tên), serve.py (máy chủ thử)
data/nhom.json          Tên tiếng Việt của khu vực / bậc / nhóm
data/chi-tiet/          Kỹ năng, chỉ số, các bản của Anh Hùng, logo phe, icon từ khóa (do scripts/crawl_anh_hung.py sinh)
data/tu-khoa.json       13 từ khóa của game (Xuất Trận, Khai Chiến...) và lời giải thích; trang tự tô sáng và chú thích
data/ky-thu.json        Dữ liệu Kỳ thủ (chữ Trung) do scripts/crawl_ky_thu.py sinh; bản dịch ở data/dich/ky-thu.json
data/doi-hinh.json      Dữ liệu Đội hình (chữ Trung) do scripts/crawl_doi_hinh.py sinh; bản dịch ở data/dich/doi-hinh.json
data/ref/ky-thu/        Bản gốc lấy từ trang chính thức, để tham chiếu (không dùng trực tiếp)
PRODUCT.md              Bối cảnh sản phẩm (cho công cụ thiết kế)
```

## Kỳ thủ

Thanh chọn kỳ thủ dùng Swiper (kéo, vuốt, mũi tên); các thành phần còn lại là JS thuần như trang Tra cứu. Bài của kỳ thủ hiện dạng lưới icon, bấm một icon thì mô tả hiện ngay phía trên lưới, nên kỳ thủ có hàng chục bài (Hương Hương, Doanh Luật) cũng không kéo trang dài ra.

Trang `ky-thu/` lấy từ trang 3 của wxq.qq.com. Dữ liệu do `py scripts/crawl_ky_thu.py` lấy (danh sách kỳ thủ, kỹ năng, bí kỹ, bài riêng, trang phục; nguồn ghi trong đầu script), rồi `py scripts/tao_anh_web.py` tạo webp. Chạy lại hai lệnh này khi game cập nhật kỳ thủ mới, sau đó dịch phần mới (`py scripts/gop_ky_thu.py --kiem-tra` cho biết còn thiếu gì; định dạng ở `data/dich/README.md`, mục Kỳ thủ).

## Đội hình

Trang `doi-hinh/` lấy từ trang `teamlist.html` của wxq.qq.com (ba nguồn: Người mới, Tổng hợp, Hot). `py scripts/crawl_doi_hinh.py` lấy dữ liệu về `data/doi-hinh.json` (465 đội hình duy nhất). **Script bỏ hết thông tin cá nhân** trước khi ghi: tên, ảnh và ID tác giả, cùng bình luận của người chơi trong dữ liệu gốc (biệt danh, ID, IP tỉnh) không bao giờ được lưu. Tướng, trang bị, thiên phú, hiệu ứng và kỳ thủ chỉ ghi bằng tên Trung; trang tự tra tên Việt và ảnh từ dữ liệu bài và kỳ thủ. Mã đội hình (`ma`) là chuỗi để sao chép vào game. Dịch phần chữ theo `data/dich/README.md` (mục Đội hình), rồi `py scripts/gop_doi_hinh.py` để gộp và kiểm tra.

## Chi tiết Anh Hùng

Trang Tra cứu, tab Anh Hùng, có ba thẻ cho mỗi Anh Hùng: **Mô tả**, **Kỹ năng** (tên, mô tả và ba mức nâng cấp theo cấp Anh Hùng) và **Chỉ số** (máu, pháp lực, công, phòng, chí mạng, tốc độ đánh, tầm đánh), giống trang 4 của wxq.qq.com. Dữ liệu lấy bằng `py scripts/crawl_anh_hung.py` (cũng tải logo phe và icon từ khóa), rồi `py scripts/tao_anh_web.py`. Bản dịch kỹ năng nằm ở `data/dich/anh-hung.json`, trường `ky_nang`; gộp và kiểm tra bằng `py scripts/gop_ky_nang.py`. Các chấm dưới ảnh lá bài đổi giữa các bản của **cùng một lá** (ví dụ Hàn Tín và Hàn Tín Thức Tỉnh), muốn xem lá khác thì bấm vào ô trong lưới.

## Từ khóa và tên riêng

Mục tiêu của bản dịch là người chơi đọc là hiểu ngay. Từ khóa của game có tên cố định trong `data/tu-khoa.json` (do chủ site duyệt); trang Tra cứu, Kỳ thủ và Đội hình tô sáng chúng trong mô tả và hiện lời giải thích (dưới mô tả, hoặc khi rê chuột). Tên tướng nước ngoài dùng tên quốc tế (Marco Polo, Athena), tên trang bị, thiên phú, hiệu ứng dịch nghĩa thay vì Hán Việt. Bảng đổi tên nằm ở `data/dich/doi-ten.json`. **Sau khi có bản dịch mới, chạy `py scripts/thong_nhat_thuat_ngu.py`** để áp từ khóa, "lượt" (回合) và bảng tên lên mọi tệp; chạy lại thoải mái.

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

## Đưa lên mạng (GitHub Pages)

Site chạy tại https://tranduskp.github.io/wiki-wxq/. Mỗi lần đẩy lên nhánh `main`, workflow `.github/workflows/pages.yml` tự dựng và deploy. Nó chỉ đưa lên những gì trang cần: các trang HTML, `assets/`, `data/bai`, `data/dich`, `data/nhom.json`, `data/ky-thu.json`, `data/anh/web/` và `data/anh/theo-url.json`. Ảnh gốc PNG, dữ liệu tham chiếu `data/ref/`, công cụ và thư mục `.claude/` không được đưa lên (đã gitignore).

Trước khi công khai repo, kiểm tra không có đường dẫn máy cá nhân, email hay khóa API trong các tệp, và đặt email commit là địa chỉ noreply của GitHub (`git config user.email ID+TENUSER@users.noreply.github.com`).

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

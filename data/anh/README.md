# data/anh: ảnh lá bài lưu cục bộ

Bản sao của mọi ảnh được liệt kê trong `data/bai/*.json` (962 ảnh PNG duy nhất, khoảng 190 MB). Do `scripts/tai_anh.py` sinh ra; **không sửa tay, không đổi tên**. Muốn tải lại hoặc bổ sung: `py scripts/tai_anh.py` (bỏ qua ảnh đã có), `--lai` để tải lại tất cả, `--kiem-tra` để chỉ kiểm tra tệp thiếu.

## Quy tắc cho agent

1. **Đừng đoán đường dẫn, hãy tra `manifest.json`.** Mỗi lá bài là một mục trong `manifest.json` → `loai.<loai>[]`:
   ```json
   { "id": "anh-hung/001", "ten_zh": "干将莫邪", "nhom_zh": "大河流域",
     "icon": "anh-hung/icon/001.png",
     "cards": ["anh-hung/001_card1.png", "anh-hung/001_card2.png", "anh-hung/001_card3.png"],
     "tai_duoc": true }
   ```
   Đường dẫn trong manifest tính từ `data/anh/`. `cards[0]` là bản 1, `cards[1]` là bản 2... (trùng thứ tự `anh_card` trong `data/bai`).
2. **Khóa của lá bài là `ten_zh`** (tên Trung, duy nhất trong mỗi loại). Cùng khóa này được dùng trong `data/dich/<loai>.json`.
3. **Ảnh dùng chung chỉ có một tệp.** Nhiều lá bài có thể trỏ tới cùng một tệp (ví dụ trang bị riêng của tướng nằm ở `cards` của cả tướng và trang bị đó). Tệp mang tên của lá bài đầu tiên dùng nó, nên `anh-hung/051` có thể trỏ tới `anh-hung/044_card2.png`. Luôn theo manifest.
4. **Tên tệp** (khi cần suy ra): `<loai>/<NNN>_card<v>.png`; `NNN` là số thứ tự dòng (từ 001) trong `data/bai/<loai>.json`, `v` là số bản (từ 1). Icon riêng: `<loai>/icon/<NNN>.png`.
5. **Loại (`<loai>`)**: `anh-hung` (85), `hieu-ung` (98), `thien-phu` (255), `trang-bi` (73).
6. **Icon** chỉ là emblem thật với `thien-phu` và `trang-bi`. Với `anh-hung` và `hieu-ung`, `icon` là huy hiệu cấp bậc nhỏ (dùng chung, không có chữ).
7. Ảnh lá bài cỡ khoảng 400×560, chữ Trung nằm ngay trên ảnh (tên ở giữa, mô tả ở nửa dưới). Đọc bằng công cụ đọc ảnh là đủ nét để dịch.
8. Nếu `tai_duoc` là `false` hoặc tệp không tồn tại: chạy lại `py scripts/tai_anh.py`, đừng bịa nội dung.

## Cho trang web (không phải cho agent)

- `theo-url.json`: link Tencent trong `data/bai` → đường dẫn PNG ở đây. `LocalImagePolicy` dùng nó để đổi link.
- `web/`: bản webp nhẹ do `py scripts/tao_anh_web.py` tạo từ PNG (cần `py -m pip install pillow`), cùng đường dẫn, đổi đuôi: `<loai>/<NNN>_card<v>.webp` (đầy đủ, khung xem), `<loai>/<NNN>_card<v>.thumb.webp` (320px, lưới), `<loai>/icon/<NNN>.webp`. Khoảng 32 MB cho cả bộ. Chỉ thư mục này cần đưa lên host; PNG gốc (190 MB) là để đọc và dịch.
- Thêm bài mới: sửa `data/bai`, chạy `py scripts/tai_anh.py` rồi `py scripts/tao_anh_web.py`.

## Ảnh Kỳ thủ

`ky-thu/<lordId>/` (avatar, chan-dung, `tp<N>-bia` và `tp<N>-kv` cho trang phục, `kn<N>` là icon nhóm kỹ năng) và `ky-thu/bai/<id>.png` (icon bài) do `scripts/crawl_ky_thu.py` tải, không nằm trong `manifest.json` (manifest chỉ có bốn loại bài). Đường dẫn của từng ảnh nằm ngay trong `data/ky-thu.json`. Bản webp cho trang ở `web/ky-thu/...` (ảnh lớn thu về cạnh dài tối đa 1400px).

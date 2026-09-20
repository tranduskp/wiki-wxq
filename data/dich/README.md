# data/dich: bản dịch tiếng Việt

Mỗi loại một tệp: `anh-hung.json`, `hieu-ung.json`, `thien-phu.json`, `trang-bi.json`. Ảnh gốc để đọc và đối chiếu nằm ở `data/anh/` (xem `data/anh/README.md`, tra đường dẫn qua `data/anh/manifest.json`).

## Định dạng

Khóa là **tên Trung của lá bài** (`ten_tuong_hoac_the` trong `data/bai/<loai>.json`, duy nhất trong mỗi loại).

```json
{
  "干将莫邪": {
    "ten": "Can Tương Mạc Tà",
    "mo_ta": "Khi Can Tương Mạc Tà có mặt trên sân, nhận Trang bị thường Song Kiếm · Hùng.",
    "ban": {
      "2": { "ten": "Song Kiếm · Hùng", "mo_ta": "Tốc độ đánh +30%. Nếu người mang là Can Tương Mạc Tà, giới hạn pháp lực giảm xuống còn 10." },
      "3": { "mo_ta": "Khi Can Tương Mạc Tà có mặt trên sân, nhận Trang bị thường Song Kiếm · Hùng và Song Kiếm · Thư." }
    }
  }
}
```

- `ten`: tên Việt của lá bài (ở bản 1). Bắt buộc.
- `mo_ta`: dịch phần mô tả in trên **bản 1** (`cards[0]`). Lá bài không có mô tả thì bỏ trường này.
- `ban` (tùy chọn): các bản còn lại, khóa là số bản dưới dạng chuỗi (`"2"`, `"3"`...). Mỗi bản có `mo_ta` (dịch chữ in trên ảnh của bản đó) và `ten` **chỉ khi tên in trên ảnh bản đó khác tên lá bài** (ví dụ ảnh bản 2 là một trang bị riêng của tướng). Bản có chữ y hệt bản 1 thì có thể bỏ qua.
- `mau: true` đánh dấu bản dịch mẫu chưa duyệt (site hiện nhãn "Bản dịch mẫu"). Bản dịch thật thì không có trường này; hiện không còn mục nào có `mau`.
- `ghi_chu` (tùy chọn): chỗ không chắc, chữ khó đọc, hoặc thuật ngữ cần chủ site quyết. Site không hiển thị trường này.

Dịch những gì **in trên ảnh** và chỉ những gì in trên ảnh. Không suy đoán chỉ số, cơ chế hay bối cảnh mà ảnh không nói. Chữ nhỏ tiếng Anh ở góc ảnh (HERO NO., HONOR OF KINGS: ACE...) không phải nội dung, bỏ qua.

## Quy tắc dịch

- **Tên người, tướng, địa danh, binh khí, trang bị mang tên thần thoại/lịch sử: Hán Việt**, viết hoa từng chữ (干将莫邪 → Can Tương Mạc Tà, 项羽 → Hạng Vũ, 风暴巨剑 → Phong Bạo Cự Kiếm).
- **Tên thông thường của hiệu ứng/thiên phú (từ đời thường, hiện đại): dịch nghĩa sang tiếng Việt tự nhiên**, viết hoa chữ đầu mỗi từ chính (复印机 → Máy Photocopy, 吸纳人才 → Thu Nạp Nhân Tài). Từ nào nghe Hán Việt đã quen (Thiên Phú, Anh Hùng) thì giữ Hán Việt.
- Dấu `·` giữa các phần của tên giữ nguyên (双剑·雄 → Song Kiếm · Hùng).
- Câu mô tả: ngắn, rõ, đúng giọng hướng dẫn trong game, giữ nguyên số liệu, dấu `+`, `%`, `/`, `~`. Không thêm chữ ngoài nội dung gốc.
- Tên một lá bài khác xuất hiện trong mô tả phải dùng **đúng tên Việt** của lá bài đó (tra `thuat-ngu.json`).

## Thuật ngữ chung (bắt buộc dùng thống nhất)

| Trung | Việt |
|---|---|
| 英雄 / 英雄牌 | Anh Hùng / bài Anh Hùng |
| 效果 | Hiệu Ứng |
| 天赋 / 天赋牌 | Thiên Phú / bài Thiên Phú |
| 装备 | Trang Bị |
| 基础装备 / 普通装备 / 特殊装备 | Trang bị cơ bản / Trang bị thường / Trang bị đặc biệt |
| 卡牌 | lá bài |
| N阶 | bậc N |
| 在场 | có mặt trên sân |
| 获得 | nhận |
| 穿戴 / 穿戴者 | mang / người mang |
| 铸造 | rèn |
| 觉醒 (AWAKENED) | Thức Tỉnh |
| 攻击速度 | tốc độ đánh |
| 法力值 | pháp lực |
| 兑换券 | phiếu đổi |

`thuat-ngu.json` là bảng tên đã chốt (Trung → Việt) của các lá bài đã dịch, để lá bài khác nhắc tới thì dùng đúng tên. Được sinh ra từ các tệp `data/dich/*.json`.

## Quy trình cho agent

1. Lấy danh sách lá bài và đường dẫn ảnh từ `data/anh/manifest.json`.
2. Mở từng ảnh bằng công cụ đọc ảnh, đọc tên và mô tả, dịch theo quy tắc trên.
3. Khi nhiều agent chạy song song, mỗi agent ghi vào tệp nháp riêng `data/dich/_nhap/<loai>-<hậu tố>.json` (cùng định dạng), không sửa thẳng tệp chính.
4. Chạy `py scripts/gop_ban_dich.py`: gộp nháp vào `data/dich/<loai>.json`, kiểm tra, chép bản dịch của lá bài chủ sang các bản dùng chung ảnh, và sinh lại `thuat-ngu.json`. Sửa nhỏ thì sửa thẳng `data/dich/<loai>.json` (nháp đã gộp xong thì xóa `_nhap/`, vì nháp ghi đè tệp chính khi gộp lại).
5. Đánh dấu chỗ không chắc trong `ghi_chu`.

## Thuật ngữ bổ sung (đã chốt khi dịch Trang Bị và Hiệu Ứng)

Dùng đúng các cách dịch dưới đây trong mọi loại bài.

| Trung | Việt |
|---|---|
| 唯一 (đầu mô tả) | Duy Nhất. (viết hoa N, làm từ đầu của mô tả) |
| 输出型 / 防御型 / 法术型 / 功能型 | loại sát thương / phòng thủ / pháp thuật / chức năng |
| 物理攻击力 / 法术攻击力 | công vật lý / công pháp thuật |
| 物理防御 / 法术防御 | phòng thủ vật lý / phòng thủ pháp thuật |
| 物理伤害 / 法术伤害 / 真实伤害 | sát thương vật lý / pháp thuật / chuẩn |
| 生命值 / 最大生命值 | máu / máu tối đa |
| 暴击率 / 暴击效果 | tỉ lệ chí mạng / hiệu quả chí mạng |
| 致命伤害 | sát thương chí tử |
| 伤害加成 / 伤害减免 | sát thương cộng thêm / giảm sát thương |
| 移动速度 | tốc độ di chuyển |
| 冷却 | thời gian hồi |
| 护盾 | khiên |
| 眩晕 / 控制效果 / 压制 | choáng / hiệu ứng khống chế / áp chế |
| 无敌 / 不可选中 | vô địch / không thể bị chọn |
| 叠加 / 层 | cộng dồn / tầng |
| 战斗开始 / 本场战斗 | bắt đầu giao chiến / trong trận này |
| 回合 | vòng |
| 格 | ô |
| 普通攻击 / 普攻 | đánh thường |
| 释放技能 | tung kỹ năng |
| 等级 | cấp |
| 友军 / 己方 | đồng đội (hoặc đồng minh) / phe ta |
| 敌人 / 敌方 | kẻ địch / địch |
| 阵亡 | tử trận |
| 棋手 / 棋手经验 / 棋手等级 | kỳ thủ / kinh nghiệm kỳ thủ / cấp kỳ thủ |
| 战术牌 / 战术 | bài Chiến Thuật / Chiến Thuật |
| 转瞬 | Tức Thời |
| 整备 | Chỉnh Bị |
| 登场 | Đăng Tràng |
| 临时等级 | Cấp Tạm Thời |
| 图腾 | Đồ Đằng |
| 阵营 | trận doanh |
| 征召令 | Lệnh Triệu Tập |
| 古币 | Cổ Tệ |
| 刷新 | làm mới |
| 移除 | loại bỏ |
| 打出 | đánh ra |
| 阿科米亚 | A Khoa Mễ Á |
| 核心 | Lõi |
| 觉醒进度 | tiến độ Thức Tỉnh |
| 之 (trong tên trang bị) | Chi (Hiền Giả Chi Thư) |

Tên vùng luôn theo `data/nhom.json` (Đại Hà Lưu Vực, Trục Lộc, Tam Phân Chi Địa, Hà Lạc, Nhật Lạc Hải, Vô Trận Doanh). Ảnh có khi in rút gọn, ví dụ 【三分】; giữ đúng chữ in trên ảnh ("Tam Phân").

`hiệu quả` dùng cho độ lớn của một hiệu ứng; `hiệu ứng` dùng cho trạng thái (tiêu cực, làm chậm...).

## Kỳ thủ (`ky-thu.json`)

Kỳ thủ (棋手) là nhân vật người chơi, dữ liệu do `scripts/crawl_ky_thu.py` lấy từ trang 3 của wxq.qq.com vào `data/ky-thu.json` (chữ Trung, có sẵn văn bản nên **dịch từ chữ trong JSON, không cần đọc ảnh**). Bản dịch nằm ở `data/dich/ky-thu.json`, khóa là tên Trung của kỳ thủ (`ten_zh`):

```json
{
  "_chung": { "nguon": { "初始获得卡牌": "Bài nhận ngay từ đầu" } },
  "阿离": {
    "ten": "A Ly",
    "cau_noi": "Muốn có được thì trước hết phải dám theo đuổi!",
    "trang_phuc": { "阿离": "Nguyên bản", "墨世龙尘": "..." },
    "the": { "枫叶舞": { "ten": "Phong Diệp Vũ", "mo_ta": "..." } }
  }
}
```

- `ten`: tên Việt của kỳ thủ. `cau_noi`: câu thoại (`cau_noi_zh`). Giữ giọng nhân vật, dịch thoáng, ngắn.
- `trang_phuc`: tên trang phục (`trang_phuc[].ten_zh`) → tên Việt. Trang phục có tên trùng tên kỳ thủ là bản gốc, dịch thành "Nguyên bản".
- `the`: mọi lá bài của kỳ thủ (cả trong `ky_nang[].the[]` lẫn `bai[]`), khóa là `ten_zh` của lá bài (không trùng trong dữ liệu hiện có). `ten` và `mo_ta` theo đúng quy tắc dịch ở trên (tên kỹ năng/bài riêng: Hán Việt; mô tả ngắn, giữ nguyên số liệu, xuống dòng `\n` giữ nguyên).
- `_chung.nguon`: các câu "nguồn" của lá bài (`bai[].nguon_zh`) → tiếng Việt, dùng chung cho mọi kỳ thủ.
- Nhóm kỹ năng `技能` / `秘技` / `专属` là chữ cố định trong giao diện (Kỹ năng / Bí kỹ / Chuyên thuộc), không dịch ở đây.
- `ghi_chu` tùy chọn ở cấp kỳ thủ, như các loại bài khác. Tên hướng dẫn video (`huong_dan`) chưa dịch.
- Thẻ `<color>`, `<b>`, `<a>` đã bị bỏ khỏi `mo_ta_zh`; thuật ngữ lấy từ hai bảng thuật ngữ ở trên và `thuat-ngu.json`. Tên kỳ thủ Hán Việt hoặc phiên âm quen thuộc (阿离 = A Ly, 班叔 = Ban Thúc, 弈星 = Dịch Tinh).

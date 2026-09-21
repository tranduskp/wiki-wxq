#!/usr/bin/env python3
"""Lấy dữ liệu Đội hình (阵容推荐, trang teamlist.html của wxq.qq.com) về làm tham chiếu, và dựng data/doi-hinh.json.

    py scripts/crawl_doi_hinh.py             lấy dữ liệu, tải ảnh còn thiếu, ghi tệp
    py scripts/crawl_doi_hinh.py --khong-anh chỉ lấy dữ liệu

Chỉ dùng thư viện chuẩn của Python 3. Nguồn (giống trang chính thức, xem js/teamlist.js của họ), mỗi nguồn phân trang
`_pro_<trang>.js` cho tới khi trang trống:
    Người mới  https://game.gtimg.cn/images/amside/ide_timer/600269_oslineupbybeginner_pro_<trang>.js
    Tổng hợp   https://game.gtimg.cn/images/amside/ide_timer/598252_oslineupbyrecommend_pro_<trang>.js
    Hot        https://game.gtimg.cn/images/amside/ide_timer/600264_oslineupbyhot_pro_<trang>.js

Quyền riêng tư: dữ liệu gốc kèm bình luận của người chơi (biệt danh, ID, openId, IP tỉnh) và thông tin tác giả.
Script này BỎ HẾT phần đó trước khi ghi bất cứ tệp nào; không lưu và không đưa vào data/doi-hinh.json tên, ảnh hay ID người dùng.

Kết quả:
    data/ref/doi-hinh/<nguon>.raw.json   bản gốc đã lược bỏ phần cá nhân (tham chiếu, không đưa lên git)
    data/doi-hinh.json                   dữ liệu gọn cho trang web, chữ Trung; tướng/trang bị/thiên phú/hiệu ứng/kỳ thủ
                                         chỉ ghi bằng tên Trung (khóa của data/bai và data/ky-thu.json)
    data/anh/doi-hinh/icon/              vài icon nhỏ dùng chung
Bản dịch nằm ở data/dich/doi-hinh.json (xem data/dich/README.md, mục Đội hình); tệp đó không bị ghi đè.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "data" / "ref" / "doi-hinh"
ANH = ROOT / "data" / "anh"
OUT = ROOT / "data" / "doi-hinh.json"

BASE = "https://game.gtimg.cn/images/amside/ide_timer/"
FEEDS = {  # id nhóm -> (tên tệp nguồn, nhãn Trung)
    "nguoi-moi": ("600269_oslineupbybeginner_pro", "新手"),
    "tong-hop": ("598252_oslineupbyrecommend_pro", "综合推荐"),
    "hot": ("600264_oslineupbyhot_pro", "热门推荐"),
}
TYPE_ICON = "https://game.gtimg.cn/images/osgame/cp/a20260707sfgw/team/hero-icon{n}.png"
USER_AGENT = "Mozilla/5.0 (compatible; wiki-wxq-crawler/1.0)"


def get_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_feed(stem: str) -> list[dict]:
    items: list[dict] = []
    for page in range(1, 100):
        try:
            batch = get_json(f"{BASE}{stem}_{page}.js")
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                break
            raise
        if not batch:
            break
        items += batch
    return items


def scrub(lineup: dict) -> dict:
    """Bỏ thông tin cá nhân: tác giả, bình luận và người bình luận. Giữ điểm số."""
    clean = {k: v for k, v in lineup.items() if k != "author"}
    inter = lineup.get("interactiveData") or {}
    clean["interactiveData"] = {"score": inter.get("score", ""), "scoreNum": inter.get("scoreNum", 0)}
    return clean


def names(items) -> list[str]:
    return [x["name"] for x in items or [] if x.get("name")]


def normalize(lineup: dict) -> dict:
    inter = lineup.get("interactiveData") or {}
    try:
        score = float(inter.get("score") or 0)
    except ValueError:
        score = 0.0
    tag = lineup.get("tag") or ""
    return {
        "ma": str(lineup["key"]),
        "ten_zh": lineup.get("name", ""),
        "tag_zh": tag,
        "chinh_thuc": "官方" in tag,
        "the_zh": list(lineup.get("tags") or []),
        "luot_dung": lineup.get("useNum", 0),
        "diem": score,
        "so_danh_gia": inter.get("scoreNum", 0),
        "ngay": lineup.get("createTimestamp", ""),
        "mua": lineup.get("seasonId", 0),
        "tong_quan_zh": lineup.get("brief", ""),
        "vi_tri_zh": lineup.get("positionDesc", ""),
        "trang_bi_zh": lineup.get("equipDesc", ""),
        "thien_phu_zh": lineup.get("talentCardDesc", ""),
        "hieu_ung_zh": lineup.get("effectCardDesc", ""),
        "ky_thu": [
            {"id": k["id"], "ten_zh": k["name"], "ghi_chu_zh": k.get("desc", "")} for k in lineup.get("lordList") or []
        ],
        "tuong": [
            {
                "ten_zh": h["name"],
                "cap": h.get("level", 1),
                "loai": h.get("type", 0),  # 0 = tướng thường; 1/2/3 = vai trò nổi bật (chưa rõ nghĩa chính thức)
                "tien_hoa": bool(h.get("isEvo")),
                "x": h.get("positionX", 0),
                "z": h.get("positionZ", 0),
                "trang_bi": names(h.get("equipList")),
                "ghi_chu_zh": h.get("desc", ""),
            }
            for h in lineup.get("heroList") or []
            if h.get("name")
        ],
        "giai_doan": [
            {
                "tu_vong": o.get("beginRound"),
                "den_vong": o.get("endRound"),
                "mo_ta_zh": o.get("desc", ""),
                "chinh": names(o.get("mainHeroList")),
                "phu": names(o.get("subHeroList")),
            }
            for o in lineup.get("operationDetails") or []
        ],
        "thien_phu": names(lineup.get("talentCardList")),
        "hieu_ung": names(lineup.get("effectCardList")),
    }


def download_icons() -> list[str]:
    failed = []
    dest_dir = ANH / "doi-hinh" / "icon"
    dest_dir.mkdir(parents=True, exist_ok=True)
    for n in (1, 2, 3):
        dest = dest_dir / f"hero-icon{n}.png"
        if dest.is_file():
            continue
        try:
            req = urllib.request.Request(TYPE_ICON.format(n=n), headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=40) as resp:
                body = resp.read()
            if not body.startswith(b"\x89PNG"):
                raise ValueError("không phải PNG")
            dest.write_bytes(body)
        except (urllib.error.URLError, ValueError, OSError) as exc:
            failed.append(f"hero-icon{n}.png ({exc})")
    return failed


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--khong-anh", action="store_true", help="không tải ảnh")
    args = ap.parse_args()

    REF.mkdir(parents=True, exist_ok=True)
    by_code: dict[str, dict] = {}
    groups = []
    for group_id, (stem, label) in FEEDS.items():
        raw = [scrub(x) for x in fetch_feed(stem)]
        (REF / f"{group_id}.raw.json").write_text(json.dumps(raw, ensure_ascii=False, indent=1), encoding="utf-8")
        for order, item in enumerate(raw):
            lineup = by_code.setdefault(str(item["key"]), normalize(item))
            lineup.setdefault("nhom", {})[group_id] = order  # vị trí trong từng nhóm, theo thứ tự nguồn
        groups.append({"id": group_id, "ten_zh": label, "so_luong": len(raw)})
        print(f"{group_id}: {len(raw)} đội hình")

    data = {
        "cap_nhat": time.strftime("%Y-%m-%d"),
        "nhom": groups,
        "doi_hinh": sorted(by_code.values(), key=lambda x: min(x["nhom"].values())),
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(by_code)} đội hình duy nhất -> {OUT.relative_to(ROOT)}")

    failed = [] if args.khong_anh else download_icons()
    for line in failed:
        print("LỖI", line, file=sys.stderr)
    if not args.khong_anh:
        print("Tiếp theo: py scripts/tao_anh_web.py")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

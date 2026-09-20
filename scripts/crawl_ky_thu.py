#!/usr/bin/env python3
"""Lấy dữ liệu Kỳ thủ (棋手, trang 3 của wxq.qq.com) về làm tham chiếu, và dựng data/ky-thu.json cho trang web.

    py scripts/crawl_ky_thu.py             lấy dữ liệu, tải ảnh còn thiếu, ghi tệp
    py scripts/crawl_ky_thu.py --khong-anh chỉ lấy dữ liệu, không tải ảnh
    py scripts/crawl_ky_thu.py --lai       tải lại cả ảnh đã có

Chỉ dùng thư viện chuẩn của Python 3. Nguồn (giống trang chính thức, xem js/role.js của họ):
    danh sách  https://vasd-cms.qq.com/cms/osgamewsq/prod/api/v1/osgamewsqwsq_info_article_3019.json
    chi tiết   https://game.gtimg.cn/images/amside/ide_timer/589094_oscard_new_16.js   (JSON, khóa "lords")

Kết quả:
    data/ref/ky-thu/danh-sach.raw.json   nguyên bản danh sách (câu thoại, ảnh, trang phục, video hướng dẫn)
    data/ref/ky-thu/chi-tiet.raw.json    nguyên bản "lords" (kỹ năng, bài riêng, bài liên quan)
    data/ky-thu.json                     dữ liệu gọn cho trang web, chữ Trung, ảnh là đường dẫn cục bộ
    data/anh/ky-thu/...                  ảnh (avatar, chân dung, trang phục, icon, ảnh nhỏ của bài)
Sau đó chạy `py scripts/tao_anh_web.py` để tạo bản webp cho trang.

Bản dịch không nằm ở đây: data/dich/ky-thu.json (xem data/dich/README.md, mục Kỳ thủ). Tệp này không bị ghi đè.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "data" / "ref" / "ky-thu"
ANH = ROOT / "data" / "anh"
OUT = ROOT / "data" / "ky-thu.json"

LIST_URL = "https://vasd-cms.qq.com/cms/osgamewsq/prod/api/v1/osgamewsqwsq_info_article_3019.json"
DETAIL_URL = "https://game.gtimg.cn/images/amside/ide_timer/589094_oscard_new_16.js"
USER_AGENT = "Mozilla/5.0 (compatible; wiki-wxq-crawler/1.0)"
MAGIC = (b"\x89PNG\r\n\x1a\n", b"\xff\xd8\xff", b"RIFF", b"GIF8")  # png, jpg, webp, gif

# Chữ trong ảnh/kiểu dữ liệu của nguồn (chưa rõ nghĩa chính thức: giữ số nguyên, đừng suy diễn)
TAG = re.compile(r"</?(?:color|b|a|i|u|size)[^>]*>|<br\s*/?>", re.I)


def get_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8")


def clean(text: str | None) -> str:
    """Bỏ thẻ định dạng của game (<color>, <b>, <a href>), giữ chữ và xuống dòng."""
    return TAG.sub("", text or "").replace("\r", "").strip()


def first_url(field) -> str:
    """Trường ảnh của CMS là danh sách đối tượng có `url`; đôi khi là chuỗi."""
    if isinstance(field, str):
        return field
    if isinstance(field, list) and field:
        item = field[0]
        return item.get("url", "") if isinstance(item, dict) else str(item)
    return ""


class Images:
    """Gom mọi ảnh cần tải; cùng URL chỉ một tệp."""

    def __init__(self) -> None:
        self.by_url: dict[str, str] = {}  # url -> đường dẫn tương đối so với data/anh/

    def add(self, url: str, rel_stem: str) -> str | None:
        if not url:
            return None
        if url not in self.by_url:
            ext = Path(url.split("?")[0]).suffix.lower() or ".png"
            self.by_url[url] = f"{rel_stem}{ext}"
        return self.by_url[url]

    def download(self, force: bool, workers: int = 8) -> list[str]:
        todo = [(u, r) for u, r in self.by_url.items() if force or not (ANH / r).is_file()]
        print(f"{len(self.by_url)} ảnh, {len(todo)} cần tải.")
        failed: list[str] = []

        def one(item: tuple[str, str]) -> None:
            url, rel = item
            dest = ANH / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            last = ""
            for attempt in range(1, 4):
                try:
                    safe = urllib.parse.quote(url, safe=":/?&=%")
                    req = urllib.request.Request(safe, headers={"User-Agent": USER_AGENT})
                    with urllib.request.urlopen(req, timeout=40) as resp:
                        body = resp.read()
                    if not body.startswith(MAGIC):
                        raise ValueError("không phải ảnh")
                    tmp = dest.with_suffix(dest.suffix + ".part")
                    tmp.write_bytes(body)
                    tmp.replace(dest)
                    return
                except (urllib.error.URLError, TimeoutError, ValueError, OSError) as exc:
                    last = str(exc)
                    time.sleep(1.5 * attempt)
            failed.append(f"{rel} <- {url} ({last})")

        with ThreadPoolExecutor(max_workers=workers) as pool:
            list(pool.map(one, todo))
        return failed


def build(lst: list[dict], lords: list[dict], images: Images) -> list[dict]:
    by_name = {x["name"]: x for x in lords}
    result = []
    for item in sorted(lst, key=lambda x: (-(x.get("order_number") or 0), -(x.get("e_published_at") or 0))):
        name = item["title"]
        lord = by_name.get(name)
        if lord is None:
            print(f"CẢNH BÁO: {name} có trong danh sách nhưng không có trong chi tiết", file=sys.stderr)
            continue
        lid = lord["lordId"]
        stem = f"ky-thu/{lid:03d}"
        basic, home = item.get("basicInfo") or {}, item.get("homepageInfo") or {}

        skins = []
        for n, skin in enumerate(item.get("skinConfig") or [], start=1):
            skins.append({
                "ten_zh": (skin.get("skin_name") or name).strip(),
                "bia": images.add(first_url(skin.get("skin_cover")), f"{stem}/tp{n}-bia"),
                "kv": images.add(first_url(skin.get("skin_kv_pc")), f"{stem}/tp{n}-kv"),
            })

        skills = []
        for n, group in enumerate(lord.get("talent") or [], start=1):
            skills.append({
                "nhom_zh": group["name"],
                "cap": group.get("level"),
                "icon": images.add(group.get("icon"), f"{stem}/kn{n}"),
                "the": [
                    {"id": c["id"], "ten_zh": c["name"], "mo_ta_zh": clean(c.get("desc"))}
                    for c in group.get("cards") or []
                ],
            })

        in_skills = {c["id"] for g in skills for c in g["the"]}
        cards, seen = [], set()
        for source, tag in ((lord.get("lordCards") or [], "rieng"), (lord.get("relatedCards") or [], "lien-quan")):
            for c in source:
                if c["id"] in seen or c["id"] in in_skills:
                    continue
                seen.add(c["id"])
                cards.append({
                    "id": c["id"],
                    "ten_zh": c["name"],
                    "nhom": tag,  # rieng = bài riêng của kỳ thủ (lordCards); lien-quan = chỉ có trong relatedCards
                    "kieu": c.get("type"),
                    "chat": c.get("quality"),
                    "mo_ta_zh": clean(c.get("desc")),
                    "nguon_zh": clean(c.get("cardGetDesc")).removeprefix("来源:").strip(),
                    "icon": images.add(c.get("thumb"), f"ky-thu/bai/{c['id']}"),
                })

        result.append({
            "ten_zh": name,
            "id": lid,
            "uid": item.get("uid"),
            "ten_en": home.get("en_name", ""),
            "cau_noi_zh": basic.get("line_text", ""),
            "avatar": images.add(first_url(home.get("avatar")), f"{stem}/avatar"),
            "chan_dung": images.add(first_url(home.get("portrait_pc")), f"{stem}/chan-dung"),
            "trang_phuc": skins,
            "ky_nang": skills,
            "bai": cards,
            "huong_dan": [
                {"ten_zh": (g.get("guide_name") or "").strip(), "video": (g.get("video_info") or {}).get("tencentId", "")}
                for g in item.get("guideConfig") or []
            ],
        })
    return result


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--khong-anh", action="store_true", help="không tải ảnh")
    ap.add_argument("--lai", action="store_true", help="tải lại cả ảnh đã có")
    args = ap.parse_args()

    lst = json.loads(get_text(f"{LIST_URL}?ts={int(time.time() // 10)}"))["data"]
    lords = json.loads(get_text(DETAIL_URL))["lords"]
    REF.mkdir(parents=True, exist_ok=True)
    (REF / "danh-sach.raw.json").write_text(json.dumps(lst, ensure_ascii=False, indent=1), encoding="utf-8")
    (REF / "chi-tiet.raw.json").write_text(json.dumps(lords, ensure_ascii=False, indent=1), encoding="utf-8")

    images = Images()
    data = build(lst, lords, images)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(data)} kỳ thủ, {sum(len(x['bai']) for x in data)} bài riêng/liên quan -> {OUT.relative_to(ROOT)}")

    failed = [] if args.khong_anh else images.download(args.lai)
    for line in failed:
        print("LỖI", line, file=sys.stderr)
    if not args.khong_anh:
        print("Tiếp theo: py scripts/tao_anh_web.py")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

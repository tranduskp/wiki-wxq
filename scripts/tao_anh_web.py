#!/usr/bin/env python3
"""Tạo bản webp nhẹ cho trang web từ ảnh PNG trong data/anh/ (cần Pillow: py -m pip install pillow).

    py scripts/tao_anh_web.py           chỉ tạo bản còn thiếu hoặc cũ hơn ảnh gốc
    py scripts/tao_anh_web.py --lai     tạo lại tất cả

Kết quả nằm ở data/anh/web/, cùng đường dẫn với ảnh gốc, đổi đuôi:
    <loai>/<NNN>_card<v>.webp         ảnh lá bài cỡ đầy đủ (khung xem)
    <loai>/<NNN>_card<v>.thumb.webp   ảnh thu nhỏ 320px chiều rộng (lưới)
    <loai>/icon/<NNN>.webp            icon (giữ nguyên kích thước)
    ky-thu/...                        ảnh Kỳ thủ (jpg/png), một bản webp thu nhỏ theo loại (xem KY_THU_EDGE)
Trang web chỉ tải thư mục web/ (LocalImagePolicy); PNG gốc là để agent đọc, không cần đưa lên host.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ANH = ROOT / "data" / "anh"
WEB = ANH / "web"
THUMB_WIDTH = 320  # phải khớp assets/js/data/CardMapper.js
KY_THU_EDGE = {"kv": 1400, "chan-dung": 1400, "bia": 360, "avatar": 360, "kn": 160, "bai": 160}  # cạnh dài tối đa
FULL_QUALITY = 86
THUMB_QUALITY = 78


def stale(dest: Path, src: Path, force: bool) -> bool:
    return force or not dest.exists() or dest.stat().st_mtime < src.stat().st_mtime


def save_webp(image: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, "WEBP", quality=quality, method=4)


def ky_thu_edge(rel: Path) -> int | None:
    """Cạnh dài tối đa của ảnh Kỳ thủ theo tên tệp (tp1-kv, avatar, ky-thu/bai/...), hoặc None nếu không phải ảnh Kỳ thủ."""
    if rel.parts[0] != "ky-thu":
        return None
    if "bai" in rel.parts:
        return KY_THU_EDGE["bai"]
    for key, edge in KY_THU_EDGE.items():
        if rel.stem.endswith(key):
            return edge
    return 1000


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--lai", action="store_true", help="tạo lại tất cả")
    args = ap.parse_args()

    made = 0
    sources = sorted(p for p in ANH.rglob("*") if p.suffix.lower() in (".png", ".jpg", ".jpeg") and WEB not in p.parents)
    for src in sources:
        rel = src.relative_to(ANH).with_suffix("")
        edge = ky_thu_edge(rel)
        is_icon = src.parent.name == "icon" or edge is not None
        full = WEB / rel.with_suffix(".webp")
        thumb = WEB / rel.with_suffix(".thumb.webp")
        todo_full = stale(full, src, args.lai)
        todo_thumb = not is_icon and stale(thumb, src, args.lai)
        if not (todo_full or todo_thumb):
            continue
        with Image.open(src) as im:
            im = im.convert("RGBA")
            if edge and max(im.size) > edge:
                scale = edge / max(im.size)
                im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
            if todo_full:
                save_webp(im, full, FULL_QUALITY if not is_icon else 90)
            if todo_thumb:
                height = round(im.height * THUMB_WIDTH / im.width)
                save_webp(im.resize((THUMB_WIDTH, height), Image.LANCZOS), thumb, THUMB_QUALITY)
        made += 1
    total = sum(p.stat().st_size for p in WEB.rglob("*.webp")) if WEB.exists() else 0
    print(f"Đã xử lý {made}/{len(sources)} ảnh gốc. Thư mục web/: {total / 1e6:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())

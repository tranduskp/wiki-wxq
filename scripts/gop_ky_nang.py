#!/usr/bin/env python3
"""Gộp bản dịch kỹ năng Anh Hùng: data/dich/_nhap/ky-nang-*.json -> trường `ky_nang` trong data/dich/anh-hung.json.

    py scripts/gop_ky_nang.py            gộp + kiểm tra + ghi
    py scripts/gop_ky_nang.py --kiem-tra chỉ kiểm tra (dùng sau khi sửa tay data/dich/anh-hung.json)

Định dạng của `ky_nang` (data/dich/README.md, mục Kỹ năng Anh Hùng):
    { "ten": "...", "mo_ta": "...", "nang_cap": ["...", "...", "..."] }
Kiểm tra với data/chi-tiet/anh-hung.json (do scripts/crawl_anh_hung.py sinh): mọi Anh Hùng có kỹ năng đều được dịch,
`nang_cap` đúng số phần tử, không còn chữ Hán, tên kỹ năng không trùng nhau. Thoát mã 1 nếu có lỗi.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DICH = ROOT / "data" / "dich" / "anh-hung.json"
NHAP = ROOT / "data" / "dich" / "_nhap"
CHI_TIET = ROOT / "data" / "chi-tiet" / "anh-hung.json"
CJK = re.compile(r"[㐀-鿿]")


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ kiểm tra, không ghi")
    args = ap.parse_args()

    dich = json.loads(DICH.read_text(encoding="utf-8"))
    detail = json.loads(CHI_TIET.read_text(encoding="utf-8"))
    for part in sorted(NHAP.glob("ky-nang-[0-9]*.json")):
        for zh, block in json.loads(part.read_text(encoding="utf-8")).items():
            if zh in dich:
                dich[zh]["ky_nang"] = {k: v for k, v in block.items() if k != "ghi_chu"}
                if block.get("ghi_chu"):
                    dich[zh].setdefault("ghi_chu_ky_nang", block["ghi_chu"])

    errors: list[str] = []
    names: dict[str, str] = {}
    done = 0
    for zh, info in detail.items():
        block = dich.get(zh, {}).get("ky_nang")
        if not block:
            errors.append(f"{zh}: chưa dịch kỹ năng")
            continue
        done += 1
        if not block.get("ten") or not block.get("mo_ta"):
            errors.append(f"{zh}: thiếu `ten` hoặc `mo_ta` của kỹ năng")
        want = len(info["ky_nang"]["nang_cap"])
        got = block.get("nang_cap", [])
        if len(got) != want:
            errors.append(f"{zh}: `nang_cap` có {len(got)} phần tử, nguồn có {want}")
        for text in [block.get("ten", ""), block.get("mo_ta", ""), *got]:
            if CJK.search(text):
                errors.append(f"{zh}: còn chữ Hán: {text[:40]}")
        if block.get("ten") in names:
            errors.append(f"tên kỹ năng trùng: {block['ten']} ({zh} và {names[block['ten']]})")
        names[block.get("ten", "")] = zh
    print(f"{done}/{len(detail)} Anh Hùng đã dịch kỹ năng")
    if not args.kiem_tra:
        DICH.write_text(json.dumps(dich, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for line in errors:
        print("LỖI", line, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

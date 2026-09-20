#!/usr/bin/env python3
"""Gộp bản dịch Kỳ thủ: data/dich/_nhap/ky-thu*.json -> data/dich/ky-thu.json, và kiểm tra với data/ky-thu.json.

    py scripts/gop_ky_thu.py            gộp + kiểm tra + ghi
    py scripts/gop_ky_thu.py --kiem-tra chỉ kiểm tra (dùng sau khi sửa tay data/dich/ky-thu.json)

Kiểm tra: mỗi kỳ thủ có `ten`, `cau_noi` (nếu có câu thoại); mọi trang phục và mọi lá bài (kỹ năng lẫn bài riêng)
có bản dịch với `ten` và `mo_ta`; `_chung.nguon` đủ các câu nguồn đang dùng; không có khóa thừa. Thoát mã 1 nếu có lỗi.
Định dạng: data/dich/README.md, mục Kỳ thủ.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "data" / "ky-thu.json"
DICH = ROOT / "data" / "dich" / "ky-thu.json"
NHAP = ROOT / "data" / "dich" / "_nhap"

# Câu "nguồn" của lá bài (bai[].nguon_zh) dùng chung cho mọi kỳ thủ
DEFAULT_SOURCES = {
    "初始获得卡牌": "Bài nhận ngay từ đầu",
    "棋手升级时概率选择获取天赋。": "Khi kỳ thủ lên cấp, có xác suất được chọn nhận Thiên Phú.",
}


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def check(players: list[dict], tr: dict) -> list[str]:
    errors: list[str] = []
    names = {p["ten_zh"] for p in players}
    for key in tr:
        if key != "_chung" and key not in names:
            errors.append(f"khóa lạ: {key}")
    sources = tr.get("_chung", {}).get("nguon", {})
    for p in players:
        t = tr.get(p["ten_zh"])
        if not t:
            errors.append(f"{p['ten_zh']}: chưa dịch")
            continue
        if not t.get("ten"):
            errors.append(f"{p['ten_zh']}: thiếu `ten`")
        if p["cau_noi_zh"] and not t.get("cau_noi"):
            errors.append(f"{p['ten_zh']}: thiếu `cau_noi`")
        for skin in p["trang_phuc"]:
            if not t.get("trang_phuc", {}).get(skin["ten_zh"]):
                errors.append(f"{p['ten_zh']}: thiếu trang phục {skin['ten_zh']}")
        cards = [c for g in p["ky_nang"] for c in g["the"]] + p["bai"]
        for c in cards:
            ct = t.get("the", {}).get(c["ten_zh"])
            if not ct or not ct.get("ten") or (c["mo_ta_zh"] and not ct.get("mo_ta")):
                errors.append(f"{p['ten_zh']}: thiếu bản dịch lá bài {c['ten_zh']}")
        extra = set(t.get("the", {})) - {c["ten_zh"] for c in cards}
        for name in sorted(extra):
            errors.append(f"{p['ten_zh']}: lá bài thừa {name}")
        for c in p["bai"]:
            if c["nguon_zh"] and c["nguon_zh"] not in sources:
                errors.append(f"_chung.nguon thiếu: {c['nguon_zh']}")
    return errors


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ kiểm tra, không ghi")
    args = ap.parse_args()

    players = json.loads(SOURCE.read_text(encoding="utf-8"))
    tr = load(DICH)
    for part in sorted(NHAP.glob("ky-thu*.json")):
        tr.update(load(part))
    tr.setdefault("_chung", {}).setdefault("nguon", {})
    for zh, vi in DEFAULT_SOURCES.items():
        tr["_chung"]["nguon"].setdefault(zh, vi)

    ordered = {"_chung": tr["_chung"]}
    ordered.update({p["ten_zh"]: tr[p["ten_zh"]] for p in players if p["ten_zh"] in tr})
    errors = check(players, ordered)
    cards = sum(len(v.get("the", {})) for k, v in ordered.items() if k != "_chung")
    print(f"{len(ordered) - 1}/{len(players)} kỳ thủ, {cards} lá bài đã dịch, {sum(1 for k, v in ordered.items() if k != '_chung' and v.get('ghi_chu'))} kỳ thủ có ghi chú")
    if not args.kiem_tra:
        DICH.write_text(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for line in errors:
        print("LỖI", line, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

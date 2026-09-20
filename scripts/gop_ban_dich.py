#!/usr/bin/env python3
"""Gộp các tệp nháp data/dich/_nhap/<loai>*.json vào data/dich/<loai>.json, kiểm tra, và sinh thuat-ngu.json.

    py scripts/gop_ban_dich.py            gộp + kiểm tra + ghi tệp
    py scripts/gop_ban_dich.py --kiem-tra chỉ kiểm tra, không ghi

Kiểm tra: khóa phải có trong data/bai/<loai>.json; `ten` không rỗng; số bản trong `ban` nằm trong
2..số ảnh của lá bài; không còn `mau`. Thoát mã 1 nếu có lỗi. Thứ tự khóa theo data/bai.

Đồng bộ ảnh dùng chung (cần data/anh/manifest.json): một ảnh có thể xuất hiện ở nhiều lá bài (trang bị riêng
của tướng, lá bài hiệu ứng nằm trong thiên phú...). Ảnh đó chỉ có một bản dịch đúng: bản dịch của lá bài
mà ảnh là bản 1 của chính nó (ưu tiên trang-bi > hieu-ung > anh-hung > thien-phu). Các bản khác trỏ tới ảnh
đó được chép lại đúng như vậy.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BAI = ROOT / "data" / "bai"
DICH = ROOT / "data" / "dich"
NHAP = DICH / "_nhap"
LOAI = ["anh-hung", "hieu-ung", "thien-phu", "trang-bi"]
UU_TIEN = ["trang-bi", "hieu-ung", "anh-hung", "thien-phu"]  # loại nào là "chủ" của ảnh dùng chung
MANIFEST = ROOT / "data" / "anh" / "manifest.json"


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def image_count(row: dict) -> int:
    cards = row.get("anh_card")
    return 1 if isinstance(cards, str) else len(cards or [])


def sync_shared_images(result: dict[str, dict]) -> int:
    """Chép bản dịch của lá bài chủ sang các bản khác dùng chung ảnh. Trả về số bản đã sửa."""
    if not MANIFEST.exists():
        print("Bỏ qua đồng bộ ảnh dùng chung: chưa có data/anh/manifest.json (chạy scripts/tai_anh.py)")
        return 0
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))["loai"]
    owners: dict[str, dict] = {}  # đường dẫn ảnh -> {ten, mo_ta}
    for loai in UU_TIEN:
        for e in manifest[loai]:
            entry = result[loai].get(e["ten_zh"])
            if entry and e["cards"][0] not in owners:
                owners[e["cards"][0]] = {"ten": entry["ten"], "mo_ta": entry.get("mo_ta", "")}
    fixed = 0
    for loai in LOAI:
        for e in manifest[loai]:
            entry = result[loai].get(e["ten_zh"])
            if not entry:
                continue
            for index, path in enumerate(e["cards"][1:], start=2):
                owner = owners.get(path)
                if not owner:
                    continue
                ban = entry.setdefault("ban", {}).setdefault(str(index), {})
                current = {"ten": ban.get("ten", entry["ten"]), "mo_ta": ban.get("mo_ta", "")}
                if current == owner:
                    continue
                if owner["ten"] != entry["ten"]:
                    ban["ten"] = owner["ten"]
                else:
                    ban.pop("ten", None)
                if owner["mo_ta"]:
                    ban["mo_ta"] = owner["mo_ta"]
                else:
                    ban.pop("mo_ta", None)
                fixed += 1
    return fixed


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ kiểm tra, không ghi")
    args = ap.parse_args()

    errors: list[str] = []
    result: dict[str, dict] = {}
    missing_by_loai: dict[str, int] = {}
    for loai in LOAI:
        rows = json.loads((BAI / f"{loai}.json").read_text(encoding="utf-8"))
        by_key = {r["ten_tuong_hoac_the"]: r for r in rows}

        # sample translations ("mau") are placeholders: only a real draft may replace them, never carry them over
        merged = {k: v for k, v in load(DICH / f"{loai}.json").items() if not v.get("mau")}
        for part in sorted(NHAP.glob(f"{loai}*.json")):
            merged.update(load(part))

        for key in merged:
            if key not in by_key:
                errors.append(f"{loai}: khóa lạ (không có trong data/bai): {key}")
        ordered = {}
        for key, row in by_key.items():
            entry = merged.get(key)
            if not entry:
                continue
            entry.pop("mau", None)
            if not entry.get("ten"):
                errors.append(f"{loai}: {key}: thiếu `ten`")
            for number in entry.get("ban", {}):
                if not (number.isdigit() and 2 <= int(number) <= image_count(row)):
                    errors.append(f"{loai}: {key}: ban \"{number}\" ngoài phạm vi 2..{image_count(row)}")
            ordered[key] = entry
        result[loai] = ordered
        missing_by_loai[loai] = len(by_key) - len(ordered)

    fixed = sync_shared_images(result)

    glossary: dict[str, str] = {}
    for loai in LOAI:
        noted = sum(1 for e in result[loai].values() if e.get("ghi_chu"))
        print(f"{loai}: {len(result[loai])} đã dịch, {missing_by_loai[loai]} còn thiếu, {noted} có ghi chú")
        glossary.update({k: e["ten"] for k, e in result[loai].items()})
        if not args.kiem_tra:
            (DICH / f"{loai}.json").write_text(
                json.dumps(result[loai], ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
    print(f"Đồng bộ ảnh dùng chung: {fixed} bản được chỉnh cho khớp lá bài chủ")

    if not args.kiem_tra:
        (DICH / "thuat-ngu.json").write_text(
            json.dumps(glossary, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
        )
    for line in errors:
        print("LỖI", line, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

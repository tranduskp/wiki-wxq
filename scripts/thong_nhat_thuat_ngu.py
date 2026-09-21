#!/usr/bin/env python3
"""Áp dụng bảng thuật ngữ thống nhất lên mọi bản dịch trong data/dich/ (và bản nháp đội hình trong data/dich/_nhap/).

    py scripts/thong_nhat_thuat_ngu.py             sửa tại chỗ, in số lần thay
    py scripts/thong_nhat_thuat_ngu.py --kiem-tra  chỉ đếm, không ghi

Chạy lại được nhiều lần (idempotent). Có hai lớp:
  1. TU_KHOA: tên từ khóa của game theo bảng chủ site đã duyệt (data/tu-khoa.json), thay cho các cách dịch cũ.
  2. DOI_TEN: `data/dich/doi-ten.json`, bảng {tên cũ: tên mới} cho tên tướng, kỳ thủ, trang bị, thiên phú, hiệu ứng
     (dễ hiểu hơn, đỡ Hán Việt). Tên dài được thay trước tên ngắn; thay xong mới chạy lớp từ khóa.
Không đụng vào khóa (Trung) và trường `ghi_chu`.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DICH = ROOT / "data" / "dich"
RENAME = DICH / "doi-ten.json"

# (mẫu, thay thế). Thứ tự quan trọng. Chữ thường và chữ hoa đầu đều có.
TU_KHOA = [
    (r"Đăng Tràng", "Xuất Trận"),
    (r"Khai Đoàn", "Khai Chiến"),
    (r"Chỉnh Bị", "Chỉnh Đốn"),
    (r"\b([Hh])y sinh\b", r"\1i sinh"),
    (r"\bHy Sinh\b", "Hi Sinh"),
    (r"Tức Thời", "Phù Du"),
    (r"\b([Hh])ợp thành\b", lambda m: ("T" if m.group(1) == "H" else "t") + "ổng hợp"),
    (r"Hợp Thành", "Tổng Hợp"),
    (r"Thiểm Hiện", "Tốc Biến"),
    (r"\bthiểm hiện\b", "tốc biến"),
    (r"Đoạt Lấy", "Tước Đoạt"),
    (r"\bđoạt lấy\b", "tước đoạt"),
    (r"(?<!ước )\bđoạt\b", "tước đoạt"),
    (r"Cấp Tạm Thời", "Cấp Độ Tạm Thời"),
    (r"\bcấp tạm thời\b", "cấp độ tạm thời"),
    (r"Thoái Tràng", "Lui Binh"),
    # 回合: "lượt" (game keywords say "khi bắt đầu lượt"), except "trong vòng 5 giây" which is plain Vietnamese
    (r"\btrong vòng (\d+(?:[.,]\d+)?) (giây|phút)", r"@@TRONG \1 \2@@"),
    # a rotation ("xoay 1 vòng") is a turn of the body, not a game round
    (r"\b(xoay|quay) (\d+) vòng", r"@@QUAY \1 \2@@"),
    (r"\bVòng\b", "Lượt"),
    (r"\bvòng\b", "lượt"),
    (r"@@TRONG ([^@]+)@@", r"trong vòng \1"),
    (r"@@QUAY ([a-z]+) (\d+)@@", r"\1 \2 vòng"),
]
TU_KHOA = [(re.compile(p), r) for p, r in TU_KHOA]
SKIP_KEYS = {"ghi_chu"}


def load_rename() -> list[tuple[re.Pattern, str]]:
    if not RENAME.exists():
        return []
    table = json.loads(RENAME.read_text(encoding="utf-8"))
    pairs = sorted(((old, new) for old, new in table.items() if old != new and not old.startswith("_")), key=lambda p: -len(p[0]))
    # letters on either side mean "part of another word", so names never match inside a longer word
    letters = "A-Za-zÀ-ỹ"
    result = []
    for old, new in pairs:
        # a new name that already contains the old one ("Tăng Viện X" -> "Quân Tăng Viện X") must not grow on every run
        at = new.find(old)
        guard = rf"(?<!{re.escape(new[:at])})" if at > 0 else ""
        result.append((re.compile(rf"(?<![{letters}]){guard}{re.escape(old)}(?![{letters}])"), new))
    return result


def fix_text(text: str, rename) -> str:
    slots: list[str] = []
    for pattern, new in rename:  # protect replaced names so a later, shorter old name cannot match inside them
        def hold(m, new=new):
            slots.append(new)
            return f"{len(slots) - 1}"
        text = pattern.sub(hold, text)
    for pattern, repl in TU_KHOA:
        text = pattern.sub(repl, text)
    return re.sub("(\\d+)", lambda m: slots[int(m.group(1))], text)


def walk(value, rename, stats: list[int]):
    if isinstance(value, str):
        new = fix_text(value, rename)
        if new != value:
            stats[0] += 1
        return new
    if isinstance(value, list):
        return [walk(v, rename, stats) for v in value]
    if isinstance(value, dict):
        return {k: (v if k in SKIP_KEYS else walk(v, rename, stats)) for k, v in value.items()}
    return value


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ đếm, không ghi")
    args = ap.parse_args()

    rename = load_rename()
    files = [p for p in sorted(DICH.glob("*.json")) if p.name not in {"doi-ten.json"}]
    files += sorted((DICH / "_nhap").glob("doi-hinh-*.json"))
    total = 0
    for path in files:
        raw = path.read_text(encoding="utf-8")
        data = json.loads(raw)
        stats = [0]
        fixed = walk(data, rename, stats)
        if stats[0]:
            total += stats[0]
            print(f"{path.relative_to(ROOT)}: {stats[0]} chuỗi đổi")
            if not args.kiem_tra:
                indent = 2 if '\n  "' in raw[:400] and '\n   "' not in raw[:400] else 1
                path.write_text(json.dumps(fixed, ensure_ascii=False, indent=indent) + "\n", encoding="utf-8")
    print(f"Tổng cộng {total} chuỗi {'sẽ đổi' if args.kiem_tra else 'đã đổi'}; bảng đổi tên: {len(rename)} mục")
    return 0


if __name__ == "__main__":
    sys.exit(main())

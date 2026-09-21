#!/usr/bin/env python3
"""Gộp tên mới (dễ hiểu hơn) do agent đề xuất vào data/dich/doi-ten.json.

    py scripts/gop_ten_moi.py            gộp
    py scripts/gop_ten_moi.py --kiem-tra chỉ báo cáo

Đầu vào: data/dich/_nhap/ten-moi-*.json, dạng { "<tên Trung>": "<tên Việt mới>" } (và "_nghi_van").
Tên Trung của trang phục có dạng "trang_phuc:<kỳ thủ>:<trang phục>". Tên cũ lấy từ các bản dịch hiện có.
Kết quả: mục {tên cũ: tên mới} được thêm vào data/dich/doi-ten.json (giữ các mục đã có, ví dụ tên tướng);
sau đó chạy `py scripts/thong_nhat_thuat_ngu.py` để áp lên mọi bản dịch.

Một tên cũ chỉ có một tên mới: cùng một lá bài có ở nhiều loại (ví dụ trang bị và thiên phú) thì lấy tên của loại
đứng trước theo thứ tự trang-bi, hieu-ung, thien-phu, ky-thu; xung đột được in ra.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DICH = ROOT / "data" / "dich"
NHAP = DICH / "_nhap"
CJK = re.compile(r"[㐀-鿿]")


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def old_names() -> dict[str, tuple[str, str]]:
    """{ khóa Trung -> (loại, tên cũ) } theo thứ tự ưu tiên."""
    result: dict[str, tuple[str, str]] = {}
    for kind in ("trang-bi", "hieu-ung", "thien-phu"):
        for zh, entry in load(DICH / f"{kind}.json").items():
            result.setdefault(zh, (kind, entry["ten"]))
    for player_zh, player in load(DICH / "ky-thu.json").items():
        if player_zh == "_chung":
            continue
        for zh, card in player.get("the", {}).items():
            result.setdefault(zh, ("ky-thu", card["ten"]))
        for skin_zh, name in player.get("trang_phuc", {}).items():
            result.setdefault(f"trang_phuc:{player_zh}:{skin_zh}", ("ky-thu", name))
    return result


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ báo cáo, không ghi")
    args = ap.parse_args()

    olds = old_names()
    table = load(DICH / "doi-ten.json")
    proposals: dict[str, str] = {}
    for part in sorted(NHAP.glob("ten-moi-*.json")):
        for zh, new in load(part).items():
            if zh != "_nghi_van":
                proposals[zh] = new

    order = {"trang-bi": 0, "hieu-ung": 1, "thien-phu": 2, "ky-thu": 3}
    added, conflicts, problems = 0, [], []
    for zh, new in sorted(proposals.items(), key=lambda kv: order.get(olds.get(kv[0], ("ky-thu", ""))[0], 9)):
        if zh not in olds:
            problems.append(f"không tìm thấy tên cũ của {zh}")
            continue
        if CJK.search(new) or not new.strip():
            problems.append(f"tên mới không hợp lệ cho {zh}: {new!r}")
            continue
        _, old = olds[zh]
        if old == new or old == "Nguyên bản":
            continue
        if old in table and table[old] != new:
            conflicts.append(f"{old!r}: giữ {table[old]!r}, bỏ {new!r} ({zh})")
            continue
        if old not in table:
            added += 1
        table[old] = new

    missing = [zh for zh in olds if zh not in proposals]
    print(f"{len(proposals)} tên mới đọc được, {added} mục thêm vào doi-ten.json, {len(table)} mục tất cả; chưa có đề xuất: {len(missing)}")
    for line in conflicts[:20]:
        print("XUNG ĐỘT", line)
    for line in problems[:20]:
        print("LỖI", line, file=sys.stderr)
    if not args.kiem_tra:
        (DICH / "doi-ten.json").write_text(json.dumps(table, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())

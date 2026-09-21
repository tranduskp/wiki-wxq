#!/usr/bin/env python3
"""Gộp bản dịch Đội hình: data/dich/_nhap/doi-hinh-*.json -> data/dich/doi-hinh.json, và kiểm tra với data/doi-hinh.json.

    py scripts/gop_doi_hinh.py            gộp + kiểm tra + ghi
    py scripts/gop_doi_hinh.py --kiem-tra chỉ kiểm tra (dùng sau khi sửa tay data/dich/doi-hinh.json)

Kiểm tra: khóa phải là mã đội hình có trong data/doi-hinh.json; `ten` không rỗng; `giai_doan` đúng số phần tử;
`ky_thu` chỉ chứa id có trong đội hình; các trường dịch không còn chữ Hán (trừ `ghi_chu`); mọi nhãn (tag) đã có bản dịch.
Thoát mã 1 nếu có lỗi. Đội hình chưa dịch chỉ được báo số lượng (trang vẫn hiện chữ gốc). Định dạng: data/dich/README.md.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "data" / "doi-hinh.json"
DICH = ROOT / "data" / "dich" / "doi-hinh.json"
NHAP = ROOT / "data" / "dich" / "_nhap"
CJK = re.compile(r"[㐀-鿿]")

# Nhãn (tag_zh và the_zh); dùng chữ, không emoji, để giao diện đồng nhất
TAGS = {
    "官方": "Chính thức",
    "新手": "Người mới",
    "🚀近期飙升": "Tăng nhanh gần đây",
    "🔥赛季热门": "Nổi bật mùa này",
    "🎲赌狗": "Đánh liều",
    "混沌裂隙": "Vết Nứt Hỗn Độn",
    "遛边艾琳": "Irene Kéo Biên",
    "🤡整活": "Chơi lầy",
    "😂欢乐": "Vui vẻ",
    "露娜不能死": "Luna Không Được Chết",
    "超级转型": "Chuyển Hướng Siêu Cấp",
}
TEXT_KEYS = ("ten", "tong_quan", "vi_tri", "trang_bi", "thien_phu", "hieu_ung")


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def check(lineups: list[dict], tr: dict) -> tuple[list[str], int]:
    errors: list[str] = []
    by_code = {x["ma"]: x for x in lineups}
    done = 0
    for code, t in tr.items():
        if code == "_chung":
            continue
        raw = by_code.get(code)
        if raw is None:
            errors.append(f"khóa lạ: {code}")
            continue
        done += 1
        if not t.get("ten"):
            errors.append(f"{code}: thiếu `ten`")
        for key in TEXT_KEYS:
            if key in t and CJK.search(t[key]):
                errors.append(f"{code}: `{key}` còn chữ Hán: {t[key][:40]}")
        phases = t.get("giai_doan")
        if phases is not None:
            if len(phases) != len(raw["giai_doan"]):
                errors.append(f"{code}: `giai_doan` có {len(phases)} phần tử, nguồn có {len(raw['giai_doan'])}")
            for i, text in enumerate(phases):
                if CJK.search(text):
                    errors.append(f"{code}: giai_doan[{i}] còn chữ Hán")
        ids = {str(k["id"]) for k in raw["ky_thu"]}
        for pid, text in (t.get("ky_thu") or {}).items():
            if pid not in ids:
                errors.append(f"{code}: ky_thu id lạ {pid}")
            if CJK.search(text):
                errors.append(f"{code}: ky_thu[{pid}] còn chữ Hán")
    tags = tr.get("_chung", {}).get("tag", {})
    for x in lineups:
        for zh in {x["tag_zh"], *x["the_zh"]} - {""}:
            if zh not in tags:
                errors.append(f"_chung.tag thiếu: {zh}")
    return sorted(set(errors)), done


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ kiểm tra, không ghi")
    args = ap.parse_args()

    lineups = json.loads(SOURCE.read_text(encoding="utf-8"))["doi_hinh"]
    tr = load(DICH)
    for part in sorted(NHAP.glob("doi-hinh-*.json")):
        tr.update(load(part))
    chung = tr.setdefault("_chung", {})
    chung["tag"] = {**chung.get("tag", {}), **TAGS}

    ordered = {"_chung": tr["_chung"]}
    ordered.update({x["ma"]: tr[x["ma"]] for x in lineups if x["ma"] in tr})
    errors, done = check(lineups, ordered)
    print(f"{done}/{len(lineups)} đội hình đã dịch, {sum(1 for k, v in ordered.items() if k != '_chung' and v.get('ghi_chu'))} có ghi chú")
    if not args.kiem_tra:
        DICH.write_text(json.dumps(ordered, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for line in errors[:60]:
        print("LỖI", line, file=sys.stderr)
    if len(errors) > 60:
        print(f"... và {len(errors) - 60} lỗi nữa", file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

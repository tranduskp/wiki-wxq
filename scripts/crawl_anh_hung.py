#!/usr/bin/env python3
"""Lấy chi tiết Anh Hùng (kỹ năng, chỉ số, từ khóa, các bản của lá bài) từ trang 4 của wxq.qq.com, cùng logo phe và icon từ khóa.

    py scripts/crawl_anh_hung.py             lấy dữ liệu, tải ảnh còn thiếu, ghi tệp
    py scripts/crawl_anh_hung.py --khong-anh chỉ lấy dữ liệu

Chỉ dùng thư viện chuẩn của Python 3. Nguồn (giống trang chính thức, xem js/cards.js của họ):
    https://game.gtimg.cn/images/amside/ide_timer/589094_oscard_new_1.js          (khóa "heroCards")
    https://game.gtimg.cn/images/osgame/cp/a20260707sfgw/card/icon/<tệp>.png      (logo phe, icon từ khóa)

Kết quả:
    data/ref/anh-hung/raw.json            bản gốc (tham chiếu, không đưa lên git)
    data/chi-tiet/anh-hung.json           { <tên Trung>: { ky_nang, chi_so, tu_khoa_zh, phien_ban } } cho trang web
    data/chi-tiet/bieu-tuong.json         { phe: {<khóa nhóm>: <ảnh>}, tu_khoa: {<tên Trung>: <ảnh>} }
    data/anh/the-bai/{ky-nang,phe,tu-khoa}/...   ảnh; sau đó chạy `py scripts/tao_anh_web.py`
Bản dịch nằm ở data/dich/anh-hung.json (trường `ky_nang`, xem data/dich/README.md); script này không ghi vào đó.

`phien_ban` xếp theo đúng thứ tự `anh_card` trong data/bai/anh-hung.json: mỗi phần tử { loai } là
"goc" (lá bài Anh Hùng), "thuc-tinh" (lá bài đã Thức Tỉnh) hoặc "lien-quan" (lá bài liên quan, ví dụ trang bị riêng
hoặc Chiến Thuật); `sau_thuc_tinh` là true khi lá liên quan đó thuộc về bản Thức Tỉnh.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "data" / "ref" / "anh-hung"
OUT_DIR = ROOT / "data" / "chi-tiet"
ANH = ROOT / "data" / "anh"

DATA_URL = "https://game.gtimg.cn/images/amside/ide_timer/589094_oscard_new_1.js"
ICON_BASE = "https://game.gtimg.cn/images/osgame/cp/a20260707sfgw/card/icon/"
USER_AGENT = "Mozilla/5.0 (compatible; wiki-wxq-crawler/1.0)"
PNG = b"\x89PNG\r\n\x1a\n"

# nhóm (khu vực) -> (tệp trên máy chủ, tên tệp của mình)
PHE = {
    "大河流域": ("Icon_DaHeLiuYu.png", "dai-ha"),
    "逐鹿": ("Icon_ZhuLu.png", "truc-loc"),
    "三分之地": ("Icon_SanFenZhiDi.png", "tam-phan"),
    "河洛": ("Icon_HeLuo.png", "ha-lac"),
    "日落海": ("Icon_RiLuoHai.png", "nhat-lac-hai"),
    "无阵营": ("wuzhenyin.png", "vo-tran-doanh"),
}
TU_KHOA = {
    "登场": ("dengchang.png", "xuat-tran"),
    "开团": ("jiaofeng.png", "khai-chien"),
    "整备": ("zhengbei.png", "chinh-don"),
    "牺牲": ("xisheng.png", "hi-sinh"),
    "复生": ("fusheng.png", "hoi-sinh"),
    "凯旋": ("kaixuan.png", "khai-hoan"),
    "败阵": ("baizhen.png", "bai-tran"),
    "合成": ("hecheng.png", "tong-hop"),
    "闪现": ("shanxian.png", "toc-bien"),
    "夺取": ("sheling.png", "tuoc-doat"),
    "退场": ("tuichang.png", "lui-binh"),
    "图腾": ("tuteng.png", "do-dang"),
}
TAG = re.compile(r"</?(?:color|b|a|i|u|size)[^>]*>|<br\s*/?>", re.I)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def clean(text: str | None) -> str:
    return TAG.sub("", text or "").replace("\r", "").strip()


def as_list(value) -> list[str]:
    return [value] if isinstance(value, str) else list(value or [])


def percent(value: float) -> float:
    return round(value, 2) if value % 1 else int(value)


def variants(hero: dict, urls: list[str]) -> list[dict]:
    """Nhận diện từng ảnh trong anh_card: lá gốc, lá Thức Tỉnh, hay lá liên quan (trước/sau Thức Tỉnh)."""
    awakened = (hero.get("heroCard") or {}).get("awakeingCard") or {}
    base, awake = hero.get("cardImage"), awakened.get("cardImage")
    result, seen_awake = [], False
    for url in urls:
        if url == base:
            result.append({"loai": "goc"})
        elif url == awake:
            seen_awake = True
            result.append({"loai": "thuc-tinh"})
        else:
            result.append({"loai": "lien-quan", "sau_thuc_tinh": seen_awake})
    return result


def build(heroes: list[dict], bai: dict[str, dict], icons: dict[str, str]) -> dict:
    out = {}
    for hero in heroes:
        row = bai.get(hero["name"])
        card = hero.get("heroCard") or {}
        if row is None or not card:
            continue
        skill = (card.get("skillList") or [{}])[0]
        props = card.get("properties") or {}
        entry = {
            "id": hero["id"],
            "phe": row["ten_khu_vuc"],
            "ky_nang": {
                "ten_zh": skill.get("name", ""),
                "mo_ta_zh": clean(skill.get("desc")),
                "icon": icons.get(f"ky-nang/{hero['id']}"),
                "nang_cap": [
                    {"cap": p.get("level"), "mo_ta_zh": clean(p.get("desc"))}
                    for p in (skill.get("enhanceSkill") or {}).get("params") or []
                ],
            },
            "chi_so": {
                "mau": props.get("HP", 0),
                "phap_luc_dau": props.get("initEnergy", 0),
                "phap_luc_max": props.get("energy", 0),
                "cong_vat_ly": props.get("phyAttack", 0),
                "cong_phap_thuat": props.get("magAttack", 0),
                "thu_vat_ly": props.get("phyDefense", 0),
                "thu_phap_thuat": props.get("magDefense", 0),
                "ti_le_chi_mang": percent(props.get("criticalRate", 0) / 100),
                "hieu_qua_chi_mang": percent((1 + props.get("criticalEffect", 0) / 10000) * 100),
                "toc_do_danh": percent(props.get("attackSpeed", 0) / 10000),
                "tam_danh": props.get("attackDistance", 0),
            },
            "tu_khoa_zh": [k["name"] for k in card.get("keywordDescription") or []],
            "phien_ban": variants(hero, as_list(row["anh_card"])),
        }
        out[hero["name"]] = entry
    return out


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--khong-anh", action="store_true", help="không tải ảnh")
    args = ap.parse_args()

    raw = json.loads(fetch(DATA_URL).decode("utf-8"))
    heroes = raw["heroCards"]
    REF.mkdir(parents=True, exist_ok=True)
    (REF / "raw.json").write_text(json.dumps(heroes, ensure_ascii=False, indent=1), encoding="utf-8")
    bai = {r["ten_tuong_hoac_the"]: r for r in json.loads((ROOT / "data" / "bai" / "anh-hung.json").read_text(encoding="utf-8"))}

    # ảnh cần tải: url -> đường dẫn tương đối so với data/anh/ ; icons: khóa -> đường dẫn
    downloads: dict[str, str] = {}
    icons: dict[str, str] = {}
    for hero in heroes:
        skill = ((hero.get("heroCard") or {}).get("skillList") or [{}])[0]
        if skill.get("icon"):
            rel = f"the-bai/ky-nang/{hero['id']}.png"
            downloads[skill["icon"]] = rel
            icons[f"ky-nang/{hero['id']}"] = rel
    bieu_tuong = {"phe": {}, "tu_khoa": {}}
    for zh, (file, slug) in PHE.items():
        rel = f"the-bai/phe/{slug}.png"
        downloads[ICON_BASE + file] = rel
        bieu_tuong["phe"][zh] = rel
    for zh, (file, slug) in TU_KHOA.items():
        rel = f"the-bai/tu-khoa/{slug}.png"
        downloads[ICON_BASE + file] = rel
        bieu_tuong["tu_khoa"][zh] = rel

    data = build(heroes, bai, icons)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "anh-hung.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (OUT_DIR / "bieu-tuong.json").write_text(json.dumps(bieu_tuong, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(data)} anh hùng, {len(downloads)} ảnh -> data/chi-tiet/")

    failed: list[str] = []
    if not args.khong_anh:
        def one(item: tuple[str, str]) -> None:
            url, rel = item
            dest = ANH / rel
            if dest.is_file():
                return
            dest.parent.mkdir(parents=True, exist_ok=True)
            try:
                body = fetch(url)
                if not body.startswith(PNG):
                    raise ValueError("không phải PNG")
                dest.write_bytes(body)
            except (urllib.error.URLError, TimeoutError, ValueError, OSError) as exc:
                failed.append(f"{rel} <- {url} ({exc})")

        with ThreadPoolExecutor(max_workers=8) as pool:
            list(pool.map(one, downloads.items()))
        print("Tiếp theo: py scripts/tao_anh_web.py")
    for line in failed:
        print("LỖI", line, file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

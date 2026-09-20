#!/usr/bin/env python3
"""Tải toàn bộ ảnh trong data/bai/*.json về data/anh/ và ghi data/anh/manifest.json (cho agent) cùng data/anh/theo-url.json (cho trang web).

Chỉ dùng thư viện chuẩn của Python 3 (không cần pip). Chạy từ bất kỳ thư mục nào:

    py scripts/tai_anh.py                 tải mọi loại bài, bỏ qua ảnh đã có
    py scripts/tai_anh.py --loai thien-phu trang-bi
    py scripts/tai_anh.py --lai           tải lại cả ảnh đã có
    py scripts/tai_anh.py --kiem-tra      chỉ kiểm tra, không tải (thoát mã 1 nếu thiếu ảnh)

Quy tắc đặt tên (đọc data/anh/README.md):
    data/anh/<loai>/<NNN>_card<v>.png    ảnh lá bài, NNN = số thứ tự dòng trong data/bai/<loai>.json (từ 001), v = bản (từ 1)
    data/anh/<loai>/icon/<NNN>.png       icon riêng của lá bài
    Ảnh trùng URL chỉ tải một lần; manifest.json luôn trỏ tới tệp thật, nên không cần biết ảnh nào dùng chung.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BAI = ROOT / "data" / "bai"
ANH = ROOT / "data" / "anh"
MANIFEST = ANH / "manifest.json"
BY_URL = ANH / "theo-url.json"

LOAI = ["anh-hung", "hieu-ung", "thien-phu", "trang-bi"]
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
USER_AGENT = "Mozilla/5.0 (compatible; wiki-wxq-image-sync/1.0)"


@dataclass
class Job:
    """Một tệp cần có trên đĩa. Nhiều ô trong manifest có thể dùng chung một Job (ảnh trùng URL)."""
    url: str
    rel: str  # đường dẫn tương đối so với data/anh/, dùng dấu /
    error: str = ""
    status: str = ""  # "co-san" | "da-tai" | "loi"


@dataclass
class Plan:
    jobs: dict[str, Job] = field(default_factory=dict)  # url -> Job (chủ sở hữu đầu tiên)
    entries: dict[str, list[dict]] = field(default_factory=dict)

    def claim(self, url: str, rel: str) -> str:
        """Trả về đường dẫn tương đối của tệp chứa url; tạo Job mới nếu url chưa có ai giữ."""
        job = self.jobs.get(url)
        if job is None:
            job = self.jobs[url] = Job(url=url, rel=rel)
        return job.rel


def as_list(value) -> list[str]:
    return [value] if isinstance(value, str) else list(value or [])


def build_plan(loai_list: list[str]) -> Plan:
    plan = Plan()
    for loai in loai_list:
        rows = json.loads((BAI / f"{loai}.json").read_text(encoding="utf-8"))
        entries = plan.entries.setdefault(loai, [])
        for i, row in enumerate(rows, start=1):
            n = f"{i:03d}"
            icon = plan.claim(row["anh_icon"], f"{loai}/icon/{n}.png") if row.get("anh_icon") else None
            cards = [
                plan.claim(url, f"{loai}/{n}_card{v}.png")
                for v, url in enumerate(as_list(row.get("anh_card")), start=1)
            ]
            entries.append({
                "id": f"{loai}/{n}",
                "ten_zh": row["ten_tuong_hoac_the"],
                "nhom_zh": row.get("ten_khu_vuc", ""),
                "icon": icon,
                "cards": cards,
            })
    return plan


def fetch(job: Job, retries: int = 3, timeout: int = 30) -> None:
    dest = ANH / job.rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    last = ""
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(job.url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                body = resp.read()
                expected = resp.headers.get("Content-Length")
            if expected and int(expected) != len(body):
                raise ValueError(f"thiếu dữ liệu ({len(body)}/{expected} byte)")
            if not body.startswith(PNG_MAGIC):
                raise ValueError("không phải tệp PNG")
            tmp.write_bytes(body)
            tmp.replace(dest)
            job.status = "da-tai"
            return
        except (urllib.error.URLError, TimeoutError, ValueError, OSError) as exc:
            last = str(exc)
            time.sleep(1.5 * attempt)
    tmp.unlink(missing_ok=True)
    job.status, job.error = "loi", last


def is_valid(path: Path) -> bool:
    try:
        with path.open("rb") as fh:
            return fh.read(8) == PNG_MAGIC
    except OSError:
        return False


def main() -> int:
    # Windows console defaults to a legacy code page that cannot print Vietnamese.
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--loai", nargs="+", choices=LOAI, default=LOAI, help="chỉ xử lý các loại này")
    ap.add_argument("--lai", action="store_true", help="tải lại cả ảnh đã có")
    ap.add_argument("--kiem-tra", action="store_true", help="chỉ kiểm tra tệp còn thiếu, không tải")
    ap.add_argument("--workers", type=int, default=8, help="số luồng tải song song (mặc định 8)")
    args = ap.parse_args()

    plan = build_plan(args.loai)
    todo: list[Job] = []
    for job in plan.jobs.values():
        if not args.lai and is_valid(ANH / job.rel):
            job.status = "co-san"
        else:
            todo.append(job)
    print(f"{len(plan.jobs)} ảnh duy nhất, {len(plan.jobs) - len(todo)} đã có, {len(todo)} cần tải.")

    if args.kiem_tra:
        for job in todo:
            print("THIẾU", job.rel)
        return 1 if todo else 0

    if todo:
        done = 0
        with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
            futures = [pool.submit(fetch, job) for job in todo]
            for fut in as_completed(futures):
                fut.result()
                done += 1
                if done % 25 == 0 or done == len(todo):
                    print(f"  {done}/{len(todo)}", flush=True)

    failed = [j for j in plan.jobs.values() if j.status == "loi"]
    ANH.mkdir(parents=True, exist_ok=True)
    manifest = {
        "_ghi_chu": "Tệp sinh tự động bởi scripts/tai_anh.py; đừng sửa tay. Đường dẫn tính từ data/anh/.",
        "tao_luc": time.strftime("%Y-%m-%d %H:%M:%S"),
        "loai": {
            loai: [
                {**e, "tai_duoc": all(
                    (ANH / p).is_file() for p in ([e["icon"]] if e["icon"] else []) + e["cards"]
                )}
                for e in entries
            ]
            for loai, entries in plan.entries.items()
        },
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    # url -> tệp, cho trang web (LocalImagePolicy) đổi link Tencent trong data/bai sang ảnh cục bộ
    BY_URL.write_text(
        json.dumps({url: job.rel for url, job in plan.jobs.items()}, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    total_bytes = sum((ANH / j.rel).stat().st_size for j in plan.jobs.values() if (ANH / j.rel).is_file())
    print(f"Xong: {len(plan.jobs) - len(failed)}/{len(plan.jobs)} ảnh, {total_bytes / 1e6:.1f} MB. Manifest: {MANIFEST.relative_to(ROOT)}")
    for job in failed:
        print("LỖI", job.rel, job.url, "->", job.error, file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Máy chủ thử cho trang web: py scripts/serve.py [cổng]  (mặc định 8080), mở http://localhost:8080

Thay cho `py -m http.server`: trang này tải vài trăm ảnh và module cùng lúc, và hàng đợi kết nối mặc định
của http.server (5) bị tràn, trình duyệt nhận ERR_CONNECTION_REFUSED và ảnh không hiện. Ở đây hàng đợi lớn,
dùng kết nối giữ sống (keep-alive), và bật `no-cache` để sửa file xong tải lại là thấy.
"""
from __future__ import annotations

import functools
import socket
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):  # yên lặng: mỗi lần tải trang có hàng trăm dòng
        pass


class Server(ThreadingHTTPServer):
    request_queue_size = 512
    daemon_threads = True
    address_family = socket.AF_INET6

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)  # nhận cả IPv4 lẫn IPv6
        super().server_bind()

    def handle_error(self, request, client_address):
        if not isinstance(sys.exc_info()[1], (ConnectionError, TimeoutError)):
            super().handle_error(request, client_address)  # trình duyệt ngắt giữa chừng thì bỏ qua


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    handler = functools.partial(Handler, directory=str(ROOT))
    try:
        server = Server(("::", port), handler)
    except OSError:  # máy không có IPv6
        Server.address_family = socket.AF_INET
        Server.server_bind = ThreadingHTTPServer.server_bind
        server = Server(("", port), handler)
    print(f"Mo http://localhost:{port} trong trinh duyet. Nhan Ctrl+C de dung.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

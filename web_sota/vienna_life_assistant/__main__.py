"""Enable ``python -m vienna_life_assistant``.

The fleet launcher runs ``python -m vienna_life_assistant``. Without this file Python
refuses with "'vienna_life_assistant' is a package and cannot be directly executed",
and because the backend starts in a hidden window that failure was silent -- the
dashboard loaded and every API call returned 404.

Mirrors the run block already at the bottom of server.py. The port is read from
WEB_PORT so it follows fleet-start.config.ps1 instead of being pinned in two places.
"""

from __future__ import annotations

import os
import sys


def _run() -> int:
    import uvicorn

    from vienna_life_assistant.server import app

    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("WEB_PORT", "10922")))
    return 0


if __name__ == "__main__":
    sys.exit(_run())

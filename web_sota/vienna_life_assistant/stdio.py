"""Stdio entry point for the MCPB bundle (Claude Desktop).

Launches the vienna-life FastMCP server over stdio. The HTTP webapp
(server.py, uvicorn) is NOT part of the bundle — this module only needs the
portmanteau tools, the SQLite store (VILIFE_DB_PATH override respected) and
the restaurant/culture datasets, all of which live under this package.
"""

from __future__ import annotations


def main() -> None:
    from vienna_life_assistant.vienna_life_mcp import mcp

    mcp.run()


if __name__ == "__main__":
    main()

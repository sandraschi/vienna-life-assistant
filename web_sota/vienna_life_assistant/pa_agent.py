"""ViLife PA agent — LLM reasoning over life data + tool-calling loop.

Two surfaces:
- Single-shot: generate_brief / answer_question (PA engine).
- Agent loop: run_agent — the LLM decides vienna_* tool calls, the loop
  executes them locally (same functions the MCP tools expose) and reflects.

Works with any OpenAI-compatible chat-completions endpoint (Ollama /v1,
LM Studio, OpenAI). If no LLM is reachable, every function degrades
gracefully to structured text so the PA never hard-fails.
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any
from urllib.request import Request, urlopen

from vienna_life_assistant.vienna_context import VIENNA_SYSTEM_PREPROMPT

logger = logging.getLogger("vienna-life-assistant.pa")

MAX_AGENT_ITERATIONS = 5
LLM_TIMEOUT = 90

_PREFERRED_LOCAL_MODELS = [
    "gemma4:12b",
    "gemma4:26b",
    "qwen3.6:27b",
    "qwen2.5:32b",
    "llama3.2:3b",
    "llama3.1:8b",
]


def _ollama_tags(base: str) -> list[str]:
    """Fetch installed Ollama model names; empty on failure."""
    try:
        with urlopen(Request(f"{base}/api/tags", method="GET"), timeout=5) as resp:
            return [m["name"] for m in json.loads(resp.read()).get("models", [])]
    except Exception:  # noqa: BLE001
        return []


def _pick_ollama_model(models: list[str]) -> str:
    for preferred in _PREFERRED_LOCAL_MODELS:
        if preferred in models:
            return preferred
    local = [m for m in models if ":cloud" not in m and ":latest" not in m]
    return local[0] if local else models[0]


# --- Provider resolution -----------------------------------------------------


def resolve_llm() -> dict[str, Any] | None:
    """Resolve the active provider to an OpenAI-compatible endpoint.

    Avoids llm_routes._detect_ollama (it force-sets OLLAMA_MODEL to the first
    tag, which may be a reasoning model that returns empty content). We pick
    a known-good local model ourselves.
    """
    provider = os.environ.get("LLM_PROVIDER", "")

    if not provider:
        ollama_base = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
        if _ollama_tags(ollama_base):
            provider = "ollama"
        else:
            from vienna_life_assistant.llm_routes import _detect_lmstudio

            detected, _ = _detect_lmstudio()
            if detected:
                provider = "lmstudio"

    if provider == "ollama":
        base = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
        model = os.environ.get("OLLAMA_MODEL", "") or _pick_ollama_model(
            _ollama_tags(base)
        )
        return {
            "url_base": f"{base}/v1",
            "model": model,
            "headers": {"Content-Type": "application/json"},
            "provider": "ollama",
        }

    if provider == "lmstudio":
        url = os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1").rstrip("/")
        model = os.environ.get("LMSTUDIO_MODEL", "") or ""
        if not model:
            return None
        return {
            "url_base": url,
            "model": model,
            "headers": {"Content-Type": "application/json"},
            "provider": "lmstudio",
        }

    if provider == "openai":
        key = os.environ.get("OPENAI_API_KEY") or os.environ.get("LOCAL_LLM_KEY") or ""
        if not key:
            return None
        url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        return {
            "url_base": url,
            "model": model,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {key}",
            },
            "provider": "openai",
        }

    return None


def _chat_message(
    url_base: str, payload: dict, headers: dict[str, str], timeout: int = LLM_TIMEOUT
) -> dict[str, Any]:
    """Full chat-completions response message (content + tool_calls)."""
    body = json.dumps(payload).encode()
    req = Request(
        f"{url_base.rstrip('/')}/chat/completions", data=body, headers=headers
    )
    with urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read())
    return data.get("choices", [{}])[0].get("message", {})


# --- Tool surface (curated subset of the vienna_* portmanteaus) --------------

_TOOL_SPECS: list[dict[str, Any]] = [
    {
        "name": "vienna_life__calendar_today",
        "run": "vienna_life",
        "op": "calendar_today",
        "description": "Today's calendar events.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_life__todo_list",
        "run": "vienna_life",
        "op": "todo_list",
        "description": "Open todos.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_life__todo_add",
        "run": "vienna_life",
        "op": "todo_add",
        "description": "Add a todo.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Todo text"},
                "priority": {"type": "string", "enum": ["high", "normal", "low"]},
            },
            "required": ["title"],
        },
    },
    {
        "name": "vienna_life__todo_toggle",
        "run": "vienna_life",
        "op": "todo_toggle",
        "description": "Toggle a todo done/open.",
        "parameters": {
            "type": "object",
            "properties": {"row_id": {"type": "integer"}},
            "required": ["row_id"],
        },
    },
    {
        "name": "vienna_life__expense_add",
        "run": "vienna_life",
        "op": "expense_add",
        "description": "Log an expense.",
        "parameters": {
            "type": "object",
            "properties": {
                "store": {"type": "string"},
                "amount_eur": {"type": "number"},
                "category": {"type": "string"},
                "date": {"type": "string", "description": "YYYY-MM-DD, optional"},
            },
            "required": ["store", "amount_eur"],
        },
    },
    {
        "name": "vienna_life__event_add",
        "run": "vienna_life",
        "op": "event_add",
        "description": "Add a calendar event.",
        "parameters": {
            "type": "object",
            "properties": {
                "date_str": {"type": "string", "description": "YYYY-MM-DD"},
                "title": {"type": "string"},
                "time": {"type": "string", "description": "HH:MM"},
                "category": {"type": "string"},
                "location": {"type": "string"},
            },
            "required": ["date_str", "title"],
        },
    },
    {
        "name": "vienna_life__life_brief",
        "run": "vienna_life",
        "op": "life_brief",
        "description": "Structured life brief (calendar, todos, meds, trips, birthdays).",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_health__meds",
        "run": "vienna_health",
        "op": "meds",
        "description": "Active medications.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_health__visits",
        "run": "vienna_health",
        "op": "visits",
        "description": "Doctor visit log.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_health__visits_add",
        "run": "vienna_health",
        "op": "visits_add",
        "description": "Log a doctor visit.",
        "parameters": {
            "type": "object",
            "properties": {
                "date": {"type": "string"},
                "doctor": {"type": "string"},
                "specialty": {"type": "string"},
                "reason": {"type": "string"},
                "diagnosis": {"type": "string"},
                "follow_up_date": {"type": "string"},
            },
            "required": ["date", "doctor"],
        },
    },
    {
        "name": "vienna_log__add",
        "run": "vienna_log",
        "op": "add",
        "description": "Add a journal entry.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "body": {"type": "string"},
                "mood": {"type": "integer", "description": "1-10"},
                "tags": {"type": "string"},
            },
            "required": ["body"],
        },
    },
    {
        "name": "vienna_log__today",
        "run": "vienna_log",
        "op": "today",
        "description": "Today's journal entries.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_email__inbox",
        "run": "vienna_email",
        "op": "inbox",
        "description": "Recent emails.",
        "parameters": {"type": "object", "properties": {"limit": {"type": "integer"}}},
    },
    {
        "name": "vienna_email__search",
        "run": "vienna_email",
        "op": "search",
        "description": "Search emails.",
        "parameters": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "vienna_email__send",
        "run": "vienna_email",
        "op": "send",
        "description": "Send an email.",
        "parameters": {
            "type": "object",
            "properties": {
                "to": {"type": "string"},
                "subject": {"type": "string"},
                "body": {"type": "string"},
                "cc": {"type": "string"},
            },
            "required": ["to", "subject", "body"],
        },
    },
    {
        "name": "vienna_travel__trips",
        "run": "vienna_travel",
        "op": "trips",
        "description": "Upcoming trips with countdown.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_travel__trip_add",
        "run": "vienna_travel",
        "op": "trip_add",
        "description": "Plan a trip.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "start_date": {"type": "string"},
                "end_date": {"type": "string"},
                "destination": {"type": "string"},
                "mode": {"type": "string"},
                "carrier": {"type": "string"},
                "status": {"type": "string"},
            },
            "required": ["title", "start_date"],
        },
    },
    {
        "name": "vienna_contacts__list",
        "run": "vienna_contacts",
        "op": "list",
        "description": "List contacts.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_contacts__birthdays",
        "run": "vienna_contacts",
        "op": "birthdays",
        "description": "Upcoming birthdays.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_contacts__add",
        "run": "vienna_contacts",
        "op": "add",
        "description": "Add a contact.",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "phone": {"type": "string"},
                "email": {"type": "string"},
                "birthday": {"type": "string"},
                "relationship": {"type": "string"},
            },
            "required": ["name"],
        },
    },
    {
        "name": "vienna_household__subscriptions",
        "run": "vienna_household",
        "op": "subscriptions",
        "description": "Subscriptions with monthly total.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_household__task_add",
        "run": "vienna_household",
        "op": "task_add",
        "description": "Add a home task.",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "category": {"type": "string"},
                "due_date": {"type": "string"},
                "frequency_days": {"type": "integer"},
            },
            "required": ["name"],
        },
    },
    {
        "name": "vienna_household__pet",
        "run": "vienna_household",
        "op": "pet",
        "description": "Pet care events (Benny).",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "vienna_notes__export_journal",
        "run": "vienna_notes",
        "op": "export_journal",
        "description": "Export a journal entry to OneNote.",
        "parameters": {
            "type": "object",
            "properties": {"entry_id": {"type": "integer"}},
            "required": ["entry_id"],
        },
    },
    {
        "name": "fleet_tools",
        "run": "fleet",
        "description": "List the MCP tools exposed by a fleet server (plex-mcp, calibre-mcp, gtfs-mcp, aiwatcher-mcp, devices-mcp). Call this first to discover what a server can do.",
        "parameters": {
            "type": "object",
            "properties": {"server": {"type": "string"}},
            "required": ["server"],
        },
    },
    {
        "name": "fleet_call",
        "run": "fleet",
        "description": "Call a tool on another fleet MCP server. Use fleet_tools first to discover the tool name and arguments. Examples: plex-mcp media search/play, calibre-mcp book lookup, gtfs-mcp live departures, aiwatcher-mcp top news, devices-mcp Fritz!Box internet status.",
        "parameters": {
            "type": "object",
            "properties": {
                "server": {"type": "string"},
                "tool": {"type": "string"},
                "arguments": {
                    "type": "object",
                    "description": "Tool arguments as a JSON object",
                },
            },
            "required": ["server", "tool"],
        },
    },
    {
        "name": "fritz_status",
        "run": "fleet",
        "description": "Fritz!Box home network status via devices-mcp: internet/WAN health, uptime, cameras. Ask when the user mentions internet problems, router, or home network.",
        "parameters": {"type": "object", "properties": {}},
    },
]

# Keys that move into the tool's data= dict instead of top-level args.
_DATA_KEYS: dict[str, list[str]] = {
    "vienna_life__todo_add": ["priority", "due_date"],
    "vienna_life__expense_add": ["store", "amount_eur", "category", "date"],
    "vienna_life__event_add": ["time", "category", "location"],
    "vienna_health__visits_add": [
        "date",
        "doctor",
        "specialty",
        "reason",
        "diagnosis",
        "follow_up_date",
    ],
    "vienna_log__add": ["title", "body", "mood", "tags", "date"],
    "vienna_email__send": ["to", "subject", "body", "cc"],
    "vienna_travel__trip_add": [
        "title",
        "start_date",
        "end_date",
        "destination",
        "mode",
        "carrier",
        "status",
    ],
    "vienna_contacts__add": ["name", "phone", "email", "birthday", "relationship"],
    "vienna_household__task_add": ["name", "category", "due_date", "frequency_days"],
}

_FUNCS: dict[str, Any] = {}


def _tool_schemas() -> list[dict[str, Any]]:
    return [
        {
            "type": "function",
            "function": {k: s[k] for k in ("name", "description", "parameters")},
        }
        for s in _TOOL_SPECS
    ]


async def execute_tool(name: str, args: dict[str, Any]) -> dict[str, Any]:
    """Run one vienna_* tool locally. Returns the tool's result dict."""
    global _FUNCS
    if not _FUNCS:
        from vienna_life_assistant.vienna_life_mcp import (
            vienna_contacts,
            vienna_email,
            vienna_health,
            vienna_household,
            vienna_life,
            vienna_log,
            vienna_notes,
            vienna_travel,
        )

        _FUNCS = {
            "vienna_life": vienna_life,
            "vienna_health": vienna_health,
            "vienna_log": vienna_log,
            "vienna_email": vienna_email,
            "vienna_travel": vienna_travel,
            "vienna_contacts": vienna_contacts,
            "vienna_household": vienna_household,
            "vienna_notes": vienna_notes,
        }

    spec = next((s for s in _TOOL_SPECS if s["name"] == name), None)
    if spec is None:
        return {"success": False, "error": f"unknown tool {name}"}

    if spec["run"] == "fleet":
        from vienna_life_assistant import fleet_mcp

        if name == "fleet_tools":
            tools = fleet_mcp.list_tools(args.get("server", ""))
            if not tools:
                return {
                    "success": False,
                    "error": f"server '{args.get('server', '')}' offline or not allowlisted",
                }
            return {
                "success": True,
                "server": args.get("server"),
                "tools": [
                    {
                        "name": t.get("name"),
                        "description": (t.get("description") or "")[:200],
                    }
                    for t in tools[:40]
                ],
            }
        if name == "fritz_status":
            return fleet_mcp.fritz_status()
        return fleet_mcp.call_tool(
            args.get("server", ""), args.get("tool", ""), args.get("arguments") or {}
        )

    fn = _FUNCS[spec["run"]]
    kwargs: dict[str, Any] = {"operation": spec["op"]}
    rest = dict(args or {})
    data_keys = _DATA_KEYS.get(name, [])
    data = {k: rest.pop(k) for k in data_keys if k in rest}
    kwargs.update(rest)
    if data:
        kwargs["data"] = data
    try:
        result = await fn(**kwargs)
        return (
            result
            if isinstance(result, dict)
            else {"success": True, "result": str(result)}
        )
    except Exception as e:  # noqa: BLE001 — tool errors feed back to the LLM
        logger.warning("tool %s failed: %s", name, e)
        return {"success": False, "error": str(e)}


# --- Agent loop ---------------------------------------------------------------


async def run_agent(
    messages: list[dict[str, str]],
    system_prompt: str | None = None,
    max_iterations: int = MAX_AGENT_ITERATIONS,
) -> dict[str, Any]:
    """Chat with tool execution. Returns {ok, response, trace, tool_calls}."""
    llm = resolve_llm()
    if llm is None:
        return {
            "ok": False,
            "error": "No LLM configured/reachable — start Ollama or set a provider in Settings",
        }

    msgs: list[dict[str, Any]] = [
        {"role": "system", "content": system_prompt or VIENNA_SYSTEM_PREPROMPT},
        *[
            {"role": m.get("role", "user"), "content": m.get("content", "")}
            for m in messages
            if m.get("content")
        ],
    ]
    trace: list[dict[str, Any]] = []
    final = ""

    for _ in range(max_iterations):
        payload: dict[str, Any] = {
            "model": llm["model"],
            "messages": msgs,
            "max_tokens": 2048,
            "stream": False,
            "tools": _tool_schemas(),
            "tool_choice": "auto",
        }
        try:
            import asyncio as _asyncio

            message = await _asyncio.to_thread(
                _chat_message, llm["url_base"], payload, llm["headers"]
            )
        except Exception as e:  # noqa: BLE001
            logger.warning("agent LLM call failed: %s", e)
            return {"ok": False, "error": f"LLM call failed: {e}"}

        if message.get("content"):
            final = message["content"]
        tool_calls = message.get("tool_calls") or []
        if not tool_calls:
            break

        msgs.append(
            {
                "role": "assistant",
                "content": message.get("content") or "",
                "tool_calls": tool_calls,
            }
        )
        for tc in tool_calls:
            fn = tc.get("function", {})
            name = fn.get("name", "")
            try:
                args = json.loads(fn.get("arguments") or "{}")
            except json.JSONDecodeError:
                args = {}
            result = await execute_tool(name, args)
            short = (
                {k: v for k, v in result.items() if k != "items"}
                if isinstance(result, dict)
                else result
            )
            trace.append({"tool": name, "args": args, "result": short})
            msgs.append(
                {
                    "role": "tool",
                    "tool_call_id": tc.get("id", ""),
                    "content": json.dumps(result, default=str)[:4000],
                }
            )

    if not final:
        final = "…" if trace else "No response."
    return {"ok": True, "response": final, "trace": trace, "tool_calls": len(trace)}


# --- Single-shot PA calls -----------------------------------------------------


def _completion(system: str, user: str, max_tokens: int = 1200) -> str | None:
    llm = resolve_llm()
    if llm is None:
        return None
    payload = {
        "model": llm["model"],
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "max_tokens": max_tokens,
        "stream": False,
    }
    try:
        message = _chat_message(llm["url_base"], payload, llm["headers"])
        return (message.get("content") or "").strip() or None
    except Exception as e:  # noqa: BLE001
        logger.warning("PA completion failed: %s", e)
        return None


def generate_brief(context_md: str) -> str | None:
    """LLM morning brief over real life context."""
    return _completion(
        "You are ViLife, Sandra's personal assistant in Vienna (Alsergrund). "
        "Produce a warm, practical morning brief from the life context. Use headings, "
        "keep it under 30 lines: what matters today (calendar, health, trips), what to "
        "watch (renewals, birthdays, refills), one small suggestion. Plain markdown.",
        f"Life context:\n\n{context_md}",
        max_tokens=1500,
    )


def answer_question(question: str, context_md: str) -> str | None:
    """NL question over life data."""
    return _completion(
        "You are ViLife, Sandra's personal assistant in Vienna. Answer the question "
        "using ONLY the life context provided. If the answer is not in the context, say "
        "so and suggest the closest tool that could fetch it. Be concise.",
        f"Life context:\n\n{context_md}\n\nQuestion: {question}",
        max_tokens=800,
    )

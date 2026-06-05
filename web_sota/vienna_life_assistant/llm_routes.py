"""Local LLM glom-on + chat — Ollama, LM Studio, OpenAI (switchable)."""

from __future__ import annotations

import json
import os
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter

from vienna_life_assistant.vienna_context import CHAT_PREPROMPTS, VIENNA_SYSTEM_PREPROMPT

router = APIRouter(prefix="/api/llm", tags=["llm"])

OPENAI_DEFAULT_URL = "https://api.openai.com/v1"
OPENAI_FALLBACK_MODELS = [
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4.1",
    "gpt-4.1-mini",
    "o3-mini",
    "o4-mini",
]


def _openai_key() -> str:
    return os.environ.get("OPENAI_API_KEY") or os.environ.get("LOCAL_LLM_KEY") or ""


def _openai_base() -> str:
    return (os.environ.get("OPENAI_BASE_URL") or os.environ.get("LOCAL_LLM_URL") or OPENAI_DEFAULT_URL).rstrip("/")


def _detect_ollama() -> tuple[bool, str | None]:
    for host in ("http://127.0.0.1:11434", "http://localhost:11434"):
        try:
            req = Request(f"{host}/api/tags", method="GET")
            with urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read())
            models = [m["name"] for m in data.get("models", [])]
            if models:
                os.environ.setdefault("OLLAMA_URL", host)
                preferred = os.environ.get("OLLAMA_MODEL") or ""
                pick = preferred if preferred in models else models[0]
                os.environ.setdefault("OLLAMA_MODEL", pick)
                os.environ.setdefault("LLM_PROVIDER", "ollama")
                return True, pick
        except (URLError, OSError, json.JSONDecodeError, KeyError, TimeoutError):
            continue
    return False, None


def _detect_lmstudio() -> tuple[bool, str | None]:
    url = os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1")
    try:
        req = Request(f"{url}/models", method="GET", headers={"Content-Type": "application/json"})
        with urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
        models = [m["id"] for m in data.get("data", [])]
        if models:
            pick = os.environ.get("LMSTUDIO_MODEL") or models[0]
            os.environ.setdefault("LMSTUDIO_MODEL", pick)
            if not os.environ.get("LLM_PROVIDER"):
                os.environ["LLM_PROVIDER"] = "lmstudio"
            return True, pick
    except (URLError, OSError, json.JSONDecodeError, KeyError, TimeoutError):
        pass
    return False, None


def _openai_headers(api_key: str | None = None) -> dict[str, str]:
    key = api_key or _openai_key()
    headers = {"Content-Type": "application/json"}
    if key:
        headers["Authorization"] = f"Bearer {key}"
    return headers


def _chat_completions(url_base: str, payload: dict, headers: dict[str, str], timeout: int = 120) -> str:
    body = json.dumps(payload).encode()
    req = Request(f"{url_base.rstrip('/')}/chat/completions", data=body, headers=headers)
    with urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read())
    return data.get("choices", [{}])[0].get("message", {}).get("content", "")


@router.get("/status")
async def llm_status() -> dict[str, Any]:
    provider = os.environ.get("LLM_PROVIDER", "ollama")
    result: dict[str, Any] = {
        "provider": provider,
        "ok": False,
        "error": None,
        "model": None,
        "local_llm": False,
        "cloud_llm": provider == "openai",
    }

    if provider == "ollama":
        url = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
        model = os.environ.get("OLLAMA_MODEL", "")
        try:
            req = Request(f"{url}/api/tags", method="GET")
            with urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())
            models = [m["name"] for m in data.get("models", [])]
            result["ok"] = bool(models)
            result["model"] = model if model in models else (models[0] if models else None)
            result["available_models"] = models
            result["local_llm"] = result["ok"]
        except Exception as exc:
            result["error"] = str(exc)
            ok, auto_model = _detect_ollama()
            if ok:
                result.update({"ok": True, "model": auto_model, "local_llm": True, "error": None, "auto_discovered": True})

    elif provider == "lmstudio":
        url = os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1")
        model = os.environ.get("LMSTUDIO_MODEL", "")
        try:
            req = Request(f"{url}/models", method="GET", headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())
            models = [m["id"] for m in data.get("data", [])]
            result["ok"] = bool(models)
            result["model"] = model if model in models else (models[0] if models else None)
            result["available_models"] = models
            result["local_llm"] = result["ok"]
        except Exception as exc:
            result["error"] = str(exc)

    elif provider == "openai":
        key = _openai_key()
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        result["model"] = model
        if not key:
            result["error"] = "OPENAI_API_KEY not configured"
        else:
            try:
                req = Request(f"{_openai_base()}/models", method="GET", headers=_openai_headers(key))
                with urlopen(req, timeout=10) as resp:
                    json.loads(resp.read())
                result["ok"] = True
            except Exception as exc:
                result["error"] = str(exc)
                result["ok"] = True

    if not result["ok"] and provider != "openai":
        ollama_ok, ollama_model = _detect_ollama()
        if ollama_ok and provider == "ollama":
            result.update({"ok": True, "model": ollama_model, "local_llm": True, "auto_discovered": True, "error": None})

    return result


@router.get("/models")
async def llm_models(provider: str = "ollama", base_url: str | None = None, api_key: str | None = None) -> dict[str, Any]:
    if provider == "ollama":
        url = base_url or os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
        try:
            req = Request(f"{url}/api/tags", method="GET")
            with urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())
            models = [m["name"] for m in data.get("models", [])]
            return {"ok": True, "provider": "ollama", "models": models}
        except Exception as exc:
            return {"ok": False, "provider": "ollama", "error": str(exc), "models": []}

    if provider == "lmstudio":
        url = base_url or os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1")
        try:
            req = Request(f"{url}/models", method="GET", headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())
            models = [m["id"] for m in data.get("data", [])]
            return {"ok": True, "provider": "lmstudio", "models": models}
        except Exception as exc:
            return {"ok": False, "provider": "lmstudio", "error": str(exc), "models": []}

    if provider == "openai":
        key = api_key or _openai_key()
        if not key:
            return {"ok": False, "provider": "openai", "error": "API key required", "models": OPENAI_FALLBACK_MODELS}
        url = (base_url or _openai_base()).rstrip("/")
        try:
            req = Request(f"{url}/models", method="GET", headers=_openai_headers(key))
            with urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
            models = sorted(
                m["id"]
                for m in data.get("data", [])
                if any(m["id"].startswith(p) for p in ("gpt-", "o1", "o3", "o4", "chatgpt"))
            )
            if not models:
                models = OPENAI_FALLBACK_MODELS
            return {"ok": True, "provider": "openai", "models": models}
        except Exception as exc:
            return {"ok": False, "provider": "openai", "error": str(exc), "models": OPENAI_FALLBACK_MODELS}

    return {"ok": False, "provider": provider, "error": "Unknown provider", "models": []}


@router.get("/preprompts")
async def llm_preprompts() -> dict[str, Any]:
    return {"preprompts": CHAT_PREPROMPTS}


@router.post("/chat")
async def llm_chat(body: dict[str, Any]) -> dict[str, Any]:
    provider = body.get("provider") or os.environ.get("LLM_PROVIDER", "ollama")
    message = (body.get("message") or "").strip()
    if not message:
        return {"ok": False, "error": "No message provided"}

    history = body.get("history") or []
    messages: list[dict[str, str]] = [{"role": "system", "content": VIENNA_SYSTEM_PREPROMPT}]
    for item in history:
        role = item.get("role")
        content = item.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": str(content)})
    messages.append({"role": "user", "content": message})

    if provider == "ollama":
        model = body.get("model") or os.environ.get("OLLAMA_MODEL", "qwen3.5:27b")
        url = body.get("ollama_url") or os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
        payload = json.dumps({"model": model, "messages": messages, "stream": False}).encode()
        try:
            req = Request(f"{url}/api/chat", data=payload, headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read())
            return {"ok": True, "response": data.get("message", {}).get("content", "")}
        except Exception as exc:
            return {"ok": False, "error": str(exc)}

    if provider == "lmstudio":
        model = body.get("model") or os.environ.get("LMSTUDIO_MODEL", "")
        url = body.get("lmstudio_url") or os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1")
        try:
            content = _chat_completions(
                url,
                {"model": model, "messages": messages, "max_tokens": 2048},
                {"Content-Type": "application/json"},
            )
            return {"ok": True, "response": content}
        except Exception as exc:
            return {"ok": False, "error": str(exc)}

    if provider == "openai":
        api_key = body.get("openai_api_key") or _openai_key()
        if not api_key:
            return {"ok": False, "error": "OpenAI API key not configured"}
        model = body.get("model") or os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        url = body.get("openai_base_url") or _openai_base()
        try:
            content = _chat_completions(
                url,
                {"model": model, "messages": messages, "max_tokens": 2048},
                _openai_headers(api_key),
            )
            return {"ok": True, "response": content}
        except Exception as exc:
            return {"ok": False, "error": str(exc)}

    return {"ok": False, "error": f"Unknown provider: {provider}"}

"""Journal RAG — semantic search over the personal log via Ollama embeddings.

Uses the OpenAI-compatible /v1/embeddings endpoint (the native /api/embed can
return empty vectors for some model tags). Vectors are stored in SQLite
(journal_embeddings) and compared with plain Python cosine — no numpy/LanceDB
needed at personal-journal scale.
"""

from __future__ import annotations

import json
import logging
import math
import os
from datetime import datetime
from typing import Any
from urllib.request import Request, urlopen

from sqlalchemy import delete as sa_delete
from sqlalchemy import select
from sqlalchemy.orm import Session

from vienna_life_assistant.models import JournalEmbedding, JournalEntry

logger = logging.getLogger("vienna-life-assistant.rag")

EMBED_MODEL = os.environ.get("RAG_EMBED_MODEL", "nomic-embed-text")
EMBED_BASE = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
EMBED_TIMEOUT = 60
_MAX_ENTRIES = 500


def embed(text: str) -> list[float] | None:
    """Embed text via Ollama /v1/embeddings; None when unavailable."""
    try:
        payload = json.dumps({"model": EMBED_MODEL, "input": text[:4000]}).encode()
        req = Request(
            f"{EMBED_BASE}/v1/embeddings",
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        with urlopen(req, timeout=EMBED_TIMEOUT) as resp:
            data = json.loads(resp.read())
        vectors = data.get("data") or []
        if not vectors:
            return None
        return [float(v) for v in vectors[0].get("embedding", [])]
    except Exception as e:  # noqa: BLE001 — RAG must degrade gracefully
        logger.warning("embed failed: %s", e)
        return None


def _entry_text(entry: JournalEntry) -> str:
    return f"{entry.date} {entry.title} {entry.body} {entry.tags}".strip()


def _cosine(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def ensure_indexed(db: Session, force: bool = False) -> int:
    """Embed journal entries missing a stored vector. Returns count embedded."""
    if force:
        db.execute(sa_delete(JournalEmbedding))
        db.commit()

    stored = set(db.execute(select(JournalEmbedding.entry_id)).scalars())
    entries = [
        e
        for e in db.execute(
            select(JournalEntry).order_by(JournalEntry.id.desc()).limit(_MAX_ENTRIES)
        ).scalars()
        if e.id not in stored
    ]
    embedded = 0
    for entry in entries:
        vector = embed(_entry_text(entry))
        if not vector:
            continue
        db.add(
            JournalEmbedding(
                entry_id=entry.id,
                embedding=json.dumps(vector),
                created_at=datetime.now().isoformat(timespec="seconds"),
            )
        )
        embedded += 1
    if embedded:
        db.commit()
    return embedded


def semantic_search(db: Session, query: str, limit: int = 3) -> list[dict[str, Any]]:
    """Top journal entries by cosine similarity to the query."""
    if not query.strip():
        return []
    qv = embed(query)
    if not qv:
        return []
    ensure_indexed(db)

    rows = db.execute(select(JournalEmbedding)).scalars().all()
    scored: list[tuple[float, JournalEmbedding]] = []
    for row in rows:
        try:
            vec = json.loads(row.embedding)
        except json.JSONDecodeError:
            continue
        scored.append((_cosine(qv, vec), row))
    scored.sort(key=lambda t: t[0], reverse=True)

    hits: list[dict[str, Any]] = []
    for score, row in scored[:limit]:
        entry = db.get(JournalEntry, row.entry_id)
        if entry is None:
            continue
        d = entry.to_dict()
        d["score"] = round(score, 3)
        hits.append(d)
    return hits


def reindex_all(db: Session) -> int:
    """Full re-embed of the journal (forces refresh of stored vectors)."""
    return ensure_indexed(db, force=True)

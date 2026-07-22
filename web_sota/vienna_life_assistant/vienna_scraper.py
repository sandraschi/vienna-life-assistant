"""Scraper for Vienna cultural events using Playwright headless Chromium + httpx.

Sources:
- Wiener Staatsoper: schedule (JS SPA, Playwright)
- Konzerthaus: program (JS SPA, Playwright)
- Burgtheater: performances (server-rendered HTML, httpx)
- Belvedere: exhibitions (server-rendered HTML, httpx)

Caches responses in-memory with configurable TTL.
"""

from __future__ import annotations

import logging
import re
import time

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger("vienna-life-assistant.scraper")

_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
_HTTP_TIMEOUT = 15.0

_cache: dict[str, tuple[float, list]] = {}
_PERFORMANCE_TTL = 1800  # 30 min
_EXHIBITION_TTL = 7200  # 2 hours


def _cached(key: str, ttl: float):
    entry = _cache.get(key)
    if entry and (time.time() - entry[0]) < ttl:
        return entry[1]
    return None


def _set_cache(key: str, data: list) -> None:
    _cache[key] = (time.time(), data)


def _fetch_html(url: str) -> str | None:
    try:
        resp = httpx.get(
            url,
            headers={"User-Agent": _USER_AGENT},
            timeout=_HTTP_TIMEOUT,
            follow_redirects=True,
        )
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        logger.warning("fetch failed for %s: %s", url, e)
        return None


def _render_spa(url: str, timeout_ms: int = 25000) -> str | None:
    """Render a JS SPA page with Playwright headless Chromium."""
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        logger.warning("playwright not installed")
        return None

    import asyncio

    async def _go():
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            try:
                ctx = await browser.new_context(user_agent=_USER_AGENT)
                page = await ctx.new_page()
                await page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
                await page.wait_for_timeout(5000)
                return await page.inner_text("body")
            finally:
                await browser.close()

    try:
        return asyncio.run(_go())
    except Exception as e:
        logger.warning("spa render failed for %s: %s", url, e)
        return None


# --- Performances ---

BURG_REMOVE = re.compile(r"^(Mo\.|Di\.|Mi\.|Do\.|Fr\.|Sa\.|So\.)\w*\.?")


def _clean_burg_date(raw: str) -> str:
    raw = raw.replace("Uhr", "").replace("\u2013", "-").strip()
    raw = BURG_REMOVE.sub("", raw).strip()
    return re.sub(r"(\d{2}:\d{2})(\d{2}:\d{2})", r"\1 \2", raw)


def _scrape_burgtheater() -> list[dict[str, str]]:
    html = _fetch_html("https://www.burgtheater.at/spielplan")
    if not html:
        return []
    soup = BeautifulSoup(html, "lxml")
    seen: set[str] = set()
    results: list[dict[str, str]] = []
    for event in soup.select(".s-event"):
        a = event.select_one("h2.s-event__title a")
        if not a:
            continue
        title = a.get_text(strip=True)
        if not title or len(title) < 5 or title in seen:
            continue
        seen.add(title)
        de = event.select_one(".s-event__date, .s-event__info")
        raw = de.get_text(strip=True) if de else ""
        results.append(
            {
                "venue": "Burgtheater",
                "title": title,
                "time": _clean_burg_date(raw),
                "tickets": "Available",
            }
        )
    logger.info("burgtheater: %d events", len(results))
    return results


def _scrape_staatsoper() -> list[dict[str, str]]:
    body = _render_spa("https://www.wiener-staatsoper.at/kalender/")
    if not body:
        return []
    lines = [ln.strip() for ln in body.split("\n")]
    seen: set[str] = set()
    results: list[dict[str, str]] = []
    i = 0
    while i < len(lines):
        current = lines[i]
        if re.match(r"\d{2}:\d{2}—\d{2}:\d{2}", current):
            time_str = current
            composer = lines[i + 1] if i + 1 < len(lines) else ""
            title = lines[i + 2] if i + 2 < len(lines) else ""
            full = f"{composer} - {title}".strip().strip("-").strip()
            if full and len(full) > 5 and full not in seen:
                seen.add(full)
                results.append(
                    {
                        "venue": "Wiener Staatsoper",
                        "title": full,
                        "time": time_str,
                        "tickets": "Available",
                    }
                )
            i += 4
            continue
        i += 1
    logger.info("staatsoper: %d events", len(results))
    return results


def fetch_performances() -> list[dict[str, str]]:
    """Aggregate scheduled performances from all sources."""
    cached = _cached("performances", _PERFORMANCE_TTL)
    if cached is not None:
        return cached
    all_events: list[dict[str, str]] = []
    all_events.extend(_scrape_burgtheater())
    all_events.extend(_scrape_staatsoper())
    logger.info("total %d performances", len(all_events))
    _set_cache("performances", all_events)
    return all_events


# --- Exhibitions ---


def fetch_exhibitions() -> list[dict[str, str]]:
    """Fetch current exhibitions from Belvedere website."""
    cached = _cached("exhibitions", _EXHIBITION_TTL)
    if cached is not None:
        return cached
    exhibitions: list[dict[str, str]] = []
    html = _fetch_html("https://www.belvedere.at/en/exhibitions")
    if not html:
        _set_cache("exhibitions", exhibitions)
        return exhibitions
    soup = BeautifulSoup(html, "lxml")
    seen: set[str] = set()
    for a in soup.select("a.link--full"):
        text = a.get_text(strip=True)
        if not text or "," not in text:
            continue
        parts = [p.strip() for p in text.replace("  ", " ").split(",")]
        title = parts[0]
        if not title or len(title) < 5 or title in seen:
            continue
        seen.add(title)
        dates = parts[1] if len(parts) > 1 else "Current"
        dates = dates.replace("OngoingUpper", "Ongoing, Upper").replace(
            "OngoingLower", "Ongoing, Lower"
        )
        dates = dates.replace("to", " - ", 1) if "to" in dates else dates
        exhibitions.append({"museum": "Belvedere", "title": title, "dates": dates})
    logger.info("belvedere: %d exhibitions", len(exhibitions))
    _set_cache("exhibitions", exhibitions)
    return exhibitions


# --- Restaurants / Lunch Menus ---

_LUNCH_TTL = 3600  # 1 hour


def fetch_lunch_menus() -> list[dict[str, str]]:
    """Fetch daily lunch menus from Gasthaus Orlik."""
    cached = _cached("lunch", _LUNCH_TTL)
    if cached is not None:
        return cached

    menus: list[dict[str, str]] = []
    html = _fetch_html("https://gasthaus-orlik.at/mittagmenues.html")
    if not html:
        _set_cache("lunch", menus)
        return menus

    soup = BeautifulSoup(html, "lxml")
    items: list[str] = []
    # Extract menu items between "Tagessuppe" markers
    for tag in soup.select("p, li, td, strong"):
        t = tag.get_text(strip=True)
        if not t or len(t) < 5:
            continue
        if "Mittagsmen" in t or "servieren" in t or "freuen" in t or "Menü" in t:
            continue
        if "Tagessuppe" in t or "Rindssuppe" in t:
            if items:
                menus.append({"restaurant": "Gasthaus Orlik", "items": items})
            items = []
            continue
        if "€" in t:
            items.append(t)
            if items:
                menus.append({"restaurant": "Gasthaus Orlik", "items": items})
            items = []
            continue
        if any(
            k in t.lower()
            for k in ["homepage", "standardkarte", "getränke", "kontakt", "empfehlung"]
        ):
            continue
        items.append(t)

    if items:
        menus.append({"restaurant": "Gasthaus Orlik", "items": items})

    logger.info("orlik: %d menu groups", len(menus))
    _set_cache("lunch", menus)
    return menus

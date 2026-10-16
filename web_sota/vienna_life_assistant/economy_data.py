"""Vienna economy: employers, internationals, startups, tourism. Round 11 (2026-10-16).

Wide before deep. Verified anchors: OMV #1 (62,3 Mrd 2022), internationale
Einrichtungen (20.000 Jobs, 180 Konzerne), BAWAG (4 Mio Kunden, 3.200 Besch.),
Bitpanda-Unicorn (170 Mio Series B). Rest: Namen + verify-Flags.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "ranking": "Groessen-Rankings AT (OMV 62,3 Mrd 2022; Strabag, voestalpine, Porsche)",
    "international": "wien.info (Internationales Wien: 20.000 Jobs, 180 Konzerne)",
    "bawag": "Arbeitgeber-Portraet 08.09.2026 (4 Mio Kunden, 3.200 Besch.)",
    "startups": "heute.at (Bitpanda/GoStudent/refurbed-Hype; 170 Mio Series B)",
    "tourismus": "wien.gv.at (Naechtigungs-Meldepflicht)",
}

ECONOMY_CHAPTERS = [
    {
        "title": "Wer zahlt in Wien?",
        "body": (
            "OMV an der Spitze der AT-Umsatzliste (62,3 Mrd 2022), dahinter Porsche Holding, "
            "voestalpine, Strabag — dazu Banken (Erste, Raiffeisen, BAWAG: 4 Mio Kunden), Versicherungen, "
            "A1, Post, Stadt Wien + Stadtwerke als Riesenarbeitgeber. Details und Adressen naechster Pass; "
            "hier steht das Geruest."
        ),
    },
    {
        "title": "International + Startup + Tourismus",
        "body": (
            "UNO-City und Co. sichern knapp 20.000 Jobs; 180 Konzerne sitzen mit Osteuropa-Zentralen hier. "
            "Startups: Bitpanda (erstes Unicorn, 170 Mio Series B), GoStudent, refurbed — Hype mit Substanz, "
            "Details folgen. Tourismus: Meldepflicht pro Naechtigung (wien.gv.at) — die Stadt zaehlt genau, "
            "wer kommt."
        ),
    },
]

PLAYERS: list[dict] = [
    {"name": "OMV", "address": "Wien (verify)", "notes": "Umsatzstaerkstes AT-Unternehmen 2022 (62,3 Mrd)", "tags": ["konzern", "energie"], "verify": True, "source": "Umsatz-Ranking"},
    {"name": "Internationale Einrichtungen (UNO-City & Co.)", "address": "Donaustadt (verify)", "notes": "Knapp 20.000 Jobs; 180 Konzerne mit Standort", "tags": ["international"], "verify": True, "source": "wien.info"},
    {"name": "BAWAG Group", "address": "Wien (verify)", "notes": "4 Mio Kunden, 3.200 Beschaeftigte (2026)", "tags": ["bank"], "verify": True, "source": "Arbeitgeber-Portraet"},
    {"name": "Bitpanda", "address": "Wien (verify)", "notes": "Erstes AT-Unicorn (170 Mio Series B)", "tags": ["startup", "fintech"], "verify": True, "source": "heute.at"},
    {"name": "GoStudent / refurbed", "address": "Wien (verify)", "notes": "Startup-Hype (Details naechster Pass)", "tags": ["startup"], "verify": True, "source": "heute.at"},
    {"name": "Erste / Raiffeisen / VIG / A1 / Post / AUA / Siemens", "address": "Wien (verify)", "notes": "Sammel: Namen verifiziert, Details naechster Pass", "tags": ["konzern"], "verify": True},
    {"name": "Stadt Wien + Wiener Stadtwerke", "address": "Wien (verify)", "notes": "Riesenarbeitgeber inkl. Wien Energie, Wiener Linien (Details naechster Pass)", "tags": ["stadt"], "verify": True},
]

OFFICIAL_URLS: dict = {}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS


def get_economy_chapters() -> list[dict]:
    """Essay: Wer zahlt + International/Startup/Tourismus."""
    return ECONOMY_CHAPTERS


def get_players() -> list[dict]:
    """Konzerne, Internationale, Startups (Adressen naechster Pass)."""
    return PLAYERS

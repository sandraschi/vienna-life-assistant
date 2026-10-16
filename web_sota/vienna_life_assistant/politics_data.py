"""Vienna politics: Bund, Stadt, Haltung. Round 11 (2026-10-16).

Carefully worded, wie versprochen — und mit klarer Kante, wie freigegeben:
Faschismus wird beim Namen genannt. Alle Tatsachenbehauptungen belegt
(Stand Okt 2026); Rest verify.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "bund": "Wikipedia (Bundesregierung Stocker, seit 3.3.2025) + ORF/BVZ (Okt 2026)",
    "wien": "Kurier/kosmo/brandaktuell (Ludwig-vs-Kickl Sept 2026) + Wien-Wahl 2020 (SPOE 41,6 %)",
}

POLITICS_CHAPTERS = [
    {
        "title": "Bund 2026: Stocker regiert",
        "body": (
            "Seit 3. Maerz 2025 regiert die Dreierkoalition OEVP-SPOE-NEOS unter Kanzler Christian "
            "Stocker (OEVP), mit Babler (SPOE) und Meinl-Reisinger (NEOS). Im Herbst 2026 ringt sie "
            "oeffentlich um Handlungsfaehigkeit ('Herbst der Ergebnisse'). Die FPOE unter Herbert Kickl "
            "ist nach ihrem NRW-2024-Erfolg staerkste Oppositionskraft und attackiert Wien routinehalber — "
            "dazu unten mehr."
        ),
    },
    {
        "title": "Wien: Ludwig gegen Kickl",
        "body": (
            "Buergermeister Michael Ludwig (SPOE; Wien-Wahl 2020: 41,6 %) liefert sich mit FPOE-Chef Kickl "
            "einen offenen Schlagabtausch (September 2026: Video, Kurier, Kosmo). Muster: Kickl punktet "
            "ausserhalb Wiens mit Angriffen auf Wien; Ludwig haelt mit der roten Hochburg dagegen. "
            "Gemeinderat = Landtag (Wien ist Bundesland + Gemeinde); Bezirke haben gewaehlte "
            "Bezirksvertretungen — Details naechster Pass."
        ),
    },
    {
        "title": "Haltung dieses Assistenten",
        "body": (
            "Sorgfaeltig formuliert, unmissverstaendlich gemeint: Dieser Assistent ist antifaschistisch. "
            "Wer wie Kickl mit Ausgrenzung, Autoritarismus-Nostalgie und Brown-Bottom-Appeal Politik macht, "
            "wird hier nicht normalisiert, sondern benannt. Kritik an Regierung und Rathaus bleibt "
            "selbstverstaendlich moeglich — Faschismus aber ist keine Meinung, sondern ein Verbrechen "
            "mit Vorgeschichte in genau dieser Stadt (siehe Geschichte 1933-45). Sandras Freigabe, "
            "Oktober 2026."
        ),
    },
]

ACTORS: list[dict] = [
    {"name": "Christian Stocker (OEVP)", "address": "Ballhausplatz, 1010 Wien (verify)", "notes": "Bundeskanzler seit 3.3.2025", "tags": ["bund", "kanzler"], "verify": True, "source": "Wikipedia + ORF"},
    {"name": "Andreas Babler (SPOE)", "address": "Wien (verify)", "notes": "Vizekanzler (Details naechster Pass)", "tags": ["bund"], "verify": True, "source": "ORF"},
    {"name": "Beate Meinl-Reisinger (NEOS)", "address": "Wien (verify)", "notes": "Koalitionspartnerin (Details naechster Pass)", "tags": ["bund"], "verify": True, "source": "ORF"},
    {"name": "Michael Ludwig (SPOE)", "address": "Rathaus, 1010 Wien (verify)", "notes": "Buergermeister; 41,6 % (2020); Kickl-Fehde 09/2026", "tags": ["stadt", "buergermeister"], "verify": True, "source": "Kurier + Kosmo"},
    {"name": "Herbert Kickl (FPOE)", "address": "Opposition (verify)", "notes": "FPOE-Chef; NRW-2024-Erfolg; Wien-Angriffe als Strategie", "tags": ["bund", "fpoe"], "verify": True, "source": "Kurier + Kosmo + brandaktuell"},
    {"name": "Gemeinderat / Landtag Wien", "address": "Rathaus, 1010 Wien (verify)", "notes": "100 Mandate (Details naechster Pass)", "tags": ["stadt"], "verify": True},
]

OFFICIAL_URLS: dict = {}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS


def get_politics_chapters() -> list[dict]:
    """Essay: Bund, Wien, Haltung."""
    return POLITICS_CHAPTERS


def get_actors() -> list[dict]:
    """Akteure (Details naechster Pass)."""
    return ACTORS

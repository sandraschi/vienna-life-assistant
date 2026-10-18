"""Vienna transport: world-class Oeffis vs. car flood. Round (2026-10-17).

Verified: Ticketpreise (24h 10,20 / 7 Tage 28,90 / Monat 75 / Jahr 467),
Parkpickerl flaechendeckend seit 1.3.2022 (10 EUR/Monat, Mo-Fr 9-22h),
A23 (17 km, staerkste Strasse AT, Lueckenschluss S1/Lobau als Entlastung).
Linien-Details und P&R-Preise: verify-Flags.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-17"
SOURCES = {
    "preise": "Wiener-Linien-Preisliste + Jahreskarte-Seite (Einmal 467 / digital 461 / Abo 506,40)",
    "pickerl": "wien.gv.at + ORF (1.3.2022, Sima) + Gruene Wien",
    "a23": "Asfinag-Daten via europesays (17 km, staerkste) + 21.10.2025 (Lueckenschluss)",
}

TRANSPORT_CHAPTERS = [
    {
        "title": "Eines der besten Netze der Welt",
        "body": (
            "U-Bahn, Tram, Bus, Nachtbus: Wien faehrt dicht, billig und die halbe Nacht. "
            "Die Monatskarte kostet 75 Euro, die Jahreskarte 467 (die 365er-Zeit ist vorbei). "
            "Dafuer: 24h-Ticket 10,20, 7 Tage 28,90. Details zu Linien und Nachtnetz naechster Pass — "
            "das Netz selbst steht."
        ),
    },
    {
        "title": "Autoflut vs. Stadt",
        "body": (
            "Zu viele Autos, wie ueberall — aber die Stadt steuert gegen: Seit 1. Maerz 2022 gilt das "
            "Parkpickerl flaechendeckend (10 Euro/Monat, Kurzparkzonen Mo-Fr 9-22h), Pendler-Blech ohne "
            "Ticket ist Geschichte. Parkplaetze weichen Blumenbeeten, Baeumen und Rasenstuecken "
            "(sichtbar im Stadtbild); Einwohnerparken plus Park & Ride sollen den Rest richten."
        ),
    },
    {
        "title": "Die A23 und das Loch im Ring",
        "body": (
            "Die Suedosttangente (A23): 17 Kilometer, kuerzeste Autobahn, staerkste Strasse "
            "Oesterreichs — und chronisch ueberlastet, ohne hochrangige Ausweichroute. Die Entlastung "
            "heisst Lueckenschluss: S1-Regionring plus Lobautunnel unter der Lobau durch. Umstritten, "
            "unverzichtbar, im Bau bzw. in Planung — Stand folgt."
        ),
    },
]

LINKS: list[dict] = [
    {
        "name": "U-Bahn",
        "address": "cityweit (verify)",
        "notes": "Linien-Details naechster Pass",
        "tags": ["oeffi", "ubahn"],
        "verify": True,
    },
    {
        "name": "Strassenbahn",
        "address": "cityweit (verify)",
        "notes": "Linien-Details naechster Pass",
        "tags": ["oeffi", "tram"],
        "verify": True,
    },
    {
        "name": "Bus + Nachtbus",
        "address": "cityweit (verify)",
        "notes": "Nachtnetz-Details naechster Pass",
        "tags": ["oeffi", "bus"],
        "verify": True,
    },
    {
        "name": "Jahreskarte",
        "address": "Wiener Linien",
        "notes": "467 Einmal (digital 461); Abo 506,40/Jahr",
        "tags": ["oeffi", "ticket"],
        "source": "Preisliste",
    },
    {
        "name": "Monatskarte",
        "address": "Wiener Linien",
        "notes": "75 Euro; 24h 10,20; 7 Tage 28,90",
        "tags": ["oeffi", "ticket"],
        "source": "Preisliste",
    },
    {
        "name": "Parkpickerl",
        "address": "alle Bezirke (seit 1.3.2022)",
        "notes": "10 Euro/Monat; Kurzparkzonen Mo-Fr 9-22h; Parkschein 1,70/halbe Stunde",
        "tags": ["auto", "parken"],
        "source": "wien.gv.at + ORF",
    },
    {
        "name": "Park & Ride",
        "address": "Stadtraender (verify)",
        "notes": "Preise/Anlagen naechster Pass",
        "tags": ["auto", "parken"],
        "verify": True,
    },
    {
        "name": "A23 Suedosttangente",
        "address": "17 km Suedost",
        "notes": "Staerkste Strasse AT; Lueckenschluss als Entlastung (21.10.2025)",
        "tags": ["auto", "autobahn"],
        "source": "Asfinag",
    },
    {
        "name": "S1 + Lobautunnel",
        "address": "Regionring-Ost (verify)",
        "notes": "Lueckenschluss unter der Lobau; Stand naechster Pass",
        "tags": ["auto", "autobahn"],
        "verify": True,
    },
]

OFFICIAL_URLS = {
    "Parkpickerl": "https://www.wien.gv.at/amtswege/parkpickerl",
}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS


def get_transport_chapters() -> list[dict]:
    """Essay: Oeffis, Autoflut, A23."""
    return TRANSPORT_CHAPTERS


def get_links() -> list[dict]:
    """Oeffi-Linien, Tickets, Parken, Autobahnen."""
    return LINKS

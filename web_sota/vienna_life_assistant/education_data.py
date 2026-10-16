"""Vienna education: schools, universities, academies. Round 10 (2026-10-16).

Wide before deep: names + system essay verified against wien.gv.at,
istadi (9 oeff. Unis + 5 FHs), TU/MedUni/BOKU domains, news.at (Schulwahl).
Streets flagged verify throughout.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "unis": "istadi.com (9 oeff. Unis + 5 FHs, 2026-09) + wien.gv.at/bildung/studium",
    "domains": "tuwien.at + meduniwien.ac.at + boku.ac.at",
    "schule": "news.at Buergerservice (Mittelschule oder Gymnasium)",
}

EDUCATION_CHAPTERS = [
    {
        "title": "Schulsystem: die Weiche mit zehn",
        "body": (
            "Vier Jahre Volksschule, dann die erste Weiche: Mittelschule oder Gymnasium-Unterstufe "
            "(news.at). Danach AHS-Oberstufe oder BHS (HAK, HTL, HLW) bis zur Matura — oder Lehre: das "
            "duale System aus Betrieb + Berufsschule, das Oesterreichs Jugendarbeitslosigkeit niedrig "
            "haelt. Schulpflicht seit Maria Theresia (siehe Geschichte); Gesamtschul-Debatte seit "
            "Jahrzehnten ungeloest (als Debattenstand markiert)."
        ),
    },
    {
        "title": "Unis: 1365 bis Campus",
        "body": (
            "Neun oeffentliche Universitaeten plus fuenf Fachhochschulen plus Private (istadi 2026): "
            "Uni Wien (1365, aelteste im deutschen Sprachraum), TU, WU (Neubau-Campus), MedUni (AKH-Naehe), "
            "BOKU, Akademie der bildenden Kuenste, Angewandte, mdw (Musik), Vetmed. Uebersicht: "
            "wien.gv.at/bildung/studium. Details/Adressen naechster Pass."
        ),
    },
]

INSTITUTIONS: list[dict] = [
    {"name": "Universitaet Wien", "address": "Wien (verify)", "notes": "1365 (Alma Mater Rudolphina); groesste Uni des Landes", "tags": ["uni"], "verify": True},
    {"name": "TU Wien", "address": "Wien (verify)", "notes": "Technik (Krebsforschung mit MedAustron, aktuell)", "tags": ["uni", "technik"], "verify": True, "source": "tuwien.at"},
    {"name": "WU Wien", "address": "Wien (verify)", "notes": "Neubau-Campus (Adresse verifizieren)", "tags": ["uni", "wirtschaft"], "verify": True},
    {"name": "MedUni Wien", "address": "Wien (verify)", "notes": "AKH-Naehe (Adresse verifizieren)", "tags": ["uni", "medizin"], "verify": True, "source": "meduniwien.ac.at"},
    {"name": "BOKU", "address": "Wien (verify)", "notes": "Bodenkultur (Adresse verifizieren)", "tags": ["uni"], "verify": True, "source": "boku.ac.at"},
    {"name": "Akademie der bildenden Kuenste", "address": "Wien (verify)", "notes": "Kunstuni (Adresse verifizieren)", "tags": ["akademie", "kunst"], "verify": True},
    {"name": "Angewandte", "address": "Wien (verify)", "notes": "Kunst/Design (Adresse verifizieren)", "tags": ["akademie", "kunst"], "verify": True},
    {"name": "mdw", "address": "Wien (verify)", "notes": "Musik und darstellende Kunst (Adresse verifizieren)", "tags": ["akademie", "musik"], "verify": True},
    {"name": "Vetmed", "address": "Wien (verify)", "notes": "Tieraerztliche (Adresse verifizieren)", "tags": ["uni", "medizin"], "verify": True},
    {"name": "FH Campus Wien / BFI & Co.", "address": "Wien (verify)", "notes": "5 FHs in Wien (Namen naechster Pass)", "tags": ["fh"], "verify": True, "source": "istadi.com"},
]

OFFICIAL_URLS = {
    "TU Wien": "https://www.tuwien.at/",
    "MedUni Wien": "https://www.meduniwien.ac.at/web",
    "BOKU": "https://boku.ac.at/",
}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS


def get_education_chapters() -> list[dict]:
    """Essay: Schulsystem + Unis."""
    return EDUCATION_CHAPTERS


def get_institutions() -> list[dict]:
    """Unis, Akademien, FHs (Adressen naechster Pass)."""
    return INSTITUTIONS

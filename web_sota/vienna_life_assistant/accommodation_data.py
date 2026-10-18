"""Vienna accommodation: a paean to social housing + the full Wohnen landscape.

Round 5 (2026-10-16). Essay + facts + stay entries.
Entries flagged "verify: True" need street-level confirmation; nothing invented.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "kmh": "cityabc.at + stadtfilm-wien.at (Faktenblatt) + nextroom (Architektur)",
    "gemeindebau": "SPOE Wien Geschichte des Gemeindebaus + Die Presse (Geschichte in Zahlen 2016)",
    "airbnb": "wien.gv.at (MA37-Merkblatt, privat-vermieten) + airbnb.at/help/897 + WKO + advokat-wien.at",
    "friedenszins": "mieterschutzwien.at (Gesetze im Wandel) + arbeit-wirtschaft Blog (Mythos Friedenszins 2021)",
    "ringstrasse": "geschichtewiki.wien.gv.at (Stadterweiterung) + wienmuseum Magazin (Immobilienmarkt Ringstrassenzeit) + Wien Museum Sammlung (Plan 1857)",
    "seestadt": "wien.gv.at/stadtplanung + aspern-seestadt.at (Masterplan Tovatt) + bauwelt.de",
    "studentenheime": "akademikerhilfe.at/wien",
}

OFFICIAL_URLS = {
    "Seestadt Aspern": "https://www.aspern-seestadt.at/",
    "Akademikerhilfe (Heime)": "https://www.akademikerhilfe.at/de/wien",
    "Airbnb-Regel Wien": "https://www.wien.gv.at/wirtschaft/privat-vermieten-touristische-zwecke",
}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS

PAEAN = [
    {
        "title": "Wir haben es erfunden",
        "body": (
            "Wien hat den sozialen Wohnbau nicht erfunden wie man das Rad erfindet — "
            "sondern wie man eine Antwort erfindet: auf Elend. Nach 1918 hauste die Stadt in "
            "Zinskasernen, Kellerloecher und Bettgeher-Verschlaegen — Menschen, die kein Bett besassen, "
            "sondern eines mieteten, stundenweise, warm von fremdem Schlaf. Die sozialdemokratische "
            "Stadtregierung ('Rotes Wien') antwortete mit dem groessten kommunalen Wohnbauprogramm "
            "Europas: finanziert aus der Wohnbausteuer (Teil der Breitner Luxussteuern), gebaut als "
            "Superblocks mit Licht, Luft, Waschkuechen, Kindergaerten, Bibliotheken und Aerzten. "
            "65.000 Wohnungen im Roten Wien; heute ueber 200.000 Gemeindewohnungen in rund 1.800 Bauten. "
            "Wer in Wien 'Gemeindebau' sagt, meint kein Stigma, sondern ein Versprechen."
        ),
    },
    {
        "title": "Karl-Marx-Hof",
        "body": (
            "Heiligenstaedter Strasse 82-92, 1190 Wien. 1927-1930 nach Plaenen von Karl Ehn auf der "
            "Hagenwiese errichtet, eroeffnet am 12. Oktober 1930: 1.272 Wohnungen (urspruenglich 1.382), "
            "ein Kilometer lang, mit Zentralwaescherei, Baedern, Kindergaerten und dem 12.-Februar-Platz. "
            "Im Februar 1934 wurde er zur Festung — heftige Kaempfe des Buergerkriegs auf seinem Gelaende. "
            "Heute Denkmal, Wohnort und Museum des Roten Wien in einem."
        ),
    },
    {
        "title": "Ringstrasse: der erste Boom",
        "body": (
            "Alles davor war der erste Bauboom: Handschreiben vom 20. Dezember 1857 — Kaiser Franz Joseph "
            "befiehlt, Befestigung zu schleifen und Glacis zu verbauen. Ab 1858 waechst die Ringstrasse "
            "mit Prachtbauten, dahinter die Gruenderzeit-Zinshaeuser: Stuck, Parkett, Fluegeltueren, "
            "Kastenfenster — die Altbauwohnungen, in denen Wien bis heute am liebsten wohnt. Der Boom "
            "machte Grundbesitzer reich und Mieter arm: Slums in den Vorstaedten, Zinskasernen, "
            "Bettgeher. Die Antwort kam erst nach dem Krieg — siehe oben."
        ),
    },
    {
        "title": "Friedenszins: Segen, dann Unsinn",
        "body": (
            "Das Mietengesetz 1922 fror die Mieten auf dem Stand vom 1. August 1914 ein — den "
            "'Friedenszins' (Paragraph 2). Nach Inflation und Krieg ein Rettungsanker fuer Mieter. "
            "Aber eingefrorene Mieten erhalten keine Haeuser: jahrzehntelang verfielen Altbauten, weil "
            "sich Instandhaltung nicht rechnete. Erst ab 1982 konnten auch alte Vertraege angehoben "
            "werden (Weg zum MRG); in den 1980ern wurde der Friedenszins abgeschafft — und spukt seither "
            "als Gespenst durch jede Mietendebatte. Die Kehrseite heute: Wo Altmieter mit guenstigen "
            "Altvertraegen sitzen, versuchen skrupellose Hausbesitzer mitunter, sie loszuwerden — "
            "Eigenbedarfsdrohungen, Ablöse-Deals, Sanierungsdruck, Befristungs-Tricks. Wer das erlebt: "
            "Mieterschutzverband, Arbeiterkammer, Schlichtungsstelle. Kein Einzelfall-Geschichtenerzaehlen "
            "hier — aber das Muster ist dokumentiert, und Vorsicht ist angebracht."
        ),
    },
    {
        "title": "Der zweite Boom: nach 2000",
        "body": (
            "2004 ging in der Roesslergasse (Liesing) der erste neue Gemeindebau seit Jahrzehnten hoch — "
            "die Stadt baute wieder selbst. Seither: Seestadt Aspern (ehemaliges Flugfeld, 240 Hektar, "
            "seit 2014, Wohnraum fuer 25.000+ Menschen, Masterplan Johannes Tovatt), Sonnwendviertel beim "
            "Hauptbahnhof, Nordbahnhofviertel, Donauplatte. Wien waechst — und versucht, diesmal nicht erst "
            "Slums entstehen zu lassen."
        ),
    },
    {
        "title": "Hotels, Pensionen — und was es nicht gibt",
        "body": (
            "Die Hotellandschaft reicht vom Grand Hotel der Ringstrasse (Sacher, Imperial, Bristol, "
            "Ritz-Carlton, Park Hyatt) bis zur Wiener 'Pension' — familiengefuehrte Kleinbetriebe mit "
            "Fruehstuecksraum statt Lobby, oft in Gruenderzeithaeusern. Was es NICHT gibt: Share Houses "
            "wie in Japan — keine gemanagte WG-Industrie mit Reinigungsservice und Events. Wer WG will, "
            "sucht klassisch (Mitbewohner-Boersen, Unischwarzesbrett-Prinzip digital). Dafuer gibt es "
            "Studentenheime im grossen Stil (Akademikerhilfe: ~20 Heime, ~2.600 Plaetze in Wien; dazu "
            "OEJAB, STUWO, WIHAST) und staedtische Seniorenheime ('Haeuser zum Leben')."
        ),
    },
    {
        "title": "Die Airbnb-Revolution und ihre Feinde",
        "body": (
            "Airbnb fraß Wohnraum: ganze Haeuser wurden zu de-facto-Hotels, Anrainer bekamen Koffer-Rollen "
            "um 3 Uhr frueh. Wien schlug zurueck — und zwar hart: seit 1. Juli 2024 ist touristische "
            "Kurzzeitvermietung in Wohnzonen grundsaetzlich verboten; ausserhalb der Wohnzone sind ohne "
            "Bewilligung maximal 90 Tage pro Jahr erlaubt (Home-Sharing light), darueber braucht es eine "
            "Ausnahmebewilligung nach Paragraph 129 Bauordnung, befristet auf maximal fuenf Jahre. "
            "Plattformen wie Airbnb und Booking.com muessen liefern (Daten, Registrierung), Expedia, HRS "
            "und Trivago surfen im selben Fahrwasser. Ziel laut Stadt: leistbarer Wohnraum fuer die "
            "Wiener Bevoelkerung. Der Kampf laeuft — aber Wien kaempft, und das ist schon mehr, als die "
            "meisten Staedte tun."
        ),
    },
]

STAYS: list[dict] = [
    {"name": "Karl-Marx-Hof", "address": "Heiligenstaedter Strasse 82-92, 1190 Wien", "notes": "1927-1930, Karl Ehn; 1.272 Wohnungen (urspr. 1.382); Eroeffnung 12.10.1930; Feb-1934-Kaempfe; Waschsalon-Ausstellung 'Das Rote Wien'", "tags": ["gemeindebau", "denkmal"], "source": "cityabc.at + stadtfilm-wien.at + dasrotewien-waschsalon.at", "details": "Waschsalon Nr. 2 (Halteraugasse) seit 1.5.2010: 4 Themen (Rotes Wien 1919-34, Wohnbau, Bildung/Kultur); 'Neues Wien' als Gesellschaftsexperiment ueber alle Lebensbereiche. Beschilderung: nicht verifiziert (kleines Haus — deutsch sicher, englisch fraglich; vor Ort pruefen)."},
    {"name": "Gemeindebau-Bestand (Wiener Wohnen)", "address": "cityweit (~1.800 Bauten)", "notes": "220.000 Wohnungen (Stand 2016); 65.000 im Roten Wien; Neubau-Roesslergasse Liesing 2004; wohnberatung-wien Vergabe", "tags": ["gemeindebau"], "source": "SPOE Wien + Die Presse"},
    {"name": "Seestadt Aspern", "address": "22. Bezirk, Donaustadt", "notes": "240 ha, seit 2014; 25.000+ Bewohner, 20.000+ Arbeitsplaetze; Masterplan Tovatt", "tags": ["neubau", "stadtentwicklung"], "source": "wien.gv.at + aspern-seestadt.at"},
    {"name": "Sonnwendviertel", "address": "10. Bezirk (Hauptbahnhof)", "notes": "Neubau-Quartier mit Mischnutzung (vgl. Bauwelt: Seestadt + Sonnwendviertel Ost)", "tags": ["neubau", "stadtentwicklung"], "source": "bauwelt.de"},
    {"name": "Nordbahnhofviertel", "address": "2. Bezirk (verify)", "notes": "Neubau-Quartier", "tags": ["neubau", "stadtentwicklung"], "verify": True},
    {"name": "Akademikerhilfe (Heime)", "address": "~20 Heime Wien, ~2.600 Plaetze", "notes": "Groesster studentischer Traeger (Beispiel); Standorte + Preise online vergleichen", "tags": ["studentenheim"], "source": "akademikerhilfe.at"},
    {"name": "OEJAB / STUWO / WIHAST", "address": "Wien (verify)", "notes": "Weitere Heimtraeger; Adressen + Plaetze im naechsten Pass", "tags": ["studentenheim"], "verify": True},
    {"name": "Haeuser zum Leben", "address": "Wien (verify)", "notes": "Staedtische Seniorenheime (Kuratorium Wiener Pensionisten-Wohnhaeuser)", "tags": ["seniorenheim"], "verify": True},
    {"name": "Hotel Sacher Wien", "address": "Philharmonikerstrasse, 1010 Wien (verify)", "notes": "Grand-Hotel-Klassiker (siehe auch Restaurants/Hotels)", "tags": ["hotel", "luxus"], "verify": True},
    {"name": "Pensionen (klassisch)", "address": "Wien (verify)", "notes": "Familiengefuehrte Kleinbetriebe in Gruenderzeithaeusern; Namen im naechsten Pass", "tags": ["pension"], "verify": True},
    {"name": "WG (klassisch)", "address": "cityweit", "notes": "Keine Sharehouse-Industrie wie in Japan: Mitbewohner-Boersen statt Management-Firma", "tags": ["wg"]},
    {"name": "Airbnb-Regel Wien", "address": "gilt cityweit (seit 1.7.2024)", "notes": "Wohnzone: Verbot. Ausserhalb: max 90 Tage/Jahr ohne Bewilligung; Ausnahme §129 BO max 5 Jahre", "tags": ["airbnb", "recht"], "source": "wien.gv.at + airbnb.at/help/897 + WKO"},
    {"name": "Booking.com & Co.", "address": "Plattformen", "notes": "Booking, Expedia, HRS, Trivago: Vermittler im selben Fahrwasser (Registrierungs-/Datenpflichten)", "tags": ["plattform"]},
]


def get_paean() -> list[dict]:
    """Der Lobgesang: 7 Kapitel Wiener Wohnen."""
    return PAEAN


def get_stays() -> list[dict]:
    """Stay-Eintraege: Gemeindebau, Neubau, Heime, Hotels, Recht."""
    return STAYS

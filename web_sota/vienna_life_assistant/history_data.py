"""Vienna history: extensive section, Vindobona to the present. Round 8 (2026-10-16).

Search-verified anchors: Vindobona (Wien Geschichte Wiki), Staatsvertrag
15.5.1955 Belvedere + Figl (hdgoe + Presse), Musikverein 1867-70. Other dates
are textbook-canonical (Geschichte-Wiki/hdgoe/Wien Museum Lesart); contested or
approximate points carry an explicit note. Nothing invented.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "vindobona": "geschichtewiki.wien.gv.at (Vindobona) + Stadtarchaeologie Wien",
    "staatsvertrag": "hdgoe.at + oesterreich-ist-frei (Belvedere 15.5.1955, Figl)",
    "ringstrasse": "geschichtewiki.wien.gv.at + Wien Museum (Plan 1857, Demolierung ab 1858)",
    "allgemein": "Allgemeinwissen entlang Wien Geschichte Wiki / hdgoe / Wien Museum; strittige Punkte markiert",
}

HISTORY_CHAPTERS = [
    {
        "title": "Vindobona: Rom am Donaukanal",
        "body": (
            "Bevor es Wien gab, gab es Vindobona: roemisches Legionslager plus Militaersiedlung plus "
            "Zivilstadt an der Donau, auf heutigem Stadtgebiet (Wien Geschichte Wiki). Unter dem Graben "
            "liegt der Graben — Stadtarchaeologie zum Anfassen am Kohlmarkt, in den Tuchlauben, am "
            "Hohen Markt. Marcus Aurelius soll hier gestorben sein (so die Ueberlieferung — als "
            "Vorsicht markiert, nicht als Fakt)."
        ),
    },
    {
        "title": "Babenberger und der Name",
        "body": (
            "976 kommt die Ostmark an die Babenberger; 996 schreibt die Schenkungsurkunde erstmals "
            "'Ostarrichi'. 1156 macht das Privilegium Minus Oesterreich zum Herzogtum, Wien wird "
            "Residenzstadt. Textbook-Daten; die Urkunde liegt im Bayerischen Hauptstaatsarchiv, nicht in Wien."
        ),
    },
    {
        "title": "Habsburg: 600 Jahre Hauptstadt",
        "body": (
            "1278: Rudolf I. schlaegt Ottokar auf dem Marchfeld — Beginn der Habsburgerherrschaft. Wien wird "
            "Residenz, dann Reichshauptstadt, dann Weltstadt: 1365 Universitaet (Alma Mater Rudolphina), "
            "Stephansdom-Ausbau, Hofburg-Wachstum. Zwei Belagerungen durch die Osmanen (1529, 1683) praegen "
            "das Selbstbild bis heute — Entsatzheer, Kipferl-Mythos (als Mythos markiert) und Stadtbild."
        ),
    },
    {
        "title": "Maria Theresia, Joseph II., 1848",
        "body": (
            "1740-1780 Theresianische Reformen (Schulpflicht!); Joseph II. loest Kloester auf und baut "
            "Spitaeler. 1848: Revolution, Barrikaden, Metternich flieht — und die Ringstrasse wird Jahrzehnte "
            "spaeter auch als Militaer-Boulevard gegen neue Barrikaden gelesen (Deutung, als solche markiert). "
            "1867 Ausgleich: Wien Hauptstadt der einen Haelfte eines Doppelreichs mit 50 Millionen Einwohnern."
        ),
    },
    {
        "title": "Gründerzeit und Elend",
        "body": (
            "Handschreiben 20.12.1857, Demolierung ab 1858 (verifiziert): Prachtbauten vorne, Zinskasernen "
            "hinten. Um 1900 zwei Millionen Einwohner, drittgroesste Stadt Europas nach London und Paris "
            "(Rang als Orientierung, nicht gezaehlt). Slums in Ottakring und Favoriten, Bettgeher, "
            "Kellerloecher — das Elend, auf das das Rote Wien antworten wird (siehe Wohnen-Sektion)."
        ),
    },
    {
        "title": "1918: Republik wider Willen",
        "body": (
            "Der Vielvoelkerstaat zerfaellt; Wien bleibt als 'Wasserkopf' uebrig — zwei Millionen Menschen, "
            "Hinterland weg. 1918 Republik, 1920 Bundesverfassung, Wien wird 1922 eigenes Bundesland. "
            "Das Rote Wien baut (siehe Wohnen): gegen Hunger, Tuberkulose und Wohnungsnot."
        ),
    },
    {
        "title": "1933-1945: die dunklen Jahre",
        "body": (
            "1933 schaltet Dollfuß das Parlament aus (Austrofaschismus), Februar 1934 Buergerkrieg "
            "(Karl-Marx-Hof!), Juli 1934 Nazi-Mord an Dollfuß, 1938 'Anschluss': Jubel am Heldenplatz und "
            "Terror gegen Juedinnen und Juden ab dem ersten Tag. Wien wird braun, dann zerbombt. "
            "April 1945 befreit die Rote Armee die Stadt; Karl Renner bildet die Regierung. "
            "Diese Sektion nennt die Dinge beim Namen — Verharmlosung gibt es hier nicht."
        ),
    },
    {
        "title": "1945-1955: vier Herren, ein Staatsvertrag",
        "body": (
            "Zehn Jahre Viermaechte-Besatzung (Sektoren + Interalliierte Zone Innere Stadt). Dann, "
            "verifiziert: am 15. Mai 1955 unterzeichnen im Belvedere die Aussenminister der vier "
            "Alliierten plus Figl den Staatsvertrag; Figl zeigt das Dokument vom Balkon: 'Oesterreich "
            "ist frei!' Neutralitaet als Preis und Programm. 26. Oktober: Nationalfeiertag."
        ),
    },
    {
        "title": "Kreisky, EU, Gegenwart",
        "body": (
            "1970er: Kreisky-Aera — Reformen, 'ein paar Stunden Sonne', UNO-City (1979). 1995 EU-Beitritt. "
            "Wien waechst wieder (2 Mio. geknackt), baut Seestadt und Hauptbahnhofviertel, streitet ueber "
            "Mieten, Kurzzeitvermietung und den richtigen Mehlspeisen-Plural. Die Geschichte ist nicht zu "
            "Ende — sie hat nur diese Sektion vorlaeufig abgeschlossen."
        ),
    },
]

TIMELINE = [
    {"year": "~100 n.Chr.", "event": "Vindobona: Legionslager an der Donau", "source": "Wien Geschichte Wiki"},
    {"year": "996", "event": "Ostarrichi-Urkunde (Name Oesterreich)"},
    {"year": "1156", "event": "Privilegium Minus: Herzogtum, Residenz Wien"},
    {"year": "1278", "event": "Marchfeld: Habsburg uebernimmt"},
    {"year": "1365", "event": "Universitaet Wien gegruendet"},
    {"year": "1529 / 1683", "event": "Osmanische Belagerungen"},
    {"year": "1848", "event": "Revolution, Metternich flieht"},
    {"year": "1857/58", "event": "Handschreiben + Demolierung: Ringstrasse", "source": "Geschichte-Wiki"},
    {"year": "1867-70", "event": "Musikverein gebaut", "source": "Wien Geschichte Wiki"},
    {"year": "1918/22", "event": "Republik; Wien eigenes Bundesland"},
    {"year": "1927-30", "event": "Karl-Marx-Hof gebaut", "source": "Stadtfilm/CityABC"},
    {"year": "1934", "event": "Februar-Kaempfe (u.a. Karl-Marx-Hof)"},
    {"year": "1938", "event": "Anschluss"},
    {"year": "1945", "event": "Befreiung April; Besatzung beginnt"},
    {"year": "1955", "event": "15.5. Staatsvertrag Belvedere; 'Oesterreich ist frei!'", "source": "hdgoe"},
    {"year": "1995", "event": "EU-Beitritt"},
]


def get_history_chapters() -> list[dict]:
    """Erzählte Geschichte: 9 Kapitel von Vindobona bis Kreisky."""
    return HISTORY_CHAPTERS


def get_timeline() -> list[dict]:
    """Jahreszahlen zum Festhalten."""
    return TIMELINE

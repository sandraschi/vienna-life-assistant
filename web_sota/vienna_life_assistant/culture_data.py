"""Vienna culture: music (Goldener Saal to Schrammeln), museums, theater,
festivals, film, galleries. Round 6 (2026-10-16).

Verified this round: Burgtheater (Universitaetsring 2), KHM
(Maria-Theresien-Platz), Krinzinger (Seilerstaette 16, seit 1971),
Freud Museum (Berggasse 19), Sissi-Trilogie (1955/56/57, Marischka),
Kottan (1976-84, Zenker/Patzak), Schrammelmusik (1878),
Vier Frauen (ORF 2005, Satire-Landkrimi), Donauinselfest (3.-5.7.2026, 43.),
Viennale (64., groesstes AT-Filmfestival).
Entries flagged "verify: True" need street-level confirmation.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "venues": "musikverein.at + burgtheater.at + khm.at + concerti.at",
    "film": "de.wikipedia.org (Sissi, Kottan via Extract; Hofrat Geiger via 1947er-Remake-Beleg) + ORF ON (Vier Frauen)",
    "schrammel": "de.wikipedia.org (Schrammelmusik via Extract)",
    "festivals": "wien.info (Viennale) + ganz-wien.at (Donauinselfest 2026)",
    "galleries": "galerie-krinzinger.at + wien.info + falter.at",
    "freud": "freud-museum.at + wienmuseum Magazin",
    "rex": "tv.orf.at + on.orf.at (ORF ON) + joyn.at",
    "medien": "orf.at/digital + oesterreich-Medienueberblicke (14 Tageszeitungen, 7 bundesweit) + krone.at (reichweitenstaerkste)",
    "verify2026": "konzerthaus.at + wiener-staatsoper.at + belvedere.at + albertina.at + secession.at + nhm-wien.ac.at + technischesmuseum.at + josefstadt.org + kriminalmuseum.at + rudolfshof.at + tante-liesl.at + ragusa.at + lapasteria.at + kiangwine.at + xocolat.at + luxor1090.at",
    "weihnachten2026": "wien.info (Maerkte) + wiencityguide + regionalsuche.at + mintaustria.com (16 Maerkte, Belvedere neu) + christkindlmaerkte.com + wanderscope.at",
}

# Offizielle Sites (nur Belegtes) + Weihnachtsmarkt-Quellen.
OFFICIAL_URLS = {
    "Musikverein (Goldener Saal)": "https://musikverein.at",
    "Wiener Konzerthaus": "https://www.konzerthaus.at",
    "Burgtheater": "https://www.burgtheater.at",
    "Kunsthistorisches Museum": "https://www.khm.at",
    "Belvedere (Oberes/Unteres)": "https://www.belvedere.at",
    "Albertina": "https://www.albertina.at",
    "MAK": "https://www.mak.at/",
    "Wien Museum": "https://www.wienmuseum.at",
    "Sigmund Freud Museum": "https://www.freud-museum.at/de",
    "Theater an der Wien": "https://www.vbw.at",
    "Galerie Krinzinger": "https://galerie-krinzinger.at/",
    "Wiener Kriminalmuseum": "https://www.kriminalmuseum.at",
    "Kommissar Rex (1994-2004)": "https://tv.orf.at/program/orf3/zeitgeschi3788.html",
    "Kronen Zeitung": "https://www.krone.at/",
    "ORF (1, 2, III, ON)": "https://www.orf.at",
    "Viennale": "https://www.wien.info/de/aktuell/veranstaltungen/viennale-2025-935324",
    "Donauinselfest": "https://www.ganz-wien.at/veranstaltungen/festival/donauinselfest.html",
    "Christkindlmarkt Rathausplatz": "https://www.wien.info/de/aktuell/weihnachten/weihnachtsmaerkte-365008",
    "Juedisches Museum (Dorotheergasse)": "https://www.jmw.at/",
    "Museum Judenplatz": "https://www.jmw.at/",
    "Moebelmuseum (Hofmobiliendepot)": "https://www.moebelmuseumwien.at/",
    "Tiergarten Schoenbrunn": "https://www.zoovienna.at/",
    "Votivkino": "https://www.votivkino.at/",
    "Sisi Museum (Hofburg)": "https://www.sisimuseum-hofburg.at",
    "Blumengaerten Hirschstetten": "https://www.wien.gv.at/freizeit/blumengaerten-hirschstetten-besucherinformationen",
    "Volksgarten": "https://www.geschichtewiki.wien.gv.at/Volksgarten",
    "Arenbergpark (Flaktuerme)": "https://www.geschichtewiki.wien.gv.at/Flakturmpaar_Arenbergpark",
    "Haus des Meeres": "http://www.haus-des-meeres.at/",
}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS

CULTURE_INTRO = [
    {
        "title": "Vom Goldenen Saal zum Heurigen",
        "body": (
            "Wien hoert nie auf zu musizieren — oben der Goldene Saal mit knapp 2.000 Plaetzen und "
            "seinem 'Goldenen Klang', unten beim Heurigen zwei Geigen, Kontragitarre und picksüsses "
            "Hoelzl. Dazwischen: Oper, Konzerthaus, Jazzclubs, Techno-Keller und das Wienerlied. "
            "Diese Sektion laeuft die ganze Strecke ab — mit verifizierten Adressen wo moeglich, "
            "ehrlichen (verify)-Flags wo nicht."
        ),
    },
]

VENUES: list[dict] = [
    # -- Musik: Klassik --
    {"name": "Musikverein (Goldener Saal)", "address": "Musikvereinsplatz 1, 1010 Wien", "phone": "+43 1 505 81 90", "notes": "Neorenaissance 1867-1870; Wiener Philharmoniker; Goldener Klang; ~2.000 Plaetze; Neujahrskonzert alljaehrlich 1.1.", "tags": ["musik", "klassik"], "source": "musikverein.at + concerti.at + Wien Geschichte Wiki"},
    {"name": "Wiener Konzerthaus", "address": "Lothringerstrasse 20, 1030 Wien", "phone": "+43 1 242002", "notes": "Zweiter Klassik-Saal der Stadt", "tags": ["musik", "klassik"], "source": "konzerthaus.at"},
    {"name": "Wiener Staatsoper", "address": "Opernring 2, 1010 Wien", "notes": "Oper + Ballett; Opernball alljaehrlich (Fasching)", "tags": ["musik", "oper"], "source": "wiener-staatsoper.at",         "details": "Eroeffnet 25.5.1869 mit Don Giovanni (deutsch); Opernball-Karten nur via Opernball-Buero. Stehplaetze (Sandra): beruehmt billig, Schlange am Auffuehrungstag, echte Fans stehen stundenlang; sehr gute Sicht hinterm Parterre; Studenten + Touris; Aufstuetz-Gelaender machen 3-Stunden-Opern ok."},
    {"name": "Volksoper", "address": "Waehringer Strasse 78, 1090 Wien", "notes": "Operette, Musical, Ballett", "tags": ["musik", "operette"], "source": "wiener-staatsoper.at (Bundestheater-Adressen)"},
    {"name": "Theater an der Wien", "address": "Linke Wienzeile 6, 1060 Wien", "phone": "+43 1 58830", "notes": "Musiktheater/Oper (VBW)", "tags": ["musik", "oper"], "source": "theater-wien.at"},
    # -- Musik: Wienerlied/Schrammeln --
    {"name": "Schrammelmusik (Konzept)", "address": "Heurigen + Gaststaetten cityweit", "notes": "Johann & Josef Schrammel, ab 1878 mit Strohmayer: 2 Geigen, Kontragitarre, G-Klarinette, spaeter Harmonika; Wiener Volksmusik, eng mit Wienerlied/Heurigenmusik", "tags": ["musik", "wienerlied"], "source": "de.wikipedia.org"},
    {"name": "Heurigen Grinzing/Nussdorf", "address": "19. Bezirk (verify)", "notes": "Heurigenviertel fuer Schrammeln + Sturm; konkret: Rudolfshof, Cobenzlgasse 8 (Endstation 38), +43 1 320 21 08", "tags": ["musik", "heuriger"], "verify": True, "source": "rudolfshof.at"},
    {"name": "Heurigen Stammersdorf/Mauer", "address": "21./23. Bezirk (verify)", "notes": "Stadtrand-Heurige (Adressen naechster Pass)", "tags": ["musik", "heuriger"], "verify": True},
    # -- Museen --
    {"name": "Kunsthistorisches Museum", "address": "Maria-Theresien-Platz, 1010 Wien", "notes": "Fuenf Jahrtausende; Bruegel-Saal; Kaiserforum", "tags": ["museum", "klassik-museum"], "source": "khm.at + de.wikipedia.org", "details": "Neorenaissance-Ringstrassenbau 1871-1891 (Semper/Hasenauer, Auftrag Franz Josephs), oeffentlich seit 22.10.1891. Groesste Bruegel-Sammlung der Welt (12 Gemaelde: Fasching/Fasten, Kinderspiele, Babel, Jaeger im Schnee). Kunstkammer: Cellinis Saliera (1539-43), Gemma Augustea, Kinderharnisch Karls V. Dazu Aegyptisch-Orientales (Mastaba des Kaninisut), Antiken, Muenzkabinett. Verbund: Neue Burg, Theatermuseum, Weltmuseum, Theseustempel, Schatzkammer, Wagenburg, Ambras."},
    {"name": "Belvedere (Oberes/Unteres)", "address": "Prinz-Eugen-Strasse 27, 1030 Wien", "phone": "+43 1 79 55 70", "notes": "Klimt-Kuss; Barockschloss Prinz Eugens", "tags": ["museum"], "source": "belvedere.at + wien.info + de.wikipedia.org", "details": "Sommerresidenz Prinz Eugens (Hildebrandt 1712-23); Garten (Girard, vollendet 1725, seit 1780 oeffentlich, 12 Brunnen 2005-10 saniert); Kuss 1908/09; ab 1903 Moderne Galerie, seit 1955 Oest. Galerie; Staatsvertrag 15.5.1955 im Marmorsaal; Alpengarten (Erzherzog Johann 1803, 1865 zusammengelegt); Menagerie nach Eugens Tod nach Schoenbrunn."},
    {"name": "Albertina", "address": "Albertinaplatz 1, 1010 Wien", "phone": "+43 1 534830", "notes": "Grafik + Moderne; taeglich 10-18, Mi/Fr bis 21h; dazu Albertina Modern", "tags": ["museum"], "source": "albertina.at + wien.info + Geschichte-Wiki", "details": "Grafiksammlung seit 1776 (Herzog Albert von Sachsen-Teschen), Palais Augustinerstrasse 1; Batliner seit 2007 (eine der groessten Privatsammlungen Europas: Impressionismus bis Gegenwart)."},
    {"name": "MuseumsQuartier (Areal)", "address": "Museumsplatz, 1070 Wien", "notes": "Eines der groessten Kulturareale der Welt; Haeuser einzeln unten", "tags": ["museum", "quartier"]},
    {"name": "mumok", "address": "Museumsplatz 1, 1070 Wien", "notes": "Stiftung Ludwig; Di-So 10-18", "tags": ["museum"], "source": "mumok.at"},
    {"name": "Leopold Museum", "address": "Museumsplatz 1, 1070 Wien", "notes": "Schiele/Klimt (Arealsadresse; Details naechster Pass)", "tags": ["museum"], "source": "MQ-Arealsadresse"},
    {"name": "Kunsthalle Wien", "address": "Museumsplatz 1, 1070 Wien", "notes": "Zeitgenoessisch (Arealsadresse; Details naechster Pass)", "tags": ["museum"], "source": "MQ-Arealsadresse"},
    {"name": "MAK", "address": "Stubenring 5, 1010 Wien", "notes": "Angewandte Kunst/Design", "tags": ["museum", "design"], "source": "mak.at + Geschichte-Wiki", "details": "Museum fuer Kunst und Industrie; 1907 Handelsmuseum-Bestaende (Asien/Siebold); 1937 Epochen-Neuaufstellung; mit Kunstgewerbeschule (Ferstel 1875-77) verbunden."},
    {"name": "Secession", "address": "Friedrichstrasse 12, 1010 Wien", "notes": "Beethovenfries; 'Der Zeit ihre Kunst' (U1/U2/U4 Karlsplatz)", "tags": ["museum", "jugendstil"], "source": "secession.at", "details": "Klimts Beethovenfries (1902, XIV. Ausstellung, Hommage an Beethoven) im Souterrain; Di-So 10-18, Mo zu; darueber zeitgenoessische Kunst."},
    {"name": "Wien Museum", "address": "Karlsplatz, 1040 Wien (verify)", "notes": "Urbanes Universalmuseum, Neubau (Hausnummer verifizieren)", "tags": ["museum", "stadt"], "verify": True, "source": "wienmuseum.at"},
    {"name": "Sigmund Freud Museum", "address": "Berggasse 19, 1090 Wien", "notes": "47 Jahre Wohn-/Arbeitsort, Flucht Juni 1938; Museum seit 1971, neu 2020", "tags": ["museum", "gedenken"], "source": "freud-museum.at", "details": "18 Monate Umbau, Neueröffnung 28.8.2020; Couch als digitales Erlebnis via Smartphone (Original 1938 mitgenommen)."},
    {"name": "Naturhistorisches Museum", "address": "Burgring 7, 1010 Wien", "phone": "+43 1 52177", "notes": "Venus von Willendorf", "tags": ["museum"], "source": "nhm-wien.ac.at"},
    {"name": "Technisches Museum", "address": "Mariahilfer Strasse 212, 1140 Wien", "notes": "Technik zum Anfassen", "tags": ["museum"], "source": "technischesmuseum.at"},
    # -- Theater --
    {"name": "Burgtheater", "address": "Universitaetsring 2, 1010 Wien", "phone": "+43 1 51444 4545", "notes": "1870er/80er-Haus ggü. Rathaus; groesste Sprechbuehne Europas", "tags": ["theater", "sprechtheater"], "source": "burgtheater.at"},
    {"name": "Akademietheater", "address": "1030 Wien", "notes": "Zweite Spielstaette des Burgtheaters (Strasse verifizieren)", "tags": ["theater"], "verify": True, "source": "burgtheater.at Saalplaene"},
    {"name": "Theater in der Josefstadt", "address": "Josefstaedter Strasse 26, 1080 Wien", "notes": "Aeltestes bespieltes Theater Wiens; 562 Sitz- + 10 Stehplaetze; Kammerspiele als Zweitbuehne", "tags": ["theater"], "source": "josefstadt.org"},
    {"name": "Volkstheater", "address": "1070 Wien (verify)", "notes": "Volkstheater-Tradition (Strasse verifizieren)", "tags": ["theater"], "verify": True},
    {"name": "Rabenhof Theater", "address": "1030 Wien (verify)", "notes": "Zeitgenoessisches urbanes Volkstheater mit Popkultur-Ansatz IM Gemeindebau (Strasse verifizieren)", "tags": ["theater", "kabarett"], "verify": True, "source": "rabenhof.at"},
    {"name": "Schauspielhaus / Werk X", "address": "Wien (verify)", "notes": "Freie Szene (Adressen naechster Pass)", "tags": ["theater", "freie-szene"], "verify": True},
    # -- Film: Wien dreht --
    {"name": "Der Hofrat Geiger (1947)", "address": "Film, kein Ort", "notes": "Nach Martin Costa; '1947er-Kitsch' (Zitat TV Spielfilm); Remakes: Mariandl (1962), TV 1996 (Peter Weck); Wachau/Spitz-Milieu", "tags": ["film", "heimatfilm"], "source": "de.wikipedia.org"},
    {"name": "Sissi-Trilogie (1955/56/57)", "address": "Film, kein Ort", "notes": "Ernst Marischka; Romy Schneider + Karlheinz Böhm; erfolgreichste dt.-sprachige Produktion; Kaiser-Mythos aus Schönbrunn", "tags": ["film", "heimatfilm"], "source": "wikipedia (bing-verifiziert)"},
    {"name": "Heimatfilm (Konzept)", "address": "Kino, kein Ort", "notes": "Nachkriegs-Genre: Berge, Förster, Mariandln; Wien als Sehnsuchtsort — Gegenpol zum Trümmerfilm", "tags": ["film", "heimatfilm"]},
    {"name": "Kottan ermittelt (1976-84)", "address": "ORF, kein Ort", "notes": "19 Folgen; Zenker/Patzak; Kottan: Vogel/Buchrieser/Resetarits; Krimi-Satire, DIE Wiener Polizei-Komödie", "tags": ["film", "polizei-komoedie"], "source": "de.wikipedia.org"},
    {"name": "Vier Frauen und ein Todesfall (ab 2005)", "address": "ORF 1 / ORF ON, kein Ort", "notes": "Landkrimi mit satirischen Zügen; Staffeln auf ORF ON", "tags": ["film", "polizei-komoedie"], "source": "ORF ON"},
    {"name": "SOKO Donau / CopStories", "address": "ORF (verify)", "notes": "Procedural-Gegenwart (Details naechster Pass)", "tags": ["film", "polizei-komoedie"], "verify": True},
    # -- Festivals --
    {"name": "Viennale", "address": "cityweit (Hauptspielstaetten verify)", "notes": "64. Ausgabe; groesstes AT-Filmfestival; alljaehrlich Herbst", "tags": ["festival", "film"], "source": "wien.info"},
    {"name": "Donauinselfest", "address": "Donauinsel", "notes": "3.-5.7.2026, 43. Ausgabe; groesstes Open-Air Europas, Eintritt frei", "tags": ["festival", "musik"], "source": "ganz-wien.at"},
    {"name": "Christkindlmarkt Rathausplatz", "address": "Rathausplatz, 1010 Wien", "notes": "13.11.-26.12.2026, taegl. 10-22 (24.12. bis 18:30), Eintritt frei; Eistraum, Kinderwelt Rathauspark, Kerzen-Torbogen (eine Quelle nennt 14.11.-6.1. — vor Ort pruefen)", "tags": ["festival", "weihnachtsmarkt"], "source": "christkindlmaerkte.com + wanderscope.at + mintaustria.com"},
    {"name": "Weihnachtsmarkt Schoenbrunn", "address": "Schloss Schoenbrunn, 1130 Wien", "notes": "Ab 6.11.2026; Palastkulisse", "tags": ["festival", "weihnachtsmarkt"], "source": "Weihnachtsmaerkte-Uebersicht 21.09.2026"},
    {"name": "Weihnachtsmarkt Belvedere", "address": "Schloss Belvedere, 1030 Wien", "notes": "NEU 2026", "tags": ["festival", "weihnachtsmarkt"], "source": "mintaustria.com (16 Maerkte)"},
    {"name": "Weihnachtsmarkt Spittelberg", "address": "Spittelberg, 1070 Wien", "notes": "Viertel-Spaziergang; Handwerk", "tags": ["festival", "weihnachtsmarkt"], "source": "regionalsuche.at + viennaepass.com"},
    {"name": "Art Advent Karlsplatz", "address": "Karlsplatz, 1040 Wien", "notes": "Ab 13.11.; zeitgenoessisches Kunsthandwerk + Kulturprogramm", "tags": ["festival", "weihnachtsmarkt"], "source": "christkindlmaerkte.com + Uebersicht 21.09.2026"},
    {"name": "Altwiener Christkindlmarkt Freyung", "address": "Freyung, 1010 Wien", "notes": "Nostalgisch, traditionelles Angebot", "tags": ["festival", "weihnachtsmarkt"], "source": "christkindlmaerkte.com"},
    {"name": "Weihnachtsmarkt Am Hof", "address": "Am Hof, 1010 Wien", "notes": "Ab 13.11.; Handwerk/Geschenke", "tags": ["festival", "weihnachtsmarkt"], "source": "Uebersicht 21.09.2026 + regionalsuche.at"},
    {"name": "Weihnachtsmarkt Maria-Theresien-Platz", "address": "Maria-Theresien-Platz, 1010 Wien", "notes": "Zwischen KHM und NHM; Handwerk", "tags": ["festival", "weihnachtsmarkt"], "source": "regionalsuche.at + viennaepass.com"},
    {"name": "Weihnachtsmarkt Stephansplatz", "address": "Stephansplatz, 1010 Wien", "notes": "Ab 6.11.2026", "tags": ["festival", "weihnachtsmarkt"], "source": "Uebersicht 21.09.2026"},
    {"name": "Cineplexx (Kette)", "address": "cityweit Wien (verify)", "notes": "Multiplex-Kette; Einzelstandorte naechster Pass", "tags": ["film", "kino", "kette"], "verify": True},
    {"name": "Hollywood Megaplex", "address": "2x Wien (verify)", "notes": "IMAX + 4DX; dazu Pasching, St. Poelten, Innsbruck", "tags": ["film", "kino", "kette"], "verify": True, "source": "megaplex.at"},
    {"name": "Burg Kino", "address": "1010 Wien (verify)", "notes": "Arthouse-Top (4,3); 1.-Bezirk-Cluster", "tags": ["film", "kino", "arthouse"], "verify": True, "source": "Bestenliste 2026"},
    {"name": "Gartenbaukino", "address": "1010 Wien (verify)", "notes": "Arthouse-Top (4,4); grosser Saal", "tags": ["film", "kino", "arthouse"], "verify": True, "source": "Bestenliste 2026"},
    {"name": "Oesterreichisches Filmmuseum", "address": "1010 Wien (verify)", "notes": "Arthouse-Top (4,4); Archivkino", "tags": ["film", "kino", "arthouse"], "verify": True, "source": "Bestenliste 2026"},
    {"name": "Artis International", "address": "Schultergasse 5, 1010 Wien", "notes": "1.-Bezirk-Cluster", "tags": ["film", "kino"], "source": "Kinouebersicht"},
    {"name": "Actors Studio", "address": "Tuchlauben 13, 1010 Wien", "notes": "1.-Bezirk-Cluster", "tags": ["film", "kino"], "source": "Kinouebersicht"},
    {"name": "Apollo Kino", "address": "Gumpendorferstrasse 63, 1060 Wien", "notes": "Sechster Bezirk", "tags": ["film", "kino"], "source": "Kinouebersicht"},
    {"name": "Stadtkino / De France / Metro / Cine Center", "address": "Wien (verify)", "notes": "1.-Bezirk-Programmkinos (Einzelnamen naechster Pass)", "tags": ["film", "kino", "arthouse"], "verify": True, "source": "Wiener Kinoliste"},
    {"name": "Votivkino", "address": "Waehringer Strasse 12, 1090 Wien", "phone": "01 3173571", "notes": "Seit den 80ern Treffpunkt der Cineastenszene; zweite Spielstaette De France", "tags": ["film", "kino", "arthouse"], "source": "votivkino.at + film.at + Falter"},
    {"name": "Schikaneder", "address": "Wien (verify)", "notes": "Seit 1912; aeltestes durchgehend bespieltes Programmkino Wiens; Top-Kino-Nachbar", "tags": ["film", "kino", "arthouse"], "verify": True, "source": "topkino.at"},
    {"name": "Shopping City Sued (SCS)", "address": "Voesendorf bei Wien", "notes": "22.9.1976 eroeffnet; ca. 198.000 qm, 330+ Geschaefte; Nr. 1 in Oesterreich", "tags": ["shopping", "ekz"], "source": "Groessen-Ranking 2025"},
    {"name": "Westfield Donau Zentrum", "address": "Kagran, 1220 Wien", "notes": "Ca. 130.000 qm, ~260 Shops, ~18 Mio Besucher; groesstes Center IN Wien; Nr. 2 in Oesterreich", "tags": ["shopping", "ekz"], "source": "Groessen-Ranking 2025 + Center-Test"},
    {"name": "Lugner City", "address": "1150 Wien (verify)", "notes": "Kult-Center (Adresse verifizieren)", "tags": ["shopping", "ekz"], "verify": True},
    {"name": "Gasometer", "address": "1110 Wien (verify)", "notes": "Musik + Shopping in den Gasometern (Adresse verifizieren)", "tags": ["shopping", "ekz"], "verify": True},
    {"name": "Millennium City", "address": "1200 Wien (verify)", "notes": "Ufer-Center (Adresse verifizieren)", "tags": ["shopping", "ekz"], "verify": True},
    {"name": "Stadion Center", "address": "1020 Wien (verify)", "notes": "Prater-Naehe (Adresse verifizieren)", "tags": ["shopping", "ekz"], "verify": True},
    {"name": "BahnhofCity", "address": "Wien (verify)", "notes": "Bahnhofs-Shopping (Details naechster Pass)", "tags": ["shopping", "ekz"], "verify": True, "source": "Wien-Ranking 2023"},
    {"name": "Wiener Festwochen", "address": "cityweit (verify)", "notes": "Alljaehrlich Fruehsommer (Termin pruefen)", "tags": ["festival", "theater"], "verify": True},
    {"name": "Jazzfest Wien", "address": "cityweit (verify)", "notes": "Alljaehrlich Sommer (Termin pruefen)", "tags": ["festival", "musik"], "verify": True},
    {"name": "Film Festival Rathausplatz", "address": "Rathausplatz, 1010 Wien", "notes": "Alljaehrlich Sommer: Opernfilme + Streetfood (Termin pruefen)", "tags": ["festival", "film"], "verify": True},
    {"name": "ImPulsTanz", "address": "cityweit (verify)", "notes": "Tanzfestival Sommer (Termin pruefen)", "tags": ["festival", "tanz"], "verify": True},
    {"name": "Neujahrskonzert", "address": "Musikvereinsplatz, 1010 Wien", "notes": "Alljaehrlich 1.1., Philharmoniker; Kartenlotterie", "tags": ["festival", "musik"], "source": "musikverein.at"},
    # -- Galerien --
    {"name": "Galerie Krinzinger", "address": "Seilerstaette 16, 1010 Wien", "phone": "+43 1 513 30 06", "notes": "Seit 1971 (Ursula Krinzinger); 500+ Ausstellungen; Zeitgenoessisch", "tags": ["galerie"], "source": "galerie-krinzinger.at + wien.info"},
    {"name": "Galerie naechst St. Stephan", "address": "1010 Wien (verify)", "notes": "Klassiker der Avantgarde (Strasse verifizieren)", "tags": ["galerie"], "verify": True},
    {"name": "Schleifmuehlgasse-Cluster", "address": "1040 Wien (verify)", "notes": "Galerienmeile (u.a. Kargl; Hausnummern naechster Pass)", "tags": ["galerie", "cluster"], "verify": True},
    {"name": "Georg Kargl Fine Arts", "address": "Schleifmuehlgasse 5, 1040 Wien", "phone": "01/5854199", "notes": "Di-Fr 11-19h; Galerienmeile Schleifmuehlgasse", "tags": ["galerie", "cluster"], "source": "Galerien-Verzeichnis"},
    {"name": "Galerie Emanuel Layr", "address": "An der Huelben 2, 1010 Wien", "phone": "01/5245490", "notes": "Di-Fr 12-18h, Sa 12h+", "tags": ["galerie"], "source": "Galerien-Verzeichnis 2016"},
    {"name": "Galerie naechst St. Stephan", "address": "Gruenangergasse 1 (2. Stock), 1010 Wien", "phone": "01/5121266", "notes": "Avantgarde-Klassiker", "tags": ["galerie"], "source": "Galerien-Verzeichnis 2016"},
    {"name": "Wiener Kriminalmuseum", "address": "Grosse Sperlgasse 24, 1020 Wien", "phone": "+43 664 300 56 77", "notes": "Dunkle Seite der Stadtgeschichte; Mi-So 10-17; Eintritt ca. 12,50", "tags": ["museum", "kurios"], "source": "kriminalmuseum.at + de.wikipedia.org + Geschichte-Wiki", "details": "Seifensiederhaus (eines der aeltesten Haeuser der Leopoldstadt, bis 1862 Herrengasse 297); 1991 aus Kriminalpolizeilichem Museum der BPD (1984), Nachfolger k.k. Polizeimuseum (1899); interaktive Morfaelle zum Selbstloesen."},
    {"name": "Narrenturm", "address": "Uni Campus Hof 6, Spitalgasse 2, 1090 Wien", "notes": "Pathologisch-anatomische Sammlung; Mi 10-18, Do+Sa 10-13", "tags": ["museum", "kurios"], "source": "nhm.at + MedUni", "details": "Rundturm Josephs II., eroeffnet 19.4.1784 als 'k.k. Irrenanstalt' — erste Anstalt Europas dieser Art; heute pathologisch-anatomische Sammlung."},
    {"name": "Juedisches Museum (Dorotheergasse)", "address": "Dorotheergasse 11, 1010 Wien", "phone": "+43 1 5350431", "notes": "Geschichte des juedischen Wiens; So-Fr 10-18, Sa geschlossen", "tags": ["museum", "gedenken"], "source": "jmw.at + wien.info", "details": "1895 erstes juedisches Museum der Welt, 1938 geschlossen, 1993 wiedereroeffnet; Palais Eskeles; 800+ Jahre Geschichte, Schaudepot; Eintritt ca. 15 (2026)."},
    {"name": "Museum Judenplatz", "address": "Judenplatz 8, 1010 Wien", "notes": "Zweites Haus des Juedischen Museums; 10-18h; U3 Herrengasse", "tags": ["museum", "gedenken"], "source": "jmw.at", "details": "Misrachi-Haus; Direktorin Staudinger; eines der bedeutendsten juedischen Museen Europas."},
    {"name": "Moebelmuseum (Hofmobiliendepot)", "address": "Andreasgasse 7, 1070 Wien", "notes": "Weltgroesstes Wohnkultur-Museum: kaiserliches Mobiliar, Luester bis Spucknaepfe; Mo-So 10-18", "tags": ["museum"], "source": "moebelmuseumwien.at"},
    {"name": "Wagenburg", "address": "Schloss Schoenbrunn (verify)", "notes": "Kaiserliche Wagen (Adresse naechster Pass)", "tags": ["museum"], "verify": True},
    {"name": "Sisi Museum (Hofburg)", "address": "Michaelerkuppel, 1010 Wien", "phone": "+43 1 5337570", "notes": "Alte Hofburg: Sisi-Mythos am Originalschauplatz (Schwester-Seiten: Schoenbrunn, Hof, Moebelmuseum)", "tags": ["museum", "hofburg"], "source": "sisimuseum-hofburg.at"},
    {"name": "Schloss Schoenbrunn (Appartements)", "address": "1130 Wien (verify)", "notes": "State Apartments (~40 Min) vs. Palace Ticket (~75 Min); virtueller Rundgang online", "tags": ["museum", "schloss"], "verify": True, "source": "schoenbrunn.at", "details": "Sommerresidenz der Habsburger; UNESCO-Welterbe (besterhaltenes Barockensemble Europas); Gloriette 1775 (Hetzendorf, 241 m Aussicht)."},
    {"name": "Neue Hofburg", "address": "Heldenplatz, 1010 Wien", "notes": "Beherbergt Weltmuseum + Ruestkammer + mehr (Habsburger-Sammlungen)", "tags": ["museum", "hofburg"], "source": "KHM/Neue Hofburg"},
    {"name": "Weltmuseum Wien", "address": "Heldenplatz, 1010 Wien", "notes": "Ethnografie; heute 10-18h (Beispieltag)", "tags": ["museum", "hofburg"], "source": "weltmuseumwien.at"},
    {"name": "Hofjagd- und Ruestkammer", "address": "Heldenplatz, 1010 Wien (Zugang ueber Weltmuseum)", "notes": "Taeglich ausser Montag 10h+", "tags": ["museum", "hofburg"], "source": "KHM/Neue Hofburg"},
    {"name": "Tiergarten Schoenbrunn", "address": "Schlosspark Schoenbrunn, 1130 Wien (verify)", "notes": "Aeltester Zoo der Welt; Menagerie Franz I. Stephans. Fauna-Notiz (Sandra): Verglichen mit anderen Laendern ist Oesterreichs Fauna harmlos — am gefaehrlichsten ist die Kuh (Almweide, Mutterkuh mit Kalb, bellender Hund; kann toedlich enden). Hornviper: wirklich giftig; Kreuzotter: halb so wild", "tags": ["zoo", "garten"], "verify": True, "source": "zooviena.at + schoenbrunn.at"},
    {"name": "Palmenhaus Schoenbrunn", "address": "Schlosspark Schoenbrunn (verify)", "notes": "Adresse naechster Pass", "tags": ["garten"], "verify": True},
    {"name": "Wuestenhaus Schoenbrunn", "address": "Schlosspark Schoenbrunn (verify)", "notes": "Adresse naechster Pass", "tags": ["garten"], "verify": True},
    {"name": "Botanischer Garten", "address": "Wien (verify)", "notes": "Adresse naechster Pass", "tags": ["garten"], "verify": True},
    {"name": "Alpengarten Belvedere", "address": "Belvedere-Park (verify)", "notes": "Adresse naechster Pass", "tags": ["garten"], "verify": True},
    {"name": "Blumengaerten Hirschstetten", "address": "Quadenstrasse 15, 1220 Wien", "notes": "Themengaerten + Zoo im 22. Bezirk; Maerz-Okt (Stand 05/2026); Eintritt frei; Hundeverbot; Fuehrungen", "tags": ["garten", "zoo"], "source": "wien.gv.at + mamilade.at"},
    {"name": "Volksgarten", "address": "Hofburg-Areal, 1010 Wien", "notes": "1809 Bastionen gesprengt, 1812 geschliffen, 1814/15 eingeebnet; Theseustempel 1820-23 (Nobile); Rosarium nach WK2; Sisi-Denkmal", "tags": ["park", "garten"], "source": "Wien Geschichte Wiki"},
    {"name": "Rathauspark", "address": "Rathausplatz, 1010 Wien", "notes": "Ringstrassen-Garten, Eventzone (200 Jahre Ringstrassen-Gruen)", "tags": ["park", "garten"], "source": "Ringstrassen-Gaerten"},
    {"name": "Kurpark Oberlaa", "address": "Favoriten (verify)", "notes": "WIG-Gelaende (Jahr verifizieren); heute 25 km Spazierwege", "tags": ["park", "garten"], "verify": True, "source": "WIG-Seite"},
    {"name": "Donaupark", "address": "Donaustadt (verify)", "notes": "WIG-64-Erbe (verifizieren); Donauturm-Naehe", "tags": ["park", "garten"], "verify": True},
    {"name": "Wienerwald", "address": "Stadtrand (verify)", "notes": "Hausberg-Guertel (Details verifizieren)", "tags": ["park", "wald"], "verify": True},
    {"name": "Kahlenberg", "address": "Doebling (verify)", "notes": "Aussicht ueber Wien (Details verifizieren)", "tags": ["park", "aussicht"], "verify": True},
    {"name": "Arenbergpark (Flaktuerme)", "address": "Arenbergpark, 1030 Wien", "notes": "Flakturmpaar 'Baldrian': Bau Dez 1942-Okt 1943, Bauart II, 9 Stockwerke; erste fertige Tuerme Wiens (Vollausbau); von 6 Wiener Flaktuermen", "tags": ["park", "garten", "geschichte"], "source": "Wien Geschichte Wiki"},
    {"name": "Haus des Meeres", "address": "Fritz-Gruenbaum-Platz 1 (Esterhazypark), 1060 Wien", "phone": "+43 1 5871417", "notes": "Aquarium im Flakturm; taegl. 9-18, Do 9-21; 57A", "tags": ["museum", "aquarium"], "source": "haus-des-meeres.at", "details": "Flakturm aus den 1940ern im Esterhazypark: 1957 gruendet sich darin der Aqua Terra Zoo. Ehrenpraesident Franz Six praegt das Haus seit 1965 ehrenamtlich mit. Ausgebaut Stockwerk fuer Stockwerk — vom Bunker zum Aquarium mit 360-Grad-Ocean-Sky oben, Auffangstation, eigener Forschung und Freundesverein. Ueber 60 Jahre Hausgeschichte, dokumentiert auf haus-des-meeres.at/geschichte."},
    # -- TV: Rex, ORF, Privatsender --
    {"name": "Kommissar Rex (1994-2004)", "address": "Wien, TV (ORF/Sat.1)", "notes": "Rex = Reginald von Ravenhorst, Deutscher Schaeferhund; erst Moretti, dann Burkhard u.a.; 'Wiener Spuernasenmythos'; Weltsyndikat; streamt auf ORF ON; groesster Wiener TV-Export", "tags": ["tv", "polizei-komoedie"], "source": "tv.orf.at + on.orf.at"},
    {"name": "ORF (1, 2, III, ON)", "address": "Hugo-Portisch-Gasse, 1130 Wien (Kueniglberg; bis 2022 Wuerzburggasse)", "notes": "Oeffentlich-rechtlich; ORF III Kultur; ORF ON Streaming (Rex, Vier Frauen); Digital via Satellit", "tags": ["tv", "sender"], "source": "orf.at (Umbenennung 2022)"},
    {"name": "ATV", "address": "Wien (verify)", "notes": "Privatsender, bundesweit", "tags": ["tv", "sender", "privat"], "verify": True, "source": "Medienueberblicke 2026"},
    {"name": "PULS 4", "address": "Wien (verify)", "notes": "Als Ballungsraumsender Puls TV gestartet, heute bundesweit privat", "tags": ["tv", "sender", "privat"], "verify": True, "source": "Medienueberblicke"},
    {"name": "ServusTV", "address": "Salzburg/Wien (verify)", "notes": "Privatsender, bundesweit", "tags": ["tv", "sender", "privat"], "verify": True, "source": "Medienueberblicke 2026"},
    # -- Zeitungen & Blaetter --
    {"name": "Kronen Zeitung", "address": "Wien (verify)", "notes": "'Oesterreichs reichweitenstaerkste Tageszeitung' (Eigenangabe); Boulevard", "tags": ["zeitung"], "verify": True, "source": "krone.at"},
    {"name": "Der Standard / Die Presse / Kurier", "address": "Wien (verify)", "notes": "Qualitaetsblaetter (Details naechster Pass)", "tags": ["zeitung"], "verify": True},
    {"name": "Falter", "address": "Wien (verify)", "notes": "Stadtzeitung, wochenlich; Holzer testet seit 1988 (siehe REVIEWER_LANDSCAPE)", "tags": ["zeitung", "stadtzeitung"], "verify": True},
    {"name": "Profil / News / Trend", "address": "Wien (verify)", "notes": "Nachrichtenmagazine (Details naechster Pass)", "tags": ["zeitung", "magazin"], "verify": True},
    {"name": "Wiener Zeitung", "address": "Wien (verify)", "notes": "Ehemals aelteste Tageszeitung (Details naechster Pass)", "tags": ["zeitung"], "verify": True},
    {"name": "Augustin", "address": "Wien (verify)", "notes": "Strassenzeitung (Details naechster Pass)", "tags": ["zeitung"], "verify": True},
]


def get_culture_intro() -> list[dict]:
    """Intro-Essay: Goldener Saal bis Heurigen."""
    return CULTURE_INTRO


def get_culture_venues() -> list[dict]:
    """Kultur-Venues: Musik, Museen, Theater, Film, Festivals, Galerien."""
    return VENUES

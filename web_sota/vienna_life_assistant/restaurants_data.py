"""Canonical Vienna restaurant / cafe / bar intel.

Round 1 (2026-10-16, chitchat session, Sandra local):
Sources: mittag.at (Orlik), hitomi.at, rembetiko.at/speisen--wein-1090,
lunchy.to Servitenviertel ranking.

Round 2 (2026-10-16, deep research pass):
Sources: Falstaff Restaurantguide 2026 (Top 10 Wien + Punkte),
Guide MICHELIN Austria 2026 (Sterne), guide.michelin.com (Pramerl & the Wolf),
smilerkreativ.at (Geheimtipps wo Locals essen), wienuncovered/Falstaff (Wuerstelstaende),
akakiko.at, tuerkis.at, bahnhofcitywienwest.oebb.at, WIEN MITTE The Mall,
meinbezirk.at (Lucky Pavillon), falstaff.com (HuHu Hotpot),
diebestenderstadt.de (Bars/Doener), viennalist.com, all-inn.at,
mycitytrip/atlas-guide (Touristenfallen), Ritz-Carlton/Michelin (Hotelrestaurants).

Address verification (round 1, against server.py pre-existing list):
- Gasthaus Orlik: intel Spittelauer Platz 1, 1090 Wien WINS.
  server.py had "Servitengasse 7, 1090 Wien" -> STALE, corrected.
- MAST Weinbistro: intel Porzellangasse 53, 1090 Wien WINS.
  server.py had "Servitengasse 3, 1090 Wien" -> STALE, corrected.
Entries flagged "verify: True" have district-level or name-level addresses only;
streets get filled on the next fetch pass. Nothing is invented.
"""

from __future__ import annotations

FETCHED_ON = "2026-10-16"
SOURCES = {
    "orlik": "mittag.at",
    "hitomi": "hitomi.at",
    "rembetiko": "rembetiko.at/speisen--wein-1090",
    "ranking": "lunchy.to Servitenviertel ranking",
    "falstaff2026": "falstaff.com Restaurantguide 2026 (Top 10 Wien)",
    "michelin2026": "Guide MICHELIN Austria 2026",
    "pramerl": "guide.michelin.com/at/en/vienna/wien/restaurant/pramerl-the-wolf",
    "geheimtipps": "smilerkreativ.at/wiener-restaurant-geheimtipps-wo-die-locals-am-liebsten-essen (2026-01)",
    "wuerstel": "wienuncovered.com/wurstelstand-in-wien + Falstaff Top-10-Wuerstelstaende",
    "akakiko": "akakiko.at/about",
    "aida": "en.wikipedia.org/wiki/Aida_(cafe) + aida.at Geschichte",
    "tuerkis": "tuerkis.at + bahnhofcitywienwest.oebb.at + Yelp 2026",
    "wienmitte": "WIEN MITTE The Mall + wienuncovered (Sukiyaki) + meinbezirk.at (Lucky Pavillon)",
    "tourifallen": "mycitytrip.com + atlas-guide.com + gastroportal.at",
    "bars": "diebestenderstadt.de/wien/beste-bars-in-wien + Ritz-Carlton/Austrian press",
    "kaisers": "kaisers-original.com + derstandard.at (Mehlspeisenkette)",
    "trzesniewski": "trzesniewski.at + yourstage.wien.info + OEBB BahnhofCity",
    "tauber": "tauber.at + falter.at/lokal/10981",
    "pepi": "bahnhofcitywien-hauptbahnhof + downtownvienna.com/foodie-guide + offbeatbudapest",
    "uschains": "starbucks.at/store-locator + fiveguys.at + finde-offen.at/firmania.at (Verzeichnisse)",
    "asianwave": "beste asiatische Restaurants Wien (2025-02) + Falstaff 19 Top-Lokale asiatisch + TripAdvisor Top-10",
    "reviewers": "wien.info (Wiener Kueche/Klassiker/Vienna Bites 2026) + falter.at (Holzer seit 1988) + Falstaff + GaultMillau + Michelin",
    "schachtelwirt": "schachtelwirt-wien.at + derstandard.at (2016, Hausmannskost im Karton) + falter.at (Wien wie es isst) + restaurantguru (4.9)",
    "shortlist2026": "tante-liesl.at + ragusa.at + servitenwirt.at + lapasteria.at + wien.info + TripAdvisor + Falter/Falstaff (Mercerie) + kiangwine.at + xocolat.at + luxor1090.at + servitenviertel.at",
    "bosna": "beste-Wuerstelstaende-Listen + derstandard Test 2026-08 (Alles Wurscht Favorit) + vegane-Bosna-Berichte",
    "currywurst": "r/wien + viennalist.com/currywurst + curryeck.at + unilocal + falstaff.com Wuerstelstaende",
}

# Offizielle Sites (nur Domains, die in der Recherche tatsaechlich belegt sind).
# Alles andere bekommt zur Serve-Zeit einen Google-Maps-Suchlink (server.py).
OFFICIAL_URLS = {
    "Hitomi Wok & Grill 1090": "https://hitomi.at",
    "Rembetiko": "https://rembetiko.at/speisen--wein-1090",
    "Tuerkis (Kette, 15-16x)": "https://tuerkis.at",
    "Plachutta Stammhaus Hietzing": "https://www.plachutta.at",
    "Plachutta Wollzeile": "https://www.plachutta.at",
    "Plachutta Nussdorf": "https://www.plachutta.at",
    "Trzesniewski Stammhaus": "https://www.trzesniewski.at",
    "Trzesniewski (Filialnetz)": "https://www.trzesniewski.at",
    "Tauber Brötchen Manufaktur": "https://www.tauber.at",
    "Kaiser's Opernring": "https://www.kaisers-original.com",
    "Starbucks (AT-Netz)": "https://www.starbucks.at",
    "Five Guys (AT)": "https://www.fiveguys.at",
    "KFC Wien": "https://kfc.co.at/",
    "Flanagans Irish Pub": "https://flanagans.at/",
    "Shiki (Mutterlokal)": "https://www.shiki.at/home",
    "Wiener Deewan": "https://deewan.at",
    "Disco Volante": "https://www.disco-volante.at/",
    "Luftburg - Kolarik im Prater": "https://kolarik.at/",
    "Aida (Kette, 34x)": "https://www.aida.at",
    "Akakiko 1090": "https://www.akakiko.at",
    "Tante Liesl": "https://tante-liesl.at",
    "Ragusa": "https://www.ragusa.at",
    "Servitenwirt": "http://www.servitenwirt.at",
    "La Pasteria": "https://www.lapasteria.at",
    "Luxor Bar": "https://luxor1090.at/",
    "Schachtelwirt": "https://www.schachtelwirt-wien.at/",
    "Curryeck": "http://curryeck.at/",
    "Bitzinger (Albertina)": "https://bitzinger.wien",
    "Fuhrgassl-Huber": "https://www.fuhrgassl-huber.at/",
    "Zwoelf-Apostelkeller": "https://www.zwoelf-apostelkeller.at/",
    "Melker Stiftskeller": "https://www.melkerstiftskeller.at/",
    "Pramerl and the Wolf": "https://guide.michelin.com/at/en/vienna/wien/restaurant/pramerl-the-wolf",
}


def get_official_urls() -> dict:
    """Name -> offizielle URL (belegt). Rest: Maps-Fallback via server.py."""
    return OFFICIAL_URLS

ORLIK_WEEKLY_MENU = {
    "week": "2026-10-12/16",
    "lunch_hours": "Mon-Fri 11:00-14:30",
    "soup_daily": "Tagessuppe or Rindssuppe",
    "note": "Menue 1 veg-swappable",
    "days": [
        {"day": "Mo", "menu1": "1/2 Brathendl + Erbsenreis", "menu2": "Geroestete Knoedel mit Ei"},
        {"day": "Di", "menu1": "Rindermeisl + Kuerbisgemuese", "menu2": "Gnocchi all'arrabiata"},
        {"day": "Mi", "menu1": "Cordon bleu + Erdaepfelsalat", "menu2": "Krautfleckerl"},
        {"day": "Do", "menu1": "Schweinsbraten + Sauerkraut + Semmelknoedel", "menu2": "Spinatspaetzle"},
        {"day": "Fr", "menu1": "Kabeljau + Erdaepfelsalat", "menu2": "Spaghetti Bolognaise"},
    ],
}

REMBETIKO_KARTE = {
    "fetched": "2026-10-16",
    "source": "rembetiko.at/speisen--wein-1090",
    "sections": ["suppen", "vorspeisen", "hauptgerichte", "grill", "desserts", "weine"],
    "regulars": [
        {"dish": "Gyros", "number": "90"},
        {"dish": "Souvlaki Spezial", "number": "74"},
        {"dish": "Baeren Souvlaki (kids)", "number": "kids"},
        {"dish": "Tarzan Souvlaki (kids)", "number": "kids"},
        {"dish": "Indianer Souvlaki (kids)", "number": "kids"},
    ],
    "takeout": "takeout boxes available",
}

# --- Ketten-Analyse (round 2) -------------------------------------------------
CHAINS_ANALYSIS = {
    "akakiko": {
        "founded": 1994,
        "branches_at": "18 Filialen in Oesterreich",
        "concept": "Easy Japanese Fusion: Sushi, Maki, Bento, Wok, Ramen; erweitert um koreanisch/thai/chinesisch/pan-asiatisch",
        "position": "Oesterreichs groesste japanische Restaurantkette",
        "wien_branches": ["Julius-Tandler-Platz, 1090 (Franz-Josefs-Bahnhof)", "Wien Mitte, 1030", "Gerngross (Naehe Neubau), 1070", "Flagship 5. Stock (500+ qm, Wien)"],
        "verdict": "Solide Kette, gutes Preis-Leistung, SciFi-Deko in manchen Filialen; kein Geheimtipp, kein Reinfall.",
        "source": "akakiko.at/about",
    },
    "aida": {
        "founded": 1913,
        "branches_at": "34 Cafe-Konditoreien (Wien + Franchise global), groesster privater Konditorei-/Kaffeehaus-Betrieb Europas (bis 3 t Torten/Tag)",
        "concept": "Cafe-Konditorei im pinken Corporate Design; 1946 erste Espressomaschine Oesterreichs (Filiale Wollzeile, 1010)",
        "position": "Aelteste Kaffeehauskette der Welt (Franchise-Prinzip seit Gruendung)",
        "award": "Goldene Kaffeebohne (Gault-Millau, 2006)",
        "verdict": "Touristen-sicher, Qualitaet konstant, aber Konditorei von der Stange; Locals gehen eher ins unabhaengige Kaffeehaus.",
        "source": "wikipedia Aida_(cafe) + aida.at Geschichte",
    },
    "hitomi": {
        "founded": "Kette (Filialen u.a. 1210 Trillergasse 4, 1090 Franz-Josefs-Bahnhof seit Sept 2026)",
        "branches_at": "mind. 1090 + 1210 Wien",
        "concept": "Teppanyaki-Restaurant, 80+ Spezialitaeten chinesisch/japanisch (Sushi, Sashimi, Dim Sum, Wok, Teppanyaki live), AYCE + a la carte",
        "pricing_pattern": "Mittag ca. 14,90 / Abend ca. 19,90 (Buffet + Teppanyaki; 1210er-Preise, 1090 tagesaktuell pruefen)",
        "verdict": "Funktionales AYCE, gut fuer Gruppen; kein Fine Dining, Preis fair.",
        "source": "hitomi.at + trillerpark.at + falter.at",
    },
    "mister_li": {
        "founded": None,
        "branches_at": None,
        "concept": None,
        "verdict": "KEINE Kette gefunden. Einziger Treffer: Li Nudeln Imbiss, Liechtenwerder Platz 24, 1090 Wien (Dumplings, Sushi, Filet; Einzel-Imbiss, kein Filialnetz). Namensaenhnliche Mr. Lee / Mr. Lu (Auhof Center, 1140) sind andere Betreiber. Falls 'Mister Li' gemeint war: Adresse nachreichen, dann recherchieren wir nach.",
        "source": "restaurantguru + speisekarte.menu (2026-10-16)",
    },
    "plachutta": {
        "founded": "Stammhaus Hietzing bei Schloss Schoenbrunn (13. Bez.)",
        "branches_at": "3 Haeuser: Auhofstrasse 1, 1130 (Stammhaus) / Wollzeile 38, 1010 / Heiligenstaedter Strasse 179, 1190 (Nussdorf)",
        "concept": "Wiener Tafelspitz-Kueche, Rindfleischspezialitaeten; Institution + Pilgerstaette",
        "verdict": "Quasi-Kette (Familienbetrieb, 3 Standorte), Qualitaet hoch, Preise gehoben aber fair; kein Touristenfallen-Verdacht.",
        "source": "plachutta.at + ganz-wien.at",
    },
    "tuerkis": {
        "founded": "Familienbetrieb, kontinuierliches Wachstum",
        "branches_at": "15-16 Standorte in Wien (u.a. Wien-Mitte mit neuem Auftritt, Bahnhofcity Wien West, SCS, Museumsquartier U-Bahn)",
        "concept": "Kebap, Falafel, vegane Speisen; taeglich frisch, hauseigene Rezepte + eigene Backstube (Ausbau); Yelp Top-10-Kebap Wien 2026",
        "verdict": "Sandra-Approved: die gute Kette im Kebap-Dschungel. Konsistent, frisch, faire Preise. Konkurrenz: Kent, Berliner Doener, Ali's Grill, Die Doeneria, Kebabkoenig.",
        "source": "tuerkis.at + bahnhofcitywienwest.oebb.at + Yelp 2026",
    },
    "kaisers": {
        "founded": "Idee 2020 (Kaiserschmarren to go), erste Filiale 2021 Donau-Zentrum",
        "branches_at": "Franchise AT/DE/CH (Standortliste kaisers-original.com/locations); Wien u.a. Opernring 1/35-37, 1010",
        "concept": "Erste/groesste Kaisers'schmarrn-Kette; Franchise auch fuer Quereinsteiger",
        "verdict": "Junge Kette, Retro-Suessspeise modern verpackt; Standard-Test (derstandard.at) lesen. Kein Traditionsbetrieb.",
        "source": "kaisers-original.com + derstandard.at",
    },
    "trzesniewski": {
        "founded": "1902 Franciszek Trzesniewski, Tiefen Graben -> Dorotheergasse 1, 1010 (Stammhaus)",
        "branches_at": "15 Filialen: 13x Wien + 1x Flughafen + 1x Linz; Online-Vorbestellung + Hbf-Filiale",
        "concept": "Offene Brötchen (Schwarzbrot + Aufstrich, Rezepte geheim); Klassiker Speck mit Ei seit 1902; 'die unaussprechlich guten Brötchen'",
        "verdict": "Echte Wiener Institution (120+ Jahre), wien.info-geadelt ('wienerische Art von Fast Food'). Muss ins Datenblatt.",
        "source": "trzesniewski.at + yourstage.wien.info + OEBB",
    },
    "tauber": {
        "founded": "Tauber Brötchen Manufaktur seit 1987",
        "branches_at": "13-14 Standorte Wien + Niederoesterreich (tauber.at/filialen); Wien-Lieferung in 3h, Selbstabholung",
        "concept": "Handgemachte Brötchen/Sandwiches + Catering/Boxen ('Vielfalt Boxen'); Falter-gelistet: Fruehstueck, warme Theke (Leberkaese, Laibchen, Gulasch, Wuerstel), Sommer Eis",
        "verdict": "Der Manufaktur-Konkurrent zu Trzesniewski (juenger, catering-stark). Beide nebeneinander fuehren.",
        "source": "tauber.at + falter.at/lokal/10981",
    },
    "pepi": {
        "founded": "Kult-Imbiss (kein Gründungsjahr verifiziert)",
        "branches_at": "2 Standorte: Operngasse/nahe Staatsoper (Goethedenkmal) + Wien Hauptbahnhof (BahnhofCity)",
        "concept": "Leberkaese in 12 Sorten (Roestzwiebel, Trueffel-Steinpilz, Chili, Kaese...); Fleisch von oberösterreichischen Bauern; Premium ca. +1,50 EUR vs. Billa/Spar-Semmel",
        "verdict": "Der Premium-Leberkaese der Stadt; downtownvienna: 'Institution in zeitgemaesse Snackkultur uebersetzt'. Fixeintrag.",
        "source": "bahnhofcitywien HBF + downtownvienna + offbeatbudapest",
    },
    "american": {
        "founded": None,
        "branches_at": "Praesenz verifiziert (eigene AT-Domains/Verzeichnisse), Filialzahlen offen",
        "concept": "Coffee (Starbucks, store-locator AT), Burger (Five Guys AT, McDonald's, Burger King), Chicken (KFC u.a.); dazu Hard Rock Cafe Wien (bereits im Datensatz)",
        "verdict": "US-Ketten sind da, aber Kulinarik-Nebenrolle; Locals ignorieren sie. Filialzahlen im naechsten Pass zaehlen, nicht schaetzen.",
        "source": "starbucks.at + fiveguys.at + Verzeichnisse (finde-offen/firmania)",
    },
    "maxbenito": {
        "founded": None,
        "branches_at": "MQ + Herrengasse + Rotenturmstrasse + Wipplingerstrasse 23 (Wien)",
        "concept": "Mexikanisch: Burritos, Bowls; Expansionskurs (Standard 2020)",
        "verdict": "Wiener Mex-Kette, MQ-Filiale Guru 4.8. Kein Burgerladen — Verwechslung ausgeschlossen.",
        "source": "restaurantguru + derstandard.at + foodora.at",
    },
    "irish": {
        "founded": None,
        "branches_at": None,
        "concept": None,
        "verdict": "KEINE Irish-Pub-Kette gefunden. Flanagans (Free House, Interieur aus Co. Cork) und Bockshorn sind Einzelstuecke. Falls eine bestimmte Kette gemeint war: Namen nachreichen.",
        "source": "flanagans.at + falter.at (2026-10-16)",
    },
    "asian_welle": {        "founded": None,
        "branches_at": "Proliferation: eigene Bestenlisten (Falstaff 19 Top-Lokale 'asiatische Kueche'; TripAdvisor Top-10; 2025er-Rundschau mit Hong Kong Cafe, Yu's Cottage, Dodo62, NIKKAI, Asahimoto, Champa, Oreno Ramen...)",
        "concept": "Von Kantonesisch (Acht Schaetze/Pflaumenwein-Tradition) ueber Sushi/Ramen (Seesushi 4.9, Mochi, Oreno) bis Pho (Pho Saigon) und Fusion (Akakiko-Kette, Hitomi-AYCE, Kiang Wine & Dine)",
        "verdict": "Breiteste Welle nach Kebap: Japaner + Chinesen + Vietnamesen + Fusion. Einzelnamen unten als verify-Eintraege; Adressen naechster Pass. Der 20-Jahre-Bogen (Sandra): Vor 20 Jahren waren Japaner selten und teuer — heute sind Sushi, Maki, Udon, Ramen, Tonkatsu guenstiges Fastfood, Maki und Mochi gibt's beim Spar. Sicherheitshinweis aus Erfahrung: Mochi, der Neujahrs-Omakiller — wuerg. Aber langsam und nicht in einem Stueck: koestlich. Absurd, aber jedes Jahr in japanischen Medien — zusammen mit Dach-Schneeraeum-Stuerzen und wilden Baeren. Unkai (1994) als Pionier, Akakiko als Kette, Shiki Omakase als Spitze: drei Generationen in einem Datensatz.",
        "source": "asiatische-Bestenlisten 2025 + Falstaff + TripAdvisor",
    },
}

# --- Reviewer-Landschaft (wer urteilt ueber Wiens Kueche) ----------------------
REVIEWER_LANDSCAPE = {
    "wien_info": "Stadtportal: Wiener Kueche / Klassiker (Schnitzel-Gulasch-Alltagsgastro) + 'Vienna Bites' (2026 = Kulinarik-Jahr, gastronomische Identitaet)",
    "falter": "Florian Holzer testet seit 1988 jede Woche ein Lokal + Graetzl-Rundgaenge (Essen & Trinken-Rubrik)",
    "falstaff": "Restaurantguide 2026 (100-Punkte-Wertung, Wien-Top-10 im Datensatz) + 19 asiatische Top-Lokale",
    "gaultmillau": "Goldene Kaffeebohne an Aida (2006); Hauben-Wertung (im naechsten Pass einpflegen)",
    "michelin": "Guide Austria 2026: 101 Sternerestaurants AT, 22 neu; Wien 3* (Steirereck, Amador), 2* (Filippou, Mraz, Nickol), 1* (u.a. Pramerl & the Wolf)",
    "crowd": "TripAdvisor (Seesushi 4.9, Joyce, Mochi, Pho Saigon), Yelp (Kebap-Top-10 2026), Restaurant Guru, Die Besten der Stadt, meinbezirk.at",
    "source": "wien.info + falter.at + falstaff.com + michelin 2026",
}

# --- AYCE Wien Mitte & Landstrasse --------------------------------------------
AYCE_MITTE = [
    {"name": "Sukiyaki", "address": "WIEN MITTE The Mall, 1030 Wien", "notes": "Asiatisches AYCE-Buffet (warme Speisen, Sushi, Maki, Desserts); Mittagstisch ca. 11,90; offene Kueche", "tags": ["ayce", "sushi", "wien-mitte"], "source": "wienmitte-themall + wienuncovered 2026-03"},
    {"name": "Sukiyaki mini", "address": "Haupteingang WIEN MITTE The Mall (gegenueber Action), 1030 Wien", "notes": "Kleine Schwester des Sukiyaki", "tags": ["ayce", "wien-mitte"], "source": "sukiyaki_wien"},
    {"name": "Sushi Cross", "address": "WIEN MITTE The Mall, 1030 Wien", "notes": "Mall-Gastronomie, Sushi-Schiene", "tags": ["sushi", "wien-mitte"], "source": "WIEN MITTE The Mall"},
    {"name": "Lucky Pavillon", "address": "Loewengasse, 1030 Wien", "notes": "AYCE seit 40+ Jahren, ehrlich, viel Platz, grosse Auswahl", "tags": ["ayce", "chinese", "landstrasse"], "source": "meinbezirk.at"},
    {"name": "HuHu Hotpot", "address": "Landstrasse, 1030 Wien (verify)", "notes": "Neueroeffnung: Feuertopf/Hotpot AYCE am Tisch (Bruehen + frische Zutaten)", "tags": ["ayce", "hotpot", "neu"], "verify": True, "source": "falstaff.com News"},
]

GEHEIMTIPPS = [
    {"name": "Gasthaus Woracziczky", "address": "5. Bezirk, Margareten (verify)", "notes": "Neo-Beisl: Tageskarte vom Markt (Kalbsbries, faschierte Laibchen, Rindfleisch); Reservierung Pflicht", "tags": ["geheimtipp", "beisl"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    {"name": "Glacis Beisl", "address": "Breite Gasse (Museumsquartier), 1070 Wien (verify)", "notes": "Versteckte Oase/Schanigarten unter Nussbaeumen; Grammelknödel auf Veltlinerkraut legendaer", "tags": ["geheimtipp", "schanigarten"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    {"name": "Seven North", "address": "7. Bezirk, Neubau (verify)", "notes": "Levantinisch laut/wild (Design-Hotel EG); gebackener Karfiol mit Tahini stadtbekannt; Sharing", "tags": ["geheimtipp", "levantinisch"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    {"name": "Propeller", "address": "5. Bezirk (verify)", "notes": "Fruehstueck/Brunch: pochierte Eier auf Sauerteig mit Kimchi, French Toast; kleine Roestereien", "tags": ["geheimtipp", "brunch"], "verify": True, "source": "smilerkreativ.at 2026-01"},
]

TOURISTENFALLEN = {
    "rule": "Keine Fotokarten vor der Tuer; zwei Gassen weiter essen Einheimische besser und guenstiger. Hotspots: Stephansdom, Ringstrasse, Salzburger Getreidegasse.",
    "spots": [
        {"name": "Figlmueller", "address": "1010 Wien (verify)", "notes": "Berechtigt + Geschichte, aber Warteschlange/Massenabfertigung; Alternative im Graetzl suchen", "tags": ["touristenfalle-kontext"], "verify": True},
        {"name": "Cafe Sacher", "address": "Philharmonikerstrasse, 1010 Wien (verify)", "notes": "Torte + Geschichte top, Wartezeit happig; Alternative: unabhaengige Konditorei", "tags": ["touristenfalle-kontext"], "verify": True},
    ],
    "fair_alternative": {"name": "Gasthaus Poeschl", "address": "Weihburggasse, 1010 Wien (verify)", "notes": "Traditionelles Beisl einen Block vom Graben; Mittagskundschaft, Schnitzel 18-22 EUR", "tags": ["fair", "beisl"], "verify": True, "source": "Touristenfallen Wien 2026"},
    "source": "mycitytrip.com + atlas-guide.com + gastroportal.at",
}

RESTAURANTS: list[dict] = [
    # -- Round 1: verifizierte Servitenviertel-Mains --
    {
        "name": "Gasthaus Orlik",
        "address": "Spittelauer Platz 1, 1090 Wien",
        "phone": "01 3172104",
        "cuisine": "Wiener Wirtshaus",
        "lunch_hours": "Mon-Fri 11:00-14:30",
        "is_favorite": True,
        "tags": ["wirtshaus", "lunch", "servitenviertel"],
        "weekly_menu": ORLIK_WEEKLY_MENU,
        "source": "mittag.at",
    },
    {
        "name": "Kathmandu Kitchen",
        "address": "Rotenloewengasse 17, 1090 Wien",
        "phone": "01 3173313",
        "cuisine": "Nepalese/Indian",
        "is_favorite": False,
        "tags": ["nepalese", "indian", "sunday-dinner", "lunch-menu"],
        "notes": "Reservations; Sunday dinners; lunch menu",
        "source": "chitchat intel 2026-10-16",
    },
    {
        "name": "MAST Weinbistro",
        "address": "Porzellangasse 53, 1090 Wien",
        "phone": "01 9226679",
        "cuisine": "Wine bistro",
        "is_favorite": True,
        "tags": ["bib-gourmand", "wine", "chefs-choice"],
        "notes": "Bib Gourmand, 16/20, 1500+ wines, Chef's Choice 6-course",
        "source": "chitchat intel 2026-10-16",
    },
    {
        "name": "Hitomi Wok & Grill 1090",
        "address": "Julius-Tandler-Platz 3 Top C, 1090 Wien (Franz-Josefs-Bahnhof)",
        "phone": "+43 660 888 66 89",
        "cuisine": "Teppanyaki / AYCE",
        "hours": "daily 11-22",
        "is_favorite": False,
        "tags": ["teppanyaki", "ayce", "new-2026-09", "chain-hitomi"],
        "notes": "Teppanyaki AYCE, 80+ items, opened Sept 2026",
        "source": "hitomi.at",
    },
    {
        "name": "Rembetiko",
        "address": "Porzellangasse 38, 1090 Wien",
        "phone": "+43 1 317 64 93",
        "cuisine": "Greek",
        "is_favorite": False,
        "tags": ["greek", "gyros", "takeout", "kids"],
        "karte": REMBETIKO_KARTE,
        "source": "rembetiko.at/speisen--wein-1090",
    },
    # -- Fine Dining: Falstaff 2026 Top 10 Wien (Adressen aus Schema.org) --
    {"name": "Steirereck im Stadtpark", "address": "Am Heumarkt 2a (im Stadtpark), 1030 Wien", "notes": "Falstaff 100 P / Michelin 3 Sterne (seit 2025) / Koch des Jahres Reitbauer; Brot- + Kaesewagen, grosse Weinkarte", "tags": ["fine-dining", "michelin-3", "falstaff-100"], "source": "falstaff.com + michelin 2026", "details": "Birgit + Heinz Reitbauer (gemeinsam seit 2005); 3 Sterne seit 21.1.2025 (eines von 2 Drei-Sternern AT); Falstaff 100; Brot-/Kaesewagen; Meierei; radikal produktbezogen."},
    {"name": "Amador", "address": "Grinzinger Strasse 86, 1190 Wien", "notes": "Michelin 3 Sterne; Juan Amador (spanische Wurzeln: Carabinero, Jabugo, Escabeche); Gewoelbekeller", "tags": ["fine-dining", "michelin-3"], "source": "falstaff.com + michelin 2026"},
    {"name": "Konstantin Filippou", "address": "Dominikanerbastei 17, 1010 Wien", "notes": "Michelin 2 Sterne; Mittags 3-Gang-Einstieg, abends laenger; Signature Brandade mit Kaviar", "tags": ["fine-dining", "michelin-2"], "source": "falstaff.com + michelin 2026"},
    {"name": "Mraz & Sohn", "address": "Wallensteinstrasse 59, 1200 Wien", "notes": "Michelin 2 Sterne; entspannt-praezise Sternekueche, Kult-Ueberraschungsmenue, schwer zu bekommen", "tags": ["fine-dining", "michelin-2"], "source": "falstaff.com + michelin 2026"},
    {"name": "Silvio Nickol", "address": "Coburgbastei 4 (Palais Coburg), 1010 Wien", "notes": "8-Gang 'Genussreise'; legendaerer Weinkeller", "tags": ["fine-dining", "michelin-2"], "source": "falstaff.com + michelin 2026"},
    {"name": "Aend", "address": "Mollardgasse 76, 1060 Wien", "notes": "Stil/Purismus im Gewoelbe; Fabian Guenzel, Top-Produkte + Spielwitz", "tags": ["fine-dining"], "source": "falstaff.com 2026"},
    {"name": "Glasswing (The Amauris)", "address": "Kaerntner Ring 8, 1010 Wien", "notes": "Alexandru Simon; Wine-&-Dine-Abende; Ringstrassen-Hotel", "tags": ["fine-dining", "hotel"], "source": "falstaff.com 2026"},
    {"name": "Restaurant Doubek", "address": "Kochgasse 13, 1080 Wien", "notes": "Stefan Doubek, offene Kueche", "tags": ["fine-dining"], "source": "falstaff.com 2026"},
    {"name": "Fabios", "address": "Tuchlauben 4-6, 1010 Wien", "notes": "Italiener mit Charakter seit 2002, prime time voll", "tags": ["fine-dining", "italian"], "source": "falstaff.com 2026"},
    {"name": "TIAN", "address": "Himmelpfortgasse 23, 1010 Wien", "notes": "Vegetarisch/vegan Gourmet (Paul Ivic), 7/9 Gaenge; Nachhaltigkeits-Autoritaet", "tags": ["fine-dining", "veg"], "source": "falstaff.com 2026"},
    {"name": "Pramerl and the Wolf", "address": "Pramergasse 21, 1090 Wien", "phone": "+43 1 9464139", "notes": "Michelin 1 Stern 2026; Casual Fine Dining im Ex-Beisl; Ueberraschungsmenue (Calamari-Carbonara ohne Pasta: Calamari/Raeucheraal/Parmesan); Mi+Do ab 19h, Fr+Sa Early Bird 18-20h + Prime Time ab 20:30h; U4", "tags": ["fine-dining", "michelin-1", "servitenviertel"], "source": "guide.michelin.com 2026-03 + CNTraveller", "details": "CNTraveller-Urteil: kleines Format, hohes Niveau, kreatives Ueberraschungsmenue, sorgfaeltige Weinkarte. Koechenamen verifizieren wir noch — gemeldet wird."},
    {"name": "Edvard", "address": "Schottenring (Anantara Palais Hansen), 1010 Wien (verify)", "notes": "Michelin-Spitze im Luxushotel; Nachbar der Pramerl-Guide-Seite", "tags": ["fine-dining", "hotel"], "verify": True, "source": "guide.michelin.com"},
    # -- Luxushotel-Restaurants / Rooftop --
    {"name": "Hotel Sacher (Rote Bar / Cafe Sacher)", "address": "1010 Wien (verify)", "notes": "5-Sterne-Klassiker; Torte + Rote Bar", "tags": ["hotel", "luxus"], "verify": True, "source": "michelin hotels"},
    {"name": "Dstrikt Steakhouse (Ritz-Carlton)", "address": "Ringstrasse, 1010 Wien (verify)", "notes": "Steakhouse im Ritz-Carlton", "tags": ["hotel", "steak"], "verify": True, "source": "ritzcarlton.com"},
    {"name": "Pastamara - Bar con Cucina (Ritz-Carlton)", "address": "Ringstrasse, 1010 Wien (verify)", "notes": "Italienisch im Ritz-Carlton", "tags": ["hotel", "italian"], "verify": True, "source": "ritzcarlton.com"},
    {"name": "D-Bar (Ritz-Carlton)", "address": "Ringstrasse, 1010 Wien (verify)", "notes": "Elegante Bar im Ritz-Carlton", "tags": ["hotel", "bar"], "verify": True, "source": "ritzcarlton.com"},
    {"name": "Atmosphere Rooftop (Ritz-Carlton, 8. Stock)", "address": "Ringstrasse, 1010 Wien (verify)", "notes": "Rooftop-Bar (saisonal; zeitweise geschlossen); Champagner + Cocktails", "tags": ["hotel", "rooftop", "bar"], "verify": True, "source": "ritzcarlton.com"},
    {"name": "The Bank Brasserie (Park Hyatt)", "address": "Am Hof, 1010 Wien (verify)", "notes": "Brasserie im Park Hyatt Vienna", "tags": ["hotel", "brasserie"], "verify": True, "source": "michelin hotels"},
    {"name": "Das Loft (SO/ Vienna)", "address": "Praterstrasse 1, 1020 Wien (verify)", "notes": "Fine Dining + Bar mit Donaukanal-Blick", "tags": ["hotel", "rooftop"], "verify": True, "source": "guide.michelin.com nearby"},
    {"name": "Grand Ferdinand", "address": "Schubertring, 1010 Wien (verify)", "notes": "Grand Ferdinand Vienna (Michelin Hotels)", "tags": ["hotel"], "verify": True, "source": "guide.michelin.com"},
    {"name": "Almanac Palais Vienna", "address": "1010 Wien (verify)", "notes": "Palais-Hotel (Michelin Hotels)", "tags": ["hotel"], "verify": True, "source": "guide.michelin.com"},
    {"name": "Hotel Sans Souci", "address": "1070 Wien (verify)", "notes": "Boutique-Hotel beim MQ", "tags": ["hotel"], "verify": True, "source": "guide.michelin.com"},
    {"name": "Altstadt Vienna", "address": "1070 Wien (verify)", "notes": "Altstadt-Hotel", "tags": ["hotel"], "verify": True, "source": "guide.michelin.com"},
    {"name": "The Guesthouse Vienna", "address": "1010 Wien (verify)", "notes": "Design-Hotel", "tags": ["hotel"], "verify": True, "source": "guide.michelin.com"},
    # -- Plachutta quasi-Kette --
    {"name": "Plachutta Stammhaus Hietzing", "address": "Auhofstrasse 1, 1130 Wien", "notes": "Stammhaus bei Schoenbrunn; Tafelspitz-Pilgerstaette", "tags": ["tafelspitz", "kette-plachutta", "wirtshaus"], "source": "plachutta.at"},
    {"name": "Plachutta Wollzeile", "address": "Wollzeile 38, 1010 Wien", "notes": "Innenstadt-Ableger", "tags": ["tafelspitz", "kette-plachutta"], "source": "plachutta.at"},
    {"name": "Plachutta Nussdorf", "address": "Heiligenstaedter Strasse 179, 1190 Wien", "notes": "Nussdorf-Ableger", "tags": ["tafelspitz", "kette-plachutta"], "source": "plachutta.at"},
    # -- Wuerstelstand-Kultur --
    {"name": "Bitzinger (Albertina)", "address": "Albertinaplatz 1, 1010 Wien", "notes": "Familienbetrieb (Albertina seit 1999, Riesenrad seit 2009); Bosna/Bratwurst/Curry; ABER: lange Schlange, Touri-Anteil hoch — Sandras Urteil: Hype unverstaendlich; Locals: Alles Wurscht / Zum scharfen René", "tags": ["wuerstelstand", "kult"], "source": "bitzinger.wien + Falstaff + Sandra"},
    {"name": "Fuhrgassl-Huber", "address": "Neustift am Walde 68, 1190 Wien", "phone": "01/4401405", "notes": "Weingut + Buschenschank + Hotel (Ernst & Gerti Huber); Mo-Sa 14-24, So/Feiertag 12-24, kein Ruhetag; Zweit-Buffet 10er-Marie, Ottakringerstrasse 222-224", "tags": ["heuriger", "wirtshaus"], "source": "fuhrgassl-huber.at + heurigen.at"},
    {"name": "Zwoelf-Apostelkeller", "address": "Sonnenfelsgasse 3, 1010 Wien", "phone": "01/5134128", "notes": "Stadtheuriger im 800 Jahre alten Gewoelbe; 390 Plaetze; taegl. 11-24; Schnitzel 'nach Kaiser Art', Tafelspitz", "tags": ["keller", "heuriger"], "source": "zwoelf-apostelkeller.at"},
    {"name": "Melker Stiftskeller", "address": "1010 Wien (verify)", "notes": "Historisches Kellerlokal; Heurigentheke (Schweinsbraten, Krautfleckerl, Gulasch, Laberl)", "tags": ["keller"], "verify": True, "source": "melkerstiftskeller.at"},
    {"name": "Esterhazykeller", "address": "Wien (verify)", "notes": "Kellerlokal (Details verifizieren)", "tags": ["keller"], "verify": True},
    {"name": "Wuerstelstand Hoher Markt", "address": "Hoher Markt 1, 1010 Wien", "notes": "Taeglich 10-04 (So ab 11); 4-8 EUR", "tags": ["wuerstelstand"], "source": "wuerstelstand-guide 2026"},
    {"name": "Alles Walzer Alles Wurst", "address": "Quellenstrasse 84, 1100 Wien", "notes": "Falstaff Top-10-Wuerstelstand", "tags": ["wuerstelstand"], "source": "Falstaff"},
    # -- Kebap-Invasion (Tuerkis = die gute Kette) --
    {"name": "Tuerkis (Kette, 15-16x)", "address": "u.a. Wien-Mitte (neuer Auftritt), Bahnhofcity West, SCS, Museumsquartier U-Bahn", "notes": "Familienbetrieb; Kebap/Falafel/vegan; hauseigene Rezepte + Backstube; Yelp Top-10-Kebap 2026; Sandra-approved", "tags": ["kebap", "kette-tuerkis", "favorit"], "is_favorite": True, "source": "tuerkis.at + Yelp 2026"},
    {"name": "Kent", "address": "Wien (verify)", "notes": "Kebap-Konkurrenz (Yelp-Liste)", "tags": ["kebap"], "verify": True, "source": "Yelp 2026"},
    {"name": "Berliner Doener", "address": "Wien (verify)", "notes": "Kebap-Konkurrenz (Yelp #1-Nennung)", "tags": ["kebap"], "verify": True, "source": "Yelp 2026"},
    {"name": "Ali's Grill / Ali Ocakbasi", "address": "Wien (verify)", "notes": "Kebap-Konkurrenz", "tags": ["kebap"], "verify": True, "source": "Yelp 2026"},
    {"name": "Die Doeneria", "address": "Wien (verify)", "notes": "Kebap-Konkurrenz", "tags": ["kebap"], "verify": True, "source": "Yelp 2026"},
    {"name": "Li Nudeln Imbiss", "address": "Liechtenwerder Platz 24, 1090 Wien", "notes": "KEIN Filialnetz (Einzel-Imbiss): Dumplings, Sushi, Filet; 'Mister Li'-Kette nicht gefunden", "tags": ["imbiss", "kette-misterli-negativ"], "source": "restaurantguru + speisekarte.menu"},
    # -- AYCE Wien Mitte / Landstrasse --
    {"name": "Sukiyaki", "address": "WIEN MITTE The Mall, 1030 Wien", "notes": "AYCE-Buffet (warm, Sushi, Maki, Desserts); Mittagstisch ca. 11,90; offene Kueche/Unterwasserwelt", "tags": ["ayce", "sushi", "wien-mitte"], "source": "wienmitte-themall + wienuncovered 2026-03"},
    {"name": "Sukiyaki mini", "address": "Haupteingang WIEN MITTE The Mall (ggü. Action), 1030 Wien", "notes": "Kleine Schwester", "tags": ["ayce", "wien-mitte"], "source": "sukiyaki_wien"},
    {"name": "Sushi Cross", "address": "WIEN MITTE The Mall, 1030 Wien", "notes": "Mall-Gastronomie", "tags": ["sushi", "wien-mitte"], "source": "WIEN MITTE The Mall"},
    {"name": "Lucky Pavillon", "address": "Loewengasse, 1030 Wien", "notes": "AYCE seit 40+ Jahren, ehrlich, viel Platz", "tags": ["ayce", "chinese"], "source": "meinbezirk.at"},
    {"name": "HuHu Hotpot", "address": "Landstrasse, 1030 Wien (verify)", "notes": "Neu: Feuertopf/Hotpot AYCE (Bruehen + frische Zutaten)", "tags": ["ayce", "hotpot", "neu"], "verify": True, "source": "falstaff.com News"},
    # -- Geheimtipps (Locals) --
    {"name": "Gasthaus Woracziczky", "address": "5. Bezirk, Margareten (verify)", "notes": "Neo-Beisl: Marktkarte (Kalbsbries, Laibchen, Rindfleisch); Reservierung Pflicht", "tags": ["geheimtipp", "beisl"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    {"name": "Glacis Beisl", "address": "Breite Gasse (MQ), 1070 Wien (verify)", "notes": "Schanigarten unter Nussbaeumen; Grammelknödel/Veltlinerkraut", "tags": ["geheimtipp", "schanigarten"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    {"name": "Seven North", "address": "7. Bezirk, Neubau (verify)", "notes": "Levantinisch (Hotel-EG); Karfiol/Tahini; Sharing, laut", "tags": ["geheimtipp", "levantinisch"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    {"name": "Propeller", "address": "5. Bezirk (verify)", "notes": "Brunch: pochierte Eier/Sauerteig/Kimchi, French Toast; Roestkaffee", "tags": ["geheimtipp", "brunch"], "verify": True, "source": "smilerkreativ.at 2026-01"},
    # -- Servitenviertel-Shortlist Rest (round 1) --
    {"name": "Ragusa", "address": "Berggasse 15, 1090 Wien", "phone": "+43 1 317 15 77", "notes": "Croatian fish, 25 yrs; Auszeit-Adresse", "tags": ["croatian", "fish", "shortlist"], "source": "ragusa.at + TripAdvisor"},
    {"name": "Rebhuhn", "address": "Berggasse 24, 1090 Wien", "notes": "century Wirtshaus", "tags": ["wirtshaus", "shortlist"], "source": "Verzeichnis (Ragusa-Umfeld)"},
    {"name": "Servitenwirt", "address": "Servitengasse 7/1, 1090 Wien", "phone": "+43 1 3152387", "notes": "Oesterreichisch; 10-24h; selbes Haus wie Tante Liesl (Stiege 1)", "tags": ["wirtshaus", "shortlist"], "source": "servitenwirt.at + TripAdvisor"},
    {"name": "Tante Liesl", "address": "Servitengasse 7, 1090 Wien", "phone": "+43 1 2958135", "notes": "Michelin-Guide-Nachbar von Pramerl; taeglich 12-23, warme Kueche 12-22; mittag.at", "tags": ["wirtshaus", "shortlist"], "source": "tante-liesl.at + Michelin Guide"},
    {"name": "La Pasteria", "address": "Servitengasse 10, 1090 Wien", "phone": "+43 1 310 27 36", "notes": "Alimentari, Ristorante & Bar; mediterran (wien.info: franzoesisches Flair im Viertel)", "tags": ["italian", "shortlist"], "source": "lapasteria.at + wien.info"},
    {"name": "La Mercerie", "address": "Berggasse 25, 1090 Wien", "notes": "Fruehstuecks-Bistrot mit Terrasse; kein Instagram, keine Website — trotzdem stadtbekannt (Falstaff); Falter-gelistet", "tags": ["french", "brunch", "shortlist"], "source": "TripAdvisor + Falstaff + Falter"},
    {"name": "Kiang Wine & Dine", "address": "Gruenentorgasse 19, 1090 Wien", "phone": "+43 664 515 36 33", "notes": "Di-Fr ab 17h; asiatisch + Wein", "tags": ["asian", "wine", "shortlist"], "source": "kiangwine.at"},
    {"name": "Xocolat Manufaktur", "address": "Servitengasse 5, 1090 Wien", "phone": "01/3100 020", "notes": "Schoko-Kollektionen; Mo-Fr 10-18, Sa 10-17", "tags": ["chocolate", "shortlist"], "source": "xocolat.at + servitenviertel.at"},
    {"name": "Sentepe", "address": "1090 Wien (verify)", "notes": "bio lunch; 2 Suchrunden ohne Adress-Treffer — naechster Pass", "tags": ["bio", "lunch", "shortlist"], "verify": True},
    {"name": "Riva", "address": "1090 Wien (verify)", "notes": "2 Suchrunden ohne Treffer — naechster Pass", "tags": ["shortlist"], "verify": True},
    {"name": "Akakiko 1090", "address": "Julius-Tandler-Platz, 1090 Wien (Franz-Josefs-Bahnhof)", "notes": "Ketten-Filiale (SciFi-Deko); siehe CHAINS_ANALYSIS.akakiko", "tags": ["japanese", "kette-akakiko", "shortlist"], "source": "akakiko.at"},
    {"name": "Luxor Bar", "address": "Gruenentorgasse 19B, 1090 Wien", "notes": "Cafe Luxor seit 1983; Fruehstueck, Klassiker, Drinks, Sport, Gastgarten; taeglich ab 9h — base camp", "tags": ["bar", "base", "cafe"], "source": "luxor1090.at + servitenviertel.at + TripAdvisor"},
    # -- Cafes (Aida-Kette + Klassiker) --
    {"name": "Aida (Kette, 34x)", "address": "u.a. Wollzeile, 1010 Wien (Erst-Espresso 1946); cityweit + Flughafen", "notes": "Pink-Konditorei seit 1913; 3 t/Tag; Goldene Kaffeebohne 2006; konstant aber Massenware", "tags": ["cafe", "kette-aida", "konditorei"], "source": "wikipedia + aida.at"},
    {"name": "Cafe Berg", "address": "Berggasse 8, 1090 Wien", "notes": "Sandra's High-Level Choice; intellektuell/vibrant", "tags": ["cafe", "favorit"], "is_favorite": True},
    {"name": "Cafe Prueckel", "address": "Stubenring 24, 1010 Wien (verify)", "notes": "Design-Klassiker am Ring", "tags": ["cafe"], "verify": True},
    {"name": "Griechenbeisl", "address": "1010 Wien (verify)", "notes": "Aeltestes Wirtshaus (Bar-Erwähnung Top-10)", "tags": ["cafe", "wirtshaus", "bar"], "verify": True, "source": "diebestenderstadt.de"},
    # -- Bars / Cocktail / Rooftop --
    {"name": "Krypt", "address": "1010 Wien (verify)", "notes": "Top-Cocktailbar", "tags": ["bar", "cocktail"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Die Parfuemerie", "address": "1010 Wien (verify)", "notes": "Top-Cocktailbar", "tags": ["bar", "cocktail"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Agent Oscar", "address": "Wien (verify)", "notes": "Cocktailbar", "tags": ["bar", "cocktail"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Franz von Hahn", "address": "Wien (verify)", "notes": "Cocktailbar", "tags": ["bar", "cocktail"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Saint George", "address": "Wien (verify)", "notes": "Cocktailbar", "tags": ["bar", "cocktail"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "The Chapel Bar", "address": "Wien (verify)", "notes": "Cocktailbar", "tags": ["bar", "cocktail"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Loos American Bar", "address": "1010 Wien (verify)", "notes": "Wiener Cocktail-Klassiker (Adolf Loos)", "tags": ["bar", "klassiker"], "verify": True, "source": "diebestenderstadt.de"},
    {"name": "First American Bar", "address": "1010 Wien (verify)", "notes": "Klassiker", "tags": ["bar", "klassiker"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Cafe Leopold", "address": "MQ, 1070 Wien (verify)", "notes": "Kunst + Cocktails", "tags": ["bar", "cafe"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Sky Bar", "address": "1010 Wien (verify)", "notes": "Cocktails mit Aussicht", "tags": ["bar", "rooftop"], "verify": True, "source": "beste Cocktailbars Wien"},
    {"name": "Onyx Bar", "address": "1010 Wien (verify)", "notes": "Bar (Top-10)", "tags": ["bar"], "verify": True, "source": "diebestenderstadt.de"},
    {"name": "Lamee Rooftop", "address": "1010 Wien (verify)", "notes": "Rooftop-Bar", "tags": ["bar", "rooftop"], "verify": True, "source": "News 2026"},
    {"name": "Cayo Coco (Hoxton)", "address": "1020 Wien (verify)", "notes": "Rooftop im Hoxton Vienna", "tags": ["bar", "rooftop"], "verify": True, "source": "News 2026"},
    {"name": "Redroof Bar", "address": "Wien (verify)", "notes": "Rooftop", "tags": ["bar", "rooftop"], "verify": True, "source": "News 2026"},
    {"name": "Settimo Cielo", "address": "Wien (verify)", "notes": "Rooftop", "tags": ["bar", "rooftop"], "verify": True, "source": "News 2026"},
    {"name": "Neue Hoheit", "address": "Wien (verify)", "notes": "Rooftop (neu)", "tags": ["bar", "rooftop"], "verify": True, "source": "News 2026"},
    {"name": "Dachboden (25hours Hotel)", "address": "1070 Wien (verify)", "notes": "Rooftop im 25hours Hotel", "tags": ["bar", "rooftop"], "verify": True, "source": "News 2026"},
    {"name": "Bockshorn Irish Pub", "address": "Wien (verify)", "notes": "Irish Pub (Top-10)", "tags": ["bar", "pub"], "verify": True, "source": "diebestenderstadt.de"},
    {"name": "Travel Shack Vienna", "address": "Wien (verify)", "notes": "Backpacker-Bar", "tags": ["bar"], "verify": True, "source": "diebestenderstadt.de"},
    {"name": "Hard Rock Cafe Wien", "address": "1010 Wien (verify)", "notes": "Kette; Touri-sicher", "tags": ["bar", "kette"], "verify": True, "source": "diebestenderstadt.de"},
    # -- Touristenfallen-Kontext (Figlmueller/Sacher/Schweizerhaus) --
    {"name": "Figlmueller", "address": "1010 Wien (verify)", "notes": "Schnitzel-Kult mit Geschichte; Warteschlange/Masse - Graetzl-Alternative suchen", "tags": ["touristenfalle-kontext", "schnitzel"], "verify": True, "source": "smilerkreativ.at"},
    {"name": "Cafe Sacher", "address": "Philharmonikerstrasse, 1010 Wien (verify)", "notes": "Torte top, Wartezeit happig; Alternative: freie Konditorei", "tags": ["touristenfalle-kontext", "torte"], "verify": True, "source": "smilerkreativ.at"},
    {"name": "Schweizerhaus", "address": "Prater, 1020 Wien (verify)", "notes": "KEINE Touristenfalle: ganz Wien kommt auf Bier + Stelze; Saisoneroeffnung im Fruehjahr (kleines Event); businessgaeste-tauglich; unter der Woche statt Wochenende", "tags": ["stelze", "prater"], "verify": True, "source": "Sandra + smilerkreativ.at"},
    {"name": "Luftburg - Kolarik im Prater", "address": "Waldsteingartenstrasse 128, Prater, 1020 Wien", "notes": "1992 am Traditionsstandort (Wurstelprater) eroeffnet, Paul Kolarik; groesstes vollzertifiziertes Bio-Restaurant der Welt (2023); Stelze/Ribs/Wiener Kueche/veg+vegan; Wiedereroeffnung 2021", "tags": ["wirtshaus", "bio", "prater"], "source": "kolarik.at + praterwien.com + wikipedia"},
    {"name": "Zum Englischen Reiter", "address": "Wurstelprater, 1020 Wien (verify)", "notes": "Mitten im Vergnuegungspark; Wiener Kueche, Stelze, Schnitzel; Riesenportionen", "tags": ["wirtshaus", "prater"], "verify": True, "source": "Yelp + praterwien (facebook)"},
    {"name": "Gasthaus Poeschl", "address": "Weihburggasse, 1010 Wien (verify)", "notes": "Faire Alternative einen Block vom Graben; Schnitzel 18-22 EUR, Mittags-Locals", "tags": ["fair", "beisl", "schnitzel"], "verify": True, "source": "Touristenfallen Wien 2026"},
    # -- Maerkte & Food-Hubs (Platzhalter, Strassen im naechsten Pass) --
    {"name": "Naschmarkt", "address": "Wienzeile, 1060 Wien", "notes": "Mo 06-21; international + Bars/Restaurants abends; Flohmarkt Kettenbrueckengasse Sa 06:30-14", "tags": ["markt", "food-hub"], "source": "Marktuebersicht + Geschichte-Wiki", "details": "16. Jh.; Aschenmarkt (Asche-Handel ODER Asch=Milcheimer — zwei Theorien); 1774 Kleinmarkt; 'Naschmarkt' ab 1820 (Suessigkeiten)."},
    {"name": "Brunnenmarkt / Yppenplatz", "address": "Brunnengasse, 1160 Wien", "notes": "Strassenmarkt + Bauernmarkt am Yppenplatz + Lokale", "tags": ["markt", "food-hub"], "source": "1000things + wohlfuehlweb"},
    {"name": "Karmelitermarkt", "address": "1020 Wien", "notes": "Gretzl-Markt + Restaurants", "tags": ["markt", "food-hub"], "source": "Marktuebersicht"},
    {"name": "Rochusmarkt", "address": "1030 Wien", "notes": "Landstrassen-Markt (nahe Wien Mitte)", "tags": ["markt", "food-hub"], "source": "Marktuebersicht"},
    {"name": "Meidlinger Markt", "address": "1120 Wien", "notes": "Geheimtipp-Markt", "tags": ["markt", "food-hub"], "source": "Marktuebersicht"},
    {"name": "Kutschkermarkt", "address": "1180 Wien", "notes": "Klein + fein", "tags": ["markt", "food-hub"], "source": "1000things"},
    {"name": "Vorgartenmarkt", "address": "1020 Wien", "notes": "Klein + fein (Nachbar: Volkertmarkt)", "tags": ["markt", "food-hub"], "source": "Marktuebersicht"},
    {"name": "Viktor-Adler-Markt", "address": "1100 Wien", "notes": "Favoriten-Markt", "tags": ["markt", "food-hub"], "source": "Marktuebersicht"},
    {"name": "Bauernmarkt Freyung", "address": "Freyung, 1010 Wien", "notes": "Innenstadt-Bauernmarkt", "tags": ["markt", "food-hub"], "source": "wohlfuehlweb"},
    {"name": "Spittelberg", "address": "7. Bezirk (verify)", "notes": "Grätzl mit dichten Lokalen", "tags": ["food-hub", "graetzl"], "verify": True},
    {"name": "Cafe Demel", "address": "1010 Wien (verify)", "notes": "Konditorei-Klassiker (Kette? nein, Einzelhaus)", "tags": ["cafe", "konditorei", "klassiker"], "verify": True},
    {"name": "Cafe Central", "address": "1010 Wien (verify)", "notes": "Kaffeehaus-Klassiker", "tags": ["cafe", "klassiker"], "verify": True},
    # -- Wiener Ketten: Brötchen, Pepi, Kaisers --
    {"name": "Trzesniewski Stammhaus", "address": "Dorotheergasse 1, 1010 Wien", "notes": "Seit 1902 (Tiefer Graben -> Dorotheergasse); 'die unaussprechlich guten Brötchen'; Speck mit Ei; Rezepte geheim; 13x Wien + Flughafen + Linz", "tags": ["broetchen", "kette-trzesniewski", "institution"], "source": "trzesniewski.at + wien.info"},
    {"name": "Trzesniewski (Filialnetz)", "address": "13x Wien + Flughafen Wien + Linz", "notes": "Online-Vorbestellung, Hbf-Filiale (OEBB); siehe CHAINS_ANALYSIS.trzesniewski", "tags": ["broetchen", "kette-trzesniewski"], "source": "trzesniewski.at"},
    {"name": "Tauber Brötchen Manufaktur", "address": "13-14x Wien + NOE (verify)", "notes": "Seit 1987; handmade Brötchen/Sandwiches + Vielfalt-Boxen; 3h-Lieferung; warme Theke (Leberkaese, Laibchen, Gulasch); Falter-gelistet", "tags": ["broetchen", "kette-tauber"], "verify": True, "source": "tauber.at + falter.at"},
    {"name": "Leberkas-Pepi Oper", "address": "Operngasse (nahe Staatsoper/Goethedenkmal), 1010 Wien", "notes": "Kult-Imbiss; 12 Sorten (Roestzwiebel, Trueffel-Steinpilz, Chili, Kaese); Fleisch aus OOE; Premium +1,50 vs Supermarkt", "tags": ["leberkaese", "kette-pepi", "imbiss"], "source": "downtownvienna + restaurantguru"},
    {"name": "Leberkas-Pepi Hauptbahnhof", "address": "Wien Hauptbahnhof (BahnhofCity), 1100 Wien", "notes": "Zweite Filiale; 12 Sorten", "tags": ["leberkaese", "kette-pepi", "imbiss"], "source": "bahnhofcitywien + offbeatbudapest"},
    # -- Kult-Imbiss: Schachtel, Bosna, Curry (Round 4) --
    {"name": "Schachtelwirt", "address": "Judengasse 5, 1010 Wien (Bermudadreieck)", "notes": "Hausmannskost im Karton seit 2016: Schnitzel-Trio (Kalb/Schwein/Sur), Schweinsbraten, Backhendl, Gulasch; regional; Guru 4.9; Take-away + Lieferung", "tags": ["kult-imbiss", "schachtel", "schnitzel"], "is_favorite": True, "source": "schachtelwirt-wien.at + derstandard.at + falter.at"},
    {"name": "Alles Wurscht", "address": "Wien (verify)", "notes": "Bosna + Kaesekrainer mit Zwiebel/Roestzwiebel; Test-Favorit 2026-08; Bosna = Bratwurst/Weissbrot/Zwiebel/Petersilie/Curry", "tags": ["kult-imbiss", "bosna", "wuerstelstand"], "verify": True, "source": "derstandard Test 2026-08"},
    {"name": "Zum scharfen René", "address": "Schwarzenbergplatz, 1010 Wien (verify)", "notes": "Klassiker-Stand (Konzerthaus/Musikverein-Naehe): Burenwurst, Currywurst, Kaesekrainer; froehlicher Umgang", "tags": ["kult-imbiss", "currywurst", "wuerstelstand"], "verify": True, "source": "viennalist.com"},
    {"name": "Curryeck", "address": "Wien (verify)", "notes": "'The original German Imbiss': Currywurst, Bratwurst, Bouletten, Baguette, Croque, Pommes", "tags": ["kult-imbiss", "currywurst"], "verify": True, "source": "curryeck.at"},
    {"name": "Mosquito", "address": "Wien (verify)", "notes": "Currywurst-Top (Unilocal-Liste)", "tags": ["kult-imbiss", "currywurst"], "verify": True, "source": "unilocal.de"},
    {"name": "New Champions", "address": "Wien (OFFEN)", "notes": "Nicht gefunden (5 Suchanlaeufe): Strasse/Bezirk oder Gericht nachreichen, dann Recherche + Eintrag", "tags": ["kult-imbiss", "offen"], "verify": True},
    {"name": "Kaiser's Opernring", "address": "Opernring 1/35-37, 1010 Wien", "notes": "Kaiser'schmarrn-Kette (Idee 2020, erste Filiale 2021 Donau-Zentrum); Franchise AT/DE/CH; 'Schmarrn to go'", "tags": ["suess", "kette-kaisers"], "source": "kaisers-original.com + derstandard.at"},
    # -- American Chains --
    {"name": "Starbucks (AT-Netz)", "address": "cityweit Wien (Filialzahl verify)", "notes": "US-Coffeeshop; AT-Store-Locator + App-Order; kulinarische Nebenrolle", "tags": ["coffee", "us-chain"], "verify": True, "source": "starbucks.at"},
    {"name": "Five Guys (AT)", "address": "Wien (Filialzahl verify)", "notes": "Burger made-to-order + hand-cut Fries + Shakes; eigene AT-Domain", "tags": ["burger", "us-chain"], "verify": True, "source": "fiveguys.at"},
    {"name": "McDonald's Wien", "address": "cityweit Wien (Filialzahl verify)", "notes": "Praesenz sicher, Zahl nicht gezaehlt", "tags": ["burger", "us-chain"], "verify": True},
    {"name": "Burger King Wien", "address": "cityweit Wien (Filialzahl verify)", "notes": "Praesenz sicher, Zahl nicht gezaehlt", "tags": ["burger", "us-chain"], "verify": True},
    {"name": "KFC Wien", "address": "Wien (Filialfinder verify)", "notes": "Chicken (Hot Wings, Strips, Buckets); Filialfinder + Click & Collect + Lieferung auf kfc.co.at", "tags": ["chicken", "us-chain"], "verify": True, "source": "kfc.co.at"},
    {"name": "Max & Benito MQ", "address": "Museumsquartier, 1070 Wien (verify)", "notes": "Mexikanisch (Burritos, Bowls); Guru 4.8 bei 2000+ Reviews; Expansionskurs seit 2020", "tags": ["mexican", "kette-maxbenito"], "verify": True, "source": "restaurantguru + derstandard.at"},
    {"name": "Max & Benito Herrengasse", "address": "Herrengasse, 1010 Wien (verify)", "notes": "Guru 4.3; Filiale der Mex-Kette", "tags": ["mexican", "kette-maxbenito"], "verify": True, "source": "restaurantguru"},
    {"name": "Max & Benito Rotenturmstrasse", "address": "Rotenturmstrasse, 1010 Wien (verify)", "notes": "Foodora-Lieferung", "tags": ["mexican", "kette-maxbenito"], "verify": True, "source": "foodora.at"},
    {"name": "Max & Benito Wipplingerstrasse", "address": "Wipplingerstrasse 23, 1010 Wien", "notes": "Mexikanisch (Kueche bestaetigt)", "tags": ["mexican", "kette-maxbenito"], "source": "restauranttester.at"},
    {"name": "Flanagans Irish Pub", "address": "Wien Zentrum (verify)", "notes": "Free House (Eigentinterieur aus Churchtown, Co. Cork, eingeschifft); Falter-gelistet; KEINE Kette (Einzelstueck)", "tags": ["bar", "pub", "irish"], "verify": True, "source": "flanagans.at + falter.at"},
    {"name": "Wiener Deewan", "address": "Liechtensteinstrasse 10, 1090 Wien", "phone": "01-9251185", "notes": "Pakistanisch; ALL YOU CAN EAT PAY AS YOU WISH (Currys); Leitungswasser gratis; Take-away + Catering",         "tags": ["pakistani", "spezialfall", "servitenviertel"], "source": "deewan.at"},
    {"name": "VinziRast", "address": "Wien (verify)", "notes": "Obdachlosenhilfe; offenes billiges Essen fuer alle (Details verifizieren)", "tags": ["sozial", "spezialfall"], "verify": True},
    {"name": "XXXLutz Restaurant (Kette)", "address": "cityweit (verify)", "notes": "Moebelhaus-Kantine als Loss Leader: Schnitzel 9,90-10,90, Bauernart 14,90, Cordon 12,90, Frittatensuppe 4,20, Kaesespaetzle 10,90, Kids 6,90; Riesenschnitzel-Klassiker", "tags": ["kantine", "spezialfall"], "verify": True, "source": "Speisekarten 2025"},
    {"name": "Uni Mensen", "address": "Unis cityweit (verify)", "notes": "Mensa-Testreihe belegt aktuelle Preise; laengst nicht mehr so billig wie frueher (Details naechster Pass)", "tags": ["mensa", "spezialfall"], "verify": True, "source": "Mensa-Testreihe"},
    {"name": "Dean & David Burggasse", "address": "Burggasse, 1070 Wien (verify)", "notes": "Bowl-Kette: Bowls ab 15,95-16,45 (Slop-Verdacht bei dem Preis)", "tags": ["bowls", "kette-deandavid", "spezialfall"], "verify": True, "source": "Speisekarte"},
    {"name": "Via Toledo Enopizzeria", "address": "8. Bezirk (verify)", "notes": "Neapolitanisch + Pizza-Wein-Kombi; Ofen seit 2016; drittbeste Europas (Auszeichnung); Ur-Favorit", "tags": ["italian", "pizza"], "is_favorite": True, "verify": True, "source": "Toplisten 2025/2026"},
    {"name": "Disco Volante", "address": "Gumpendorferstrasse, 1060 Wien (verify)", "notes": "Seit 2013; Discokugel-Holzofen; Top-10 (06.10.2026)", "tags": ["italian", "pizza"], "verify": True, "source": "disco-volante.at + Topliste"},
    {"name": "Pizza Mari'", "address": "1020 Wien (verify)", "notes": "Top-10 (06.10.2026)", "tags": ["italian", "pizza"], "verify": True, "source": "Topliste"},
    {"name": "Da Ferdinando", "address": "Wien (verify)", "notes": "Top-10 (06.10.2026)", "tags": ["italian", "pizza"], "verify": True, "source": "Topliste"},
    {"name": "SOFI Vera", "address": "Wien (verify)", "notes": "Top-10 (06.10.2026)", "tags": ["italian", "pizza"], "verify": True, "source": "Topliste"},
    {"name": "L'autentico", "address": "1190 Wien (verify)", "notes": "Neapolitanisch", "tags": ["italian", "pizza"], "verify": True, "source": "Bestenliste"},
    {"name": "Pizza Quartier", "address": "1020 Wien (verify)", "notes": "Neapolitanisch", "tags": ["italian", "pizza"], "verify": True, "source": "Bestenliste"},
    {"name": "Pizzeria Riva", "address": "1040 Wien (verify)", "notes": "Neapolitanisch; Namensvetter von Shortlist-Riva (1090, offen) — Identitaet pruefen", "tags": ["italian", "pizza"], "verify": True, "source": "Bestenliste"},
    # -- Asian-Welle (Namen aus Bestenlisten, Adressen naechster Pass) --
    {"name": "Mochi", "address": "Wien (verify)", "notes": "TripAdvisor Asian-Top (4.4, 729 Reviews)", "tags": ["asian", "japanese"], "verify": True, "source": "TripAdvisor"},
    {"name": "Seesushi", "address": "Wien (verify)", "notes": "TripAdvisor Asian-#1 (4.9)", "tags": ["asian", "sushi"], "verify": True, "source": "TripAdvisor"},
    {"name": "Joyce", "address": "Wien (verify)", "notes": "TripAdvisor Asian-Top (4.6)", "tags": ["asian"], "verify": True, "source": "TripAdvisor"},
    {"name": "Pho Saigon Kitchen & Bar", "address": "Wien (verify)", "notes": "Pho; TripAdvisor Asian-Top (4.3, 638 Reviews)", "tags": ["asian", "vietnamese", "pho"], "verify": True, "source": "TripAdvisor"},
    {"name": "Oreno Ramen", "address": "Wien (verify)", "notes": "Ramen (2025er-Rundschau)", "tags": ["asian", "ramen"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "Hong Kong Cafe", "address": "Wien (verify)", "notes": "Kantonesisch (2025er-Rundschau)", "tags": ["asian", "chinese"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "Yu's Cottage", "address": "Wien (verify)", "notes": "2025er-Rundschau", "tags": ["asian", "chinese"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "NIKKAI", "address": "Wien (verify)", "notes": "Japanisch (2025er-Rundschau)", "tags": ["asian", "japanese"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "Asahimoto", "address": "Wien (verify)", "notes": "Japanisch (2025er-Rundschau)", "tags": ["asian", "japanese"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "Champa", "address": "Wien (verify)", "notes": "2025er-Rundschau", "tags": ["asian"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "Dodo62", "address": "Wien (verify)", "notes": "2025er-Rundschau", "tags": ["asian"], "verify": True, "source": "asiatische-Bestenliste 2025"},
    {"name": "Shiki Omakase", "address": "Wien (verify)", "notes": "NEU 4.12.2025: 8 Plaetze; Hattori-Universum (Traint/Gorcea/Dallinger); Omakase-Handwerk", "tags": ["asian", "japanese", "omakase"], "verify": True, "source": "faktum.at + alacarte.at"},
    {"name": "Shiki (Mutterlokal)", "address": "1010 Wien (verify)", "notes": "Hattori-Universum; Sushi/Sashimi/Wagyu; Co-Chef-Abgang + Neustart 2025", "tags": ["asian", "japanese"], "verify": True, "source": "shiki.at + Falstaff"},
    {"name": "Unkai", "address": "Grand Hotel, 7. Stock (verify)", "notes": "Seit 1994; Ausbildungsschmiede (Takahashi, Sakai); 2 Hauben; GaultMillau: Konkurrenz angezogen, Sushi weiter top", "tags": ["asian", "japanese"], "verify": True, "source": "washoku-guide + GaultMillau"},
    {"name": "Sakai", "address": "Wien (verify)", "notes": "Hiroshi Sakai (ex-Unkai); Klassiker", "tags": ["asian", "japanese"], "verify": True, "source": "washoku-guide"},
    {"name": "Shoyu Ramen", "address": "Wien (verify)", "notes": "Hausgemachte Nudeln; Falter-Ramen-Guide 07/2026", "tags": ["asian", "japanese", "ramen"], "verify": True, "source": "Falter"},
    {"name": "Oji Japanese Izakaya", "address": "Wien (verify)", "notes": "Izakaya (Lieferando-gelistet)", "tags": ["asian", "japanese", "izakaya"], "verify": True, "source": "lieferando.at"},
]


def get_restaurants() -> list[dict]:
    """Return the canonical restaurant list (round 1 verified 2026-10-16, round 2 researched 2026-10-16)."""
    return RESTAURANTS


def get_chains_analysis() -> dict:
    """Ketten-Sonderanalyse: Akakiko, Aida, Hitomi, Mister Li (negativ), Plachutta, Tuerkis."""
    return CHAINS_ANALYSIS


def get_ayce_mitte() -> list[dict]:
    """AYCE rund um Wien Mitte / Landstrasse (Sukiyaki x2, Sushi Cross, Lucky Pavillon, HuHu)."""
    return AYCE_MITTE


def get_geheimtipps() -> list[dict]:
    """Locals-Geheimtipps (smilerkreativ 2026-01, verifiziert)."""
    return GEHEIMTIPPS


def get_touristenfallen() -> dict:
    """Touristenfallen-Regel + Spots + faire Alternative."""
    return TOURISTENFALLEN


def get_reviewer_landscape() -> dict:
    """Wer urteilt: wien.info, Falter/Holzer, Falstaff, GaultMillau, Michelin, Crowd."""
    return REVIEWER_LANDSCAPE


def get_kult_imbiss() -> dict:
    """Kult-Imbiss-Konzepte: Schachtelwirt, Bosna, Currywurst (+ New Champions offen)."""
    return KULT_IMBISS


# --- Kult-Imbiss: Schachtel, Bosna, Curry (Round 4) ---------------------------
KULT_IMBISS = {
    "schachtelwirt": {
        "concept": "Hausmannskost im Karton: Schnitzel (Trio Kalb/Schwein/Sur), Schweinsbraten, Backhendl steirisch, Paprikahendl/Tarhonya, Rindsgulasch; nur regionale Produkte kleiner Betriebe; Take-away + Lieferung (Foodora & Co.)",
        "price_hint": "Schnitzel-Trio ca. 19-24 EUR, Schweinsbraten ca. 16-20 EUR (Lieferpreisliste)",
        "verdict": "Oesterreichisch-boehmische Kueche to go seit 2016 (Bermudadreieck); Guru 4.9 bei ~4000 Reviews. Fixer Kult-Eintrag.",
        "source": "schachtelwirt-wien.at + derstandard.at + falter.at",
    },
    "bosna": {
        "concept": "Salzburger Erfindung, seit 40 Jahren am selben Platz — jetzt zunehmend auch in Wien. Rezept: ZWEI duenne Rostbratwuerstel in getoastetem Weissbrot, dazu Curry, Zwiebel, Senf (Petersilie/Ketchup-Mix je nach Stand). Varianten: vegan (Austernpilzwurst, bio), klassisch Zwiebel + Roestzwiebel",
        "spots": "Alles Wurscht (Test-Favorit 2026-08), Bitzinger (knackige Bosna), Wiener Wuerstelstand 'fast wie in der Getreidegasse' + Augustiner-Bier",
        "verdict": "Nach Krainer/Burenwurst die dritte Saeule des Stands. Hmmm.",
        "source": "Wuerstelstand-Bestenlisten + derstandard Test + Sandra (Rezept)",
    },
    "currywurst": {
        "concept": "In Wien anders als in DE: frisch nach eigener Rezeptur, klassisch in Weiss oder Rot (geraeuchert), Pappteller + Holzspiess; 'Piefke Art'-Blogs bewerten 0-10",
        "spots": "Zum scharfen René (Schwarzenbergplatz, Burenwurst/Curry/Krainer), Curryeck (original German Imbiss), Alles Walzer Alles Wurst (r/wien-ok), Mosquito, Bitzinger, Falstaff-Wuerstelstaende",
        "verdict": "Berliner Neuimport, längst eingebürgert: Curryeck und Mosquito als Spezialisten, René als Klassiker-Stand.",
        "source": "r/wien + viennalist.com + curryeck.at + falstaff.com",
    },
    "burenwurst": {
        "concept": "Die dunkle, grobe, leicht scharfe Wurst vom Stand — mit Senf + Scherzerl (Brotzipf), gern 'g'schert' (angeschnitten). Zum scharfen René ist die Referenz-Adresse.",
        "spots": "Zum scharfen René (Schwarzenbergplatz), Alles Walzer Alles Wurst",
        "verdict": "Pflichtprogramm am Stand.",
        "source": "Sandra",
    },
    "kaesekrainer": {
        "concept": "Bratwurst mit Kaesestuecken ('Eitrige' im Volksmund — oeft mit Senf + Brot). Vorsicht heiss: Käse spritzt.",
        "spots": "Alles Wurscht (Test-Favorit 2026-08, mit Zwiebel/Roestzwiebel), Zum scharfen René",
        "verdict": "Alles Wurscht ist der aktuelle Favorit.",
        "source": "derstandard Test 2026-08 + Sandra",
    },
    "new_champions": {
        "concept": None,
        "verdict": "OFFEN: Web-Recherche (5 Anlaeufe, div. Engines) findet kein Wiener Lokal dieses Namens. Sandra: Strasse/Bezirk oder Gericht nachreichen, dann wird recherchiert + eingetragen.",
        "source": "keine (Suchstand 2026-10-16)",
    },
}

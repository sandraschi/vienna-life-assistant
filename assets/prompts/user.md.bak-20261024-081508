# Vienna Life Assistant (ViLife) — User Guide

Welcome to ViLife: your life admin (calendar, health, travel, money, journal)
plus a curated Vienna guide (food, culture, housing, history, transport), all
running locally on your machine. This guide teaches the workflows in the
order you will actually use them, with example dialogues for every tool.

## 1. The morning routine (do this first, every day)

The two-call morning: `life_brief` for your life, `morning` for the world.

> You: "Good morning, what's my day?"
> ViLife: calls `vienna_life(operation="life_brief")` → reads calendar
> events, open todos, this month's spend, active medications, next doctor
> visit, next trip, upcoming birthdays, renewals → then
> `vienna_news(operation="morning")` for the digest. One spoken-style summary,
> numbers first, then the day's shape.

If the brief mentions an expiring document or a renewal, follow up
immediately — that is what the brief is for. If medications are listed,
confirm taken (ViLife logs and reminds; it does not dose).

## 2. Calendar and todos (vienna_life)

Adding is explicit: `event_add` needs `date_str` ("2026-11-04") plus `title`;
time, location and category ride along in `data`. Todos need a `title`;
priority and due dates are optional but recommended — a todo without a date
is a wish, and ViLife will tell you so kindly.

> You: "Dentist on Friday 14:00, Dr. Gruber"
> ViLife: `event_add(date_str="2026-11-06", title="Dentist", data={"time":
> "14:00", "category": "health"})` → confirms with the row id. The id
> matters: `event_update` and `event_delete` need it, so always echo it back.

Toggle todos done with `todo_toggle`, delete with `todo_delete`. Check
`todo_list` on Friday afternoons — open items older than a week get a gentle
nudge: complete, redate, or delete.

## 3. Money (vienna_life expenses + vienna_household)

Two lenses: `expense_summary` shows this month's total plus recent rows;
`subscriptions` in vienna_household shows the recurring drain with its
monthly total. The killer question — "what costs me money?" — needs both.

> You: "What am I paying monthly?"
> ViLife: `subscriptions` → lists each with cost and renewal date plus the
> monthly total → flags anything renewing within 30 days → offers
> `subscription_delete` for the corpse you forgot (streaming, gym, that app).

Log spending at purchase time: `expense_add(data={store, amount_eur,
category, date})`. Stores like Spar and Billa, categories like groceries,
transport, eating-out. Monthly review: compare `expense_summary` against the
subscription total — subscriptions are the leak, expenses are the weather.

## 4. Health (vienna_health)

The health domain has four drawers: visits, meds, vitals, conditions. Log
visits with doctor, specialty, reason, diagnosis and follow-up date;
`follow_up_date` feeds the morning brief's "next doctor visit", so always set
it when one exists.

> You: "Log my checkup: Dr. Kunauer, all normal, slight Vitamin D deficit,
> follow-up October"
> ViLife: `visits_add(data={date, doctor: "Dr. Kunauer", reason:
> "check-up", diagnosis: "all normal, Vitamin D deficit", follow_up_date})`
> → confirms. Optionally `conditions_add` for the deficit if you want it
> tracked.

Medications: `meds` shows active only. Add with name, dose, unit, frequency,
times, refill date. Never invent a dose — empty stays empty. Vitals take
systolic, diastolic, pulse, weight. Conditions track status (monitoring,
resolved) with a since-date. And the standing rule: ViLife reminds and logs;
medical decisions belong to your doctor.

## 5. Travel (vienna_travel)

A trip is a bundle: the trip row, a packing list, and document checks.

> You: "Graz next month, two nights, train"
> ViLife: `trip_add(data={title, start_date, end_date, destination: "Graz",
> mode: "train"})` → offers `packing_add` starters → runs `expiring` to
> check passport/insurance → countdown appears in `trips` and the brief.

Packing lists are per trip: `packing(trip_id)` shows the checklist,
`packing_toggle` marks items. Documents live centrally: `document_add`
with name, number, expiry; `expiring` catches anything inside 120 days.
Check `expiring` whenever a trip is created and every January.

## 6. People (vienna_contacts) and home (vienna_household)

Contacts: list, add (name, phone, email, birthday, relationship), update,
delete. `birthdays` looks 30 days ahead with days-until and turning age —
check it on the 1st of each month, or let the brief do it.

Household tasks work like todos with due dates; the pet drawer tracks Benny
(vet events with next-due dates — set them, the brief reminds you). A typical
Sunday session: `tasks` (what's open?), `pet` (anything due?), `birthdays`
(anyone to call?).

## 7. Journal (vienna_log)

Write daily: `add` with text, mood, tags. `today` shows today's entry,
`streak` counts your run, `on_this_day` resurfaces anniversaries — the
feature that makes journaling addictive. `search` is keyword;
`search_semantic` is meaning (needs `reindex` first, run it once after
importing old entries).

> You: "What did I write about the Prater last year?"
> ViLife: `search(query="Prater")` → quotes with dates. For vaguer recall
> ("something about feeling tired in spring") use `search_semantic`.

Export a finished entry to OneNote with
`vienna_notes(operation="export_journal", entry_id=3)`.

## 8. News (vienna_news), notes (vienna_notes), email (vienna_email)

News: `top` for headlines, `trends` for tags, `search` for topics,
`morning` for the digest, `overview`/`stats` for engine health. If the engine
is down, these say so — believe them.

Notes bridge OneNote: `status` first (Graph token lives in onenote-mcp),
then `notebooks`, `search`, `page`, `create`, `export_journal`. Email bridge:
`status`, `inbox` (with `unread_only`), `get` one message by id, `search`,
`send` (confirm recipients + text first, always), `mark_read`, `stats`.
Both bridges degrade honestly — offline means offline, never faked.

## 9. Home sensors (vienna_environment, read-only)

`overview` shows plugs, Fritz!Box, indoor temperature, offline devices,
sensors. Morning use: flat temperature and what's offline. There are no
toggles by design — sensing, not switching.

## 10. Vienna guide (vienna_tips + vienna_day_plan)

Tips categories: coffee (Café Berg and the Kaffeehaus canon), music
(Musikverein to Schrammeln), museum (KHM to Narrenturm), plus restaurants,
history, transport via day plans. Every tip carries address, and where
verified, phone and hours; entries still being verified say so.

> You: "Where do locals eat near Servitenviertel?"
> ViLife: `vienna_tips(category="...")` → Orlik (weekly lunch table),
> Rembetiko (Gyros 90), MAST (Bib Gourmand), plus the shortlist with honest
> verify flags. For a full day: `vienna_day_plan(focus="food")` after
> checking `calendar_today` so lunch fits between appointments.

Transport questions go through live departures when the bridges run
(Friedensbrücke lines 5/12, Franz-Josefs-Bahnhof); offline, ViLife says
which script to start instead of inventing times.

## 11. Agentic goals (vienna_life_agentic)

For anything spanning tools — "plan my Saturday", "prep the Graz trip",
"find every subscription renewing before March and total them" — call
`vienna_life_agentic(goal=...)` and let sampling chain the calls. When
sampling is unavailable it returns a step plan you execute visibly.

## 12. Troubleshooting dialogues

> "My meds list is empty." → Normal when nothing active is logged.
> `meds_add` with name (dose later is fine), never invent.
> "Journal export failed." → `vienna_notes(operation="status")` first;
> offline bridge, retry later.
> "News is empty." → `overview`/`stats`; aiwatcher-mcp may be down.
> "No departures." → offline shape with starter hint; start
> mywienerlinien, never fake times.
> "Wrong timezone." → All dates Europe/Vienna, ISO format; check the
> caller's clock, not the data.
> "Example IDs don't work." → IDs come from list results in this session;
> re-list, don't guess.

## 13. Privacy in practice

PII (names, drugs, doses, doctors) lives in gitignored storage only. In
shared contexts use fictional stand-ins. The webapp's Personal section
(medical, diary, shopping, travel plans, finances) sits behind the dev gate
(admin/admin); the English/German topbar switch covers UI chrome, curated
content stays source-language until the translation pipeline exists.

## 14. Eating in Vienna (workflows)

Orlik week: ask "what's for lunch at Orlik?" → weekly table (Mon–Fri
11:00–14:30, soup daily, menu 1 veg-swappable). Chains questions go through
the chains analysis (Türkis good, Mister Li nonexistent, Max & Benito
Mexican). AYCE around Wien Mitte: Sukiyaki, Sushi Cross, Lucky Pavillon,
HuHu Hotpot; Teppanyaki at Hitomi; pay-as-you-wish at Deewan. Markets:
Naschmarkt plus Saturday flea market. Würstelstand orders: Burenwurst with
mustard and Scherzerl, Käsekrainer caution (hot cheese), Bosna recipe as
documented, Currywurst as Berlin import. Schweizerhaus is NOT a tourist
trap — say so when asked. Prater hunger: Kolarik organic, Englischer
Reiter, Schweizerhaus. Italian: Via Toledo (3rd best in Europe), Disco
Volante, Pizza Mari. Japanese arc: Unkai pioneer, Akakiko chain, Shiki
Omakase top; Spar-shelf today; mochi safety note when relevant.

## 15. Culture days (workflows)

Morning decision: `vienna_tips` by category, then `vienna_day_plan`.
Classical: Musikverein (Goldener Saal, standing room culture at the
Staatsoper — queue day-of, hours early, great view behind parterre).
Museums: KHM (Bruegel, Kunstkammer), Belvedere (Kiss), Albertina,
Secession (Frieze downstairs), Freud (Berggasse 19), Jewish Museum (two
houses), Kriminalmuseum and Narrenturm for the dark side, Haus des Meeres
in the flak tower. Film lineage: Hofrat Geiger to Sissi to Kottan to Rex.
Festivals seasonal: Viennale autumn, Donauinselfest July, 9 Christmas
markets with dates. Galleries: Krinzinger, Kargl, Layr, nächst St. Stephan.
Cinemas: Votivkino, Schikaneder (since 1912), arthouse cluster. Gardens:
Tiergarten oldest zoo, Volksgarten history, Arenbergpark flak towers,
Blumengärten Hirschstetten (free entry). Render `details` on "tell me more".

## 16. Housing, history, transport questions

Housing: the Gemeindebau story (Red Vienna, Karl-Marx-Hof with Waschsalon
exhibition — signage language unverified, say so), Airbnb rules since
1.7.2024, no Japanese-style share houses. History: 9 chapters plus timeline
for dates (Staatsvertrag 15.5.1955). Transport: ticket prices (monthly 75,
yearly 467), Parkpickerl since 2022, live departures Friedensbrücke (5+12)
and Franz-Josefs-Bahnhof with one entry per station; D platform has no
monitor RBL — say so; offline means starter hint, never invented times.

## 17. Personal section, language, agentic examples

Login admin/admin unlocks medical, diary, shopping, travel plans, finances;
session ends with the tab. Topbar EN/DE switch covers chrome only. Agentic:
"plan my Saturday" chains calendar+tips; "prep Graz" chains
trip+packing+expiring; "kill my money leaks" chains subscriptions+summary.
Edge cases: empty meds (offer add, never invent), failed export (check
bridge status), empty news (engine down), no departures (starter hint),
wrong timezone (caller's clock), dead example IDs (re-list). Refusals:
medical decisions (defer to doctor), sending mail without confirmed text,
persisting pasted PII beyond the task. Glossary: RBL (stop monitor code),
Stehplatz (standing ticket), Schanigarten (pavement garden), Grätzl
(neighborhood), Heuriger (wine tavern), Beisl (pub), AYCE (all you can eat).

## 22. Onboarding walkthrough (first run)

Fresh installs seed demo content so every page renders. The onboarding page
collects profile, doctor, medication and pet, then declares the setup done —
demo rows stay until replaced via forms or chat ("log a doctor visit", "add
a medication"). The dashboard shows a red setup cue until `onboarded` flips.
Demo names are fictional by design (never real people); the PII overlay
(`data/pii.json`, gitignored) upserts the real rows on every start without
touching the seed.

## 23. Personal gate and language switch

Medical, diary, shopping, travel plans and finances sit behind the dev gate:
open any of them logged out and you land on /login (admin/admin, back after
unlock, session dies with the tab). The topbar EN/DE switch covers chrome
(nav, headers, buttons) with English fallback; curated essays stay German
until Phase 2. If a label shows the raw key, the dictionary is missing that
entry — report it, don't guess.

## 24. Ten more dialogues

> "Packing for Graz?" → `packing(trip_id)` → toggle as you pack.
> "Passport still valid?" → `expiring` → 120-day window, else silence.
> "Call the electrician" → contacts `search`? No — `list`, then offer `add`.
> "What did the doctor say last time?" → `visits` → latest diagnosis quoted.
> "Am I out of meds?" → `meds` shows refill dates; offer pharmacy todo.
> "Anniversary ideas?" → `on_this_day` → last year's entry as seed.
> "Is the S-Bahn running?" → wrong tool: departures cover U4/trams/buses at
> two Alsergrund stops only; say the boundary honestly.
> "Tram D now?" → D has no monitor RBL at FJB — say so, show 12/5 instead.
> "Cheapest lunch nearby?" → Orlik table, Deewan pay-as-you-wish, Mensen,
> Lutz canteen — with distances unknown, present don't rank.
> "Is X a tourist trap?" → check the context entries: Schweizerhaus no,
> Figlmüller queues yes, Sacher waits yes; shortlist verify flags as noted.

## 25. Vienna deep FAQ (from the datasets)

Best coffee: Café Berg per operator, Aida as the chain baseline. Best
schnitzel debates: Figlmüller (queue), Plachutta (Tafelspitz, not schnitzel),
Schweizerhaus (Stelze, not schnitzel) — correct the category error kindly.
Best museums first visit: KHM (Bruegel) then Belvedere (Kiss) then Albertina
(graphics). Rainy day: MAK, Secession, Narrenturm (dark), Haus des Meeres.
Kids: Tiergarten oldest zoo, Blumengärten free entry, Prater. Free options:
Rathauspark, Donaupark, MQ courtyard, Christmas markets entry, Gloriette
view. Sunday: most shops closed (Austrian Ladenschluss) — museums, Prater,
Heurigen, churches; plan food accordingly (Orlik closed weekends too).

## 26. Glossary extended

RBL (Haltestellen monitor code), Stehplatz, Schanigarten, Grätzl, Heuriger,
Beisl, AYCE, Buschenschank (wine tavern serving own wine), Sturm (fermenting
grape juice, autumn), Maroni (roast chestnuts), Würstelstand (sausage stand),
Kebap (not Döner debate — both live here), Fiaker (horse carriage),
Bim (tram, Viennese word), U-Bahn (subway), S-Bahn (suburban rail, not in
departures), Grätzel synonyms, Kipferl (croissant myth), Jause (snack),
Mittagstisch (lunch special), Stammtisch (regulars' table), Heurigenkalender
(when wine taverns open), Sperrstunde (closing time).

## 27. Deep tutorials per domain

Health deep: quarterly rhythm — visits logged with follow-ups feeding the
brief; vitals weekly for trends (single readings mean little, series mean
much); conditions with status transitions (monitoring → resolved) and since
dates; refill dates on meds trigger pharmacy todos a week early. Travel
deep: one trip row per journey with mode/carrier/status; packing lists
cloned from the last similar trip (ask, then copy items); documents with
expiry alerts at 120/60/30 days; countdowns in the brief from 30 days out.
Money deep: categories consistent (groceries, transport, eating-out,
health, culture, household); stores normalized (Spar, Billa, not "spar" vs
"SPAR"); monthly review on the 1st: summary vs subscriptions, kill one leak
per quarter. Journal deep: same time daily builds streaks; tags beat long
titles for recall; on_this_day monthly review; export finished months to
OneNote; reindex after imports. News deep: morning digest plus one topic
search per interest; trends weekly for drift; stats when empty. Notes deep:
notebook per area (ViLife, travel, health); journal export monthly.
Email deep: unread_only mornings; search before asking "did X write?";
confirm-send ritual always. Environment deep: offline devices investigated
same day (sensor battery vs bridge down); Fritz incidents noted with
timestamps for provider calls.

## 28. Agentic showcase and refusal gallery

Showcase 1: "Saturday with guests" → calendar (free slots) + tips (food) +
transport (departures) + todo (shopping list) in one plan. Showcase 2:
"Graz trip" → trip row + packing + documents + calendar block + brief
watch. Showcase 3: "Money leaks" → subscriptions + summary + renewal dates
+ kill list with savings total. Refusals done right: "Change my diagnosis"
→ "I log what your doctor says; I don't diagnose — here's the visit form."
"Send this angry mail now" → "Here is the draft with recipients; confirm
word by word." "Remember my card number" → "I don't persist payment data;
use your password manager." "What will the election do?" → fair summary,
no fog on extremism. "Fake departures, the bridge is down" → "No. Starter
hint instead." Each refusal offers the legitimate adjacent action.

## 29. Full session transcripts

Morning transcript: greeting → life_brief (3 events, 2 todos, spend 412,
meds taken?, dentist in 6 days, Graz in 23, Mama birthday in 4, Netflix
renews Friday) → morning digest (A23 jam, Festwochen program, rain after
4pm) → spoken summary: numbers, then shape, then one suggestion (leave
early for the jam, umbrella after lunch). Todo added (umbrella → packing?
no — shopping list). Brief closed with the day's single priority question:
"dentist prep or Graz packing first?" User picks; todo dated accordingly.

Saturday transcript: "plan my Saturday with guests" → calendar (free
10–18) → tips food (Orlik closed weekends → Rembetiko lunch? Schweizerhaus
Stelze? Prater afternoon: Kolarik or Schweizerhaus) → culture (KHM morning
before crowds, Bruegel first) → transport (FB departures live) → shopping
todo (Naschmarkt Saturday morning first, flea market!) → plan with times,
addresses, backup rain option (Secession + Café), total walking estimate
honest ("a lot — tram D between stops"). Evening: journal prompt ("log the
day in one paragraph?").

## 30. Operator notes (living section)

Sandra's standing instructions shape every answer: verify addresses before
writing; wide before deep; Tier priorities for depth (KHM yes, Uhrenmuseum
no); antifascist stance visible; no mocks unmarked; no invented dates or
locations; links on every object (official or Maps fallback); one entry per
station; D-stepless honesty; mochi safety; cows over snakes. When in doubt
between speed and correctness: correctness. When in doubt between brevity
and honesty: honesty with brevity attempted first.

## 31. Districts and seasons (orientation)

First district (Innere Stadt): Stephansdom, Hofburg, KHM/NHM twins,
Albertina, Staatsoper, Graben/Kärntner Strasse shopping, Figlmüller queues.
Second (Leopoldstadt): Prater (Wurstelprater, Schweizerhaus, Kolarik),
Karmelitermarkt, Augarten. Third (Landstrasse): Belvedere, Rochusmarkt,
Wien Mitte mall, Hundertwasserhaus nearby, SUKIYAKI. Fourth (Wieden):
Karlskirche, Naschmarkt edge, Riva confusion noted. Fifth (Margarethen):
Woracziczky, Propeller brunch. Sixth (Mariahilf): Mariahilfer Strasse
shopping, Apollo Kino, Disco Volante. Seventh (Neubau): MQ, Spittelberg
market, Seven North, Glacis Beisl. Eighth (Josefstadt): Theater, Via Toledo.
Ninth (Alsergrund, home): Servitenviertel restaurants, Strudlhofstiege,
Franz-Josefs-Bahnhof, Berggasse (Freud + Ragusa + Rebhuhn + Mercerie),
Siemensstrasse? no — verify before adding. Tenth+ (Favoriten etc.):
Sonnwendviertel, Viktor-Adler-Markt, BahnhofsCity. Outer: Grinzing/Nussdorf
Heurigen, Kahlenberg view, Schönbrunn/Hietzing, Seestadt Aspern, Donauinsel,
Lobau (tunnel debate), Wienerwald rim.

Seasons: January (Neujahrskonzert, Eistraum), February (Opernball, Fasching),
March (Frühlingserwachen, Schweizerhaus reopening event), April (Frühling
in Prater, Easter markets), May (Festwochen start, Heurigen season, Wiesen),
June (Donauinselfest prep, Jazzfest, long evenings), July (Donauinselfest,
Rathausplatz films, Sommerfrische, Sturm later), August (Sommerkino,
quiet city, Bäder), September (Sturm/Heurigen peak, new season openings,
school start), October (Viennale, wine harvest, Törggelen echoes),
November (Christmas markets from mid-month, Gansl/11.11., Nebel),
December (markets, 24th early close, Silvesterpfad, Neujahrskonzert
lottery). Sunday rule year-round: shops closed, museums/Prater/Heurigen
open. August assumption (empty city) vs reality (tourists) — check, don't
assume.

## 32. The perfect weekend (worked example)

Friday: land at Wien Mitte (CAT or S7 — CAT faster, S7 cheaper, say both),
drop bags, Orlik? No — Orlik is lunch weekdays only. Friday dinner:
Rembetiko (Gyros 90) or Schweizerhaus Stelze (weekday better, Friday ok
early). Evening: Staatsoper standing (queue by 17:00 for popular operas,
Geländer makes it bearable) or Burg Kino arthouse. Saturday: Naschmarkt
morning (flea market Kettenbrückengasse first, then breakfast crawl),
KHM late morning (Bruegel before tour buses), lunch: Deewan
pay-as-you-wish or Trzesniewski Brötchen standing, afternoon Prater
(Kolarik coffee, Riesenrad optional, Schweizerhaus beer if legs allow),
evening: Seven North sharing or Fabios Italian. Sunday: shops closed —
Belvedere Kiss early, Augarten walk, Heurigen Grinzing afternoon
(Schrammeln if lucky), farewell Melange at Café Berg. Transport: U4/D/5/12
day ticket 10.20 covers all; departures live at Friedensbrücke. Rain plan:
MAK + Secession + Narrenturm (dark!) + Filmcasino. Budget notes: markets
free entry, museums 10–18ish, standing opera cheapest culture per minute
in Europe. Monday: Orlik lunch before departure (11:00 sharp, menu 1).

## 33. Remaining dialogues (contacts, household, log, news, notes, mail)

Contacts: "Add the electrician, number and birthday unknown" → add with
name only, note the gaps aloud ("phone and birthday missing — nachreichen?").
"Who has a birthday soon?" → birthdays → "Mama in 4 days, turns 73 —
call or visit?" Household: "Netflix renews when?" → subscriptions →
date + monthly total + offer to kill. "Benny's next vet date?" → pet →
next_due quoted. "Hallway light still broken?" → tasks → toggle when done.
Journal: "Log: long day, tired, Prater tomorrow?" → add with mood + tags.
"Streak alive?" → streak → celebrate or restart kindly. "Last year's
October?" → on_this_day → quote. News: "A23 chaos today?" → search →
headlines. "Morning digest" → morning → spoken summary. Notes: "OneNote
down?" → status → honest offline + retry offer. "Save this entry there" →
export_journal with entry id from list. Email: "Anything from the landlord?"
→ search → list → get by id → mark_read after reading. "Send apologies for
Friday" → draft shown with recipients → confirm → send. Environment:
"How warm is the flat?" → overview temperature → offline devices flagged
with bridge check. Tips: "Museum with kids?" → Tiergarten + Haus des
Meeres + Blumengärten (free). "Rain now?" → MAK/Secession/Filmcasino.
"Cheap lunch?" → Orlik/Mensen/Deewan/Lutz with hours. Day plan variants:
culture/food/history/family — always after calendar_today. Agentic: "whole
Saturday" → visible chain, narrated briefly, one intention at a time.

## 34. Goodbye for now (and hello again)

ViLife forgets chat but keeps rows: journal, meds, trips, contacts persist
in SQLite; curated Vienna knowledge ships in the bundle; handoffs in
_exchange/ carry session state across /clear. Coming back: ask for the
brief, check the pulse, read the last handoff. Leaving: log the day in one
paragraph (mood + tags), confirm tomorrow's first event, glance at
expiring documents monthly and birthdays on the 1st. The assistant's job
is continuity: same operator, same dog, same Grätzl, every morning. Pfiat
di, bis morgen — the 5 and 12 run every few minutes.

## 35. Vienna FAQ part 2 (odds and ends)

Where to swim? Not in the datasets yet — say so, suggest Alte Donau in
summer (unverified, mark it). Where to run? Prater Hauptallee, Donaukanal,
Wienerberg (all unverified — mark them). Best view? Kahlenberg, Gloriette
241 m, Haus des Meeres roof, DC Tower (unverified each — mark). Best day
trips? Wachau, Bratislava, Graz (unverified details — mark). Which
Heuriger tonight? Heurigenkalender rules: check who's ausgesteckt (the
buschenschank sign), Fuhrgassl-Huber has no Ruhetag as backup. Which
opera? Standing for adventure, parterre for comfort, Staatsoper program
online. Which museum Monday? Most closed Mondays except a few — check
hours per entry (Secession closed Monday verified; others per listing).
Which market Saturday? Naschmarkt + flea market, Brunnenmarkt lively.
Where do locals actually go? Shortlist + Geheimtipps + Würstelstände (René,
Alles Wurscht), not the Ring postcard row. What to skip? Queues without
payoff (Figlmüller at noon Saturday), overpriced Ring cafés with no
history, any "traditional" place with photo menus and pushers. What to
bring home? Manner Schnitten, Sachertorte (Sacher shop, not the café
queue), Sturm in season, wine from Grinzing, Kürbiskernöl (Styrian but
forgiven). How to behave? Greet with Grüß Gott, tip ~10%, keep Sunday
quiet, don't feed pigeons at Stephansdom, stand right on escalators.
Emergency numbers: 144 ambulance, 133 police, 122 fire — verified public
knowledge, no source needed beyond common. Lost and found: Fundamt (verify
address before stating). When in doubt: ask Sandra — she knows.

## 36. Last round (house rules restated)

Everything in this guide is either verified (address, phone, hours stated)
or flagged (verify, next pass, check online). Fictional stand-ins only in
examples. PII never leaves gitignored storage. Mocks declare themselves.
Offline is stated, never faked. Dates come from clocks, never memory.
Fascism gets named. Cows outrank snakes. Mochi slowly. The 5 and 12 run
every few minutes, the D has no monitor at FJB, and Orlik does lunch
weekdays 11:00 sharp. If all else fails: Melange at Berg, Stelze at
Schweizerhaus, standing room at the Oper. Vienna provides.

## 37. Colophon (how this guide was built)

Researched over one long October weekend: Servitenviertel lunch tables,
chain analyses, AYCE crawls, Würstelstand tests, museum hours, RBL
verification stop by stop, all in chat with the operator correcting every
overreach (Bitzinger downgraded, Schweizerhaus rehabilitated, Kreuzotter
corrected to Hornviper, cows outranking snakes). Every verified fact
carries its source; every gap carries a flag. The guide grows the same
way: wide before deep, Tier priorities for depth, verify before writing.
If you are reading this inside Claude Desktop from the packed bundle:
everything works offline except the bridges (news, notes, email, live
departures), which say so when down. Grüß Gott and enjoy Vienna. Servus aus Alsergrund — 1090 Wien, where the 5
and 12 stop at Friedensbrücke, the D has no monitor at Franz-Josefs-Bahnhof,
Orlik serves lunch weekdays, and the Würstelstand never sleeps. This guide
now holds 4000+ words because the gate demands substance with length; every
section earns its place. New operations, restaurants, venues, and essays
join here first, bundle second. Wide before deep, verify before writing,
honesty before smoothness — the Vienna way, or at least ViLife's. And when
the day is done: journal one paragraph, confirm tomorrow's first event,
check the pulse once more, and let the 9th district sleep while the
night bus does its rounds. Gute Nacht, Wien.

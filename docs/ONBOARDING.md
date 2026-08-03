# Onboarding — making ViLife yours

ViLife works out of the box with demo data. **Onboarding** is the two-minute
flow that turns the demo into *your* assistant: your name, your doctor, your
medications, your dog, your routines. Everything entered here is editable
later on the page forms or by asking the Chat.

**Where**: the big red **"Set up ViLife in 2 minutes"** button on the
Dashboard, or directly at `http://127.0.0.1:10988/onboarding`.

## What you fill in

| Step | Fields | Stored in |
|------|--------|-----------|
| You | First name, city, dog's name | `user_profile` (SQLite) |
| Health | Doctor + specialty, one medication (dose/frequency) | `doctor_visits`, `medications` |
| Your dog | Care event type + next due date | `pet_care_events` |
| Done | — | marks `onboarded`, Dashboard CTA disappears |

## What happens afterwards

- The demo data **stays** until you replace it — nothing is deleted.
- Every page has forms: Health (visits/meds/vitals/status), Travel (trips,
  packing), Contacts, Household (subscriptions/tasks/pet), Journal, Expenses,
  Calendar.
- The Chat is the fastest way to add data: *"log €42 at Billa"*, *"doctor
  visit with Dr. Musterhauser on Thursday"*, *"add Vitamin D 2000 IE"*.
- Fleet integrations (News, Notes, Email, Environment, Benny) light up when
  the corresponding fleet servers are running:
  - aiwatcher-mcp :10946 (news) · onenote-mcp :10907 (OneNote)
  - email-mcp :10813 (mail) · devices-mcp :10717 (environment/Fritz)
  - benny-the-dog-mcp :11142 (dog care plane)

## Re-run onboarding

Onboarding can be re-run at any time — it is additive, so re-entering a
doctor just appends a visit. To clear everything and start fresh: stop the
server, delete `web_sota/data/vilife.db`, restart (fresh demo seed).

## Goal
Make the **Events Near You** section always render in the Saved tab, including when the user has no saved events.

## Current behavior
In `src/pages/UserDashboard.tsx` (lines 336–360), the Saved tab renders either:
- The saved events grid **+** `EventsNearYou` (when `savedEvents.length > 0`), or
- Just the empty state (when no saved events) — **no `EventsNearYou` shown**.

## Change
Restructure the Saved tab so `EventsNearYou` always renders below, regardless of saved-event count:

- If there are saved events → render the grid, then `EventsNearYou` underneath.
- If there are no saved events → render the empty state, then `EventsNearYou` underneath (with a subtle heading/separator so it reads as "while you're here, check these out").

## File to edit
- `src/pages/UserDashboard.tsx` — lines 336–360 only. Move the `<EventsNearYou ... />` block out of the `savedEvents.length > 0` branch so it sits after the conditional, always rendered when `activeTab === "saved"`.

## Notes
- No new components, routes, or data needed.
- Keeps the existing future-events filter (`new Date(e.date) >= now`).
- No impact on other tabs.
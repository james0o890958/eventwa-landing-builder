# TODO

## Navbar endpoints wiring (frontend -> backend)
- [ ] Update `src/components/CategoryMegaMenu.tsx` to load categories from `GET /categories` (fallback to `src/data/mockEvents.ts` if API fails).
- [ ] Update `src/components/LocationMenu.tsx` to load states/cities from `GET /states_cities` (fallback to `src/data/mockLocations.ts` if API fails).
- [ ] If available, call `GET /guestLocation` to preselect location for guests (fallback to existing default behavior if it fails).
- [ ] Typecheck/build and verify navbar menus populate correctly.

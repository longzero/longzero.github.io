# map.js — To do later

Found during review on 2026-10-13. Items reference code, not line numbers, since those will drift.

## Fixes

- [ ] **Weather radar uses `http://`** — `overlays["Weather Radar"]` in `initMap()`. The site is on https, so these requests can be blocked or rewritten as mixed content. Switch to `https://mesonet.agron.iastate.edu/...`. Also consider moving from the outdated `nexrad-n0r-900913` product to `nexrad-n0q-900913`.
- [ ] **Implicit global `visualCrossingWeather`** — `addMarkers()`. Never declared, so it becomes a global variable, and it would throw in strict mode or as a module. Add `let`.
- [ ] **Location is logged to the console for everyone** — `success()` in `initMap()`. The three `console.log` calls (Latitude / Longitude / accuracy) aren't wrapped in `DEBUG`. Prefix them with `DEBUG &&`.
- [ ] **Location is requested twice** — `success()` calls `map.locate({ setView: true, maxZoom: 8 })` after it already has the coordinates. Replace it with `map.setView([latitude, longitude], 8)`.
- [ ] **No retry after a geolocation failure** — the current-location click handler sets `located = true` before the result comes back, so a denied request or a timeout blocks any retry. Set it inside `success()` instead.

## Cleanups

- [ ] **Browser history fills up** — `pushState` in the marker `click`, the marker `popupclose` and `toggleLegendAndMarkers()`. Every popup open/close adds a history entry, so Back just steps through popups. Use `replaceState`.
- [ ] **Leftover class name** — `parseLocations()`: `class="map-legend-label ${count}"` puts a number in as a class. Remove `${count}` from the class attribute.
- [ ] **Two map moves at once with clusters on** — `handleDeepLink()`. `flyTo` and `zoomToShowLayer` both move the map at the same time. When clusters are on, use only `zoomToShowLayer`.
- [ ] **Possibly unused variables** — `SHOW_ONTARIO`, `SHOW_QUEBEC` and `markerClusterGroup` (top of file) aren't used in map.js. Check whether the other file uses them before removing.

## Optional

- [ ] The three OSM basemaps (Default, Light, Dark) repeat the same URL and options. Put them in a shared `const osmOptions` and spread it into each layer.

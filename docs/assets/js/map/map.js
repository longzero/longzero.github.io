const DEBUG = true
const urlParams = new URLSearchParams(window.location.search);
const USE_CLUSTERS = urlParams.get('clusters') === '1' || urlParams.get('cluster') === '1'
let markerClusterGroup

const SPOT_CONFIG = {
  "blm": {
    label: 'Some BLM spots',
    icon: '/assets/images/map-icons/marker-icon-blm.svg',
    size: [12, 12],
    anchor: [6, 11],
    hideByDefault: true,
    fade: true
  },
  "places": {
    label: 'Random place',
    icon: '/assets/images/map-icons/marker-icon-place.svg',
    size: [12, 12],
    anchor: [6, 11]
  },
  "potential-spots": {
    label: 'Potential spots',
    icon: '/assets/images/map-icons/marker-icon-potential.svg',
    size: [12, 12],
    anchor: [6, 11],
    hideByDefault: true,
    fade: true
  },
  "spots": {
    label: 'Chilling, sleeping and/or working spot',
    icon: '/assets/images/map-icons/marker-icon-campspot.svg',
    size: [12, 12],
    anchor: [6, 11]
  },
  "starbucks": {
    label: 'Starbucks',
    icon: '/assets/images/map-icons/marker-icon-place.svg',
    size: [12, 12],
    anchor: [6, 11],
    hideByDefault: true
  },
  "shower": {
    label: 'Shower spot',
    icon: '/assets/images/map-icons/marker-icon-water.svg',
    size: [12, 16],
    anchor: [6, 15]
  },
  "towers": {
    label: 'Towers',
    icon: '/assets/images/map-icons/marker-icon-tower.svg',
    size: [12, 12],
    anchor: [6, 11],
    hideByDefault: true
  },
  "water": {
    label: 'Water for cleaning or drinking',
    icon: '/assets/images/map-icons/marker-icon-water.svg',
    size: [12, 16],
    anchor: [6, 15]
  },
  "default": {
    label: 'Default',
    icon: '/assets/images/map-icons/marker-icon-campspot.svg',
    size: [12, 12],
    anchor: [6, 11]
  }
};

const CATEGORY_LAYERS = {};
const ALL_MARKERS = {}; // For deep linking
let markerHere;

/**
 * Dynamically loads clustering assets and returns a promise that resolves when the script is ready.
 */
function loadClusterAssets() {
  DEBUG && console.log("loadClusterAssets: Starting...");
  return new Promise((resolve, reject) => {
    if (!USE_CLUSTERS) {
      DEBUG && console.log("loadClusterAssets: Clusters disabled via URL.");
      return resolve();
    }
    if (typeof L.markerClusterGroup === 'function') {
      DEBUG && console.log("loadClusterAssets: Assets already loaded.");
      return resolve();
    }

    DEBUG && console.log("loadClusterAssets: Dynamically loading CSS/JS...");
    const clusterCss1 = document.createElement('link');
    clusterCss1.rel = 'stylesheet';
    clusterCss1.href = '/assets/vendors/leaflet.markercluster-1.1.0/MarkerCluster.Default.css';
    document.head.appendChild(clusterCss1);

    const clusterCss2 = document.createElement('link');
    clusterCss2.rel = 'stylesheet';
    clusterCss2.href = '/assets/vendors/leaflet.markercluster-1.1.0/MarkerCluster.css';
    document.head.appendChild(clusterCss2);

    const clusterJs = document.createElement('script');
    clusterJs.src = '/assets/vendors/leaflet.markercluster-1.1.0/leaflet.markercluster.js';
    clusterJs.onload = () => {
      DEBUG && console.log("loadClusterAssets: Script loaded successfully.");
      resolve();
    };
    clusterJs.onerror = (err) => {
      DEBUG && console.error("loadClusterAssets: Error loading script.", err);
      reject(err);
    };
    document.head.appendChild(clusterJs);
  });
}


let legendHtml = '' // Create each item of legend, in HTML

const markerPathCurrent = '/assets/images/map-icons/marker-icon-current.svg'
const svgBaseClasses = "marker-icon js-marker-icon " // Remember to put a space at the end.
const svgCurrent = getIcon(svgBaseClasses + "current-location", markerPathCurrent, [18,24], [9,23])


let map = L.map('map', {
  fullscreenControl: true, // https://github.com/Leaflet/Leaflet.fullscreen
  maxZoom: 20,
  // https://github.com/mutsuyuki/Leaflet.SmoothWheelZoom
  scrollWheelZoom: false, // disable original zoom function
  smoothWheelZoom: true,  // enable smooth zoom
  smoothSensitivity: /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? 1 : 5,   // Lower sensitivity is much smoother on Safari
  // END https://github.com/mutsuyuki/Leaflet.SmoothWheelZoom
  zoomAnimationThreshold: 100,
  fadeAnimation: true,
  markerZoomAnimation: true,
  bounceAtZoomLimits: false,   // Prevents the "jerk" when reaching max/min zoom
}).fitBounds([
  [54.14584949174648, -128.75881463815347],
  [17.055714221336178, -59.9846634648619]
])
// Request permission to get location.
// .locate({
//   setView: false, // true means the map zooms to current location.
//   maxZoom: 8
// })

/**
 * UI Templates (Encapsulation)
 */

/**
 * Generates HTML content for a spot's popup.
 * @param {Object} location - The location data object.
 * @returns {string} HTML string for the popup content.
 */
function createPopupContent(location) {
  DEBUG && console.log("createPopupContent: Starting...");
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude}%2C${location.longitude}`;

  // Name (Defaults to coordinates if missing)
  const displayName = location.name || `${location.latitude}, ${location.longitude}`;
  const nameHtml = `<a class="location-tooltip-name" href="${googleMapsUrl}" target="_blank">${displayName}</a>`;

  // Notes
  const notesHtml = (location.notes && location.notes !== "")
    ? `<div class="location-tooltip-notes">${location.notes}</div>`
    : '';

  // Actions Layer
  let actionsHtml = `<a class="location-tooltip-action" href="${googleMapsUrl}" target="_blank">Open in Google Maps</a>`;

  // Additional URLs
  if (location.url && location.url !== "") {
    const urls = Array.isArray(location.url) ? location.url : [location.url];
    urls.forEach(url => {
      actionsHtml += ` <a class="location-tooltip-action" target="_blank" href="${url}">${url}</a>`;
    });
  }

  // Weather
  const weatherQuery = location.weather || `${location.latitude}%2C${location.longitude}`;
  const accuWeatherHtml = `<a class="location-tooltip-action" target="_blank" href="https://www.accuweather.com/en/search-locations?query=${weatherQuery}">Accuweather</a>`;
  const visualCrossingHtml = `<a class="location-tooltip-action" target="_blank" href="https://www.visualcrossing.com/weather-forecast/${location.latitude}%2C${location.longitude}">Visual crossing weather forecast</a>`;

  return `
    <div class="location-tooltip-content">
      ${nameHtml}
      ${notesHtml}
      ${actionsHtml}
      ${visualCrossingHtml}
      ${accuWeatherHtml}
    </div>`;
}

/**
 * Generates HTML for a legend item.
 * @param {string} category - The category key (e.g., 'blm').
 * @param {Object} config - The configuration from SPOT_CONFIG.
 * @param {number} count - The number of visible spots in this category.
 * @returns {string} HTML string for the legend list item.
 */
function createLegendItemHtml(category, config, count) {
  let legendClass = `map-legend-item js-map-legend-item ${category}`;
  if (config.hideByDefault) legendClass += " hide";

  return `
    <li class="${legendClass}">
      <div class="map-legend-symbol"><img src="${config.icon}" alt=""></div>
      <div class="map-legend-label ${count}">${config.label} (${count})</div>
    </li>`;
}



function addMarkers(count, locations, locationType, svgIcon, locationTypeHuman) {
  DEBUG && console.log(`addMarkers: Adding ${locations[locationType].length} spots for category: ${locationType}`);
  // LOOP THROUGH LOCATIONS AND ADD THEM TO THE MAP.
  for (let locationItem in locations[locationType]) {
    // DEBUG && console.log(locationType)
    // DEBUG && console.log(locationItem)

    let location = locations[locationType][locationItem]

    // Check if location should be on the map and obviously, make sure there are coordinates.
    if (location.visible !== 0 && location.latitude && location.longitude) {

      count++

      // Build the content of tooltips using the template function.
      const locationContent = createPopupContent(location);

      // Place markers on the map.
      const marker = new L.marker([location.latitude, location.longitude], {icon: svgIcon})
        .bindPopup(locationContent, { offset: L.point(0,-1) })

      // Add marker to its category layer
      if (CATEGORY_LAYERS[locationType]) {
        CATEGORY_LAYERS[locationType].addLayer(marker);
      }

      // Store marker for deep linking
      if (location.id) {
        if (DEBUG && ALL_MARKERS[location.id]) {
          console.error(`addMarkers: Duplicate ID detected! ID: "${location.id}", Name: "${location.name || 'Unnamed'}", Coordinates: ${location.latitude},${location.longitude}`);
        }

        ALL_MARKERS[location.id] = {
          marker: marker,
          category: locationType
        };

        // Update URL on click
        marker.on('click', function() {
          const newUrl = new URL(window.location);
          newUrl.searchParams.set('id', location.id);
          window.history.pushState({}, '', newUrl);
        });

        // Clear URL when popup is closed
        marker.on('popupclose', function() {
          const currentUrl = new URL(window.location);
          // Only clear if the ID in the URL matches this marker (to avoid race conditions)
          if (currentUrl.searchParams.get('id') === location.id) {
            currentUrl.searchParams.delete('id');
            window.history.pushState({}, '', currentUrl);
          }
        });
      } else {
        DEBUG && console.error(`addMarkers: Spot missing ID! Category: "${locationType}", Name: "${location.name || 'Unnamed'}", Coordinates: ${location.latitude},${location.longitude}`);
      }
    } // if
  } // for (individual places)
  return count;
}

function getIcon(markerClasses, markerPath, markerSize, markerAnchor) {
  return L.icon({
    className: markerClasses,
    iconUrl: markerPath,
    iconSize: markerSize,
    iconAnchor: markerAnchor
  })
}

function parseLocations(locations) {
  DEBUG && console.log("parseLocations: Starting parsing of all categories...");
  for (let locationType in locations) {
    const config = SPOT_CONFIG[locationType] || SPOT_CONFIG.default || { label: 'Default', icon: '/assets/images/map-icons/marker-icon-campspot.svg', size: [12, 12], anchor: [6, 11] };
    const locationTypeHuman = config.label;
    const legendMarker = config.icon;
    let legendClass = "map-legend-item js-map-legend-item " + locationType;
    let markerClasses = svgBaseClasses + locationType;

    if (config.fade) {
      markerClasses += " marker-icon--fade";
    }

    // Initialize the layer group for this category
    if (USE_CLUSTERS && typeof L.markerClusterGroup === 'function') {
      CATEGORY_LAYERS[locationType] = L.markerClusterGroup();
    } else {
      CATEGORY_LAYERS[locationType] = L.layerGroup();
    }

    const svgIcon = getIcon(markerClasses, legendMarker, config.size, config.anchor);

    let count = 0; // For counting locations by type.
    count = addMarkers(count, locations, locationType, svgIcon, locationTypeHuman);

    // If not hidden by default, add the layer to the map
    if (!config.hideByDefault) {
      map.addLayer(CATEGORY_LAYERS[locationType]);
    }

    legendHtml += createLegendItemHtml(locationType, config, count);
  }

  // Use the class hide to hide by default
  legendHtml += `<li class="map-legend-item js-map-legend-item current-location hide">
    <div class="map-legend-symbol"><img src="${markerPathCurrent}" alt=""></div>
    <div class="map-legend-label">Current location<br>(double-check accuracy)</div></li>`;
}




function toggleLegendAndMarkers() {
  DEBUG && console.log("toggleLegendAndMarkers: Setting up click listeners...");
  const legendToggle = document.querySelectorAll('.js-map-legend-item')
  legendToggle.forEach(item => {
    item.addEventListener('click', function() {
      const category = Array.from(this.classList).find(cls =>
        cls !== 'map-legend-item' &&
        cls !== 'js-map-legend-item' &&
        cls !== 'hide'
      );

      DEBUG && console.log(`Legend Toggle: ${category} clicked.`);
      this.classList.toggle('hide');

      // If we are hiding a category, remove the ID from the URL if it belongs to this category
      if (this.classList.contains('hide')) {
        const currentId = new URLSearchParams(window.location.search).get('id');
        if (currentId && ALL_MARKERS[currentId] && ALL_MARKERS[currentId].category === category) {
          const newUrl = new URL(window.location);
          newUrl.searchParams.delete('id');
          window.history.pushState({}, '', newUrl);
        }
      }

      if (category === 'current-location') {
        if (markerHere) {
          const action = map.hasLayer(markerHere) ? "Removing" : "Adding";
          DEBUG && console.log(`${action} current-location marker.`);
          if (map.hasLayer(markerHere)) map.removeLayer(markerHere);
          else map.addLayer(markerHere);
        }
        return;
      }

      const layer = CATEGORY_LAYERS[category];
      if (layer) {
        const action = map.hasLayer(layer) ? "Removing" : "Adding";
        DEBUG && console.log(`${action} layer for category: ${category}`);
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        } else {
          map.addLayer(layer);
        }
      }
    });
  });
}

/**
 * Handles deep linking based on the ?id= parameter in the URL.
 */
function handleDeepLink() {
  const targetId = urlParams.get('id');
  if (!targetId || !ALL_MARKERS[targetId]) return;

  const data = ALL_MARKERS[targetId];
  const marker = data.marker;
  const category = data.category;

  DEBUG && console.log(`handleDeepLink: Deep link found for ID: ${targetId}`);

  // 1. Ensure category is visible
  const layer = CATEGORY_LAYERS[category];
  if (!map.hasLayer(layer)) {
    DEBUG && console.log(`handleDeepLink: Enabling hidden category "${category}" for deep link.`);
    map.addLayer(layer);

    // Also update legend UI
    const legendItem = document.querySelector(`.js-map-legend-item.${category}`);
    if (legendItem) legendItem.classList.remove('hide');
  }

  // 2. Fly to marker
  map.flyTo(marker.getLatLng(), 10, {
    duration: 2,        // 2 seconds is the "sweet spot" for Safari
    easeLinearity: 0.25 // Standard easing feel
  });

  // 3. Open popup (handle clusters if enabled)
  if (USE_CLUSTERS && typeof layer.zoomToShowLayer === 'function') {
    layer.zoomToShowLayer(marker, () => {
      marker.openPopup();
    });
  } else {
    marker.openPopup();
  }
}

function initMap(locations) {
  // DEBUG && console.log(locations)

  // This is the code to start the map at a specific location.
  // var map = L.map('map').setView([38.973268454455706, -105.03998309979006], 14);

  const basemaps = {
    // Standard OpenStreetMap: Reliable, all-purpose map with street-level detail.
    "Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors. This map is personal and contains places where I have been with my personal impression.'
    }),

    // Topographic Map: Best for outdoor activities. Shows contour lines, elevation, and trails.
    "OpenTopoMap": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17, // Note: Limited zoom depth compared to street maps.
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }),

    // Esri World Imagery: High-resolution satellite photos. (Use the 'Labels' overlay to see road names).
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),

    // CartoDB Positron: A clean, light-colored map designed to make your markers stand out.
    "Minimal (Light)": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }),

    // CartoDB Dark Matter: A dark-themed version for better visibility in markers or low light.
    "Minimal (Dark)": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    })
  };

  const overlays = {
    // Real-time NEXRAD precipitation radar (U.S. Only).
    "Weather Radar": L.tileLayer.wms('http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {
      layers: 'nexrad-n0r-900913',
      format: 'image/png',
      transparent: true,
      attribution: "Weather data &copy; IEM Nexrad",
      opacity: 0.3, // Visible over contrasty maps but still allows seeing map details.
      maxZoom: 20
    }),

    // Essential for use with Satellite view; adds city names and major highways.
    "Labels": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Labels &copy; Esri',
      opacity: 0.7,
      maxZoom: 20
    })
  };

  // CUSTOMIZE
  // const world_borders_inside = L.geoJson.ajax("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json", {
  //   style: {
  //     //crs: crs,
  //     fillOpacity: 1,
  //     fillColor: "rgb(10, 118, 50)",
  //     fillColor: "#aaa",
  //     stroke: false,
  //     color: "rgb(130, 218, 210)",
  //     color: "#ddd",
  //     opacity: 1
  //   }
  // }).addTo(map);

  L.control.scale().addTo(map);
  L.control.layers(basemaps, overlays).addTo(map);

  // Set defaults
  basemaps.Default.addTo(map);
  overlays["Weather Radar"].addTo(map);

  // LEGEND AND MARKERS
  parseLocations(locations)
  document.querySelector('#map-legend-items').innerHTML = legendHtml
  toggleLegendAndMarkers()
  // END LEGEND AND MARKERS

  // Process deep links after markers are initialized
  handleDeepLink();



  // CURRENT LOCATION
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(position) {
    DEBUG && console.log("Current location: success() entered.")

    const crd = position.coords;
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    // myresult.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    // makeMyMap(latitude, longitude);
    // DEBUG && console.log("latitude: "+latitude+" and longitude: "+longitude)

    let googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + latitude + "%2C" + longitude
    let popupMessage = `<a href="${googleMapsUrl}" target="_blank">You are here.</a>`

    markerHere = new L.marker([latitude, longitude], {icon: svgCurrent})
      .bindPopup(popupMessage, { offset: L.point(0,-14) })
      .addTo(map);
    map.locate({
      setView: true, // true means the map zooms to current location. Does not always work on desktop.
      maxZoom: 8
    })

    DEBUG && console.log("Current location: success() done.")
  }
  function error(err) {
    DEBUG && console.warn(`ERROR(${err.code}): ${err.message}`);
    DEBUG && console.log("Current location: error() entered.")
    DEBUG && console.log("Current location: unable to retrieve your location")
  }

  let located = false // true means the user already triggered location detection.
  document.querySelector('.js-map-legend-item.current-location').addEventListener('click', function(){
    DEBUG && console.log("Current location: clicked to request location.")
    if (located == false) {
      DEBUG && console.log(`Current location: ${located}`)
      // navigator.geolocation.getCurrentPosition(success, error);
      navigator.geolocation.getCurrentPosition(success, error, options);

      located = true
      DEBUG && console.log(`Current location: ${located}`)
      DEBUG && console.log("Current location: requested location.")
    }
  })
  // END CURRENT LOCATION




} // function initMap(locations)


/**
 * Fetches JSON data from a file and returns a promise.
 */
function fetchJSON(file) {
  DEBUG && console.log(`fetchJSON: Fetching ${file}...`);
  return fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      DEBUG && console.log(`fetchJSON: Successfully loaded ${file}`);
      return data;
    })
    .catch(error => {
      DEBUG && console.error(`fetchJSON: Error loading ${file}:`, error);
      throw error;
    });
}

const DEBUG = false
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

/**
 * Dynamically loads clustering assets and returns a promise that resolves when the script is ready.
 */
function loadClusterAssets() {
  return new Promise((resolve, reject) => {
    if (!USE_CLUSTERS) return resolve();
    if (typeof L.markerClusterGroup === 'function') return resolve();

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
    clusterJs.onload = resolve;
    clusterJs.onerror = reject;
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
  smoothSensitivity: 8,   // zoom speed. default is 1
  // END https://github.com/mutsuyuki/Leaflet.SmoothWheelZoom
}).fitBounds([
  [54.14584949174648, -128.75881463815347],
  [17.055714221336178, -59.9846634648619]
])
// Request permission to get location.
// .locate({
//   setView: false, // true means the map zooms to current location.
//   maxZoom: 8
// })



function addMarkers(count, locations, locationType, svgIcon, locationTypeHuman) {
  // LOOP THROUGH LOCATIONS AND ADD THEM TO THE MAP.
  for (let locationItem in locations[locationType]) {
    // DEBUG && console.log(locationType)
    // DEBUG && console.log(locationItem)

    let location = locations[locationType][locationItem]

    // Check if location should be on the map and obviously, make sure there are coordinates.
    if (location.visible !== 0 && location.latitude && location.longitude) {

      count++

      let locationName = "",
          locationNotes = "",
          locationUrl = "",
          locationWeather = ""

      // Create URL to Google Maps from coordinates.
      let googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + location.latitude + "%2C" + location.longitude

      // If there is no name, create it from coordinates.
      if (location.name == undefined) locationName = location.latitude + ", " + location.longitude
      else locationName = location.name
      locationName = '<a class="location-tooltip-name" href="' + googleMapsUrl + '" target="_blank">' + locationName + '</a>'

      // Check other content
      if (location.notes !== undefined && location.notes !== "") locationNotes = '<div class="location-tooltip-notes">' + location.notes + '</div>'
      if (location.url !== undefined && location.url !== "") {
        if (Array.isArray(location.url)) {
          for (let i = 0; i < location.url.length; i++) {
            if (locationUrl !== "") locationUrl += ' ';
            locationUrl += '<a class="location-tooltip-action" target="_blank" href="' + location.url[i] + '">' + location.url[i] + '</a>'
          }
        } else {
          locationUrl = '<a class="location-tooltip-action" target="_blank" href="' + location.url + '">' + location.url + '</a>'
        }
      }
      if (location.weather !== undefined && location.weather !== "") locationWeather = '<a class="location-tooltip-action" target="_blank" href="https://www.accuweather.com/en/search-locations?query=' + location.weather + '">Accuweather</a>'
      else locationWeather = '<a class="location-tooltip-action" target="_blank" href="https://www.accuweather.com/en/search-locations?query=' + location.latitude + '%2C' + location.longitude + '">Accuweather</a>'

      visualCrossingWeather = '<a class="location-tooltip-action" target="_blank" href="https://www.visualcrossing.com/weather-forecast/' + location.latitude + '%2C' + location.longitude + '">Visual crossing weather forecast</a>'


      // Build the content of tooltips.
      let locationContent = '<div class="location-tooltip-content">' + locationName + locationNotes + locationUrl + visualCrossingWeather + locationWeather + '</div>'

      // Place markers on the map.
      const marker = new L.marker([location.latitude, location.longitude], {icon: svgIcon})
        .bindPopup(locationContent, { offset: L.point(0,-1) })

      if (USE_CLUSTERS) {
        markerClusterGroup.addLayer(marker);
      } else {
        marker.addTo(map);
      }
    } // if
  } // for (individual places)

  // End legend item with the label.
  // legendHtml += '" alt=""></div><div class="map-legend-label">'+ locationTypeHuman +' ('+ locations[locationType].length +')</div></li>'
  legendHtml += '" alt=""></div><div class="map-legend-label '+ locations[locationType].length +'">'+ locationTypeHuman +' ('+ count +')</div></li>'
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
  for (let locationType in locations) {
    const config = SPOT_CONFIG[locationType] || SPOT_CONFIG.default;
    const locationTypeHuman = config.label;
    const legendMarker = config.icon;
    let legendClass = "map-legend-item js-map-legend-item " + locationType;
    let markerClasses = svgBaseClasses + locationType;

    if (config.fade) {
      markerClasses += " marker-icon--fade";
    }

    if (config.hideByDefault) {
      legendClass += " hide";
      markerClasses += " hide";
    }

    const svgIcon = getIcon(markerClasses, legendMarker, config.size, config.anchor);

    legendHtml += `<li class="${legendClass}"><div class="map-legend-symbol"><img src="${legendMarker}" alt=""></div>`;

    let count = 0; // For counting locations by type.
    addMarkers(count, locations, locationType, svgIcon, locationTypeHuman);
  }

  // Use the class hide to hide by default
  legendHtml += `<li class="map-legend-item js-map-legend-item current-location hide">
    <div class="map-legend-symbol"><img src="${markerPathCurrent}" alt=""></div>
    <div class="map-legend-label">Current location<br>(double-check accuracy)</div></li>`;
}




function toggleLegendAndMarkers() {
  const legendToggle = document.querySelectorAll('.js-map-legend-item')
  legendToggle.forEach(item => {
    item.addEventListener('click', function() {
      this.classList.toggle('hide');

      // Get the specific category from class list (excluding base classes)
      const category = Array.from(this.classList).find(cls =>
        cls !== 'map-legend-item' &&
        cls !== 'js-map-legend-item' &&
        cls !== 'hide'
      );

      if (category) {
        const markers = document.querySelectorAll(`.js-marker-icon.${category}`);
        markers.forEach(marker => marker.classList.toggle('hide'));
      }
    });
  });
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


  if (USE_CLUSTERS && typeof L.markerClusterGroup === 'function') {
    markerClusterGroup = L.markerClusterGroup();
  }

  // console.log(locations.campspots.length)
  // if (typeof locations === 'object' && locations !== null) {
  //   console.log("It's an object")
  // }



  // LEGEND AND MARKERS

  // Beginning legend item HTML.
  legendHtml += ''

  parseLocations(locations)

  document.querySelector('#map-legend-items').innerHTML = legendHtml

  toggleLegendAndMarkers()

  // END LEGEND AND MARKERS



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

    if (USE_CLUSTERS) {
      markerClusterGroup.addLayer(markerHere);
    } else {
      markerHere.addTo(map);
    }
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



  if (USE_CLUSTERS && markerClusterGroup) {
    map.addLayer(markerClusterGroup);
  }

} // function initMap(locations)


// https://stackoverflow.com/a/34579496/2716287
function loadJSON(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}
// END https://stackoverflow.com/a/34579496/2716287

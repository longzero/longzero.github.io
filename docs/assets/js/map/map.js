DEBUG = true


// TOGGLE LEGEND
// document.querySelector('.js-legend-toggle').addEventListener('click', function() {
//   this.parentNode.classList.toggle('minimize')
// })
let legendClass = 'map-legend-item'
let legendHtml = '' // Create each item of legend, in HTML
let legendMarker = ''
let locationTypeHuman = '' // Used for labelling the legend, so instead of just “Water”, it will be “Place to get water”

let map = L.map('map', {
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



// MAP MARKER ICONS
const markerPathBLM = '/assets/images/map-icons/marker-icon-blm.svg'
const markerPathPotential = '/assets/images/map-icons/marker-icon-potential.svg'
const markerPathCampspot = '/assets/images/map-icons/marker-icon-campspot.svg'
const markerPathCurrent = '/assets/images/map-icons/marker-icon-current.svg'
const markerPathPlace = '/assets/images/map-icons/marker-icon-place.svg'
const markerPathWater = '/assets/images/map-icons/marker-icon-water.svg'


// You have tried using SVG, but there is an issue with zooming:
// When zooming, the marker shifts.
const svgDefault = L.icon({
  iconUrl: markerPathCampspot,
  className: "marker-icon js-marker-icon campspot default",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

let svgIcon = L.icon({
  // Green: #3AAD64
  iconUrl: markerPathCampspot,
  className: "marker-icon js-marker-icon",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgBLM = L.icon({
  iconUrl: markerPathBLM,
  // Use the class hide to hide by default (use that string to search elsewhere it is used)
  className: "marker-icon marker-icon--fade js-marker-icon blm hide",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

let svgCurrent = L.icon({
  iconUrl: markerPathCurrent,
  className: "marker-icon js-marker-icon current-location",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgPlace = L.icon({
  iconUrl: markerPathPlace,
  className: "marker-icon js-marker-icon places",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgPotential = L.icon({
  iconUrl: markerPathPotential,
  // Use the class hide to hide by default (use that string to search elsewhere it is used)
  className: "marker-icon marker-icon--fade js-marker-icon potential-spots hide",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgShower = L.icon({
  iconUrl: markerPathWater,
  className: "marker-icon js-marker-icon shower",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgSpots = L.icon({
  iconUrl: markerPathCampspot,
  className: "marker-icon js-marker-icon spots",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgStarbucks = L.icon({
  iconUrl: markerPathPlace,
  className: "marker-icon js-marker-icon starbucks",
  iconSize: [24,32],
  iconAnchor: [12,31]
});

const svgWater = L.icon({
  iconUrl: markerPathWater,
  className: "marker-icon js-marker-icon water",
  iconSize: [24,32],
  iconAnchor: [12,31]
});
// END MAP MARKER ICONS



function addMarkers(count, locations, locationType) {
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
          locationUrl = ""

      // Create URL to Google Maps from coordinates.
      let googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + location.latitude + "%2C" + location.longitude

      // If there is no name, create it from coordinates.
      if (location.name == undefined) locationName = location.latitude + ", " + location.longitude
      else locationName = location.name
      locationName = '<a class="location-tooltip-name" href="' + googleMapsUrl + '" target="_blank">' + locationName + '</a>'

      // Check other content
      if (location.notes !== undefined && location.notes !== "") locationNotes = '<div class="location-tooltip-notes">' + location.notes + '</div>'
      if (location.url !== undefined && location.url !== "") locationUrl = '<a class="location-tooltip-action" target="_blank" href="' + location.url + '">' + location.url + '</a>'

      // Build the content of tooltips.
      let locationContent = '<div class="location-tooltip-content">' + locationName + locationNotes + locationUrl + '</div>'

      // Place markers on the map.
      marker = new L.marker([location.latitude, location.longitude], {icon: svgIcon})
        .bindPopup(locationContent, { offset: L.point(0,-14) })
        // Comment this line if using clusters
        .addTo(map);

      // Uncomment this line if using clusters
      // markers.addLayer(marker);
    } // if
  } // for (individual places)

  // End legend item with the label.
  // legendHtml += '" alt=""></div><div class="map-legend-label">'+ locationTypeHuman +' ('+ locations[locationType].length +')</div></li>'
  legendHtml += '" alt=""></div><div class="map-legend-label '+ locations[locationType].length +'">'+ locationTypeHuman +' ('+ count +')</div></li>'
}

function parseLocations(locations) {
  for (let locationType in locations) {
    // Change marker icon depending on type of location.
    // Set the marker path for the legend item icon.
    switch(locationType) {
      case "blm":
        // Use the class hide to hide by default (use that string to search elsewhere it is used)
        legendClass = 'map-legend-item js-map-legend-item blm hide ' + locationType
        // legendHtml += markerPathBLM
        legendMarker = markerPathBLM
        locationTypeHuman = 'Some BLM'
        svgIcon = svgBLM
        break
      case "places":
        legendClass = 'map-legend-item js-map-legend-item ' + locationType
        // legendHtml += markerPathPlace
        legendMarker = markerPathPlace
        locationTypeHuman = 'Random place'
        svgIcon = svgPlace
        break
      case "potential-spots":
        // Use the class hide to hide by default (use that string to search elsewhere it is used)
        legendClass = 'map-legend-item js-map-legend-item hide ' + locationType
        legendMarker = markerPathPotential
        locationTypeHuman = 'Potential spots'
        svgIcon = svgPotential
        break
      case "spots":
        legendClass = 'map-legend-item js-map-legend-item ' + locationType
        // legendHtml += markerPathCampspot
        legendMarker = markerPathCampspot
        locationTypeHuman = 'Chilling, sleeping and/or working spot'
        svgIcon = svgSpots
        break
      case "starbucks":
        legendClass = 'map-legend-item js-map-legend-item ' + locationType
        // legendHtml += markerPathPlace
        legendMarker = markerPathPlace
        locationTypeHuman = 'Starbucks'
        svgIcon = svgStarbucks
        break
      case "shower":
        legendClass = 'map-legend-item js-map-legend-item ' + locationType
        // legendHtml += markerPathWater
        legendMarker = markerPathWater
        locationTypeHuman = 'Shower spot'
        svgIcon = svgShower
        break
      case "water":
        legendClass = 'map-legend-item js-map-legend-item ' + locationType
        // legendHtml += markerPathWater
        legendMarker = markerPathWater
        locationTypeHuman = 'Water for cleaning or drinking'
        svgIcon = svgWater
        break
      default:
        legendClass = 'map-legend-item js-map-legend-item ' + locationType
        // legendHtml += markerPathCampspot
        legendMarker = markerPathCampspot
        svgIcon = svgDefault
    } // switch


    legendHtml += '<li class="'+ legendClass +'"><div class="map-legend-symbol"><img src="' + legendMarker

    let count = 0 // For counting locations by type.
    addMarkers(count, locations, locationType)
  } // for (first level in json)
}

function toggleLegendAndMarkers() {
  // TOGGLE LEGEND AND MARKERS
  const legendToggle = document.querySelectorAll('.js-map-legend-item')
  for (let i = 0; i < legendToggle.length; i++) {
    legendToggle[i].addEventListener('click', function() {
      this.classList.toggle('hide')
      let markers
      if (this.classList.contains('current-location')) {
        markers = document.querySelectorAll('.js-marker-icon.current-location')
      }
      else if (this.classList.contains('spots')) {
        markers = document.querySelectorAll('.js-marker-icon.spots')
      }
      else if (this.classList.contains('blm')) {
        markers = document.querySelectorAll('.js-marker-icon.blm')
      }
      else if (this.classList.contains('places')) {
        markers = document.querySelectorAll('.js-marker-icon.places')
      }
      else if (this.classList.contains('potential-spots')) {
        markers = document.querySelectorAll('.js-marker-icon.potential-spots')
      }
      else if (this.classList.contains('shower')) {
        markers = document.querySelectorAll('.js-marker-icon.shower')
      }
      else if (this.classList.contains('starbucks')) {
        markers = document.querySelectorAll('.js-marker-icon.starbucks')
      }
      else if (this.classList.contains('water')) {
        markers = document.querySelectorAll('.js-marker-icon.water')
      }
      for (let j = 0; j < markers.length; j++) {
        markers[j].classList.toggle('hide')
      }
    })
  }
}

function initMap(locations) {
  // DEBUG && console.log(locations)

  // This is the code to start the map at a specific location.
  // var map = L.map('map').setView([38.973268454455706, -105.03998309979006], 14);

  const basemaps = {
    // Default: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
    Default: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    Esri_WorldImagery: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {layers: 'TOPO-WMS'}),
    // OpenFireMap: L.tileLayer('http://openfiremap.org/hytiles/{z}/{x}/{y}.png', {
    //   maxZoom: 19,
    //   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    // }),
    // OpenWeatherMap_Clouds: L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid={apiKey}', {
    //   maxZoom: 19,
    //   attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
    //   apiKey: '<insert your api key here>',
    //   opacity: 0.5
    // }),
    // Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {layers: 'OSM-Overlay-WMS'}),
    Weather: L.tileLayer.wms('http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {layers: 'nexrad-n0r-900913',
      format: 'image/png',
      transparent: true,
      // attribution: "<span>Weather data © 2012 IEM Nexrad</span>",
      opacity: .25
    }),
  };

  // var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  //   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  // });
  // var OpenFireMap = L.tileLayer('http://openfiremap.org/hytiles/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  // });
  // var OpenWeatherMap_Clouds = L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid={apiKey}', {
  //   maxZoom: 19,
  //   attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
  //   apiKey: '<insert your api key here>',
  //   opacity: 0.5
  // });



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
  mapLink = '<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>';
  L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'This map is personal and contains places where I have been with my personal impression. That’s all.',
      attributionControl: false,
      maxZoom: 20
    }).addTo(map);
  L.control.layers(basemaps).addTo(map);
  // basemaps.Default.addTo(map);
  // basemaps.Topography.addTo(map);
  basemaps.Weather.addTo(map);

  // Uncomment this code if using clusters
  // let markers = L.markerClusterGroup({
  //   // options
  // });

  // console.log(locations.campspots.length)
  // if (typeof locations === 'object' && locations !== null) {
  //   console.log("It's an object")
  // }




  // LEGEND AND MARKERS

  // Beginning legend item HTML with current location.
  // Use the class hide to hide by default (use that string to search elsewhere it is used)
  legendHtml += '<li class="'+ legendClass +' js-map-legend-item current-location hide">'
  + '<div class="map-legend-symbol"><img src="' + markerPathCurrent + '" alt=""></div>'
  + '<div class="map-legend-label">Current location</div></li>'

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
    DEBUG && console.log(`Latitude : ${crd.latitude}`);
    DEBUG && console.log(`Longitude: ${crd.longitude}`);
    DEBUG && console.log(`More or less ${crd.accuracy} meters.`);

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    // myresult.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    // makeMyMap(latitude, longitude);
    // DEBUG && console.log("latitude: "+latitude+" and longitude: "+longitude)

    markerHere = new L.marker([latitude, longitude], {icon: svgCurrent})
      .bindPopup("You are here.", { offset: L.point(0,-14) })
      // Comment this line if using clusters
      .addTo(map);
    map.locate({
      setView: true, // true means the map zooms to current location.
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



  // Uncomment this line if using clusters
  // map.addLayer(markers);

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

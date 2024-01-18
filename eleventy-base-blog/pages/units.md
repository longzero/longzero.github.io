---
layout: layouts/page.njk
# description: Time
permalink: /units/
title: Units
# eleventyNavigation:
#   key: Time
#   order: 3
---

- Make unit conversion tool USA vs the rest of the world
- Calculate gas cost per km
- Gas
- Length and distance


<section class="unit-conversion distance-section">
  <div class="unit-group">
    <input class="js-distance" id="kilometers" name="kilometers" type="number">
    <span>kilometers</span>
  </div>
  <div class="unit-group">
    <input class="js-distance" id="miles" name="miles" type="number">
    <span>miles</span>
  </div>
</section>

<section class="unit-conversion liquid-volume-section">
  <div class="unit-group">
    <input class="js-liquid-volume" id="liters" name="liters" type="number">
    <span>liters</span>
  </div>
  <div class="unit-group">
    <input class="js-liquid-volume" id="us-gallons" name="us-gallons" type="number">
    <span>US liquid gallons</span>
  </div>
</section>

<section class="unit-conversion temperature-section">
  <div class="unit-group">
    <input class="js-temperature" id="celcius" name="celcius" type="number">
    <span>ºC</span>
  </div>
  <div class="unit-group">
    <input class="js-temperature" id="fahrenheit" name="fahrenheit" type="number">
    <span>ºF</span>
  </div>
</section>

<script>
  function getRound(num, decimals = 2) {
    // Without EPSILON, there are bad conversions, like 1.005 get converted to 1 instead of 1.01.
    return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }


  function getUsGallonsFromLiters(liters) {
    return liters / 3.785411784;
  }
  function getLitersFromUsGallons(gallons) {
    return gallons * 3.785411784;
  }
  const liquidVolumeInput = document.querySelectorAll('.js-liquid-volume')
  liquidVolumeInput.forEach((liquidVolume) => {
    liquidVolume.addEventListener('change', function(){
      if (this.getAttribute('id') == 'liters') {
        document.getElementById('us-gallons').value = getRound(getUsGallonsFromLiters(this.value))
      }
      else if (this.getAttribute('id') == 'us-gallons') {
        document.getElementById('liters').value = getRound(getLitersFromUsGallons(this.value))
      }
    })
  })



  function getMilesFromKilometers(kilometers) {
    return kilometers * 0.62137119;
  }
  function getKilometersFromMiles(miles) {
    return miles * 1.609344;
  }
  const distanceInput = document.querySelectorAll('.js-distance')
  distanceInput.forEach((distance) => {
    distance.addEventListener('change', function(){
      if (this.getAttribute('id') == 'kilometers') {
        document.getElementById('miles').value = getRound(getMilesFromKilometers(this.value))
      }
      else if (this.getAttribute('id') == 'miles') {
        document.getElementById('kilometers').value = getRound(getKilometersFromMiles(this.value))
      }
    })
  })



  function getCelciusFromFahrenheit(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
  }
  function getFahrenheitFromCelcius(celcius) {
    return celcius * 9/5 + 32;
  }
  const temperatureInput = document.querySelectorAll('.js-temperature')
  temperatureInput.forEach((temperature) => {
    temperature.addEventListener('change', function(){
      if (this.getAttribute('id') == 'celcius') {
        document.getElementById('fahrenheit').value = getRound(getFahrenheitFromCelcius(this.value))
      }
      else if (this.getAttribute('id') == 'fahrenheit') {
        document.getElementById('celcius').value = getRound(getCelciusFromFahrenheit(this.value))
      }
    })
  })
</script>

---
layout: layouts/page.njk
# description: Time
permalink: /units/
title: Units
# eleventyNavigation:
#   key: Time
#   order: 3

exchange_rate: 1.38
---


Enter a number, then click anywhere.

<section class="unit-conversion distance-section">
  <div class="unit-group">
    <input class="js-distance" id="distance-input-1" name="distance-input-1" type="number">
    <select class="js-distance-unit-1">
      <!-- <option>centimeters</option>
      <option>feet</option>
      <option>inches</option> -->
      <option selected>kilometers</option>
      <!-- <option>miles</option> -->
    </select>
  </div>
  <div class="unit-group">
    <input class="js-distance" id="distance-input-2" name="distance-input-2" type="number">
    <select class="js-distance-unit-2">
      <!-- <option>centimeters</option>
      <option>feet</option>
      <option>inches</option>
      <option>kilometers</option> -->
      <option selected>miles</option>
    </select>
  </div>
</section>

<section class="unit-conversion liquid-volume-section">
  <label class="unit-group">
    <input class="js-liquid-volume" id="liters" name="liters" type="number">
    <span>liters</span>
  </label>
  <label class="unit-group">
    <input class="js-liquid-volume" id="us-gallons" name="us-gallons" type="number">
    <span>US liquid gallons</span>
  </label>
</section>

<section class="unit-conversion exchange-rate-section">
  <label>Exchange rate (base is 1 USD)</label>
  <input class="js-exchange-rate" id="exchange-rate" name="exchange-rate" type="number" value="{{ exchange_rate }}">
</section>

<section class="unit-conversion currency-cad-usd-section">
  <label class="unit-group">
    <input class="js-currency" id="cad-currency" name="cad-currency" type="number">
    <span>CAD</span>
  </label>
  <label class="unit-group">
    <input class="js-currency" id="usd-currency" name="usd-currency" type="number">
    <span>USD</span>
  </label>
</section>

<section class="unit-conversion gas-cost-section">
  <label class="unit-group">
    <input class="js-gas-cost" id="cad-liter" name="cad-liter" type="number">
    <span>CAD / L</span>
  </label>
  <label class="unit-group">
    <input class="js-gas-cost" id="usd-gallon" name="usd-gallon" type="number">
    <span>USD / gallon</span>
  </label>
</section>

<section class="unit-conversion temperature-section">
  <label class="unit-group">
    <input class="js-temperature" id="celcius" name="celcius" type="number">
    <span>ºC</span>
  </label>
  <label class="unit-group">
    <input class="js-temperature" id="fahrenheit" name="fahrenheit" type="number">
    <span>ºF</span>
  </label>
</section>

<script>

  let unitValue1 = 0
  let unitValue2 = 0

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

  // let exchangeRate = 1.35 // in CAD = 1 USD
  let exchangeRate = getExchangeRate(document.getElementById('exchange-rate').value)
  function getExchangeRate() {
    return document.getElementById('exchange-rate').value
  }
  function getUsdFromCad(cad) {
    return usd = cad / getExchangeRate()
  }
  function getCadFromUsd(usd) {
    return cad = usd * getExchangeRate()
  }
  function getUsdPerGallonFromCadPerLiter(cad) {
    let usd = cad / getExchangeRate()
    return usd * 3.785411784; // 1 gallon = 3.785411784 liters
  }
  function getCadPerLiterFromUsdPerGallon(usd) {
    let cad = usd * getExchangeRate()
    return cad / 3.785411784; // 1 gallon = 3.785411784 liters
  }
  const currencyInput = document.querySelectorAll('.js-currency')
  currencyInput.forEach((currency) => {
    currency.addEventListener('change', function(){
      if (this.getAttribute('id') == 'cad-currency') {
        document.getElementById('usd-currency').value = getRound(getUsdFromCad(this.value))
      }
      else if (this.getAttribute('id') == 'usd-currency') {
        document.getElementById('cad-currency').value = getRound(getCadFromUsd(this.value))
      }
    })
  })
  const gasCostInput = document.querySelectorAll('.js-gas-cost')
  gasCostInput.forEach((gasCost) => {
    gasCost.addEventListener('change', function(){
      if (this.getAttribute('id') == 'cad-liter') {
        document.getElementById('usd-gallon').value = getRound(getUsdPerGallonFromCadPerLiter(this.value))
      }
      else if (this.getAttribute('id') == 'usd-gallon') {
        document.getElementById('cad-liter').value = getRound(getCadPerLiterFromUsdPerGallon(this.value))
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
      // unitValue1 = this.value
      // switch (this.nextElementSibling.value) {
      //   case 'centimeters':
      //     console.log('centimeters')
      //     break;
      //   case 'feet':
      //     console.log('feet')
      //     break;
      //   case 'inches':
      //     console.log('inches')
      //     break;
      //   case 'kilometers':
      //     console.log('kilometers')
      //     break;
      //   case 'miles':
      //     console.log('miles')
      //     break;
      // }
      if (this.getAttribute('id') == 'distance-input-1') {
        document.getElementById('distance-input-2').value = getRound(getMilesFromKilometers(this.value))
      }
      else if (this.getAttribute('id') == 'distance-input-2') {
        document.getElementById('distance-input-1').value = getRound(getKilometersFromMiles(this.value))
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

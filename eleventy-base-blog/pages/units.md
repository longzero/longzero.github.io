---
layout: layouts/page.njk
# description: Time
permalink: /units/
title: Units
# eleventyNavigation:
#   key: Time
#   order: 3

exchange_rate: 1.4
# winter 2025: 1.44
# 2025-12-24: 1.37
exchange_rate_mxn: 17.6
---


Enter a number, then click anywhere.

<section class="unit-conversion exchange-rate-section">
  <label class="unit-group">
    <span class="label">CAD / 1 USD</span>
    <input class="exchange-rate-field js-exchange-rate" id="exchange-rate" name="exchange-rate" type="number" value="{{ exchange_rate }}">
  </label>
  <label class="unit-group">
    <span class="label">MXN / 1 USD</span>
    <input class="exchange-rate-field js-exchange-rate-mxn" id="exchange-rate-mxn" name="exchange-rate-mxn" type="number" value="{{ exchange_rate_mxn }}">
  </label>
</section>

<section class="unit-conversion currency-section">
  <label class="unit-group">
    <input class="js-currency" id="cad-currency" name="cad-currency" type="number">
    <span>CAD</span>
  </label>
  <label class="unit-group">
    <input class="js-currency" id="usd-currency" name="usd-currency" type="number">
    <span>USD</span>
  </label>
  <label class="unit-group">
    <input class="js-currency" id="mxn-currency" name="mxn-currency" type="number">
    <span>MXN</span>
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
  <label class="unit-group">
    <input class="js-gas-cost" id="mxn-liter" name="mxn-liter" type="number">
    <span>MXN / L</span>
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
      let usdVal
      if (this.getAttribute('id') == 'cad-currency') {
        usdVal = getUsdFromCad(this.value)
      }
      else if (this.getAttribute('id') == 'usd-currency') {
        usdVal = this.value
      }
      else if (this.getAttribute('id') == 'mxn-currency') {
        usdVal = getUsdFromMxn(this.value)
      }

      if (this.getAttribute('id') !== 'cad-currency') document.getElementById('cad-currency').value = getRound(getCadFromUsd(usdVal))
      if (this.getAttribute('id') !== 'usd-currency') document.getElementById('usd-currency').value = getRound(usdVal)
      if (this.getAttribute('id') !== 'mxn-currency') document.getElementById('mxn-currency').value = getRound(getMxnFromUsd(usdVal))
    })
  })

  // MXN functions
  function getExchangeRateMxn() {
    return document.getElementById('exchange-rate-mxn').value
  }
  function getUsdFromMxn(mxn) {
    return mxn / getExchangeRateMxn()
  }
  function getMxnFromUsd(usd) {
    return usd * getExchangeRateMxn()
  }
  function getUsdPerGallonFromMxnPerLiter(mxn) {
    let usd = mxn / getExchangeRateMxn()
    return usd * 3.785411784; // 1 gallon = 3.785411784 liters
  }
  function getMxnPerLiterFromUsdPerGallon(usd) {
    let mxn = usd * getExchangeRateMxn()
    return mxn / 3.785411784; // 1 gallon = 3.785411784 liters
  }

  const gasCostInput = document.querySelectorAll('.js-gas-cost')
  gasCostInput.forEach((gasCost) => {
    gasCost.addEventListener('change', function(){
      let usdGal
      if (this.getAttribute('id') == 'cad-liter') {
        usdGal = getUsdPerGallonFromCadPerLiter(this.value)
      }
      else if (this.getAttribute('id') == 'usd-gallon') {
        usdGal = this.value
      }
      else if (this.getAttribute('id') == 'mxn-liter') {
        usdGal = getUsdPerGallonFromMxnPerLiter(this.value)
      }

      if (this.getAttribute('id') !== 'cad-liter') document.getElementById('cad-liter').value = getRound(getCadPerLiterFromUsdPerGallon(usdGal))
      if (this.getAttribute('id') !== 'usd-gallon') document.getElementById('usd-gallon').value = getRound(usdGal)
      if (this.getAttribute('id') !== 'mxn-liter') document.getElementById('mxn-liter').value = getRound(getMxnPerLiterFromUsdPerGallon(usdGal))
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

/* global L:false */

require('leaflet')
require('leaflet-polylineoffset')
require('leaflet-geowiki/viewer')

const FileControl = require('./FileControl')

window.onload = () => {
  var map = L.map('map').setView([ 0, 0 ], 3)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  new FileControl({
    onopen (name, contents) {
      geowiki.load({ name, contents }, (err, result) => {
        map.fitBounds(geowiki.getBounds())
        if (err) {
          console.error(err)
        }
      })
    }
  }).addTo(map)

  let geowiki = L.geowikiViewer({
  }).addTo(map)
}

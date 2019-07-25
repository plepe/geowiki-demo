/* global L:false */

require('leaflet')
require('leaflet-polylineoffset')
require('leaflet-geowiki/viewer')

const FileControl = require('./FileControl')

window.onload = () => {
  // Initialize map, show whole world
  var map = L.map('map').setView([ 0, 0 ], 3)

  // add the OpenStreetMap default background
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // initialize Geowiki Viewer
  let geowiki = L.geowikiViewer({
  }).addTo(map)

  // open a file and zoom to its contents
  geowiki.load('example.geojson', (err) => {
    if (err) {
      return console.error(err)
    }
    map.fitBounds(geowiki.getBounds())
  })

  // add an 'Open'-Button, to allow opening files from the users computer
  new FileControl({
    onopen (name, contents) {
      geowiki.load({ name, contents }, (err) => {
        if (err) {
          return console.error(err)
        }
        map.fitBounds(geowiki.getBounds())
      })
    }
  }).addTo(map)
}

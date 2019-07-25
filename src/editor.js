/* global L:false, Blob:false */

const { saveAs } = require('file-saver')

require('leaflet')
require('leaflet-polylineoffset')
require('leaflet-geowiki/editor')

const FileControl = require('./FileControl')

window.onload = () => {
  // Initialize map, show whole world
  var map = L.map('map').setView([ 0, 0 ], 3)

  // add the OpenStreetMap default background
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // initialize Geowiki Editor
  let geowiki = L.geowikiEditor({
    sidebar: 'sidebar'
  }).addTo(map)

  // add an 'Open'-Button to allow opening files from the users computer
  // and a 'Close'-Button to allow saving modified files
  new FileControl({
    onopen (name, contents) {
      geowiki.load({ name, contents }, (err, result) => {
        if (err) {
          return console.error(err)
        }
        map.fitBounds(geowiki.getBounds())
      })
    },
    onsave () {
      let files = geowiki.saveAll()
      files.forEach(filedata => {
        let contents = filedata.contents

        let blob = new Blob([ contents ], {
          type: 'application/vnd.geo+json;charset=utf-8'
        })

        saveAs(blob, filedata.name)
      })
    }
  }).addTo(map)
}

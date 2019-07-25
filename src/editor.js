/* global L:false */

const { saveAs } = require('file-saver')

require('leaflet')
require('leaflet-polylineoffset')
require('leaflet-geowiki/editor')

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

  let geowiki = L.geowikiEditor({
    sidebar: 'sidebar'
  }).addTo(map)
}

/* global L:false, FileReader:false */

const { saveAs } = require('file-saver')

require('leaflet')
require('leaflet-geowiki/editor')

let FileControl = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd (map) {
    let dom = document.createElement('div')
    dom.className = 'leaflet-bar'
    dom.innerHTML = '<a><label style="width: 100%; height: 100%; display: inline-block;"><input type="file" multiple="multiple" id="openAction" style="position: fixed; top: -1000px;"><i class="fas fa-folder-open"></i></label></a>' +
      '<a id="downloadAction"><i class="fas fa-download"></i></a>'
    dom.querySelector('#openAction').onchange = e => this.readFile(e)
    dom.querySelector('#downloadAction').onclick = e => this.options.onsave(e)
    return dom
  },
  // adapted from https://stackoverflow.com/a/26298948
  readFile (e) {
    Array.from(e.target.files).forEach(file => {
      var reader = new FileReader()
      reader.onload = (e) => {
        var contents = e.target.result
        this.options.onopen(file.name, contents)
      }
      reader.readAsText(file)
    })
  }
})

window.onload = () => {
  var map = L.map('map').setView([ 0, 0 ], 3)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  new FileControl({
    onopen (filename, contents) {
      geowiki.load(filename, contents, (err, result) => {
        map.fitBounds(geowiki.getBounds())
        if (err) {
          console.error(err)
        }
      })
    },
    onsave () {
      let files = geowiki.save()
      files.forEach(filedata => {
        let contents = filedata.contents

        let blob = new Blob([ contents ], {
          type: 'application/vnd.geo+json;charset=utf-8'
        })

        saveAs(blob, filedata.filename)
      })
    }
  }).addTo(map)

  let geowiki = L.geowikiEditor({
    sidebar: 'sidebar'
  }).addTo(map)
}

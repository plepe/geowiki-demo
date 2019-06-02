/* global L:false, FileReader:false */

require('leaflet')
require('leaflet-geowiki/editor')
require('leaflet-toolbar')

let OpenControl = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd (map) {
    let dom = document.createElement('div')
    dom.className = 'leaflet-bar'
    dom.innerHTML = '<a><label style="width: 100%; height: 100%; display: inline-block;"><input type="file" id="openAction" style="position: fixed; top: -1000px;"><i class="fas fa-folder-open"></i></label></a>'
    dom.querySelector('#openAction').onchange = e => this.readFile(e)
    return dom
  },
  // adapted from https://stackoverflow.com/a/26298948
  readFile (e) {
    var file = e.target.files[0]
    if (!file) {
      return
    }
    var reader = new FileReader()
    reader.onload = (e) => {
      var contents = e.target.result
      this.options.onopen(contents)
    }
    reader.readAsText(file)
  }
})

window.onload = () => {
  var map = L.map('map').setView([ 48.2006, 16.3673 ], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  new OpenControl({
    onopen (contents) {
      let data = JSON.parse(contents)

      geowiki.load(data, err => {
        if (err) {
          console.error(err)
        }
      })
    }
  }).addTo(map)

  let geowiki = L.geowikiEditor({
    sidebar: 'sidebar'
  }).addTo(map)
}

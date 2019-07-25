/* global L:false, FileReader:false */

module.exports = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd (map) {
    let dom = document.createElement('div')
    dom.className = 'leaflet-bar'

    if (this.options.onopen) {
      let a = document.createElement('a')
      dom.appendChild(a)
      a.innerHTML = '<label style="width: 100%; height: 100%; display: inline-block;"><input type="file" multiple="multiple" id="openAction" style="position: fixed; top: -1000px;"><i class="fas fa-folder-open"></i></label>'
      a.querySelector('#openAction').onchange = e => this.readFile(e)
    }

    if (this.options.onsave) {
      let a = document.createElement('a')
      a.id = 'downloadAction'
      dom.appendChild(a)
      a.innerHTML = '<i class="fas fa-download"></i>'
      a.onclick = e => this.options.onsave(e)
    }

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

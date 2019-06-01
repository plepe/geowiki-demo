require('leaflet-geowiki/editor')

window.onload = () => {
  var map = L.map('map').setView([ 48.2006, 16.3673 ], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  let geowiki = L.geowikiEditor({
    sidebar: 'sidebar'
  }).addTo(map)
  geowiki.load('test.geojson', (err) => {
    if (err) {
      console.error(err)
    }
  })
}

// MAPA BASE
var osm = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var estiloPunto = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 8,
    fill: new ol.style.Fill({color: 'red'}),
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 2
    })
  })
});

// CAPA GEOSERVER
var capaCV = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    }),
    url: 'Perfil.json',
    strategy: ol.loadingstrategy.all
  }),
  style: estiloPunto
});

// MAPA
var map = new ol.Map({
  target: 'map',
  layers: [osm, capaCV],
  view: new ol.View({
    center: ol.proj.fromLonLat([-100.96, 22.16]),
    zoom: 10
  })
});

// CLICK
map.on('singleclick', function(evt) {
  map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    var props = feature.getProperties();
    alert(JSON.stringify(props, null, 2));
  });
});

// SIDEBAR
const btn = document.getElementById("toggleBtn");
const sidebar = document.getElementById("sidebar");

btn.onclick = () => {
  sidebar.classList.toggle("active");
};

// MOVER MAPA
function goToLocation(lon, lat) {
  map.getView().animate({
    center: ol.proj.fromLonLat([lon, lat]),
    zoom: 12,
    duration: 1000
  });
}

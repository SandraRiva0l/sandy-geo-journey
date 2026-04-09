// ========== INICIALIZACIÓN DEL MAPA ==========
var osm = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var estiloPunto = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({ color: '#dc3545' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    }),
    text: new ol.style.Text({
        text: '📍',
        scale: 1.2,
        offsetY: -15
    })
});

// Capa desde GeoServer (si está disponible)
var capaCV = new ol.layer.Vector({
    source: new ol.source.Vector({
        format: new ol.format.GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }),
        url: function() {
            return 'http://localhost:8081/geoserver/ows?' +
                'service=WFS&version=1.0.0&request=GetFeature&typeName=sandy_cvstorymap:perfil_personal&outputFormat=application/json';
        },
        strategy: ol.loadingstrategy.all
    }),
    style: estiloPunto
});

// Mapa
var map = new ol.Map({
    target: 'map',
    layers: [osm, capaCV],
    view: new ol.View({
        center: ol.proj.fromLonLat([-100.96, 22.16]),
        zoom: 6
    })
});

// ========== INTERACCIONES ==========

// Click en features del mapa
map.on('singleclick', function(evt) {
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        var props = feature.getProperties();
        mostrarInfoFeature(props);
    });
});

function mostrarInfoFeature(props) {
    // SweetAlert o modal de Bootstrap
    console.log(props);
    alert(JSON.stringify(props, null, 2));
    // Puedes implementar un modal de Bootstrap aquí
}

// Función para mover el mapa
function goToLocation(lon, lat, zoom = 12) {
    map.getView().animate({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: zoom,
        duration: 1000
    });
}

// ========== SIDEBAR TOGGLE ==========
const toggleBtn = document.getElementById("toggleBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

toggleBtn.onclick = () => {
    sidebar.classList.toggle("active");
};

if (closeSidebar) {
    closeSidebar.onclick = () => {
        sidebar.classList.remove("active");
    };
}

// Cerrar sidebar al hacer clic fuera (opcional)
document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Zoom peninsula de yucatan
function goToYucatanPeninsula() {
    // Opción 1: Centro + zoom (más compatible)
    var center = ol.proj.fromLonLat([-89.2, 20.1]);
    var zoom = 7.2;
    
    map.getView().animate({
        center: center,
        zoom: zoom,
        duration: 1000,
        easing: ol.easing.easeOut
    });
    
    // Feedback visual (sin SweetAlert si no está instalado)
    console.log('📍 Navegando a Península de Yucatán | Campeche, Yucatán, Quintana Roo');
    
    // Si tienes SweetAlert instalado, descomenta:
    /*
    Swal.fire({
        title: '🌎 Península de Yucatán',
        text: 'Explorando Campeche, Yucatán y Quintana Roo',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
    });
    */
  }

    // Función específica para la Zona Universitaria de la UASLP
function goToZonaUniversitaria() {
    // Coordenadas EXACTAS de la Zona Universitaria
    var lon = -101.014;  // Longitud corregida
    var lat = 22.1444;    // Latitud corregida
    
    // Zoom más alto para ver detalles del campus
    var zoomLevel = 16;    // 16 o 17 para ver edificios
    
    map.getView().animate({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: zoomLevel,
        duration: 1200,
        easing: ol.easing.easeOut
    });
    
    // Feedback visual opcional
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '🎓 Zona Universitaria - UASLP',
            html: `
                <div class="text-start">
                    <p><strong>📍 San Luis Potosí, SLP</strong></p>
                    <p>Facultad de Ciencias<br>Ingeniería Geoespacial</p>
                    <small class="text-muted">Zoom: Nivel ${zoomLevel}</small>
                </div>
            `,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            position: 'bottom'
        });
    }
  }


// ========== BARRA INFERIOR (PORTFOLIO) ==========
const portfolioBar = document.querySelector('.portfolio-bar');
const togglePortfolio = document.getElementById('togglePortfolio');
const portfolioContent = document.getElementById('portfolioContent');
let portfolioExpanded = false;

if (togglePortfolio) {
    togglePortfolio.onclick = function() {
        portfolioExpanded = !portfolioExpanded;
        
        if (portfolioExpanded) {
            portfolioBar.classList.add('expanded');
            portfolioContent.style.display = 'flex';
            togglePortfolio.innerHTML = '<i class="bi bi-chevron-up"></i>';
        } else {
            portfolioBar.classList.remove('expanded');
            portfolioContent.style.display = 'none';
            togglePortfolio.innerHTML = '<i class="bi bi-chevron-down"></i>';
        }
    };
}

// Función para mostrar proyecto seleccionado
function showProject(projectId) {
    console.log(`Proyecto ${projectId} seleccionado`);
    
    // Ejemplo: mover a coordenadas específicas según proyecto
    const projects = {
        1: { lon: -99.13, lat: 19.43, zoom: 13, title: "Mapa de Riesgos" },
        2: { lon: -100.96, lat: 22.16, zoom: 14, title: "Análisis de Redes" }
    };
    
    const proj = projects[projectId];
    if (proj) {
        goToLocation(proj.lon, proj.lat, proj.zoom);
        // Mostrar información adicional
        alert(`📁 Proyecto: ${proj.title}\n📍 Ubicación cargada en el mapa`);
    }
}

// ========== AGREGAR CAPA BASE ADICIONAL (OPCIONAL) ==========
// Satelital (si quieres cambiar)
function cambiarBaseMapa(tipo) {
    const nuevaCapa = new ol.layer.Tile({
        source: tipo === 'satelite' 
            ? new ol.source.XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' })
            : new ol.source.OSM()
    });
    
    map.getLayers().setAt(0, nuevaCapa);
}
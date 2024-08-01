// Inicialización de variables globales
let circle; // Variable global para almacenar el círculo
let markers = []; // Variable global para almacenar los marcadores de restaurantes

// Función para calcular la distancia entre dos puntos
function calculateDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
}

// Función para buscar restaurantes cercanos a una ubicación dada dentro de un radio especificado
function findNearbyRestaurants(lat, lng, radius) {
    const latIndex = Math.floor((lat - PUNO_CENTER.lat) / GRID_SIZE);
    const lngIndex = Math.floor((lng - PUNO_CENTER.lng) / GRID_SIZE);
    const nearbyRestaurants = [];

    // Calcular el rango de celdas a buscar basado en el radio
    const cellsToSearch = Math.ceil(radius / GRID_SIZE);

    for (let i = -cellsToSearch; i <= cellsToSearch; i++) {
        for (let j = -cellsToSearch; j <= cellsToSearch; j++) {
            const cellIndex = `${latIndex + i},${lngIndex + j}`;
            if (grid[cellIndex]) {
                nearbyRestaurants.push(...grid[cellIndex]);
            }
        }
    }

    // Filtrar los restaurantes que están dentro del radio especificado y calcular la distancia
    const filteredRestaurants = nearbyRestaurants
        .map(restaurant => {
            restaurant.distance = calculateDistance(lat, lng, restaurant.lat, restaurant.lng);
            return restaurant;
        })
        .filter(restaurant => restaurant.distance <= radius);

    // Ordenar por distancia
    return filteredRestaurants.sort((a, b) => a.distance - b.distance);
}

// Inicializa el mapa y establece la vista en Puno, Perú
var map = L.map('map');

// Carga y muestra el mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Función para mostrar los n primeros restaurantes más cercanos
function showTopRestaurants() {
    const numRestaurants = document.getElementById('numRestaurants').value;
    const topRestaurants = nearbyRestaurants.slice(0, numRestaurants);
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    topRestaurants.forEach(restaurant => {
        const restaurantInfo = document.createElement('div');
        restaurantInfo.innerHTML = `${restaurant.name} - Distancia: ${(restaurant.distance * 100000).toFixed(0)} m`;
        resultsDiv.appendChild(restaurantInfo);
    });
}

// Función para mostrar el círculo de radio en el mapa y actualizar los restaurantes dentro del círculo
function showRadiusCircle() {
    const radius = document.getElementById('radius').value;
    searchRadius = radius / 100000; // Convertir metros a grados aproximadamente

    // Eliminar el círculo anterior si existe
    if (circle) {
        map.removeLayer(circle);
    }

    // Dibujar el círculo en el mapa
    circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: radius,
        color: 'blue',
        fillColor: '#3186cc',
        fillOpacity: 0.2
    }).addTo(map);

    // Filtrar y mostrar restaurantes dentro del círculo
    const restaurantsInsideCircle = nearbyRestaurants.filter(restaurant => {
        return calculateDistance(userLocation.lat, userLocation.lng, restaurant.lat, restaurant.lng) <= searchRadius;
    });

    // Mostrar los restaurantes dentro del círculo en la página
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    restaurantsInsideCircle.forEach(restaurant => {
        const restaurantInfo = document.createElement('div');
        // Multiplica la distancia por 1000 para convertir de kilómetros a metros
        const distanceMeters = (restaurant.distance * 100000).toFixed(0);
        restaurantInfo.innerHTML = `${restaurant.name} - Distancia: ${distanceMeters} m`;
        resultsDiv.appendChild(restaurantInfo);
    });
}

// Añadir la ubicación del usuario al mapa
const userLocation = { lat: -15.8410, lng: -70.0205 };
// Añadir la ubicación del usuario al mapa con un marcador personalizado
const userIcon = L.icon({
    iconUrl: '123.png', // Ruta a tu imagen personalizada
    iconSize: [40, 40], // Tamaño del icono [ancho, alto]
    iconAnchor: [16, 32], // Punto de anclaje del icono respecto a la ubicación [mitad ancho, alto]
    popupAnchor: [0, -32] // Punto de anclaje del popup (si lo usas) [desplazamientoX, desplazamientoY]
});

markers.push(L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)
    .bindPopup('Tu ubicación').openPopup());


// Ejemplo de uso inicial
let searchRadius = 0.02; // Aproximadamente 2 km
const nearbyRestaurants = findNearbyRestaurants(userLocation.lat, userLocation.lng, searchRadius);

// Mostrar restaurantes cercanos en la consola
console.log("Restaurantes cercanos:", nearbyRestaurants);

// Añadir restaurantes al mapa y almacenar marcadores en la variable markers
nearbyRestaurants.forEach(restaurant => {
    markers.push(L.marker([restaurant.lat, restaurant.lng]).addTo(map)
        .bindPopup(`${restaurant.name}<br>Distancia: ${(restaurant.distance * 100).toFixed(2)} km`));
});

// Ajustar la vista del mapa para mostrar todos los marcadores y el círculo
const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
if (circle) {
    bounds.extend(circle.getBounds());
}
map.fitBounds(bounds);

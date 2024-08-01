// Definir el tamaño de la cuadrícula
const GRID_SIZE = 0.01; // Aproximadamente 1 km

// Coordenadas de referencia (centro de Puno)
const PUNO_CENTER = { lat: -15.8402, lng: -70.0219 };

// Función para convertir coordenadas a índices de la cuadrícula
function getGridIndex(lat, lng) {
    const latIndex = Math.floor((lat - PUNO_CENTER.lat) / GRID_SIZE);
    const lngIndex = Math.floor((lng - PUNO_CENTER.lng) / GRID_SIZE);
    return `${latIndex},${lngIndex}`;
}

// Crear el hash multidimensional para la cuadrícula
const grid = {};

// Asignar restaurantes a las celdas de la cuadrícula
function assignRestaurantsToGrid(restaurants) {
    restaurants.forEach(restaurant => {
        const index = getGridIndex(restaurant.lat, restaurant.lng);
        if (!grid[index]) {
            grid[index] = [];
        }
        grid[index].push(restaurant);
    });
}

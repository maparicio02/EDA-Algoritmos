let vpTree;

// Función para inicializar el sistema
async function initializeSystem(images) {
    // Construir el Árbol VP con las imágenes y una función de distancia
    vpTree = new VPTree(images, calculateVisualDistance);
}

// Función para buscar imágenes similares basadas en una imagen de consulta
async function searchSimilarImages() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        const queryImage = await loadImageFromFile(file);
        const similarImages = vpTree.search(queryImage, 5); // Ejemplo: buscar las 5 imágenes más similares
        displayResults(similarImages);
    }
}

// Función para mostrar los resultados de la búsqueda en el HTML
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    results.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src; // Suponiendo que image tiene la propiedad src con la URL de la imagen
        resultsContainer.appendChild(imgElement);
    });
}

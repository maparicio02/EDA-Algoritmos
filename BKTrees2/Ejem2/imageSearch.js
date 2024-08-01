// Ejemplo de descriptores de imágenes con imágenes en el mismo directorio
const images = [
    { id: 1, url: 'c.jpg', descriptor: [0.1, 0.2, 0.3] },     // Descriptor de cuadrado
    { id: 2, url: 't1.jpg', descriptor: [0.5, 0.6, 0.7] }, // Descriptor de triángulo 1
    { id: 3, url: 't2.jpg', descriptor: [0.2, 0.4, 0.6] }  // Descriptor de triángulo 2
];

// Crear una instancia del árbol BK
const bkTree = new BKTree(images[0].descriptor);

// Agregar imágenes al árbol BK
for (let i = 1; i < images.length; i++) {
    bkTree.add(images[i].descriptor, euclideanDistance);
}

// Función para previsualizar la imagen seleccionada por el usuario
function previewImage(event) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = document.createElement('img');
        imgElement.classList.add('image-preview');
        imgElement.src = event.target.result;
        previewContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
}

// Función para buscar imágenes similares
function searchSimilarImages() {
    const input = document.getElementById('imageInput').files[0];
    if (!input) {
        alert('Por favor selecciona una imagen.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgDataUrl = event.target.result;

        // Implementación simulada de extracción de descriptores de la imagen introducida
        // Este es solo un ejemplo y debe ser reemplazado con la implementación real

        // Descriptor simulado de la imagen introducida
        const inputDescriptor = [0.1, 0.2, 0.3]; // Este descriptor debería ser calculado realísticamente

        // Umbral de distancia para considerar imágenes similares
        const threshold = 0.5;

        // Buscar imágenes similares en el árbol BK (simulado)
        const similarImages = bkTree.search(inputDescriptor, threshold, euclideanDistance);

        // Mostrar los resultados en la interfaz
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
        similarImages.forEach(imageIndex => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('result');
            resultElement.innerHTML = `<img src="${images[imageIndex].url}" class="image-preview"><br>ID: ${images[imageIndex].id}<br>URL: ${images[imageIndex].url}`;
            resultsContainer.appendChild(resultElement);
        });
    };
    reader.readAsDataURL(input);
}

// Función de distancia euclidiana (ejemplo)
function euclideanDistance(descriptor1, descriptor2) {
    let distance = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        distance += Math.pow(descriptor1[i] - descriptor2[i], 2);
    }
    return Math.sqrt(distance);
}

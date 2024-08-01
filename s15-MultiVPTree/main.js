document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const analyzeButton = document.getElementById('analyzeButton');
    let loadedImage = null;

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            loadedImage = new Image();
            loadedImage.src = URL.createObjectURL(file);
        }
    });

    analyzeButton.addEventListener('click', async () => {
        if (loadedImage) {
            try {
                const features = await getImageFeatures(loadedImage);

                if (features.length > 0) {
                    console.log("Características obtenidas:", features); // Depuración: Verificar características obtenidas

                    const tree = new MultiVPTree(features);
                    const query = features[0]; // Usar el primer vector de características como consulta de ejemplo
                    const results = tree.search(query, 3);
                    const resultsContainer = document.getElementById('results');
                    resultsContainer.innerHTML = ''; // Limpiar resultados previos

                    results.forEach(result => {
                        const p = document.createElement('p');
                        p.textContent = `Punto: ${result[0].join(', ')}, Distancia: ${result[1]}`;
                        resultsContainer.appendChild(p);
                    });
                } else {
                    console.log("No se encontraron características en la imagen.");
                }
            } catch (error) {
                console.error("Error procesando la imagen:", error);
            }
        } else {
            console.log("Carga una imagen primero.");
        }
    });
});

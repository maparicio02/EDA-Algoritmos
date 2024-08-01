const dictionary = [
    "libro", "casa", "perro", "gato", "coche", "bicicleta", "ordenador", "teléfono",
    "ratón", "teclado", "pantalla", "mesa", "silla", "ventana", "puerta", "pared",
    "techo", "suelo", "lámpara", "cama", "almohada", "cobija", "espejo", "reloj",
    "cuadro", "sofá", "televisión", "planta", "flor", "jardín", "patio", "cocina",
    "baño", "salón", "comedor", "dormitorio", "escritorio", "oficina", "trabajo", "escuela",
    "sobre", "el", "la", "en", "de", "con", "un", "una", "salta"
];

const bkTree = new BKTree(levenshteinDistance);

dictionary.forEach(word => bkTree.add(word));

function checkSpelling() {
    const inputSentence = document.getElementById("input-sentence").value;
    const words = inputSentence.split(/\s+/);
    const maxDistance = 2; // Ajustar según sea necesario
    const correctedWords = words.map(word => {
        const suggestions = bkTree.search(word, maxDistance);
        return suggestions.length > 0 ? getBestSuggestion(word, suggestions) : word;
    });

    const suggestionsElement = document.getElementById("suggestions");
    suggestionsElement.innerHTML = `Oración corregida: ${correctedWords.join(" ")}`;
}

function getBestSuggestion(word, suggestions) {
    return suggestions.reduce((best, current) => 
        levenshteinDistance(word, current) < levenshteinDistance(word, best) ? current : best
    );
}
 
const songs = [
  { id: 1, name: "Luz Estelar", features: [120, 55, 210] },
  { id: 2, name: "Amanecer Dorado", features: [130, 60, 200] },
  { id: 3, name: "Sueños de Luna", features: [110, 53, 180] },
  { id: 4, name: "Senderos de Aurora", features: [125, 58, 240] },
  { id: 5, name: "Viento Cálido", features: [140, 65, 220] },
  { id: 6, name: "Olas del Pacífico", features: [135, 62, 230] },
  { id: 7, name: "Noches de Verano", features: [115, 50, 190] },
  { id: 8, name: "Caminos de Otoño", features: [118, 52, 200] },
  { id: 9, name: "Nubes Escondidas", features: [122, 56, 210] },
  { id: 10, name: "Reflejos de Agua", features: [128, 59, 215] },
  { id: 11, name: "Silencio Estrellado", features: [112, 54, 195] },
  { id: 12, name: "Montañas Azules", features: [132, 61, 225] },
  { id: 13, name: "Bruma Matinal", features: [116, 51, 185] },
  { id: 14, name: "Brisa Primaveral", features: [130, 57, 210] },
  { id: 15, name: "Atardecer Sereno", features: [123, 55, 205] },
  { id: 16, name: "Estrellas Brillantes", features: [126, 58, 215] }
];

// Función de distancia euclidiana
function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

// Clase Node para representar los nodos del árbol VP
class Node {
  constructor(song) {
    this.song = song;
    this.radius = 0;
    this.inside = null;
    this.outside = null;
  }
}

// Clase VPTree para construir y buscar en el árbol VP
class VPTree {
  constructor(songs, distanceFunc) {
    this.distanceFunc = distanceFunc;
    this.root = this.buildTree(songs.slice()); // Usar slice para evitar mutar el array original
  }

  buildTree(songs) {
    if (songs.length === 0) return null;

    // Ordenar las canciones de manera determinista por algún criterio (por ejemplo, por id)
    songs.sort((a, b) => a.id - b.id); // Ordenar por ID de manera ascendente, por ejemplo

    const node = this.buildNode(songs);
    return node;
  }

  buildNode(songs) {
    if (songs.length === 0) return null;

    const index = Math.floor(songs.length / 2);
    const song = songs[index];
    const node = new Node(song);

    // Dividir canciones en grupos dentro y fuera del radio
    const insideSongs = [];
    const outsideSongs = [];

    songs.forEach((s, i) => {
      if (i !== index) {
        const distance = this.distanceFunc(song.features, s.features);
        if (distance <= node.radius) {
          insideSongs.push(s);
        } else {
          outsideSongs.push(s);
        }
      }
    });

    node.inside = this.buildNode(insideSongs);
    node.outside = this.buildNode(outsideSongs);

    return node;
  }

  search(song, maxResults, node = this.root, neighbors = []) {
    if (!node) return neighbors;

    const dist = this.distanceFunc(song.features, node.song.features);

    if (neighbors.length < maxResults || dist < neighbors[0]?.distance) {
      neighbors.push({ song: node.song, distance: dist });
      neighbors.sort((a, b) => b.distance - a.distance);
      if (neighbors.length > maxResults) neighbors.pop();
    }

    const checkInsideFirst = dist < node.radius;

    if (checkInsideFirst) {
      this.search(song, maxResults, node.inside, neighbors);
      if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0]?.distance) {
        this.search(song, maxResults, node.outside, neighbors);
      }
    } else {
      this.search(song, maxResults, node.outside, neighbors);
      if (neighbors.length < maxResults || Math.abs(node.radius - dist) < neighbors[0]?.distance) {
        this.search(song, maxResults, node.inside, neighbors);
      }
    }

    return neighbors;
  }
}

// Función para buscar canciones similares
function searchSimilarSongs(querySong, maxResults) {
  const tree = new VPTree(songs, euclideanDistance);
  return tree.search(querySong, maxResults);
}

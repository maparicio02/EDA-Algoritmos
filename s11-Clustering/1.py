import numpy as np
from PIL import Image

class QuadTreeNode:
    def __init__(self, x, y, size, is_homogeneous, value=None):
        self.x = x
        self.y = y
        self.size = size
        self.is_homogeneous = is_homogeneous
        self.value = value
        self.children = []

def is_homogeneous(region, threshold):
    min_val = np.min(region)
    max_val = np.max(region)
    return (max_val - min_val) <= threshold

def build_quadtree(image, x, y, size, threshold):
    if size == 1:
        return QuadTreeNode(x, y, size, True, image[y, x])

    half_size = size // 2
    regions = [
        (x, y, half_size),          # NW
        (x + half_size, y, half_size),     # NE
        (x, y + half_size, half_size),     # SW
        (x + half_size, y + half_size, half_size)  # SE
    ]
    
    node = QuadTreeNode(x, y, size, True)
    for (nx, ny, nsize) in regions:
        child = build_quadtree(image, nx, ny, nsize, threshold)
        node.children.append(child)
        if not child.is_homogeneous:
            node.is_homogeneous = False
    
    if node.is_homogeneous:
        node.value = np.mean(image[y:y+size, x:x+size])
    return node

def print_quadtree(node, depth=0):
    indent = ' ' * depth * 2
    if node.is_homogeneous:
        print(f"{indent}Leaf: ({node.x}, {node.y}, {node.size}) Value: {node.value}")
    else:
        print(f"{indent}Node: ({node.x}, {node.y}, {node.size})")
        for child in node.children:
            print_quadtree(child, depth + 1)

# Cargar imagen y convertirla a escala de grises
image_path = 'path_to_your_image.jpg'
image = Image.open(image_path).convert('L')
image_array = np.array(image)

# Definir umbral
threshold = 10

# Construir Quad Tree
size = image_array.shape[0]
quadtree = build_quadtree(image_array, 0, 0, size, threshold)

# Imprimir Quad Tree
print_quadtree(quadtree)
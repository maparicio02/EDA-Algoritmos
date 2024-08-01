import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

class QuadTreeNode:
    def __init__(self, bounds, level=0):
        self.bounds = bounds  # (x, y, width, height)
        self.level = level
        self.children = []
        self.is_leaf = True
        self.value = None

    def subdivide(self):
        x, y, width, height = self.bounds
        half_width = width // 2
        half_height = height // 2

        self.children = [
            QuadTreeNode((x, y, half_width, half_height), self.level + 1),
            QuadTreeNode((x + half_width, y, half_width, half_height), self.level + 1),
            QuadTreeNode((x, y + half_height, half_width, half_height), self.level + 1),
            QuadTreeNode((x + half_width, y + half_height, half_width, half_height), self.level + 1)
        ]

        self.is_leaf = False

def is_homogeneous(image, bounds, threshold):
    x, y, width, height = bounds
    if width == 0 or height == 0:
        return True  # Evita subdividir regiones vacías
    region = image[y:y + height, x:x + width]
    if region.size == 0:
        return True  # Evita subdividir regiones vacías
    std_dev = np.std(region)
    return std_dev < threshold

def build_quadtree(image, node, threshold, min_size):
    x, y, width, height = node.bounds
    if width <= min_size or height <= min_size:
        node.value = np.mean(image[y:y + height, x:x + width])  # Almacena el valor promedio
        return  # Condición de parada: no subdividir si el tamaño es menor que min_size
    if not is_homogeneous(image, node.bounds, threshold):
        node.subdivide()
        for child in node.children:
            build_quadtree(image, child, threshold, min_size)
    else:
        node.value = np.mean(image[y:y + height, x:x + width])  # Almacena el valor promedio

def draw_quadtree(ax, node):
    x, y, width, height = node.bounds
    rect = plt.Rectangle((x, y), width, height, fill=False, edgecolor='red')
    ax.add_patch(rect)
    if not node.is_leaf:
        for child in node.children:
            draw_quadtree(ax, child)

def reconstruct_image(image, node):
    x, y, width, height = node.bounds
    if node.is_leaf:
        image[y:y + height, x:x + width] = node.value
    else:
        for child in node.children:
            reconstruct_image(image, child)

def main(image_path, threshold, min_size):
    image = Image.open(image_path).convert('L')
    image_np = np.array(image)
    height, width = image_np.shape

    root = QuadTreeNode((0, 0, width, height))
    build_quadtree(image_np, root, threshold, min_size)

    reconstructed_image = np.zeros_like(image_np)
    reconstruct_image(reconstructed_image, root)

    fig, axes = plt.subplots(1, 2, figsize=(12, 6))
    axes[0].imshow(image_np, cmap='gray')
    axes[0].set_title('Imagen Original')
    axes[0].axis('off')

    axes[1].imshow(reconstructed_image, cmap='gray')
    axes[1].set_title('Imagen Reconstruida')
    axes[1].axis('off')

    draw_quadtree(axes[1], root)
    plt.show()

if __name__ == "__main__":
    image_path = 'i1.jpg'  # Cambia esto por la ruta de tu imagen
    threshold = 10  # Define tu umbral de homogeneidad
    min_size = 4  # Tamaño mínimo de subdivisión para evitar recursión excesiva
    main(image_path, threshold, min_size)

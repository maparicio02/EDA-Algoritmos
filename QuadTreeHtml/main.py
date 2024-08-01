import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

class QuadTreeNode:
    def __init__(self, bounds, level=0):
        self.bounds = bounds  # (x, y, width, height)
        self.level = level
        self.children = []
        self.is_leaf = True

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
    region = image[y:y + height, x:x + width]
    std_dev = np.std(region)
    return std_dev < threshold

def build_quadtree(image, node, threshold):
    if not is_homogeneous(image, node.bounds, threshold):
        node.subdivide()
        for child in node.children:
            build_quadtree(image, child, threshold)

def draw_quadtree(ax, node):
    x, y, width, height = node.bounds
    rect = plt.Rectangle((x, y), width, height, fill=False, edgecolor='red')
    ax.add_patch(rect)
    if not node.is_leaf:
        for child in node.children:
            draw_quadtree(ax, child)

def main(image_path, threshold):
    image = Image.open(image_path).convert('L')
    image_np = np.array(image)
    height, width = image_np.shape

    root = QuadTreeNode((0, 0, width, height))
    build_quadtree(image_np, root, threshold)

    fig, ax = plt.subplots()
    ax.imshow(image_np, cmap='gray')
    draw_quadtree(ax, root)
    plt.show()

if __name__ == "__main__":
    image_path = 'i1.jpg'  # Cambia esto por la ruta de tu imagen
    threshold = 10  # Define tu umbral de homogeneidad
    main(image_path, threshold)

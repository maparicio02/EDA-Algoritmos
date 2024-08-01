class Node {
    constructor(value, color, parent = null) {
        this.value = value;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = parent;
    }
}

class RedBlackTree {
    constructor() {
        this.TNULL = new Node(null, 'black');
        this.root = this.TNULL;
        this.history = [];
        this.saveState();
    }

    // Save the current state of the tree
    saveState() {
        this.history.push(this.cloneTree(this.root));
    }

    // Clone the tree for saving its state
    cloneTree(node) {
        if (node === this.TNULL) return this.TNULL;
        let clone = new Node(node.value, node.color);
        clone.left = this.cloneTree(node.left);
        clone.right = this.cloneTree(node.right);
        if (clone.left !== this.TNULL) clone.left.parent = clone;
        if (clone.right !== this.TNULL) clone.right.parent = clone;
        return clone;
    }

    // Rotate left
    leftRotate(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left != this.TNULL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent == null) {
            this.root = y;
        } else if (x == x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    // Rotate right
    rightRotate(x) {
        let y = x.left;
        x.left = y.right;
        if (y.right != this.TNULL) {
            y.right.parent = x;
        }
        y.parent = x.parent;
        if (x.parent == null) {
            this.root = y;
        } else if (x == x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
    }

    // Insert a node
    insert(value) {
        this.saveState(); // Save the state before making changes
        let node = new Node(value, 'red');
        node.left = this.TNULL;
        node.right = this.TNULL;

        let y = null;
        let x = this.root;

        while (x != this.TNULL) {
            y = x;
            if (node.value < x.value) {
                x = x.left;
            } else {
                x = x.right;
            }
        }

        node.parent = y;
        if (y == null) {
            this.root = node;
        } else if (node.value < y.value) {
            y.left = node;
        } else {
            y.right = node;
        }

        if (node.parent == null) {
            node.color = 'black';
            return;
        }

        if (node.parent.parent == null) {
            return;
        }

        this.fixInsert(node);
    }

    // Fix the red-black tree
    fixInsert(k) {
        while (k.parent.color == 'red') {
            if (k.parent == k.parent.parent.right) {
                let u = k.parent.parent.left;
                if (u.color == 'red') {
                    u.color = 'black';
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    k = k.parent.parent;
                } else {
                    if (k == k.parent.left) {
                        k = k.parent;
                        this.rightRotate(k);
                    }
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    this.leftRotate(k.parent.parent);
                }
            } else {
                let u = k.parent.parent.right;
                if (u.color == 'red') {
                    u.color = 'black';
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    k = k.parent.parent;
                } else {
                    if (k == k.parent.right) {
                        k = k.parent;
                        this.leftRotate(k);
                    }
                    k.parent.color = 'black';
                    k.parent.parent.color = 'red';
                    this.rightRotate(k.parent.parent);
                }
            }
            if (k == this.root) {
                break;
            }
        }
        this.root.color = 'black';
    }

    // Find the node with the minimum key
    minimum(node) {
        while (node.left != this.TNULL) {
            node = node.left;
        }
        return node;
    }

    // Find the node with the maximum key
    maximum(node) {
        while (node.right != this.TNULL) {
            node = node.right;
        }
        return node;
    }

    // Find the node with the given key
    findNode(node, key, path = []) {
        if (node == this.TNULL || key == node.value) {
            if (node !== this.TNULL) path.push(node);
            return path;
        }

        if (key < node.value) {
            path.push(node);
            return this.findNode(node.left, key, path);
        } else {
            path.push(node);
            return this.findNode(node.right, key, path);
        }
    }

    // Delete the node from the tree
    delete(value) {
        this.saveState(); // Save the state before making changes
        this.deleteNodeHelper(this.root, value);
    }

    // Balance the tree after deletion of a node
    fixDelete(x) {
        while (x != this.root && x.color == 'black') {
            if (x == x.parent.left) {
                let s = x.parent.right;
                if (s.color == 'red') {
                    s.color = 'black';
                    x.parent.color = 'red';
                    this.leftRotate(x.parent);
                    s = x.parent.right;
                }

                if (s.left.color == 'black' && s.right.color == 'black') {
                    s.color = 'red';
                    x = x.parent;
                } else {
                    if (s.right.color == 'black') {
                        s.left.color = 'black';
                        s.color = 'red';
                        this.rightRotate(s);
                        s = x.parent.right;
                    }

                    s.color = x.parent.color;
                    x.parent.color = 'black';
                    s.right.color = 'black';
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let s = x.parent.left;
                if (s.color == 'red') {
                    s.color = 'black';
                    x.parent.color = 'red';
                    this.rightRotate(x.parent);
                    s = x.parent.left;
                }

                if (s.right.color == 'black' && s.right.color == 'black') {
                    s.color = 'red';
                    x = x.parent;
                } else {
                    if (s.left.color == 'black') {
                        s.right.color = 'black';
                        s.color = 'red';
                        this.leftRotate(s);
                        s = x.parent.left;
                    }

                    s.color = x.parent.color;
                    x.parent.color = 'black';
                    s.left.color = 'black';
                    this.rightRotate(x.parent);
                    x = this.root;
                }
            }
        }
        x.color = 'black';
    }

    // Delete the node from the tree
    deleteNodeHelper(node, key) {
        let z = this.TNULL;
        let x, y;
        while (node != this.TNULL) {
            if (node.value == key) {
                z = node;
            }

            if (node.value <= key) {
                node = node.right;
            } else {
                node = node.left;
            }
        }

        if (z == this.TNULL) {
            alert("Couldn't find key in the tree");
            return;
        }

        y = z;
        let yOriginalColor = y.color;
        if (z.left == this.TNULL) {
            x = z.right;
            this.rbTransplant(z, z.right);
        } else if (z.right == this.TNULL) {
            x = z.left;
            this.rbTransplant(z, z.left);
        } else {
            y = this.minimum(z.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent == z) {
                x.parent = y;
            } else {
                this.rbTransplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }

            this.rbTransplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;
        }
        if (yOriginalColor == 'black') {
            this.fixDelete(x);
        }
    }

    // Transplant the subtree rooted at u with the subtree rooted at v
    rbTransplant(u, v) {
        if (u.parent == null) {
            this.root = v;
        } else if (u == u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        v.parent = u.parent;
    }

    // Visualize the tree
    visualize() {
        const canvas = document.getElementById('treeCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let path = [];
        if (this.currentFindNode) {
            path = this.findNode(this.root, this.currentFindNode);
        }

        this.drawNode(ctx, this.root, canvas.width / 2, 50, canvas.width / 4, path);
    }

    drawNode(ctx, node, x, y, xOffset, path) {
        if (node == this.TNULL) {
            if (document.getElementById('showNulls').checked) {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('null', x, y);
            }
            return;
        }

        const isPathNode = path.includes(node);

        ctx.fillStyle = isPathNode ? 'green' : (node.color === 'red' ? 'red' : 'black');
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value, x, y);
        ctx.strokeStyle = 'gray'; // Set line color to light gray
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - xOffset, y + 50);
            ctx.stroke();
            this.drawNode(ctx, node.left, x - xOffset, y + 50, xOffset / 2, path);
        }

        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + xOffset, y + 50);
            ctx.stroke();
            this.drawNode(ctx, node.right, x + xOffset, y + 50, xOffset / 2, path);
        }
    }

    // Undo the last action
    undo() {
        if (this.history.length === 0) {
            return;
        }

        const lastState = this.history.pop();
        this.root = lastState;

        this.visualize();
    }

    // Set the current find node value
    setCurrentFindNode(value) {
        this.currentFindNode = value;
        this.visualize();
    }
}

// Initialize the Red-Black Tree
const rbt = new RedBlackTree();

function insertNode() {
    const value = parseInt(document.getElementById('insertValue').value);
    if (!isNaN(value)) {
        rbt.insert(value);
        rbt.visualize();
    }
}

function deleteNode() {
    const value = parseInt(document.getElementById('deleteValue').value);
    if (!isNaN(value)) {
        rbt.delete(value);
        rbt.visualize();
    }
}

function findNode() {
    const value = parseInt(document.getElementById('findValue').value);
    if (!isNaN(value)) {
        rbt.setCurrentFindNode(value);
    }
}

function toggleNulls() {
    rbt.visualize();
}

function undo() {
    rbt.undo();
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(id, title, author) {
        const newNode = new Node(id, title, author);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this._insertNode(this.root, newNode);
        }
    }

    _insertNode(node, newNode) {
        if (newNode.id < node.id) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this._insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this._insertNode(node.right, newNode);
            }
        }
    }

    search(id) {
        return this._searchNode(this.root, id);
    }

    _searchNode(node, id) {
        if (node === null) {
            return null;
        }
        if (id < node.id) {
            return this._searchNode(node.left, id);
        } else if (id > node.id) {
            return this._searchNode(node.right, id);
        } else {
            return node;
        }
    }

    remove(id) {
        this.root = this._removeNode(this.root, id);
    }

    _removeNode(node, id) {
        if (node === null) {
            return null;
        }
        if (id < node.id) {
            node.left = this._removeNode(node.left, id);
            return node;
        } else if (id > node.id) {
            node.right = this._removeNode(node.right, id);
            return node;
        } else {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }
            const aux = this._findMinNode(node.right);
            node.id = aux.id;
            node.title = aux.title;
            node.author = aux.author;
            node.right = this._removeNode(node.right, aux.id);
            return node;
        }
    }

    _findMinNode(node) {
        if (node.left === null) {
            return node;
        } else {
            return this._findMinNode(node.left);
        }
    }

    inorderTraversal() {
        this._inorderTraversalNode(this.root);
    }

    _inorderTraversalNode(node) {
        if (node !== null) {
            this._inorderTraversalNode(node.left);
            console.log(`ID: ${node.id}, Título: ${node.title}, Autor: ${node.author}`);
            this._inorderTraversalNode(node.right);
        }
    }
}

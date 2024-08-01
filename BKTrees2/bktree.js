class BKTree {
    constructor(distanceFunc) {
        this.distanceFunc = distanceFunc;
        this.tree = null;
    }

    add(word) {
        const node = { word: word, children: {} };
        if (this.tree === null) {
            this.tree = node;
        } else {
            this._add(this.tree, node);
        }
    }

    _add(node, newNode) {
        const dist = this.distanceFunc(node.word, newNode.word);
        if (node.children[dist]) {
            this._add(node.children[dist], newNode);
        } else {
            node.children[dist] = newNode;
        }
    }

    search(word, maxDist) {
        if (this.tree === null) return [];
        return this._search(this.tree, word, maxDist);
    }

    _search(node, word, maxDist) {
        const dist = this.distanceFunc(node.word, word);
        const results = [];
        if (dist <= maxDist) {
            results.push(node.word);
        }
        for (let d = dist - maxDist; d <= dist + maxDist; d++) {
            if (node.children[d]) {
                results.push(...this._search(node.children[d], word, maxDist));
            }
        }
        return results;
    }
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(    
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
 
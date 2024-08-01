class BKTree {
    constructor(distanceFunction) {
        this.distanceFunction = distanceFunction;
        this.root = null;
    }

    add(word) {
        const newNode = { word, children: {} };
        if (this.root === null) {
            this.root = newNode;
        } else {
            let currentNode = this.root;
            while (true) {
                const distance = this.distanceFunction(word, currentNode.word);
                if (!currentNode.children[distance]) {
                    currentNode.children[distance] = newNode;
                    break;
                }
                currentNode = currentNode.children[distance];
            }
        }
    }

    search(query, maxDistance) {
        if (this.root === null) return [];
        const result = [];
        const nodesToVisit = [this.root];
        while (nodesToVisit.length > 0) {
            const currentNode = nodesToVisit.pop();
            const distance = this.distanceFunction(query, currentNode.word);
            if (distance <= maxDistance) {
                result.push(currentNode.word);
            }
            for (const childDistance in currentNode.children) {
                const childNode = currentNode.children[childDistance];
                if (Math.abs(distance - childDistance) <= maxDistance) {
                    nodesToVisit.push(childNode);
                }
            }
        }
        return result;
    }
}

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                const insert = matrix[i][j - 1] + 1;
                const remove = matrix[i - 1][j] + 1;
                const replace = matrix[i - 1][j - 1] + 1;
                matrix[i][j] = Math.min(insert, remove, replace);
            }
        }
    }
    return matrix[a.length][b.length];
}

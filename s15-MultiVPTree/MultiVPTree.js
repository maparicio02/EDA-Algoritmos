class MultiVPTree {
    constructor(points, numReferences = 2, leafSize = 10) {
        this.numReferences = numReferences;
        this.leafSize = leafSize;
        this.root = this.buildTree(points);
    }

    buildTree(points) {
        if (points.length <= this.leafSize) {
            return { points: points };
        }

        const references = [];
        for (let i = 0; i < this.numReferences; i++) {
            const index = Math.floor(Math.random() * points.length);
            references.push(points[index]);
        }

        const distances = points.map(point => references.map(ref => this.distance(point, ref)));

        const medianDistances = references.map((_, i) => this.median(distances.map(d => d[i])));
        
        const leftPoints = points.filter((_, idx) => distances[idx].every((d, i) => d <= medianDistances[i]));
        const rightPoints = points.filter((_, idx) => !leftPoints.includes(points[idx]));

        return {
            references: references,
            medianDistances: medianDistances,
            left: this.buildTree(leftPoints),
            right: this.buildTree(rightPoints)
        };
    }

    search(query, k = 1) {
        return this._search(this.root, query, k);
    }

    _search(node, query, k) {
        if (node.points) {
            const distances = node.points.map(point => this.distance(query, point));
            return node.points.map((point, idx) => [point, distances[idx]]).sort((a, b) => a[1] - b[1]).slice(0, k);
        }

        const queryDistances = node.references.map(ref => this.distance(query, ref));
        const exploreLeft = queryDistances.every((d, i) => d <= node.medianDistances[i]);
        const bestBranch = exploreLeft ? node.left : node.right;
        const otherBranch = exploreLeft ? node.right : node.left;

        let bestResults = this._search(bestBranch, query, k);
        const bestDistances = bestResults.map(result => result[1]);

        if (queryDistances.some((d, i) => d <= node.medianDistances[i] + Math.max(...bestDistances))) {
            const otherResults = this._search(otherBranch, query, k);
            bestResults = bestResults.concat(otherResults).sort((a, b) => a[1] - b[1]).slice(0, k);
        }

        return bestResults;
    }

    distance(a, b) {
        return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0));
    }

    median(values) {
        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        return values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
    }
}

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this.getWords(node, prefix);
    }

    getWords(node, prefix) {
        let words = [];
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        for (let char in node.children) {
            words = words.concat(this.getWords(node.children[char], prefix + char));
        }
        return words;
    }

    visualize(word) {
        let node = this.root;
        let visualTree = {};
        for (let char of word) {
            if (!node.children[char]) {
                return null; // La palabra no está en el Trie
            }
            node = node.children[char];
            visualTree[char] = {};
            visualTree = visualTree[char];
        }
        this.buildVisualTree(node, visualTree);
        console.log(JSON.stringify(visualTree, null, 2)); // Imprime el árbol visual en formato JSON
    }

    buildVisualTree(node, visualNode) {
        for (let char in node.children) {
            visualNode[char] = {};
            this.buildVisualTree(node.children[char], visualNode[char]);
        }
    }
}

const trie = new Trie();
const phpKeywords = [
    '__halt_compiler', 'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class', 
    'clone', 'const', 'continue', 'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty', 
    'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends', 
    'final', 'finally', 'fn', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements', 'include', 
    'include_once', 'instanceof', 'insteadof', 'interface', 'isset', 'list', 'match', 'namespace', 'new', 
    'or', 'print', 'private', 'protected', 'public', 'readonly', 'require', 'require_once', 'return', 
    'static', 'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor', 'yield'
];
phpKeywords.forEach(word => trie.insert(word));

const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestionsBox');
const suggestionsList = document.getElementById('suggestionsList');

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (query.length > 0) {
        const suggestions = trie.search(query);

        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', function() {
                searchInput.value = suggestion;
                suggestionsBox.style.display = 'none';
            });
            suggestionsList.appendChild(li);
        });

        suggestionsBox.style.display = suggestions.length > 0 ? 'block' : 'none';

        // Visualizar el árbol Trie para la palabra ingresada
        trie.visualize(query);
    } else {
        suggestionsBox.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    if (event.target !== searchInput) {
        suggestionsBox.style.display = 'none';
    }
});

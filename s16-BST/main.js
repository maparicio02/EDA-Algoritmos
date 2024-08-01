const bst = new BinarySearchTree();

// Función para actualizar la lista de todos los libros
function updateBookList() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    function displayBook(node) {
        if (node !== null) {
            displayBook(node.left);
            const li = document.createElement('li');
            li.textContent = `ID: ${node.id}, Título: ${node.title}, Autor: ${node.author}`;
            bookList.appendChild(li);
            displayBook(node.right);
        }
    }
    displayBook(bst.root);
}

// Función para cargar datos desde la base de datos
function loadBooks() {
    fetch('getBooks.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                bst.insert(book.id, book.title, book.author);
            });
            updateBookList();
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// Manejar el formulario de insertar libro
document.getElementById('insertForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('insertId').value);
    const title = document.getElementById('insertTitle').value;
    const author = document.getElementById('insertAuthor').value;
    bst.insert(id, title, author);
    updateBookList();
    event.target.reset();
});

// Manejar el formulario de buscar libro
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('searchId').value);
    const book = bst.search(id);
    const searchResult = document.getElementById('searchResult');
    if (book !== null) {
        searchResult.textContent = `Libro encontrado: ID: ${book.id}, Título: ${book.title}, Autor: ${book.author}`;
    } else {
        searchResult.textContent = 'Libro no encontrado';
    }
});

// Manejar el formulario de eliminar libro
document.getElementById('removeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('removeId').value);
    bst.remove(id);
    updateBookList();
    event.target.reset();
});

// Mostrar todos los libros en orden
document.getElementById('showAll').addEventListener('click', function() {
    updateBookList();
});

// Cargar los libros desde la base de datos al inicio
loadBooks();

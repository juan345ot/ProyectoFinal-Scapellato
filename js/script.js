// Defino la clase Producto para representar los productos de la tienda
class Producto {
    constructor(id, nombre, precio) {
        this.id = id; // Guardo el ID único del producto
        this.nombre = nombre; // Guardo el nombre del producto
        this.precio = precio; // Guardo el precio del producto
    }
}

// Defino la clase TiendaDulces que representa la tienda y sus funcionalidades
class TiendaDulces {
    constructor() {
        // Inicializo la lista de productos y el carrito
        this.productos = [];
        this.carrito = [];
    }

    // Método para obtener los productos del servidor (simulado)
    async obtenerProductosDelServidor() {
        // Simulamos una demora en la respuesta del servidor usando setTimeout
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Aquí se supone que se reciben los productos del servidor
                const productosDelServidor = [
                    new Producto(1, "Dulce de leche", 1000),
                    new Producto(2, "Alfajor", 500),
                    new Producto(3, "Chupetín", 150),
                    new Producto(4, "Turrón", 100),
                    new Producto(5, "Bon o Bon", 300),
                    new Producto(6, "Caramelos Ácidos", 60),
                    new Producto(7, "Rocklets", 600),
                ];
                resolve(productosDelServidor);
            }, 1000); // Simulamos 1 segundo de tiempo de espera
        });
    }

    // Método para cargar los productos desde un JSON local
    async cargarProductosDesdeJSON(url) {
        try {
            const response = await fetch('./js/productos.json');
            const data = await response.json();
            this.productos = data.map(item => new Producto(item.id, item.nombre, item.precio));
        } catch (error) {
            console.error('Error al cargar los productos desde el JSON:', error);
        }
    }

    // Método para mostrar los productos en la página
    async mostrarProductos() {
        // Cargamos los productos desde un JSON local
        await this.cargarProductosDesdeJSON('productos.json');

        // Busco el elemento HTML donde se mostrarán los productos
        const listaProductos = document.getElementById('lista-productos');
        
        // Genero el HTML de los productos y lo agrego al elemento
        listaProductos.innerHTML = this.productos.map(producto => `
            <li class="list-group-item">
                ${producto.id}) ${producto.nombre} - $${producto.precio}
                <button data-id="${producto.id}" class="agregar btn btn-primary float-right">Agregar al carrito</button>
            </li>`).join('');

        // Agrego eventos para los botones "Agregar al carrito"
        document.querySelectorAll('.agregar').forEach(boton => {
            boton.addEventListener('click', (event) => {
                const id = parseInt(event.target.getAttribute('data-id'));
                this.agregarAlCarrito(id);
            });
        });
    }

    // Método para agregar un producto al carrito
    agregarAlCarrito(id) {
        const producto = this.productos.find(producto => producto.id === id);
        const productoEnCarrito = this.carrito.find(item => item.id === id);

        // Si el producto ya está en el carrito, incremento su cantidad
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            // Si no está en el carrito, lo agrego con cantidad 1
            this.carrito.push({ ...producto, cantidad: 1 });
        }

        // Actualizo la vista del carrito
        this.mostrarCarrito();
    }

    // Método para mostrar el carrito en la página
    mostrarCarrito() {
        // Busco el elemento HTML donde se mostrará el carrito
        const listaCarrito = document.getElementById('lista-carrito');
        
        // Genero el HTML del carrito y lo agrego al elemento
        listaCarrito.innerHTML = this.carrito.map(item => `
            <li class="list-group-item">
                ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
                <button data-id="${item.id}" class="remover btn btn-danger float-right">Remover del carrito</button>
            </li>`).join('');

        // Calculo y muestro el total
        const total = this.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
        listaCarrito.innerHTML += `<li class="list-group-item">Total: $${total}</li>`;
    }

    // Método para remover un producto del carrito
    removerDelCarrito(id) {
        const productoEnCarrito = this.carrito.find(item => item.id === id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad--;
            if (productoEnCarrito.cantidad === 0) {
                // Si la cantidad llega a cero, remuevo el producto del carrito
                this.carrito = this.carrito.filter(item => item.id !== id);
            }
        }
        // Actualizo la vista del carrito
        this.mostrarCarrito();
    }

    // Método para finalizar la compra
    finalizarCompra() {
        if (this.carrito.length > 0) {
            alert("Gracias por tu compra!");
            // Vacío el carrito
            this.carrito = [];
            // Actualizo la vista del carrito
            this.mostrarCarrito();
        } else {
            alert("Tu carrito está vacío.");
        }
    }
}

// Creo una instancia de la tienda de dulces y muestro los productos al cargar la página
const tienda = new TiendaDulces();
window.addEventListener('DOMContentLoaded', async () => {
    await tienda.mostrarProductos();
    // Agregar evento al botón de "Finalizar Compra"
    document.getElementById('finalizar-compra').addEventListener('click', () => {
        tienda.finalizarCompra();
    });

    // Agregar evento al botón de "Iniciar sesión"
    document.getElementById('iniciar-sesion').addEventListener('click', () => {
        // Comprobar si el usuario está autenticado
        if (isAuthenticated()) {
            // Si está autenticado, cerrar sesión
            logout();
            // Cambiar el texto del botón a "Iniciar sesión"
            document.getElementById('iniciar-sesion').textContent = 'Iniciar sesión';
        } else {
            // Si no está autenticado, solicitar inicio de sesión
            const username = prompt('Ingresa tu nombre de usuario:');
            if (username === null) {
                alert('Operación cancelada.');
                return; // Salir de la función si la operación fue cancelada
            }
            const password = prompt('Ingresa tu contraseña:');
            if (password === null) {
                alert('Operación cancelada.');
                return; // Salir de la función si la operación fue cancelada
            }
            login(username, password);
            // Cambiar el texto del botón a "Cerrar sesión"
            document.getElementById('iniciar-sesion').textContent = 'Cerrar sesión';
        }
    });

    // Agregar evento al botón de "Registrarse"
    document.getElementById('registrarse').addEventListener('click', () => {
        const username = prompt('Elige un nombre de usuario:');
        if (username === null) {
            alert('Operación cancelada.');
            return; // Salir de la función si la operación fue cancelada
        }
        const password = prompt('Elige una contraseña:');
        if (password === null) {
            alert('Operación cancelada.');
            return; // Salir de la función si la operación fue cancelada
        }
        register(username, password);
    });

    // Agregar eventos al contenedor del carrito
    document.getElementById('lista-carrito').addEventListener('click', (event) => {
        if (event.target.classList.contains('remover')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            tienda.removerDelCarrito(id);
        }
    });
});

// Simulo una base de datos de usuarios
const users = [
    { username: 'usuario1', password: 'contraseña1' },
    { username: 'usuario2', password: 'contraseña2' },
    // ...
];

// Funciones para iniciar sesión, registrarse y cerrar sesión
function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        // Guardo el usuario en el almacenamiento local
        localStorage.setItem('user', JSON.stringify(user));
        alert('Has iniciado sesión correctamente!');
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
}

function logout() {
    localStorage.removeItem('user');
    alert('Has cerrado sesión correctamente!');
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem('user') !== null;
}

// Función para registrar un nuevo usuario
function register(username, password) {
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        alert('El nombre de usuario ya existe.');
    } else {
        // Registro al nuevo usuario
        users.push({ username, password });
        alert('Te has registrado correctamente!');
    }
}

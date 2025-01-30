document.addEventListener("DOMContentLoaded", () => {
  // Selecciona los elementos necesarios
  const cartButton = document.querySelector(".cart-btn");
  const cartLink = document.querySelector(
    ".nav-link[href='#offcanvasCarrito']"
  );
  const offcanvasCarrito = document.getElementById("offcanvasCarrito");

  // Crear instancia de offcanvas
  const bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvasCarrito);

  // Evento para mostrar el carrito desde el botón
  cartButton.addEventListener("click", () => bootstrapOffcanvas.toggle());

  // Evento para mostrar el carrito desde el enlace del navbar
  cartLink.addEventListener("click", (e) => {
    e.preventDefault();
    bootstrapOffcanvas.toggle();
  });

  // Cargar productos del carrito almacenados en LocalStorage
  cargarCarritoDesdeLocalStorage();
});

// Variables globales
let totalCarrito = 0;

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  const carritoBody = document.querySelector(
    "#offcanvasCarrito .offcanvas-body"
  );
  const precioProducto = convertirPrecioANumero(producto.precio);

  // Crear un nuevo elemento de lista para el carrito
  const itemCarrito = document.createElement("div");
  itemCarrito.classList.add(
    "carrito-item",
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "mb-3"
  );

  itemCarrito.innerHTML = `
          <div class="producto-carrito d-flex align-items-center">
            <img src="${producto.img}" alt="${producto.nombre}" class="img-carrito" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
            <div>
              <p><strong>${producto.nombre}</strong></p>
              <p>${producto.precio}</p>
            </div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(this, ${precioProducto})">❌</button>
        `;

  carritoBody.appendChild(itemCarrito);

  // Actualizar total y guardar en LocalStorage
  totalCarrito += precioProducto;
  actualizarTotal();
  guardarCarritoEnLocalStorage(producto);
}

// Función para eliminar un producto del carrito
function eliminarProducto(button, precio) {
  const item = button.closest(".carrito-item");
  const nombreProducto = item.querySelector("strong").textContent;

  item.remove();

  totalCarrito -= precio;
  actualizarTotal();

  eliminarProductoDeLocalStorage(nombreProducto);
}

// Función para convertir el precio a un número
function convertirPrecioANumero(precio) {
  return parseInt(precio.replace(/[^\d]/g, ""));
}

// Función para actualizar el total
function actualizarTotal() {
  const totalElement = document.getElementById("cart-total");
  totalElement.textContent = `$${formatearNumeroConPuntos(totalCarrito)}`;
}

// Función para formatear número con separadores de miles
function formatearNumeroConPuntos(numero) {
  return numero.toLocaleString("es-CO");
}

// Función para guardar un producto en LocalStorage
function guardarCarritoEnLocalStorage(producto) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para eliminar un producto de LocalStorage
function eliminarProductoDeLocalStorage(nombreProducto) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const nuevoCarrito = carrito.filter((prod) => prod.nombre !== nombreProducto);
  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
}

// Función para cargar productos del LocalStorage al carrito
function cargarCarritoDesdeLocalStorage() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const carritoBody = document.querySelector(
    "#offcanvasCarrito .offcanvas-body"
  );

  carrito.forEach((producto) => {
    const precioProducto = convertirPrecioANumero(producto.precio);

    const itemCarrito = document.createElement("div");
    itemCarrito.classList.add(
      "carrito-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-3"
    );

    itemCarrito.innerHTML = `
          <div class="producto-carrito d-flex align-items-center">
            <img src="${producto.img}" alt="${producto.nombre}" class="img-carrito" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
            <div>
              <p><strong>${producto.nombre}</strong></p>
              <p>${producto.precio}</p>
            </div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(this, ${precioProducto})">❌</button>
        `;

    carritoBody.appendChild(itemCarrito);
    totalCarrito += precioProducto;
  });

  actualizarTotal();
}

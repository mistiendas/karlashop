var mostrarMenu = false;
const url =
  "https://script.google.com/macros/s/AKfycbwSBZup1_hgwYEiTt-NlguFI722smRVPyIbuzzv5l_uypu8dEq5rGcuwM3CsCCSEGdA/exec";
let productos = [];
let carrito = [];

document.addEventListener("click", (e) => {
  if (e.target.id === "icono") {
    mostrarMenu = !mostrarMenu;

    if (mostrarMenu) {
      document.getElementById("menu").style.display = "flex";
      document.getElementById("productos").style.paddingTop = "230px";
      document.getElementById("segundoi").style.display = "none";
    }
  }

  if (e.target.id === "menugrande") {
    ocultarMenu();
  }

  if (e.target.id === "tercero") {
    ocultarMenu();
  }
});

function ocultarMenu() {
  mostrarMenu = false;
  document.getElementById("menu").style.display = "none";
  document.getElementById("productos").style.paddingTop = "0px";
  document.getElementById("segundoi").style.display = "flex";
}

window.addEventListener("scroll", () => {
  if (mostrarMenu && window.innerWidth <= 768) {
    // Si el ancho de la pantalla es mayor a 768px y el menú está visible, ocultarlo
    ocultarMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Cuando cargue el DOM, traer los productos

  fetch(url, {
    method: "POST",
    body: JSON.stringify({ action: "obtenerProductos" }),
  })
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      cargarProductos(productos);
    })
    .catch((error) => console.error("Error al obtener productos:", error));
});

function agregarAlCarrito(esteProducto) {
  let producto = esteProducto.parentElement;
  let nombre = producto.querySelector("#nombre").textContent;
  let precio = producto.querySelector("#precio").textContent;
  let img1 = producto.querySelector("#img1").src;

  let pedido = {
    nombreP: nombre,
    PrecioP: precio,
    imagenP: img1,
  };

  carrito.push(pedido);

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function verCarrito() {
  console.clear();
  let total = localStorage.getItem("carrito");
  carritoT = JSON.parse(total);
  carritoT.forEach((element) => {
    console.log(element);
  });
}

function cargarProductos(productos) {
  let plantilla = document.getElementById("plantilla");
  plantilla.style.display = "none"; // ocultamos el original

  productos.forEach((element) => {
    const clone = plantilla.cloneNode(true);
    clone.id = element["Codigo Producto"];
    clone.style.display = "block";

    // Reemplazar datos
    clone.querySelector("#img1").src = element["Link imagen"];
    clone.querySelector("#img2").src = element["Link imagen dos"];
    clone.querySelector("#img3").src = element["Link imagen tres"];
    clone.querySelector("#nombre").textContent =
      element["Nombre "].toUpperCase();
    clone.querySelector("#precio").textContent = "$" + element["Precio venta"];
    clone.querySelector("#descipcion").textContent =
      element["Descripcion Corta"] || "";
    clone.querySelector("#desLarga").textContent =
      element["Descripcion Larga"] || "";

    // Elegir contenedor según categoría
    let contenedor;
    switch (element["Categoria"]) {
      case "HOMBRE":
        contenedor = document.getElementById("contenedorH");
        break;
      case "MUJER":
        contenedor = document.getElementById("contenedorM");
        break;
      case "TENIS":
        contenedor = document.getElementById("contenedorT");
        break;
      case "HOGAR":
        contenedor = document.getElementById("contenedorHogar");
        break;
      case "ACCESORIOS":
        contenedor = document.getElementById("contenedorA");
        break;
      default:
        console.warn("Categoría desconocida:", element["Categoria"]);
        return;
    }

    // Insertar producto en el contenedor correspondiente
    contenedor.appendChild(clone);
  });
}

function mostrarFormularioPedido() {
  let total = localStorage.getItem("carrito");
  if (!total) {
    alert("Tu carrito está vacío");
    return;
  }

  carritoT = JSON.parse(total);

  let resumen = `
    <h3>Resumen del pedido:</h3>
    ${carritoT
      .map(
        (p, i) => `
        <div class="producto-resumen">
          <img src="${p.imagenP}" alt="${p.nombreP}">

          <div>
            <span><b>${p.nombreP}</b></span><br>
            <span>${p.PrecioP}</span>
          </div>
        </div>
      `
      )
      .join("")}
    <p><b>Total productos:</b> ${carritoT.length}</p>
  `;

  document.getElementById("resumenCarrito").innerHTML = resumen;
  document.getElementById("formularioPedido").style.display = "block";
}

// Escuchar el submit del formulario
document.getElementById("pedidoForm").addEventListener("submit", function (e) {
  e.preventDefault();
  enviarPedido();
});

function enviarPedido() {
  let carritoGuardado = localStorage.getItem("carrito");
  if (!carritoGuardado) {
    alert("Tu carrito está vacío");
    return;
  }

  let carrito = JSON.parse(carritoGuardado);

  // Calcular total (ejemplo: suma de precios)
  function calcularTotal() {
    return carrito.reduce((acc, item) => {
      let precio = parseFloat(item.PrecioP.replace("$", "").trim()) || 0;
      return acc + precio;
    }, 0);
  }

  const pedido = {
    producto: carrito.map((p) => p.nombreP).join(", "),
    cantidad: carrito.length,
    categoria: "General", // o puedes tomarlo de p.categoria si lo guardas
    productoGratis: "Ninguno", // opcional, si manejas promos
    nombre: document.getElementById("nombreCliente").value,
    celular: document.getElementById("celularCliente").value,
    direccion: document.getElementById("direccionCliente").value,
    total: calcularTotal(),
  };

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      action: "guardarPedido",
      pedido: pedido,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("✅ Pedido enviado correctamente");
      localStorage.removeItem("carrito");
      document.getElementById("formularioPedido").style.display = "none";
    })
    .catch((err) => {
      console.error("Error al enviar pedido:", err);
      alert("❌ Hubo un error al enviar el pedido");
    });
}

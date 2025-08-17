var mostrarMenu = false;
const url =
  "https://script.google.com/macros/s/AKfycbwl_rLRMoMyws_I4K8MSXTl3T8sXQAgyB1dPdzUky8Y_ix3D6hNS3e2lFhR7wKhxs3c/exec";
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

  let pedido = {
    nombreP: nombre,
    PrecioP: precio,
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
    clone.querySelector("#nombre").textContent = element["Nombre "];
    clone.querySelector("#precio").textContent = "$" + element["Precio venta"];
    clone.querySelector("#descipcion").textContent =
      element["Descripcion"] || "";
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

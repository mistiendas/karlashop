var mostrarMenu = false;
const url =
  "https://script.google.com/macros/s/AKfycbyOxtnd5C-Eqh6q9jFxuRoWV2BNeKPHta926eRFlUAUYHJM0KUSfL3w5qd8aEHbYFeT/exec";
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
    ocultarMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
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
  alert("Producto agregado al carrito!");
}

function cargarProductos(productos) {
  let plantilla = document.getElementById("plantilla");
  plantilla.style.display = "none";

  productos.forEach((element) => {
    const clone = plantilla.cloneNode(true);
    clone.id = element["Codigo Producto"];
    clone.style.display = "block";

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

    contenedor.appendChild(clone);
  });
}

function mostrarFormularioPedido() {
  document.getElementById("footerId").scrollIntoView({ behavior: "smooth" });
  let total = localStorage.getItem("carrito");
  if (!total || JSON.parse(total).length === 0) {
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
    <p><b>Total a pagar:</b> $${calcularTotalCarrito(carritoT)}</p>
  `;

  document.getElementById("resumenCarrito").innerHTML = resumen;
  document.getElementById("formularioPedido").style.display = "block";
}

function calcularTotalCarrito(carrito) {
  return carrito
    .reduce((total, item) => {
      const precio = parseFloat(item.PrecioP.replace("$", "").trim()) || 0;
      return total + precio;
    }, 0)
    .toFixed(2);
}

document.getElementById("pedidoForm").addEventListener("submit", function (e) {
  e.preventDefault();
  enviarPedido();
});

function enviarPedido() {
  let carritoGuardado = localStorage.getItem("carrito");

  if (!carritoGuardado || JSON.parse(carritoGuardado).length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let carrito = JSON.parse(carritoGuardado);
  let total = calcularTotalCarrito(carrito);

  let nombre = document.getElementById("nombreCliente").value;
  let celular = document.getElementById("celularCliente").value;
  let ciudad = document.getElementById("ciudadCliente").value;
  let barrio = document.getElementById("barrioCliente").value;
  let direccionExacta = document.getElementById("direccionCliente").value;

  if (!nombre || !celular || !ciudad || !barrio || !direccionExacta) {
    alert("Por favor completa todos los campos del formulario");
    return;
  }

  let direccionCompleta =
    "Ciudad: " +
    ciudad +
    ", Barrio: " +
    barrio +
    ", Dirección: " +
    direccionExacta;

  let pedido = {
    productos: carrito,
    total: total,
    nombre: nombre,
    celular: celular,
    direccion: direccionCompleta,
    fecha: new Date().toISOString(),
  };

  console.log("Pedido que se envía:", pedido);

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      action: "guardarPedido",
      pedido: pedido,
    }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (data.success) {
        alert("Pedido enviado correctamente");
        localStorage.removeItem("carrito");
        document.getElementById("formularioPedido").style.display = "none";
        window.location.reload();
      } else {
        alert("Error al guardar el pedido: " + data.message);
      }
    })
    .catch(function (err) {
      console.error("Error al enviar pedido:", err);
      alert("Hubo un error al enviar el pedido");
    });
}

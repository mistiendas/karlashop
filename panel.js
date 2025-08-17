if (localStorage.getItem("inicio") === "true") {
  window.location.href = "panel.html";
} else {
  window.location.href = "admin.html";
  localStorage.setItem("inicio", "false");
}

addEventListener("DOMContentLoaded", () => {
  // Inicializar el formulario de añadir producto
  document
    .getElementById("formularioAñadir")
    .addEventListener("submit", añadirProducto);
});

const URL =
  "https://script.google.com/macros/s/AKfycbwSBZup1_hgwYEiTt-NlguFI722smRVPyIbuzzv5l_uypu8dEq5rGcuwM3CsCCSEGdA/exec";
let productos = [];

addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.id;
    document.querySelectorAll("button").forEach((btn) => {
      btn.style.backgroundColor = "#4a4a6a";
    });
    document.getElementById(id).style.backgroundColor = "lightblue";
    document.getElementsByTagName("fieldset")[0].style.display = "block";
    const opciones = document.getElementsByClassName("opcionesMenu");

    mostrarOpciones(opciones, id);

    switch (id) {
      case "ver":
        verProductos();
        break;

      case "eliminar":
        // Aquí podrías implementar la lógica para eliminar productos

        break;
    }
  }
});

addEventListener("submit", (e) => {
  if (e.target.id === "formularioEliminar") {
    e.preventDefault();
    const codigoProducto = e.target.codigoEliminar.value;
    eliminarProducto(codigoProducto);
  }
});

function mostrarOpciones(opciones, idBoton) {
  let algoMostrado = false;

  for (let i = 0; i < opciones.length; i++) {
    const opcion = opciones[i];

    if (opcion.id.startsWith(idBoton)) {
      opcion.style.display = "block";
      algoMostrado = true;
    } else {
      opcion.style.display = "none";
    }
  }

  // Mostrar el fieldset solo si algo fue mostrado
  document.getElementsByTagName("fieldset")[0].style.display = algoMostrado
    ? "block"
    : "none";
}

function verProductos() {
  fetch(URL, {
    method: "POST",
    body: JSON.stringify({ action: "obtenerProductos" }),
  })
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      duplicarProducto();
    })
    .catch((error) => console.error("Error al obtener productos:", error));
}

function duplicarProducto() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  const plantilla = document.getElementById("plantilla");
  plantilla.style.display = "none"; // Ocultar la plantilla
  productos.forEach((producto) => {
    const clon = plantilla.cloneNode(true);
    clon.id = "Producto-" + producto["Codigo Producto"];
    clon.style.display = "block"; // Mostrar el clon

    // llenar campos del clon
    clon.querySelector("#nombreP").textContent = producto["Nombre "];
    clon.querySelector("#descripcionC").textContent =
      producto["Descripcion Corta"];
    clon.querySelector("#descripcionL").textContent =
      producto["Descripcion Larga"];
    clon.querySelector("#imagen1").src = producto["Link imagen"];
    clon.querySelector("#imagen2").src = producto["Link imagen dos"];
    clon.querySelector("#imagen3").src = producto["Link imagen tres"];
    clon.querySelector("#categoria").textContent = producto["Categoria"];
    clon.querySelector("#Diashabil").textContent =
      "Dias habil " + producto["Dias habil"];
    clon.querySelector("#Tallas").textContent = "tallas " + producto["Tallas"];
    clon.querySelector("#Gratis").textContent =
      "Es gratis: " + producto["Gratis"];
    clon.querySelector("#Precioventa").textContent =
      "Precio venta: " + producto["Precio venta"];
    clon.querySelector("#Preciocompra").textContent =
      "precio compra " + producto["Precio compra"];
    clon.querySelector("#Marca").textContent = "Marca " + producto["Marca "];
    clon.querySelector("#CodigoProducto").textContent =
      "codigo producto: " + producto["Codigo Producto"];
    clon.querySelector("#Activo").textContent = "activo " + producto["Activo"];
    const fecha = new Date(producto["Fecha"]);
    clon.querySelector("#fecha").textContent =
      fecha.toLocaleDateString("es-CO");

    //agregar el clon al contenedor
    contenedor.appendChild(clon);
    if (producto["Activo"] === "No") {
      clon.style.backgroundColor = "#FF7C5C"; // Color de fondo para productos inactivos
    }
  });
}

function añadirProducto(event) {
  event.preventDefault();
  const form = event.target;
  const codigo =
    form.Marca.value + form.nombreP.value.replace(/\s+/g, "-").toLowerCase();
  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString("es-CO");

  const producto = {
    Fecha: fecha,
    nombreP: form.nombreP.value,
    descripcionC: form.descripcionC.value,
    descripcionL: form.descripcionL.value,
    catidadBodega: form.catidadBodega.value,
    imagen1: form.imagen1.value,
    imagen2: form.imagen2.value,
    imagen3: form.imagen3.value,
    categoria: form.categoria.value,
    Diashabil: form.Diashabil.value,
    Tallas: form.Tallas.value,
    Gratis: form.Gratis.checked ? "Si" : "No",
    Precioventa: parseFloat(form.Precioventa.value),
    Preciocompra: parseFloat(form.Preciocompra.value),
    Marca: form.Marca.value,
    CodigoProducto: codigo,
    Activo: "Si",
  };

  fetch(URL, {
    method: "POST",
    body: JSON.stringify({ action: "guardar", productos: producto }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Producto añadido correctamente");
        form.reset(); // Limpiar el formulario
      } else {
        alert("Error al añadir el producto");
      }
    })
    .catch((error) => console.error("Error al añadir producto:", error));
}

function eliminarProducto(codigo) {
  fetch(URL, {
    method: "POST",
    body: JSON.stringify({ action: "eliminar", codigo: codigo }),
  })
    .then((response) => response.text())
    .then((data) => {
      if (data === "Ok") {
        alert("Producto eliminado correctamente");
        verProductos(); // Actualizar la lista de productos
      } else {
        alert("Error al eliminar el producto");
      }
    })
    .catch((error) => console.error("Error al eliminar producto:", error));
}

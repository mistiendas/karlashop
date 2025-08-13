var mostrarMenu = false;
const url =
  "https://script.google.com/macros/s/AKfycbwl_rLRMoMyws_I4K8MSXTl3T8sXQAgyB1dPdzUky8Y_ix3D6hNS3e2lFhR7wKhxs3c/exec";
let productos = [];

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
    })
    .catch((error) => console.error("Error al obtener productos:", error));
});

const url =
  "https://script.google.com/macros/s/AKfycby0W2bk5KgePE1W_AK7FkAbMoEgJFJvjcmx5PMM9Axj9e5LZRgxhpHB7LTqsSj7UVQ3/exec";

addEventListener("click", (e) => {
  if (e.target.type === "submit") {
    e.preventDefault();
    const user = document.getElementById("nombre").value;
    const contrasena = document.getElementById("password").value;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        action: "registrar",
        datos: {
          nombre: user,
          password: contrasena,
        },
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        if (data === "ok") {
          alert("Usuario registrado correctamente");
          localStorage.setItem("inicio", "true");
          window.location.href = "panel.html";
        } else {
          alert("Error al registrar el usuario ");
          localStorage.setItem("inicio", "false");
          location.reload();
        }
      });
  }
});

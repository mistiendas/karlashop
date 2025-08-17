const url =
  "https://script.google.com/macros/s/AKfycbwSBZup1_hgwYEiTt-NlguFI722smRVPyIbuzzv5l_uypu8dEq5rGcuwM3CsCCSEGdA/exec";

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
          window.location.href = "ah.html";
        } else {
          alert("Error al registrar el usuario ");
          localStorage.setItem("inicio", "false");
          location.reload();
        }
      });
  }
});

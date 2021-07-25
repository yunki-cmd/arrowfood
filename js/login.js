const loging = document.getElementById("login-submit");
const inputpassword = document.getElementById("password");
const inputnombre = document.getElementById("login");
const rpp = document.getElementById("recuperarPassword");
const confi = document.getElementById("send-recuperacion");


loging.addEventListener("click",(e)=> {
  e.preventDefault()
  const nombre = document.getElementById("login").value;
  const password = document.getElementById("password").value;
  const validacion = validar(nombre, password)
  if (validacion === true) {
    loginServer({ nombre, password });
  }
})

rpp.addEventListener("click", (e) => {
  e.preventDefault()
  $("#modelRecuperacion").modal("show");
})
confi.addEventListener("click", (e) => {
  e.preventDefault()
  const email = document.getElementById("email-recuperacion").value;
  const regexEmail =
    /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regexEmail.test(email)) {
    loginServer({email})
  } else {
    $("#modelRecuperacion").modal("hide");
    modalError("email")
  }
})
const validar = (nombre, password) => {
  const regexNombre = /^[a-z0-9_-]{3,16}$/;
  /*Empezamos diciendole al analizador sintáctico que encuentre el principio de la cadena (^), seguido de cualquier letra minúscula (a-z), número (0-9), un carácter de subrayado o un guión. A continuación, {3,16} asegura que sean al menos 3 de esos caracteres, pero no más de 16. Por último, queremos el final de la cadena ($).*/
  const regexPass = /^[a-z0-9_-]{6,18}$/;
  /*La coincidencia de una contraseña es muy similar a la coincidencia de un nombre de usuario. La única diferencia es que en vez de 3 a 16 letras, números, guiones bajos o guiones, queremos 6 a 18 de ellos ({6,18}).*/
  let validacion = 0
  if (!regexNombre.test(nombre)) {
    inputnombre.classList.add("activeError")
    modalError("nombre");
    } else {
    inputnombre.classList.remove("activeError");
    validacion += 1
  }
  if (!regexPass.test(password)) {
    inputpassword.classList.add("activeError")
    modalError("password");
  } else {
    inputpassword.classList.remove("activeError");
    validacion += 1
  }
  if (validacion === 2) {
    return true
  }
  return false
  
};

const modalError = (error) => {
  const titleError = document.getElementById("ErrorLiginLabel");
  if (error === "nombre") {
    titleError.textContent = `Error en el campo ${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>El nombre deben ser letra minúscula (a-z), número (0-9), un carácter de subrayado o un guión, al menos 3 caracteres, pero no más de 16.</h5>";
    $("#ErrorLigin").modal("show");
  } else if (error === "password") {
    titleError.textContent = `Error en el campo ${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>El password deben ser letra minúscula (a-z), número (0-9), un carácter de subrayado o un guión, al menos 6 caracteres, pero no más de 18.</h5>";
    $("#ErrorLigin").modal("show");
  } else if (error === "login") {
    titleError.textContent = `Error en el ${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>El nombre de usuario no existe o contraseña incorrecta</5>";
    $("#ErrorLigin").modal("show");
  } else if (error === "email") {
    titleError.textContent = `Error en el ${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>El email deben ser uno valido</5>";
    $("#ErrorLigin").modal("show");
  } else if (error === "confirmacion") {
    titleError.textContent = `${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>el email ha sido enviado</5>";
    $("#ErrorLigin").modal("show");
  }
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const loginServer = ({ nombre="", password="",email=""}) => {
  const data = {
    nombre: nombre,
    password: password,
    email:email
  }
  console.log(data)
  if (data.email.length > 0) {
     return fetch("https://pacific-woodland-79761.herokuapp.com/resetPassword",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
       }
     )
       .then((resp) => resp.json())
       .then((response) => {
         if (response.status === 200) {
           console.log(response);
           $("#modelRecuperacion").modal("hide");
           modalError("confirmacion");
         }
       })
       .catch((err) => {
         console.log("error");
       });
  }

    return fetch("https://pacific-woodland-79761.herokuapp.com/login/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);
        if (response.user === true) {
          setCookie("username", data.nombre, 1);
          setCookie("email", response.email, 1);
          setCookie("login", "true", 1);
          window.location.href = "./index.html";
        }
      })
      .catch(err => {
        modalError("login")
      });
}
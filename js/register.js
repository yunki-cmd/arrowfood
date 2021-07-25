const crearCuenta = document.getElementById("crearCuenta");

crearCuenta.addEventListener("click", (e) => {
  e.preventDefault()
  const inputs = document.forms
  const values = getValue(inputs)
  const resultValidation = validar(
    values.text,
    values.email,
    values.password[0],
    values.password[1]
  );
  if (resultValidation  === "valido") {
    registarEnMongo(values.text, values.email, values.password[0])
      .then(result => {
        if (result.status === 200) {
          window.location.href = "./index.html";
          setCookie("username", values.text, 1)
          setCookie("email", values.email, 1);
          setCookie("login","true",1)
        } else {
          modalError("cuenta");
        }
      })
  } else {
    modalError(resultValidation);
  }
})


const getValue = (ObjectForm) => {
  const value = {
    text: "",
    email: "",
    password: [],
  }
  for (const iterator of ObjectForm) {
    for (const iterator2 of iterator) {
      if (iterator2.type !== "submit") {
        /* value.push({type: iterator2.type,
          value: iterator2.value}); */
        if (iterator2.type !== "password") {
          value[iterator2.type] = iterator2.value
        } else {
          value[iterator2.type].push(iterator2.value);
        }
      }
    }
  }
  return value
}

const validar = (nombre,email, password,passwordRepe) => {
  const regexNombre = /^[a-z0-9_-]{3,16}$/;
  /*Empezamos diciendole al analizador sintáctico que encuentre el principio de la cadena (^), seguido de cualquier letra minúscula (a-z), número (0-9), un carácter de subrayado o un guión. A continuación, {3,16} asegura que sean al menos 3 de esos caracteres, pero no más de 16. Por último, queremos el final de la cadena ($).*/

  if (!regexNombre.test(nombre)) return "nombre";
  const regexEmail =
    /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regexEmail.test(email)) return "email";

  const regexPass = /^[a-z0-9_-]{6,18}$/;
  /*La coincidencia de una contraseña es muy similar a la coincidencia de un nombre de usuario. La única diferencia es que en vez de 3 a 16 letras, números, guiones bajos o guiones, queremos 6 a 18 de ellos ({6,18}).*/
  if (!regexPass.test(password)) return "password";

  if (password !== passwordRepe) return "no match";

  return "valido";
};

const registarEnMongo = (nombre,email,password) => {
  const json = {
    nombre: nombre,
    Email: email,
    password:password
  }
  return fetch(
    "https://pacific-woodland-79761.herokuapp.com/Registration/User",
    {
      method: "POST",   
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    }
  );
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
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
  } else if (error === "email") {
    titleError.textContent = `Error en el ${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>El email debe ser uno valido</5>";
    $("#ErrorLigin").modal("show");
  } else if (error === "no match") {
    titleError.textContent = `Error en el ${error}`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>El password no coinciden</5>";
    $("#ErrorLigin").modal("show");
  } else if (error === "cuenta") {
    titleError.textContent = `Correo ya esta registrado`;
    document.getElementsByClassName("modal-body")[0].innerHTML =
      "<h5>Correo ya esta registrado, intentar logear</5>";
    $("#ErrorLigin").modal("show");
  }
};
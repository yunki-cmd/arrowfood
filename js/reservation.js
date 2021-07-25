// constantes
const comensales = document.getElementById("adult");
const selection = document.getElementById("selection");
const selection2 = document.getElementById("selection-2");
const fecha = document.getElementById("checkin-date");
const telefono = document.getElementById("phone");
const turno = document.getElementById("selection-turno");
const finalizarReserva = document.getElementById("finalizarReserva");
const finalizarModal = document.getElementById("finalizarModal");
const añadirmenu = document.getElementById("añadirmenu");
const redirectIndex = document.getElementById("redirectIndex");
// limitar calentario
const currentDateTime = new Date();
const year = currentDateTime.getFullYear();
let month = currentDateTime.getMonth() + 1;
let date = currentDateTime.getDate() + 1;
if (date < 10) {
  date = "0" + date;
}
if (month < 10) {
  month = "0" + month;
}
const dateTomorrow = year + "-" + month + "-" + date;
const checkinElem = document.querySelector("#checkin-date");
checkinElem.setAttribute("min", dateTomorrow);
// objecto reserva
const reserva = {
  telefono:"",
  personas: "",
  tipoReserva: "",
  tipo:"",
  fecha:"",
  turno: "",
}
// eventos
telefono.addEventListener("change", (e) => {
  reserva.telefono = e.target.value
})

comensales.addEventListener("change", (e) => {
  const person = parseInt(e.target.value)
  const options = selection.children;
  selection2.setAttribute("disabled", "true");
  selection.children[0].selected = "selected"
  if (person >= 1) {
    if (selection.hasAttribute("disabled")) {
      selection.removeAttribute("disabled")
    }
    if (person > 10) {
        options[2].setAttribute("disabled","true")
    } else {
      options[2].removeAttribute("disabled")
    }
    if (person > 15) {
      options[1].setAttribute("disabled", "true");
    } else {
      options[1].removeAttribute("disabled");
    }
    reserva.personas = person;
  }
})

selection.addEventListener("change", (e) => {
  let personas = reserva.personas
  const tipoReserva = e.target.value
  if (selection2.hasAttribute("disabled")){
    selection2.removeAttribute("disabled")
  }
  
  if (tipoReserva === "Mesa" && personas <= 4) {
    while (selection2.hasChildNodes()) {
      selection2.removeChild(selection2.lastChild);
    }
    for (let index = 1; index <= 5; index++) {
      let opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `Mesa ${index}`;
      selection2.appendChild(opt);
    }
  }
  if (tipoReserva === "Mesa" && personas > 4 && personas <= 8) {
    while (selection2.hasChildNodes()) {
      selection2.removeChild(selection2.lastChild);
    }
    for (let index = 5; index <= 8; index++) {
      let opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `Mesa ${index}`;
      selection2.appendChild(opt);
    }
  }
  if (tipoReserva === "Mesa" && personas > 8 && personas <= 15) {
    while (selection2.hasChildNodes()) {
      selection2.removeChild(selection2.lastChild);
    }
    for (let index = 9; index <= 10; index++) {
      let opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `Mesa ${index}`;
      selection2.appendChild(opt);
    }
  }
  if (tipoReserva === "Habitacion" && personas <= 10) {
    while (selection2.hasChildNodes()) {
      selection2.removeChild(selection2.lastChild);
    }
    for (let index = 1; index <= 10; index++) {
      let opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `Habitacion ${index}`;
      selection2.appendChild(opt);
    }
  }
  if (tipoReserva === "Salon") {
    while (selection2.hasChildNodes()) {
      selection2.removeChild(selection2.lastChild);
    }
    let opt = document.createElement("option");
    opt.setAttribute("selected","true")
    opt.value = "Salon Principal";
    opt.textContent = `Salon Principal`;
    selection2.appendChild(opt);
    reserva.tipo=selection2.children[0].value
  }
  reserva.tipoReserva = tipoReserva;
})
selection2.addEventListener("change", (e) => {
  reserva.tipo = e.target.value;
})

fecha.addEventListener("change", (e) => {
  const fechareserva = e.target.value
  reserva.fecha = fechareserva
})

turno.addEventListener("change", (e) => {
  reserva.turno = e.target.value
})
redirectIndex.addEventListener("click", (e) => {
  e.preventDefault()
  window.location.href = "./index.html";
})

finalizarReserva.addEventListener("click", (e) => {
  e.preventDefault()
  const validacion = validar(reserva)
  if (validacion === "valido") {
    $("#modalReserva").modal("toggle");
  } else {
    document.getElementById("messageError").innerHTML = `<h5> Error en el campo de ${validacion}</h5>`
    $("#modalError").modal("toggle");
  }

})

finalizarModal.addEventListener("click", (e) => {
  e.preventDefault()
   reserva["email"] = getCookie("email")
  reserva["nombre"] = getCookie("username")
  console.log(reserva)
  fetch("https://pacific-woodland-79761.herokuapp.com/reserva/sinmenu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reserva),
  })
    .then((data) => data.json())
    .then((response) => {
      document.getElementById(
        "modalconfirmarMessage"
      ).innerHTML = `<h5>${response.msg}</h5>`;
      $("#modalconfirmar").modal("toggle");
    });
})



añadirmenu.addEventListener("click", (e) => {
  reserva["email"] = getCookie("email");
  reserva["nombre"] = getCookie("username");
  setCookie("reserva","true",1)
  e.preventDefault()
  localStorage.setItem("reserva", JSON.stringify(reserva));
  window.location.href="./recipe.html"
})

// funciones

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
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const validar = (obj) => {
  let longitud  = 0
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (obj[key].length > 0 || obj[key] > 0) {
        longitud += 1
        
      } else {
        console.log(obj)
        console.log(key,obj[key])
        return key
            }
    }
  }
  if (longitud === 6) return "valido"
  return "no valido"
} 





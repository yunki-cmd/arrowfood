$(document).ready(function() {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal",
    });

    $("#dismiss, .overlay").on("click", function() {
        $("#sidebar").removeClass("active");
        $(".overlay").removeClass("active");
    });

    $("#sidebarCollapse").on("click", function() {
        $("#sidebar").addClass("active");
        $(".overlay").addClass("active");
        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
    });
});

var revisarUser = (function() {
    let valor = getCookie("login");
    let nombre = getCookie("username");
    if (valor === "true") {
        var x = document.getElementById("ocultar");
        var j = document.getElementById("mostrar");
        var k = document.getElementById("textoUsername");

        x.style.display = "none";
        j.style.display = "inline";
        k.textContent = nombre;
    }
})();

var revisarUser2 = (function() {
    let reserva = getCookie("reserva");
    let valor = getCookie("login");
    let elements = document.getElementsByClassName("Ocultar2");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = "hidden ";
    }

    if (reserva == "true" && valor == "true") {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.visibility = "visible ";
        }
    }
})();

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

$(document).ready(function() {
    var owl = $(".owl-carousel");
    owl.owlCarousel({
        margin: 10,
        nav: true,
        loop: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 5,
            },
        },
    });
});

const getValue = (ObjectForm) => {
    const value = {
        Nombre: "",
        Correo: "",
        Numero: "",
        Mensaje: "",
    };
    for (const iterator of ObjectForm) {
        for (const iterator2 of iterator) {
            if (iterator2.type !== "button") {
                value[iterator2.name] = iterator2.value;
            }
        }
    }
    return value;
};

const r = document.getElementById("reserva");
r.addEventListener("click", () => {
    let login = getCookie("login");
    if (login === "true") {
        window.location.href = "./reservation.html";
    } else {
        window.location.href = "./login.html";
    }
});

function suscribir() {
    const buttons = document.querySelector(".suscribir");
    let datos = { email: buttons.previousElementSibling.value };
    fetch("https://apiarrowfood.herokuapp.com/suscripcion", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        })
        .then((data) => data.json())
        .then((rsp) => console.log(rsp.msg));
}
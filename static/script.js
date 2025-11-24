var mousePressed = false;
var lastX, lastY;
var ctx;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function drawCircleGuide() {
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI * 2, true);  // Dibuja el contorno de la figura
    ctx.strokeStyle = "lightgray";  // Gris claro para la guía
    ctx.lineWidth = 2;  // Grosor de las líneas guía
    ctx.setLineDash([5, 5]);  // Líneas discontinuas (opcional)
    ctx.stroke();
    ctx.closePath();
}

function drawSquareGuide() {
    ctx.beginPath();
    ctx.rect(50, 50, 100, 100);  // Dibuja el contorno del cuadrado
    ctx.strokeStyle = "lightgray";  // Gris claro para la guía
    ctx.lineWidth = 2;  // Grosor de las líneas guía
    ctx.setLineDash([5, 5]);  // Líneas discontinuas (opcional)
    ctx.stroke();
    ctx.closePath();
}

function drawTriangleGuide() {
    ctx.beginPath();
    ctx.moveTo(100, 50);  // Empieza en la parte superior
    ctx.lineTo(50, 150);  // Línea a la izquierda
    ctx.lineTo(150, 150);  // Línea a la derecha
    ctx.closePath();  // Cierra el triángulo
    ctx.strokeStyle = "lightgray";  // Gris claro para la guía
    ctx.lineWidth = 2;  // Grosor de las líneas guía
    ctx.setLineDash([5, 5]);  // Líneas discontinuas (opcional)
    ctx.stroke();
}

function drawDiamondGuide() {
    ctx.beginPath();
    ctx.moveTo(100, 50);  // Parte superior
    ctx.lineTo(150, 100);  // Derecha
    ctx.lineTo(100, 150);  // Inferior
    ctx.lineTo(50, 100);  // Izquierda
    ctx.closePath();  // Cierra el rombo
    ctx.strokeStyle = "lightgray";  // Gris claro para la guía
    ctx.lineWidth = 2;  // Grosor de las líneas guía
    ctx.setLineDash([5, 5]);  // Líneas discontinuas (opcional)
    ctx.stroke();
}



function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");
    numero = getRndInteger(0, 10);
    figura = ["circulo", "cuadrado", "rectangulo", "triangulo", "rombo", "ovalo", "corazon"]
    //letra = ["U", "P", "C"];
    random = Math.floor(Math.random() * figura.length);
    aleatorio = figura[random];
    document.getElementById('mensaje').innerHTML  = 'Dibujando la figura ' + aleatorio;
    document.getElementById('numero').value = aleatorio;
    // Mostrar la guía dependiendo de la figura seleccionada
    if (aleatorio === "circulo") {
        drawCircleGuide();
    } else if (aleatorio === "cuadrado") {
        drawSquareGuide();
    } else if (aleatorio === "triangulo") {
        drawTriangleGuide();
    } else if (aleatorio === "rombo") {
        drawDiamondGuide();
    }
    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });
    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });
    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
        $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 11;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

//https://www.askingbox.com/tutorial/send-html5-canvas-as-image-to-server
function prepareImg() {
    var canvas = document.getElementById('myCanvas');
    document.getElementById('myImage').value = canvas.toDataURL();
}

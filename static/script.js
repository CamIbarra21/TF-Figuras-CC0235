var mousePressed = false;
var lastX, lastY;
var ctx;      // Contexto de dibujo para el usuario
var guideCtx; // Contexto de guía de fondo
var currentShape = "";

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Configuración de estilo SOLO para las guías
function setGuideStyle() {
    guideCtx.strokeStyle = "lightgray";
    guideCtx.lineWidth = 3;
    guideCtx.setLineDash([10, 10]);
}

// GUÍAS
function drawCircleGuide() {
    guideCtx.beginPath();
    guideCtx.arc(100, 100, 60, 0, Math.PI * 2, true);
    setGuideStyle();
    guideCtx.stroke();
    guideCtx.closePath();
}

function drawSquareGuide() {
    guideCtx.beginPath();
    guideCtx.rect(50, 50, 100, 100);
    setGuideStyle();
    guideCtx.stroke();
    guideCtx.closePath();
}

function drawTriangleGuide() {
    guideCtx.beginPath();
    guideCtx.moveTo(100, 40);
    guideCtx.lineTo(40, 160);
    guideCtx.lineTo(160, 160);
    guideCtx.closePath();
    setGuideStyle();
    guideCtx.stroke();
}

function drawDiamondGuide() {
    guideCtx.beginPath();
    guideCtx.moveTo(100, 40);
    guideCtx.lineTo(160, 100);
    guideCtx.lineTo(100, 160);
    guideCtx.lineTo(40, 100);
    guideCtx.closePath();
    setGuideStyle();
    guideCtx.stroke();
}

function drawRectangleGuide() {
    guideCtx.beginPath();
    guideCtx.rect(40, 60, 120, 80); 
    setGuideStyle();
    guideCtx.stroke();
    guideCtx.closePath();
}

function drawOvalGuide() {
    guideCtx.beginPath();
    guideCtx.ellipse(100, 100, 70, 45, 0, 0, 2 * Math.PI);
    setGuideStyle();
    guideCtx.stroke();
}

function drawHeartGuide() {
    guideCtx.beginPath();
    var x = 100;
    var y = 65;
    guideCtx.moveTo(x, y);
    guideCtx.bezierCurveTo(x, y - 30, x - 55, y - 30, x - 55, y);
    guideCtx.bezierCurveTo(x - 55, y + 45, x, y + 55, x, y + 95);
    guideCtx.bezierCurveTo(x + 55, y + 45, x + 55, y + 45, x + 55, y);
    guideCtx.bezierCurveTo(x + 55, y - 30, x, y - 30, x, y);
    setGuideStyle();
    guideCtx.stroke();
    guideCtx.closePath();
}


// LÓGICA PRINCIPAL

function InitThis() {
    // Inicializar ambos contextos
    ctx = document.getElementById('myCanvas').getContext("2d");
    guideCtx = document.getElementById('guideCanvas').getContext("2d");

    // Limpiar ambos lienzos
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
    guideCtx.setTransform(1, 0, 0, 1, 0, 0);
    guideCtx.clearRect(0, 0, guideCtx.canvas.width, guideCtx.canvas.height);

    var figuras = ["circulo", "cuadrado", "rectangulo", "triangulo", "rombo", "ovalo", "corazon"];
    var random = Math.floor(Math.random() * figuras.length);
    var aleatorio = figuras[random];
            
    currentShape = aleatorio;

    document.getElementById('mensaje').innerHTML = '¡Dibuja un <span class="uppercase font-bold">' + aleatorio + '</span>!';
    document.getElementById('numero').value = aleatorio;

    // Dibujar la guía en el canvas inferior
    drawCurrentGuide(); 

    // Configurar eventos en el canvas SUPERIOR
    $('#myCanvas').off();
            
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

    // Lógica de manejo del "pincel"
    var canvas = document.getElementById('myCanvas');
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener('touchend', function(e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
}

function drawCurrentGuide() {
    if (currentShape === "circulo") drawCircleGuide();
    else if (currentShape === "cuadrado") drawSquareGuide();
    else if (currentShape === "triangulo") drawTriangleGuide();
    else if (currentShape === "rombo") drawDiamondGuide();
    else if (currentShape === "rectangulo") drawRectangleGuide();
    else if (currentShape === "ovalo") drawOvalGuide();
    else if (currentShape === "corazon") drawHeartGuide();
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 11;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; 
    lastY = y;
}

function clearArea() {
    // Solo se limpia el canvas del dibujo, la guía se queda intacta
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function prepareImg() {
    var canvas = document.getElementById('myCanvas');
    var dataURL = canvas.toDataURL('image/png');
    
    document.getElementById('myImage').value = dataURL;
    document.getElementById('drawingForm').submit();
}

$(document).ready(function() {
    InitThis();
});
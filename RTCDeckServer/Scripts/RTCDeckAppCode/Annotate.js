var eventCanvas;
var annotateHub;
var pointerState =
{
    Down: 0,
    Up: 1,
    Move: 2
}

function DrawObject() {
}

function createCanvasOverlay() {

    var slides = document.getElementsByClassName(" slides");

    var slide = slides[0];

    var sections = slide.getElementsByTagName("section");

    for (i = 0; i < sections.length; i++) {

        if (sections[i].getElementsByTagName("section").length == 0) {

            var aCanvas = document.createElement('canvas');
            aCanvas.width = 1024;
            aCanvas.height = 768;
            aCanvas.style.width = slide.scrollWidth + "px";
            aCanvas.style.height = slide.scrollHeight + "px";
            aCanvas.style.overflow = 'visible';
            aCanvas.style.position = 'absolute';
            aCanvas.style.top = '0';
            aCanvas.style.left = '0';
            aCanvas.style.zIndex = "1000000";
            aCanvas.style.visibility = 'hidden';
            aCanvas.style.pointerEvents = 'none';

            var context = aCanvas.getContext('2d');
            context.fillStyle = 'rgba(0,0,0,0.5)';
            context.fillRect(0, 0, aCanvas.width, aCanvas.height);

            context.strokeStyle = 'rgb(255,0,0)';  // a green line
            context.lineWidth = 4;                 // 4 pixels thickness    

            sections[i].appendChild(aCanvas);
        }
    }

    var showButton = document.createElement('div');
    showButton.style.position = "absolute";
    showButton.onclick = showHideCanvas;
    showButton.style.left = "20px";
    showButton.style.top = "14px";
    showButton.style.width = "50px";
    showButton.style.height = "20px";
    showButton.style.background = "#f00";
    showButton.style.cursor = "pointer";
    showButton.style.zIndex = "1000001";
    showButtonText = document.createTextNode("S/H");
    showButton.appendChild(showButtonText);

    document.body.appendChild(showButton);

    var drawButton = document.createElement('div');
    drawButton.style.position = "absolute";
    drawButton.onclick = drawOnCanvas;
    drawButton.style.left = "75px";
    drawButton.style.top = "14px";
    drawButton.style.width = "50px";
    drawButton.style.height = "20px";
    drawButton.style.background = "#f00";
    drawButton.style.cursor = "pointer";
    drawButton.style.zIndex = "1000002";
    drawButtonText = document.createTextNode("ON/OFF");
    drawButton.appendChild(drawButtonText);

    document.body.appendChild(drawButton);

    eventCanvas = document.createElement('canvas');
    eventCanvas.width = 1024;
    eventCanvas.height = 768;
    eventCanvas.style.width = slide.scrollWidth + "px";
    eventCanvas.style.height = slide.scrollHeight + "px";
    eventCanvas.style.overflow = 'visible';
    eventCanvas.style.position = 'absolute';
    eventCanvas.style.top = '0';
    eventCanvas.style.left = '0';
    eventCanvas.style.transform = 'translate(-50%, -50%)';
    eventCanvas.style.WebkitTransform = 'translate(-50%, -50%)';
    eventCanvas.style.zIndex = "2000000";
    eventCanvas.style.visibility = 'hidden';

    slide.appendChild(eventCanvas);

    eventCanvas.addEventListener("pointermove", onMouseMove, false);
    eventCanvas.addEventListener("pointerdown", onMouseDown, false);
    eventCanvas.addEventListener("pointerup", onMouseUp, false);
}

function onMouseMove(event) {
    event.preventDefault();
    var drawObject = new DrawObject();
    drawObject.currentState = pointerState.Move;
    drawObject.canvasX = (event.offsetX * eventCanvas.width) / eventCanvas.style.width.replace("px", "");
    drawObject.canvasY = (event.offsetY * eventCanvas.height) / eventCanvas.style.height.replace("px", "");
    drawIt(drawObject, true);
}

function onMouseDown(event) {
    event.preventDefault();
    var drawObject = new DrawObject();
    drawObject.currentState = pointerState.Down;
    drawIt(drawObject, true);
}

function onMouseUp(event) {
    event.preventDefault();
    var drawObject = new DrawObject();
    drawObject.currentState = pointerState.Up;
    drawIt(drawObject, true);
}

function sendIt(drawObject) {

    var messagei = JSON.stringify(drawObject);

    var event = document.createEvent("CustomEvent");
    event.initCustomEvent('drawing', false, false, {
        'message': messagei
    });

    window.dispatchEvent(event);
}

function drawIt(drawObject, fromLocal, connectionId) {
    var ignoreMovement = false;

    switch (drawObject.currentState) {
        case pointerState.Down:
            presentCanvas().drawing = true;
            break;
        case pointerState.Up:
            presentCanvas().drawing = false;
            presentCanvas().pathBegun = false;
            break;
        case pointerState.Move:
            if (presentCanvas().drawing) {
                var mouseX = drawObject.canvasX;
                var mouseY = drawObject.canvasY;

                var context = presentCanvas().getContext("2d");
                if (presentCanvas().pathBegun == false) {
                    context.beginPath();
                    presentCanvas().pathBegun = true;
                }
                else {
                    context.lineTo(mouseX, mouseY);
                    context.stroke();
                }
            }
            else {
                ignoreMovement = true;
            }
            break;
    }

    if (fromLocal && !ignoreMovement) {
        sendIt(drawObject);
    }
}

function showHideCanvas() {
    if (presentCanvas()) {
        presentCanvas().style.visibility = (presentCanvas().style.visibility == 'visible') ? 'hidden' : 'visible';
    }
    if (eventCanvas) {
        eventCanvas.style.visibility = presentCanvas().style.visibility;
    }
}

function drawOnCanvas() {
    if (eventCanvas) {
        eventCanvas.style.pointerEvents = (eventCanvas.style.pointerEvents == "none") ? "auto" : "none";
    }
}

function presentCanvas() {
    var slide = document.getElementsByClassName(" slides")[0];
    var presentSections = slide.getElementsByClassName("present");

    for (i = 0; i < presentSections.length; i++) {

        if (presentSections[i].getElementsByClassName("present").length == 0) {

            var presentCanvas = presentSections[i].getElementsByTagName("canvas")[0];

            return presentCanvas;
        }
    }
}

if (document.addEventListener !== undefined) {
    document.addEventListener("DOMContentLoaded", createCanvasOverlay, false);
}

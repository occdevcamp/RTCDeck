var eventCanvas;
var annotateHub;
var pointerState =
{
    Down: 0,
    Up: 1,
    Move: 2,
    AnnotateOn: 3,
    AnnotateOff: 4
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
            context.strokeStyle = 'rgb(255,0,0)';
            context.lineWidth = 4; 

            sections[i].appendChild(aCanvas);
        }
    }

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
    eventCanvas.style.pointerEvents = 'auto';

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
        case pointerState.AnnotateOn:
            document.getElementById("cbxAnnotation").checked = true;
            showHideCanvasInner();
            break;
        case pointerState.AnnotateOff:
            document.getElementById("cbxAnnotation").checked = false;
            showHideCanvasInner();
            break;
    }

    if (fromLocal && !ignoreMovement) {
        sendIt(drawObject);
    }
}

function showHideCanvas() {
    showHideCanvasInner();

    var drawObject = new DrawObject();
    drawObject.currentState = document.getElementById("cbxAnnotation").checked ? pointerState.AnnotateOn : pointerState.AnnotateOff;
    sendIt(drawObject);
}

function showHideCanvasInner() {

    if (presentCanvas()) {
        presentCanvas().style.visibility = document.getElementById("cbxAnnotation").checked ? 'visible' : 'hidden';
    }
    if (eventCanvas) {
        eventCanvas.style.visibility = presentCanvas().style.visibility;
    }

    document.getElementById("cbxPen").checked = (eventCanvas.style.pointerEvents == "auto") && document.getElementById("cbxAnnotation").checked;
}

function drawOnCanvas() {
    if (document.getElementById("cbxAnnotation").checked) {
        if (eventCanvas) {
            eventCanvas.style.pointerEvents = (eventCanvas.style.pointerEvents == "none") ? "auto" : "none";
        }
    }
    else {
        document.getElementById("cbxPen").checked = false;
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

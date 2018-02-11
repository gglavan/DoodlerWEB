const canvas = document.getElementById('can');
const ctx = canvas.getContext("2d");
const tempCanvas = document.createElement("canvas");
const tempCtx = tempCanvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let mousePressed = false;
let lastX, lastY;
let stPoint;
let endPoint;
let cPushArray = new Array();
let cStep = -1;

canvas.addEventListener('mousedown', function (e) {
  mousePressed = true;
  switch (activeTool) {
    case Pencil:
    case Rubber:
      Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
      break;
    case Line:
      mouseDown(e);
      break;
  }
});

canvas.addEventListener('mousemove', function (e) {
  switch (activeTool) {
    case Pencil:
    case Rubber:
      if (mousePressed) Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
      break;
    case Line:
      mouseMove(e);
      break;
  }
});

canvas.addEventListener('mouseup', function (e) {
  mousePressed = false;
  if (activeTool == Line)
    mouseUp(e);
});

canvas.addEventListener('mouseout', function (e) {
  mousePressed = false;
});

function Draw(x, y, isDown) {
  if (isDown) {
    ctx.beginPath();
    if (activeTool != Rubber)
      ctx.strokeStyle = activeColor;
    else ctx.strokeStyle = activeTool.color;
    ctx.lineWidth = activeTool.size;
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
  }
  lastX = x;
  lastY = y;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function lineP(stPoint, endPoint) {
  this.stPoint = stPoint;
  this.endPoint = endPoint;
}

function mouseDown(e) {
  mousePressed = true;
  stPoint = new Point(e.layerX, e.layerY);
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
}

function mouseMove(e) {
  if (!mousePressed) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height); //redraw image
  ctx.beginPath();
  ctx.strokeStyle = activeColor;
  ctx.lineWidth = activeTool.size;
  ctx.moveTo(stPoint.x, stPoint.y);
  ctx.lineTo(e.layerX, e.layerY);
  ctx.stroke();
  ctx.closePath();
}

function mouseUp(e) {
  mousePressed = false;
  endPoint = new Point(e.layerX, e.layerY); //get end point
}

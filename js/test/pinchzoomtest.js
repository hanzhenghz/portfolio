let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isDragging = false;
let startPanX = 0;
let startPanY = 0;
let panX = 0;
let panY = 0;
let zoom = 1;
let image = new Image();

image.onload = function() {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

image.src = '/images/raw/moment/moment_wide.png';

canvas.onmousedown = function(e) {
  isDragging = true;
  startPanX = e.clientX - panX;
  startPanY = e.clientY - panY;
};

canvas.onmouseup = function() {
  isDragging = false;
};

canvas.onmousemove = function(e) {
  if (isDragging) {
    panX = e.clientX - startPanX;
    panY = e.clientY - startPanY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
};

canvas.onwheel = function(e) {
  e.preventDefault();
  const scale = e.deltaY < 0 ? 1.1 : 0.9;
  zoom *= scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.restore();
};
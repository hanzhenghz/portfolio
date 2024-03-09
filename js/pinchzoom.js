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
  // Set the canvas dimensions to match the image
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  let sourceX, sourceY, sourceWidth, sourceHeight;
  let targetX = 0, targetY = 0;
  let targetWidth = canvas.width, targetHeight = canvas.height;

  let imageAspectRatio = image.width / image.height;
  let canvasAspectRatio = canvas.width / canvas.height;

  if (imageAspectRatio < canvasAspectRatio) {
    // The image is narrower and taller than the canvas, so we need to crop top and bottom
    sourceWidth = image.width;
    sourceHeight = image.width / canvasAspectRatio;
    sourceX = 0;
    sourceY = (image.height - sourceHeight) / 2;
  } else {
    // The image is wider and shorter than the canvas, so we need to crop left and right
    sourceHeight = image.height;
    sourceWidth = image.height * canvasAspectRatio;
    sourceY = 0;
    sourceX = (image.width - sourceWidth) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
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
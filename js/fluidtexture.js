const canvas = document.getElementById("gl");
const gl = canvas.getContext("webgl");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resize);
resize();

const vertexShaderSource = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_seed;

//----------------------------------
// ART DIRECTION CONTROLS
//----------------------------------

const float MASTER_SCALE      = 0.2;

const float TIME_SPEED        = 0.0008;

const float WARP1_SCALE       = 1.2;
const float WARP1_STRENGTH    = 4.5;

const float WARP2_SCALE       = 2.0;
const float WARP2_STRENGTH    = 4.5;

const float BAND_FREQUENCY_X  = 8.0;
const float BAND_FREQUENCY_Y  = 2.0;

const float BAND_NOISE_SCALE  = 0.5;
const float BAND_NOISE_AMOUNT = 14.0;

const float LINE_SHARPNESS    = 200.0;

const float GRAIN_SCALE       = 1.0;
const float GRAIN_STRENGTH    = 0.1;

const float GAMMA             = 8.0;

const float CONTRAST          = 5.0;

const float THRESHOLD_LOW     = 0.35;
const float THRESHOLD_HIGH    = 0.8;

//----------------------------------
// NOISE FUNCTIONS
//----------------------------------

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7)) + u_seed) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;

  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.5;
  }

  return v;
}

float contrast(float v, float amount) {
  return clamp((v - 0.5) * amount + 0.5, 0.0, 1.0);
}

//----------------------------------
// MAIN SHADER
//----------------------------------

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * TIME_SPEED;

  vec2 p = uv * MASTER_SCALE;

  vec2 warp1 = vec2(
    fbm(p * WARP1_SCALE + vec2(t, 0.0)),
    fbm(p * WARP1_SCALE + vec2(20.0, t))
  );

  vec2 warp2 = vec2(
    fbm(p * WARP2_SCALE + warp1 * 3.0 + vec2(-t, t)),
    fbm(p * WARP2_SCALE + warp1 * 3.0 + vec2(t, -t))
  );

  vec2 q =
    p +
    (warp1 - 0.5) * WARP1_STRENGTH +
    (warp2 - 0.5) * WARP2_STRENGTH;

  float v = sin(
    q.x * BAND_FREQUENCY_X +
    q.y * BAND_FREQUENCY_Y +
    fbm(q * BAND_NOISE_SCALE) * BAND_NOISE_AMOUNT
  );

  v = v * 0.5 + 0.5;

  v = pow(v, LINE_SHARPNESS);

  float grain = fbm(q * GRAIN_SCALE + t);
  v += (grain - 0.5) * GRAIN_STRENGTH;

  v = pow(clamp(v, 0.0, 1.0), GAMMA);

  v = contrast(v, CONTRAST);

  v = smoothstep(THRESHOLD_LOW, THRESHOLD_HIGH, v);

  vec3 color = vec3(v);

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,

    -1,  1,
     1, -1,
     1,  1
  ]),
  gl.STATIC_DRAW
);

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const timeLocation = gl.getUniformLocation(program, "u_time");
const seedLocation = gl.getUniformLocation(program, "u_seed");

const seed = Math.random() * 1000;
gl.uniform1f(seedLocation, seed);

function render(time) {
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.uniform1f(timeLocation, time * 0.001);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
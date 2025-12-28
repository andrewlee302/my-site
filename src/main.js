import * as THREE from "three";

const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060a, 0.08);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
camera.position.set(0, 0, 14);

const resize = () => {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);
resize();

// Light (subtle)
const light = new THREE.PointLight(0xffffff, 1.2, 200);
light.position.set(8, 8, 14);
scene.add(light);

// Particle field
const COUNT = 14000;
const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);

const c1 = new THREE.Color(0x7dd3fc); // cyan
const c2 = new THREE.Color(0xa78bfa); // purple
const tmp = new THREE.Color();

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;
  // dense center, sparse outer
  const r = Math.pow(Math.random(), 0.55) * 40;
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 18;

  positions[i3 + 0] = Math.cos(theta) * r;
  positions[i3 + 1] = y;
  positions[i3 + 2] = Math.sin(theta) * r;

  tmp.copy(c1).lerp(c2, Math.random());
  colors[i3 + 0] = tmp.r;
  colors[i3 + 1] = tmp.g;
  colors[i3 + 2] = tmp.b;
}

const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({
  size: 0.045,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geo, mat);
scene.add(points);

// Subtle “nebula” plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshBasicMaterial({ color: 0x080a12, transparent: true, opacity: 0.55 })
);
plane.position.z = -40;
scene.add(plane);

// Interaction
let targetX = 0, targetY = 0;
const onMove = (x, y) => {
  targetX = (x / window.innerWidth - 0.5) * 2;
  targetY = (y / window.innerHeight - 0.5) * 2;
};
window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchmove", (e) => {
  if (e.touches?.[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// Animation
const clock = new THREE.Clock();

function tick() {
  const t = clock.getElapsedTime();

  // camera parallax
  camera.position.x += (targetX * 1.0 - camera.position.x) * 0.04;
  camera.position.y += (-targetY * 0.8 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  // slow rotation + wave
  points.rotation.y = t * 0.05;
  points.rotation.x = Math.sin(t * 0.12) * 0.08;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();


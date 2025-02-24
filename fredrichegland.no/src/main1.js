// =========================
// Portfolio Website Refactor: main.js
// Features: Three.js animation, Star Wars-style scroll, Camera Controls
// =========================

import './style1.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// =========================
// Scene Setup
// =========================

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 150);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// =========================
// Lighting
// =========================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const pointLight = new THREE.PointLight(0xffffff, 1, 500);
pointLight.position.set(50, 50, 50);
scene.add(ambientLight, pointLight);

// =========================
// Star Field Creation
// =========================
const STAR_COUNT = 5000;
const STAR_FIELD_RADIUS = 700;
const STAR_ROTATION_SPEED = 0.005;
const stars = [];

const createStar = () => {
  const geometry = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const radius = Math.random() * STAR_FIELD_RADIUS - STAR_FIELD_RADIUS / 2;
  const theta = Math.random() * Math.PI * 2;
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  const y = Math.random() * STAR_FIELD_RADIUS - STAR_FIELD_RADIUS / 2;

  star.position.set(x, y, z);
  scene.add(star);

  stars.push({ object: star, radius, theta, y, speed: Math.random() * STAR_ROTATION_SPEED });
};

Array.from({ length: STAR_COUNT }).forEach(createStar);

// =========================
// Planet Setup
// =========================
const planetGeometry = new THREE.SphereGeometry(10, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial();
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('src/assets/Models/Earth 3D Model/textures/1_earth_8k.jpg', (texture) => {
  planetMaterial.map = texture;
  planetMaterial.needsUpdate = true;
});

// =========================
// Orbit Control (User Interaction)
// =========================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// =========================
// Animation Loop
// =========================
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.1;

  // Star Twinkle + Rotation
  stars.forEach(({ object, radius, speed, y }, index) => {
    const theta = time * speed + index * 0.05;
    object.position.x = radius * Math.cos(theta);
    object.position.z = radius * Math.sin(theta);
    object.material.color.setScalar(Math.abs(Math.sin(time + index * 0.1)) * 1.2 + 0.3);
  });

  // Planet Rotation & Orbit
  planet.rotation.y += 0.002;
  planet.position.x = 50 * Math.cos(time * 0.002);
  planet.position.z = 50 * Math.sin(time * 0.002);

  controls.update();
  renderer.render(scene, camera);
}

animate();

// =========================
// Responsive Handling
// =========================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

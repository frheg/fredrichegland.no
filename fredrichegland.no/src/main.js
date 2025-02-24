// =========================
// Portfolio Website Refactor: main.js
// Features: Three.js animation, Star Wars-style scroll, Intro lock
// =========================

import './style.css';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// =========================
// Constants & Scene Setup
// =========================

const CAMERA_POSITION = new THREE.Vector3(0, 0, 100); // Slight initial offset for better perspective
const STAR_COUNT = 8000;
const STAR_FIELD_RADIUS = 700;
const STAR_ROTATION_SPEED = 0.005;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.copy(CAMERA_POSITION);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// =========================
// Lighting
// =========================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1, 500);
pointLight.position.set(50, 50, 50);
scene.add(ambientLight, pointLight);

// =========================
// Star Field Creation
// =========================
const stars = [];
const createStar = () => {
  const starGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const radius = Math.random() * STAR_FIELD_RADIUS - STAR_FIELD_RADIUS / 2;
  const theta = Math.random() * Math.PI * 2;
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  const y = Math.random() * STAR_FIELD_RADIUS - STAR_FIELD_RADIUS / 2;

  star.position.set(x, y, z);
  scene.add(star);

  stars.push({ star, radius, theta, y, speed: Math.random() * STAR_ROTATION_SPEED });
};

// Create multiple stars
Array.from({ length: STAR_COUNT }).forEach(createStar);

// =========================
// Scroll Lock Until Intro Ends
// =========================
document.body.style.overflow = 'hidden'; // Initial lock
const intro = document.querySelector('.intro');
intro.addEventListener('animationend', () => {
  document.body.style.overflow = 'auto';
  document.body.setAttribute('data-intro-complete', 'true');
});

// =========================
// Scroll-based Board Movement
// =========================
const boardContent = document.getElementById('board');

function moveBoard() {
  if (document.body.getAttribute('data-intro-complete') !== 'true') return;
  const scrollY = window.scrollY;
  console.log(scrollY);
  const scrollSpeed = 0.01;
  boardContent.style.transform = `translateY(${scrollY + scrollSpeed}%)`;
}

document.body.onscroll = moveBoard;

// =========================
// Animation Loop
// =========================
let time = 0;
function animate() {
  requestAnimationFrame(animate);

  // Update Stars (Twinkling Effect)
  time += 0.1;
  stars.forEach(({ star, radius, speed, y }, index) => {
    const theta = time * speed + index * 0.05;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    star.position.set(x, y, z);

    // Star Twinkle
    const intensity = Math.abs(Math.sin(time + index * 0.1)) * 1.2 + 0.3;
    star.material.color.setScalar(intensity);
  });

  renderer.render(scene, camera);
}

// =========================
// Handle Window Resizing
// =========================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =========================
// Start Animation
// =========================
animate();

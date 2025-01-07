import './style.css';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 

// Constants
const CAMERA_POSITION = new THREE.Vector3(0, 0, 0); // Fixed camera position

// Scene Setup
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
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // General ambient light
scene.add(ambientLight);

// Create Stars with Twinkling and Full 3D Movement
const stars = [];
const createStar = () => {
  const starGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Smaller star size
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  // Randomize position in full 3D space
  const radius = Math.random() * 200 + 50; // Distance from the center (50 to 250 units)
  const theta = Math.random() * 2 * Math.PI; // Angle around the Y-axis
  const yOffset = Math.random() * 100 - 50; // Random height (-50 to 50)

  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta);
  const y = yOffset; // Set random vertical position

  star.position.set(x, y, z);

  scene.add(star);
  stars.push({ star, radius, theta, y, speed: Math.random() * 0.001 + 0.0005 }); // Slower revolution
};

Array(500).fill().forEach(createStar); // Create 500 stars

// Add fbx model which rotates slowly
const loader = new FBXLoader();
loader.load('src/assets/Stylized Planets.fbx', (obj) => { 
  obj.position.set(-10, 0, -100); // Move the model down
  obj.scale.set(0.1, 0.1, 0.1); // Scale down the model
  scene.add(obj);
});

// Load textures
const textureLoader = new THREE.TextureLoader();
const baseColor = textureLoader.load('src/assets/Textures/Saturn 4K/Saturn2_Saturn_BaseColor.png');
const normalMap = textureLoader.load('src/assets/Textures/Saturn 4K/Saturn2_Saturn_Normal.png');
const roughnessMap = textureLoader.load('src/assets/Textures/Saturn 4K/Saturn2_Saturn_Roughness.png');
const metallicMap = textureLoader.load('src/assets/Textures/Saturn 4K/Saturn2_Saturn_Metallic.png');

// Load FBX model
loader.load('src/assets/Stylized Planets.fbx', (obj) => {
  obj.position.set(-10, 0, -100); // Adjust position
  obj.scale.set(0.1, 0.1, 0.1); // Scale model

  obj.traverse((child) => {
    if (child.isMesh) {
      // Apply textures to the mesh material
      child.material = new THREE.MeshStandardMaterial({
        map: baseColor,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        metalnessMap: metallicMap,
      });
    }
  });

  scene.add(obj); // Add the model to the scene
});

// Resize Handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation Loop
let time = 0;
const animate = () => {
  requestAnimationFrame(animate);

  // Update star positions for horizontal and vertical revolving motion
  stars.forEach((data) => {
    const { star, radius, speed, y } = data;
    data.theta += speed; // Increment the angle of rotation
    const x = radius * Math.cos(data.theta);
    const z = radius * Math.sin(data.theta);

    star.position.set(x, y, z); // Maintain the randomized y-position
  });

  // Twinkling Effect
  time += 0.1; // Faster twinkling
  stars.forEach(({ star }, index) => {
    const intensity = Math.abs(Math.sin(time + index * 0.5)) * 1.5 + 0.5; // Stronger twinkle
    star.material.color.setScalar(intensity);
  });

  renderer.render(scene, camera);
};

animate();
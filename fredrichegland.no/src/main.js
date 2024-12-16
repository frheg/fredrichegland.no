import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// Setup
const scene = new THREE.Scene(); // The container for all objects
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // The camera that sees the scene
camera.position.set(0, 5, 5); // Set the camera position to 5 units on the z-axis
const renderer = new THREE.WebGLRenderer({  // The renderer that displays the scene
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio); // Set the pixel ratio of the renderer to the device pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the renderer to the window size
camera.position.setZ(30); // Set the camera position to 30 units on the z-axis

// Objects
const pointLight = new THREE.PointLight(0xffffff); // Create a point light
pointLight.intensity = 500; // Set the intensity of the light
pointLight.position.set(10, 20, 10); // Set the position of the point light

const ambientLight = new THREE.AmbientLight(0xffffff); // Create an ambient light
scene.add(pointLight, ambientLight); // Add the light to the scene

const lightHelper = new THREE.PointLightHelper(pointLight); // Create a light helper
const gridHelper = new THREE.GridHelper(200, 50); // Create a grid helper
scene.add(lightHelper, gridHelper); // Add the helpers to the scene

const controls = new OrbitControls(camera, renderer.domElement); // Create orbit controls 
controls.enableDamping = true; // Enable damping

function addStar() {
  const geometry = new THREE.SphereGeometry(0.05); 
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); // Create random coordinates

  star.position.set(x, y, z); // Set the position of the star
  scene.add(star); // Add the star to the scene
}

Array(5000).fill().forEach(addStar); // Create 200 stars

// Add loading screen to the scene
const loader = new THREE.TextureLoader(); // Create a texture loader
const loadingScreen = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
};
loadingScreen.camera.position.setZ(30); // Set the camera position to 30 units on the z-axis
const loadingManager = new THREE.LoadingManager(() => {
  const loadingScreen = document.getElementById('loading-screen'); // Get the loading screen
  loadingScreen.classList.add('fade-out'); // Add fade out class
  loadingScreen.addEventListener('transitionend', onTransitionEnd); // Add event listener
});



// const spaceTexture = new THREE.TextureLoader().load('src/assets/SpaceIllustration.jpg'); // Load the space texture
// scene.background = spaceTexture; // Set the space texture as the background

// FBX model
const fbx = new FBXLoader(); // Create a FBX loader
fbx.load('src/assets/MotherBoard.fbx', (object) => { // Load the FBX model
  scene.add(object); // Add the model to the scene
});

// Move around with arrow keys according to vector position such that the camera moves in the direction of the camera
function moveCamera() {
  const t = document.body.getBoundingClientRect().top; // Get the top position of the document
  camera.position.x = t * -0.01; // Move the camera to the left or right
  camera.position.y = t * -0.0002; // Move the camera up or down
  camera.position.z = t * -0.01; // Move the camera forward or backward
}

function animate() {
  requestAnimationFrame(animate); // Request the browser to call the function again

  controls.update(); // Update the controls

  renderer.render(scene, camera); // Render the scene
}
animate(); // Call the function

// Resize Handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

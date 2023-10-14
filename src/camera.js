import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
import {
  canvas,
  scene,
  gui,
  adjustNum,
  adjustStep,
  debugObject,
} from "./base.js";

/**
 * Sizes
 */
import { sizes } from "./sizes";

export { camera, controls };

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;//1
camera.position.y = 0;//0
camera.position.z = 1;//1

// work Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = false;

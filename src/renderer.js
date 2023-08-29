import * as THREE from "three";

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

export { renderer };

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = "#060505";
//debugObject.clearColor = '#1c1c1c'
renderer.setClearColor(debugObject.clearColor);
gui
  .addColor(debugObject, "clearColor")
  .onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
  })
  .name("backgroundColor");

import * as THREE from "three";
import firefliesVertexShader from "./shader/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shader/fireflies/fragment.glsl";

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

export { firefliesGeometry, firefliesCount, firefliesMaterial }
/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);
const positionArrayXadjust = -0.5;
const positionArrayYadjust = 0.5;
const positionArrayZadjust = -0.4;
for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() + positionArrayXadjust) * 1;
  positionArray[i * 3 + 1] = (Math.random() + positionArrayYadjust) * 1;
  positionArray[i * 3 + 2] = (Math.random() + positionArrayZadjust) * 1;
  scaleArray[i] = Math.random();
}
firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);
// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 250 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
gui
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("firefliesSize");
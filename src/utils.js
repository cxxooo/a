import * as THREE from "three";
import CANNON from "cannon";


import {hitSound, playHitSound, textureLoader, dracoLoader, environmentMapTexture, bakedTexture, xTexture, weaveXTexture, torusKnotSphereTexture, torusKnotSphereTexture_blackwhite} from "./loaders";
export {sphereShapeScale, objectToUpdate, sphereBeginPosition, sphereGeometry, sphereMaterial}

/**
 * Unils
 */
const sphereShapeScale = 0.5;
const objectToUpdate = [];
const sphereBeginPosition = new CANNON.Vec3(0, 3, 0);
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
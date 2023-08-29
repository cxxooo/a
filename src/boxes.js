import * as THREE from "three";
import CANNON from "cannon";

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
 * Unils
 */
import {
  sphereShapeScale,
  objectToUpdate,
  sphereBeginPosition,
  sphereGeometry,
  sphereMaterial,
} from "./utils";

import { world, planet, concreteMaterial, plasticMaterial } from "./physics";

import {
  hitSound,
  playHitSound,
  textureLoader,
  dracoLoader,
  environmentMapTexture,
  bakedTexture,
  xTexture,
  weaveXTexture,
  torusKnotSphereTexture,
  torusKnotSphereTexture_blackwhite,
} from "./loaders";

export { boxes, createBox };

let boxes = [];

// box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshMatcapMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: plasticMaterial,
  });

  body.applyLocalForce(
    new CANNON.Vec3(
      (Math.random() - 1) * 5,
      (Math.random() - 1) * 5,
      (Math.random() - 1) * 5
    ),
    new CANNON.Vec3(0, 0, 0)
  );
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  // save in objects to update
  objectToUpdate.push({
    mesh,
    body,
  });

    boxes.push({
        mesh,
        body,
    });
};

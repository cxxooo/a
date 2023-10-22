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
import {sphereShapeScale, objectToUpdate, sphereBeginPosition, sphereGeometry, sphereMaterial} from "./utils";

import {world, planet, concreteMaterial, plasticMaterial} from "./physics";

import {hitSound, playHitSound, textureLoader, dracoLoader, environmentMapTexture, bakedTexture, xTexture, weaveXTexture, torusKnotSphereTexture, torusKnotSphereTexture_blackwhite} from "./loaders";

export { spheres, createSphere};

//------------------
//專門存sphere的數組
let spheres = [];
//---------------------------
const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  scene.add(mesh);

  //Cannon.js body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    // begin position
    //position: new CANNON.Vec3(0, 3, 0),
    position: sphereBeginPosition,
    shape,
    material: plasticMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);

  world.addBody(body);

  // Save in objects to update
  objectToUpdate.push({
    mesh,
    body,
  });

  //----------------------------
  spheres.push({
    mesh,
    body,
  });
  //spheres.add(body)

  //console.log(objectToUpdate)
};
import * as THREE from "three";
import CANNON from "cannon";

//material
import {
    bakedMaterial,
    tubeTransparentMaterial,
    floorSphereMeshMaterial,
    crossingBakedMaterial,
    xMaterial,
    normalMaterial,
    reflectiveSphereMaterial,
    reflectiveSphereMaterial_blackwhite,
    tubeWireFrameMaterial,
    crossingMaterial,
    parametersGeo,
    materialGeo,
  } from "./material";

export {world, planet, concreteMaterial, plasticMaterial}

// /**
//  * Physics
//  */
// world
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
//world.gravity.set(0, 0, 0)
// material
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(concretePlasticContactMaterial);

//planet
const planetRadius = 0.7;
const planetPositionX = 0;
const planetPositionY = 0;
const planetPositionZ = 0;
const planetPosition = new CANNON.Vec3(
  planetPositionX,
  planetPositionY,
  planetPositionZ
);
const planetShape = new CANNON.Sphere(planetRadius);
const planetBody = new CANNON.Body();
planetBody.position = planetPosition;
planetBody.material = concreteMaterial;
planetBody.mass = 0;
planetBody.addShape(planetShape);
planetBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
);
world.addBody(planetBody);
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(planetRadius, 10),
  floorSphereMeshMaterial
);
planet.position.set(planetPositionX, planetPositionY, planetPositionZ);
planet.receiveShadow = true;
//planet.rotation.x = - Math.PI * 0.5

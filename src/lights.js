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


// todo: change to a function later

/**
 * Lights
 */
// test geo material
let directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
// physical material

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)
//directional light
directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)
import * as THREE from "three";

//loader
import {
    hitSound,
    playHitSound,
    textureLoader,
    dracoLoader,
    gltfLoader,
    environmentMapTexture,
    bakedTexture,
    xTexture,
    weaveXTexture,
    torusKnotSphereTexture,
    torusKnotSphereTexture_blackwhite,
  } from "./loaders";

export {bakedMaterial, tubeTransparentMaterial, floorSphereMeshMaterial, crossingBakedMaterial, xMaterial, normalMaterial, reflectiveSphereMaterial, reflectiveSphereMaterial_blackwhite, tubeWireFrameMaterial, crossingMaterial, parametersGeo, materialGeo}

/**
 * Material
 */
//Bake material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// tube transparent material
const tubeTransparentMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffe5,
});

// floor material
const floorSphereMeshMaterial = new THREE.MeshBasicMaterial({
  color: 0x91989f,
  // transparent: true,
  // alphy: 0.1
});
floorSphereMeshMaterial.wireframe = true;
floorSphereMeshMaterial.transparent = true;
floorSphereMeshMaterial.opacity = 0.1;

// weave x crossing material
const crossingBakedMaterial = new THREE.MeshBasicMaterial({
  map: weaveXTexture,
  alpha: 0.2,
});

// crossing material
const xMaterial = new THREE.MeshBasicMaterial({ map: xTexture });
const normalMaterial = new THREE.MeshNormalMaterial();

// reflective sphere from torusKnot blender scene
const reflectiveSphereMaterial = new THREE.MeshBasicMaterial({
  map: torusKnotSphereTexture,
});

// reflective sphere from torusKnot blender scene (adjustment: black white)
const reflectiveSphereMaterial_blackwhite = new THREE.MeshBasicMaterial({
  map: torusKnotSphereTexture_blackwhite,
});

// tube material
const tubeWireFrameMaterial = new THREE.MeshBasicMaterial({
  color: 0x91989f,
  // transparent: true,
  // alphy: 0.1
});
tubeWireFrameMaterial.wireframe = true;
tubeWireFrameMaterial.transparent = true;
tubeWireFrameMaterial.opacity = 0.2;
// crossing material
const crossingMaterial = new THREE.MeshBasicMaterial({
  //color:0xD0104C
  color: 0xf53733,
});

// geometry material
const parametersGeo = { materialColor: "#ffeded" };
const materialGeo = new THREE.MeshToonMaterial({
  color: parametersGeo.materialColor,
});
//const materialGeo = new THREE.MeshNormalMaterial
materialGeo.shininess = 100;
materialGeo.specular = new THREE.Color(0x1188ff);
materialGeo.metalness = 1;
materialGeo.roughness = 0;
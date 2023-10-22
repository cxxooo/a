import * as THREE from "three";

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

export {torusKnotGeometryMesh, torusKnotGeometryMeshScaleNumber}

/**
 * Objects
 */

//Meshes
const torusKnotGeometryMesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.2, 64, 60),
  materialGeo
);
torusKnotGeometryMesh.position.set(0, -1, 0);
const torusKnotGeometryMeshScaleNumber = 0.1;
torusKnotGeometryMesh.scale.set(
  torusKnotGeometryMeshScaleNumber,
  torusKnotGeometryMeshScaleNumber,
  torusKnotGeometryMeshScaleNumber
);


/**
 * Test mesh with RawShaderMaterial
 */
// // Geometry
// const geometry = new THREE.PlaneBufferGeometry(1,1,32,32)
// //Material
// const material = new THREE.RawShaderMaterial()
// //Mesh
// const mesh = new THREE.Mesh(geometry, material)
// mesh.position.set(0, -1,0)
// scene.add(mesh)
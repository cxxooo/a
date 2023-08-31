// walking on the sphere surface
// physics - distanceConstraint - force the bodies to keep a distance between each other
// set pinkballs replaces the sphere

//todo resize
import * as THREE from "three";
import CANNON from "cannon";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { HoloEffect } from "./HoloEffect.js";

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
 * Loaders
 */
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

import { gltfLoader } from "./loaders";

/**
 * Material
 */
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

/**
 * Physics
 */
import { world, planet, concreteMaterial, plasticMaterial } from "./physics";
scene.add(planet);

/**
 * Objects
 */
import {
  torusKnotGeometryMesh,
  torusKnotGeometryMeshScaleNumber,
} from "./objects";
scene.add(torusKnotGeometryMesh);

// GUI
gui
  .addColor(parametersGeo, "materialColor")
  .onChange(() => {
    materialGeo.color.set(parametersGeo.materialColor);
  })
  .name("geometryColor");
gui
  .add(torusKnotGeometryMesh.position, "x")
  .min(-adjustNum)
  .max(adjustNum)
  .step(adjustStep)
  .name("torusKnotGeometryMeshX");
gui
  .add(torusKnotGeometryMesh.position, "y")
  .min(-adjustNum)
  .max(adjustNum)
  .step(adjustStep)
  .name("torusKnotGeometryMeshY");
gui
  .add(torusKnotGeometryMesh.position, "z")
  .min(-adjustNum)
  .max(adjustNum)
  .step(adjustStep)
  .name("torusKnotGeometryMeshZ");

/**
 * Models
 */
let mixer = null;
// static pinkball
gltfLoader.load(
  "230817_pinkball_static_test.glb",
  //'230817_pinkball_surface_test.glb',
  //'230816_pinkball_test_orbit_ani.glb',
  //'230816_pinkball_test_xani.glb',
  //'230815_pinkball_test_trans_tube.glb',
  //'230815_pinkball_test.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = bakedMaterial;
    });

    //Get each objects
    const floorSphereMesh = gltf.scene.children.find(
      (child) => child.name === "Sphere"
    );
    floorSphereMesh.visible = false;
    // Apply materials
    floorSphereMesh.material = floorSphereMeshMaterial;

    scene.add(gltf.scene);
  }
);
// pinkball animation
gltfLoader.load("230817_pinkball_ani_test.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
  });

  //Get each object
  const orbitPinkBall = gltf.scene.children.find(
    (child) => child.name === "pinkball_top_animation"
  );

  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
  scene.add(gltf.scene);
});
// weave crossing
gltfLoader.load("crossing_weave_x.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = crossingBakedMaterial;
  });

  //Get each object
  const weaveXCrossing = gltf.scene.children.find(
    (child) => child.name === "weaveCross"
  );
  weaveXCrossing.visible = false;
  // mixer = new THREE.AnimationMixer(gltf.scene)
  // const action = mixer.clipAction(gltf.animations[0])
  // action.play()
  scene.add(gltf.scene);
});
// TorusKnot from blender
gltfLoader.load("230826cup.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    //child.material = reflectiveSphereMaterial
    child.material = reflectiveSphereMaterial_blackwhite;
  });

  // Get each object
  const crossingInTube = gltf.scene.children.find(
    (child) => child.name === "weaveCross_enter_in"
  );
  const crossingEntrance = gltf.scene.children.find(
    (child) => child.name === "weaveCross_enter"
  );
  const torusKnotInBlender = gltf.scene.children.find(
    (child) => child.name === "tube"
  );
  crossingEntrance.visible = false;
  crossingInTube.visible = false;
  //apply materials
  torusKnotInBlender.material = tubeWireFrameMaterial;
  // crossingEntrance.material = crossingMaterial

  scene.add(gltf.scene);
});
// crossing control from blender
gltfLoader.load("230826crossing_control.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = crossingMaterial;
  });
  scene.add(gltf.scene);
});
// locomotion path from blender
gltfLoader.load("230827path.glb", (gltf) => {
  gltf.scene.traverse((child) => {});
  scene.add(gltf.scene);
});

// //test control cube move
// const controlCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }))
// let cubeEdgeScale = 0.1
// controlCube.scale.set(cubeEdgeScale, cubeEdgeScale, cubeEdgeScale)
// //controlCube.position.set(0,0,0)
// scene.add(controlCube)

// // key controls
// //document - web page loaded in brower
// //onkeydown - listens for when a key is pressed; if so, fires an event
// //function - runs when event fired (key pressed)
// //(e) - the event that fired; info on which key was pressed; can use any name: e, event
// document.onkeydown = function (e) {
//   let moveRate = -0.05

//   // print out onkeydown event
//   //console.log(e);

//   if (e.keyCode === 37 || e.keyCode === 65) {
//     // if left arrow key pressed
//     controlCube.position.x -= moveRate;// change x by moveRate LEFT
//   }
//   if (e.keyCode === 39 || e.keyCode === 68) {
//     // if left arrow key pressed
//     controlCube.position.x += moveRate;// change x by moveRate RIGHT
//   }
//   if (e.keyCode === 38 || e.keyCode === 87) {
//     // if left arrow key pressed
//     controlCube.position.z -= moveRate;// change x by moveRate FORWARD
//   }
//   if (e.keyCode === 40 || e.keyCode === 83) {
//     // if left arrow key pressed
//     controlCube.position.z += moveRate;// change x by moveRate BACKWARD
//   }
// }

/**
 * Lights
 */
// todo: use './lights.js' later

/**
 * Fireflies
 */
import {
  firefliesGeometry,
  firefliesCount,
  firefliesMaterial,
} from "./fireflies";

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

/**
 * Sizes
 */
import { sizes } from "./sizes";

/**
 * Camera
 */
import { camera, controls } from "./camera";

/**
 * Renderer
 */
import { renderer } from "./renderer";

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

/**
 * Spheres
 */
// import { spheres, createSphere } from "./spheres";

// createSphere(sphereShapeScale, { x: 0, y: 3, z: 0 });
// createSphere(sphereShapeScale, sphereBeginPosition);
// //console.log(objectToUpdate)

/**
 * createBox
 */
import { boxes, createBox } from "./boxes";
// createBox(1, 1, 1, { x: 0, y: 3, z: 0 });

// const sphereMaterial = new THREE.MeshStandardMaterial({
//   metalness: 0.3,
//   roughness: 0.4,

// todo replicating amazing midwarm.com look with threejs
// import {useState} from 'react'
// const [userData, setUserData] = useState({})

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

//todo setting()
const params = {
  progress: 0,
  exposure: 2,
  bloomStrength: 1, //3//1.5
  bloomThreshold: 0.05, //0.01//0.05
  bloomRadius: 0.8, //0.27//0.8
};
// post-processing GUI
gui.add(params, "progress", 0, 3, 0.01).onChange(()=>{
  holoEffect.uniforms.progress.value = params.progress;
});
gui.add(params, "exposure", 0, 3, 0.01).onChange(()=>{
  renderer.toneMappingExposure = params.exposure;
});
gui.add(params, "bloomStrength", 0, 3, 0.01).onChange((val)=>{
  bloomPass.strength = val;
});
gui.add(params, "bloomThreshold", 0, 3, 0.01).onChange((val)=>{
  bloomPass.threshold = val;
});
gui.add(params, "bloomRadius", 0, 3, 0.01).onChange((val)=>{
  bloomPass.radius = val;
});

//todo initPost()
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const holoEffect = new ShaderPass(HoloEffect);
//holoEffect.uniforms['scale'].value = 4;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(holoEffect);

//todo composer resize
composer.setSize(sizes.width, sizes.height);

//todo define
let envMap, m;
const humanScale = 0.6;
let exportHumanModel;
let getChildHumanModel;
// define humanModel to get huamnModel in new THREE.TextureLoader().load('env.jpg', (texture)
//let humanModel;

//! pmremGenerator
const pmremGenertor = new THREE.PMREMGenerator(renderer);
pmremGenertor.compileEquirectangularShader();

new THREE.TextureLoader().load("env.jpg", (texture) => {
  envMap = pmremGenertor.fromEquirectangular(texture).texture;
  //envMap.mapping = THREE.EquirectangularReflectionMapping;
  //console.log(envMap);
  //console.log(envMapTextureLoader)
  pmremGenertor.dispose();

  // !shader human yuri
  gltfLoader.load("shadertest_yuri_human.glb", (gltf) => {
    gltf.scene.traverse((child) => {});
    const humanModelObject = gltf.scene;
    exportHumanModel = humanModelObject;
    // get human model
    const humanModel = gltf.scene.children.find(
      (child) => (child) => child.name === "HG_Body"
    );
    humanModel.scale.set(humanScale, humanScale, humanScale);
    humanModel.geometry.center();
    getChildHumanModel = humanModel;

    // apply material
    //humanModel.material = humanModelMaterial
    m = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.28,
    });
    m.envMap = envMap;
    m.onBeforeCompile = (shader) => {
      //m.userData.shader = shader
      shader.uniforms.uTime = { value: 0 };

      shader.fragmentShader =
        `
      uniform float uTime;
      mat4 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        
        return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                    0.0,                                0.0,                                0.0,                                1.0);
    }
    
    vec3 rotate(vec3 v, vec3 axis, float angle) {
      mat4 m = rotationMatrix(axis, angle);
      return (m * vec4(v, 1.0)).xyz;
    }
      ` + shader.fragmentShader;
      //! userData
      // m.userData.shader = shader;
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <envmap_physical_pars_fragment>`,
        `#ifdef USE_ENVMAP

      vec3 getIBLIrradiance( const in vec3 normal ) {
    
        #ifdef ENVMAP_TYPE_CUBE_UV
    
          vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
    
          vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
    
          return PI * envMapColor.rgb * envMapIntensity;
    
        #else
    
          return vec3( 0.0 );
    
        #endif
    
      }
    
      vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
    
        #ifdef ENVMAP_TYPE_CUBE_UV
    
          vec3 reflectVec = reflect( - viewDir, normal );
    
          // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
          reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
    
          reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
    
          reflectVec = rotate(reflectVec, vec3(1.0, 0.0, 0.0), uTime*0.05);

          vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
    
          return envMapColor.rgb * envMapIntensity;
    
        #else
    
          return vec3( 0.0 );
    
        #endif
    
      }
    
      #ifdef USE_ANISOTROPY
    
        vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
    
          #ifdef ENVMAP_TYPE_CUBE_UV
    
            // https://google.github.io/filament/Filament.md.html#lighting/imagebasedlights/anisotropy
            vec3 bentNormal = cross( bitangent, viewDir );
            bentNormal = normalize( cross( bentNormal, bitangent ) );
            bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
    
            return getIBLRadiance( viewDir, bentNormal, roughness );
    
          #else
    
            return vec3( 0.0 );
    
          #endif
    
        }
    
      #endif
    
    #endif`
      );
      m.userData.shader = shader;
    };
    humanModel.material = m;
    // scene add
    scene.add(humanModelObject);
    // print humanModel
    //console.log("[inner]humanModel = " + humanModel);
  });
});

// print humanModel
// console.log("[outer]humanModel = "  + humanModel)

// // !shader human yuri
// gltfLoader.load(
//   'shadertest_yuri_human.glb',
//   (gltf) => {
//     gltf.scene.traverse((child) => {
//     })
//     // get human model
//     const humanModel = gltf.scene.children.find(child =>
//       child => child.name === 'HG_Body')
//     humanModel.scale.set(1, 1, 1)
//     humanModel.geometry.center()
//     // apply material
//     //humanModel.material = humanModelMaterial
//     // scene add
//     scene.add(gltf.scene)
//   }
// )

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const time = 0;

const tick = () => {
  //exportHumanModel.rotation.y +=0.01

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update physics
  // world.step(a fixed time, how much time passed since the last step, how much iterations the world can apply to catch up with a potential delay)
  world.step(1 / 60, deltaTime, 3);

  //------------------
  // for (const object of spheres) {
  //   let x = 1 / object.body.position.x;
  //   //不能有xyz達到0
  //   object.body.applyLocalForce(
  //     new CANNON.Vec3(
  //       -10 * object.body.position.x,
  //       -10 * object.body.position.y,
  //       -10 * object.body.position.z
  //     ),
  //     new CANNON.Vec3(0, 0, 0)
  //   );
  //   object.mesh.quaternion.copy(object.body.quaternion);
  // }
  for (const object of objectToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Update Material
  //firefliesMaterial.uniforms.uTime.value = elapsedTime;

  //m.userData.shader.uniforms.uTime.value = elapsedTime
  //!export model //console.log(exportHumanModel)
  if (getChildHumanModel) {
    if (m.userData) {
      //console.log(m.userData.shader)
      if (m.userData.shader) {
        getChildHumanModel.material.userData.shader.uniforms.uTime.value =
          elapsedTime;
        holoEffect.uniforms.uTime.value = elapsedTime;
      }
    }
    getChildHumanModel.rotation.y = elapsedTime * 0.05;
    //getChildHumanModel.rotation.y -=0.01
  }
  //console.log(exportHumanModel)
  //console.log(getChildHumanModel)

  // if m.userData exists, update shader uniforms
  // print humanModel
  // if (m && m.userData && m.userData.shader && m.userData.shader.uniforms) {
  //   console.log("[outer]humanModel = " + humanModel);
  //   console.log("[outer]humanModel.userData = " + humanModel.userData);
  //   console.log(
  //     "[outer]humanModel.userData.shader = " + humanModel.userData.shader
  //   );
  //   console.log("m.userData = " + m.userData);
  //   console.log("m.userData.shader = " + m.userData.shader);
  //   console.log("m.userData.shader.uniforms = " + m.userData.shader.uniforms);

  //   humanModel.userData.shader.uniforms.uTime.value = elapsedTime + 0.05;
  // }

  // Update mixer
  if (mixer !== null) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  //todo humanmodel.userData.shader.uniforms.uTime.value = time
  //time += 0.05

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
  composer.render(scene, camera);
};
tick();

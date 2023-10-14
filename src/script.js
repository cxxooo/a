// all the models has been temporarily cancelled "add into scene"

//todo resize
import * as THREE from "three";
import CANNON from "cannon";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { HoloEffect } from "./HoloEffect.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gltfLoader } from "./loaders";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
//scene.add(planet);

/**
 * Objects
 */
import {
  torusKnotGeometryMesh,
  torusKnotGeometryMeshScaleNumber,
} from "./objects";
//scene.add(torusKnotGeometryMesh);

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

    //scene.add(gltf.scene);
  }
);
// frame scene with pinkball
gltfLoader.load("230907cup_bg_constructionFrame.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = tubeWireFrameMaterial;
  });

  //Get each objects
  const floorSphereMesh = gltf.scene.children.find(
    (child) => child.name === "Sphere"
  );
  //floorSphereMesh.visible = false;
  // Apply materials
  //floorSphereMesh.material = floorSphereMeshMaterial;

  scene.add(gltf.scene);
});
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
  //scene.add(gltf.scene);
});

// points of interest
const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector(".point-0"),
  },
];

/**
 * Lights
 */
// todo: use './lights.js' later
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
ambientLight.position.set(2, 2, 2);
scene.add(ambientLight);
const rollup = gui.addFolder("Ambient");
rollup.add(ambientLight, "visible");
rollup.add(ambientLight, "intensity", 0.0, 1.0);
rollup.add(ambientLight.color, "r", 0.0, 1.0);
rollup.add(ambientLight.color, "g", 0.0, 1.0);
rollup.add(ambientLight.color, "b", 0.0, 1.0);

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
//scene.add(fireflies);

/**
 * Sizes
 */
//import { sizes } from "./sizes";
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Fullscreen
 */
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
 * Camera
 */
import { camera, controls } from "./camera";
// const camera = new THREE.PerspectiveCamera(
//   45,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.x = 1;
// camera.position.y = 0;
// camera.position.z = 1;

// work Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

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

// let scene_scrolling = new THREE.Scene();
//   // *background texture
//   //blur
//   const bgTexture_blur = textureLoader.load(
//     "scene_scrolling_blur_bg_1_darker.jpg"
//   );
//   //const bgTexture_blur = textureLoader.load("scene_scrolling_blur_bg_1.jpg");
//   bgTexture_blur.colorSpace = THREE.SRGBColorSpace;
//   scene.background = bgTexture_blur;
//   //snow
//   const bgTexture_snow = textureLoader.load("scene_scrolling_snow_bg_1.jpg");
//   bgTexture_snow.colorSpace = THREE.SRGBColorSpace;
//   scene.background = bgTexture_snow;
//   //snow bump
//   const bgTexture_snowbump = textureLoader.load(
//     "scene_scrolling_blur_bg_1.jpg"
//   );
//   bgTexture_snowbump.colorSpace = THREE.SRGBColorSpace;
//   //scene.background = bgTexture_snowbump;
//   // *object texture
//   //blur
//   const textureBlur = textureLoader.load("blur.jpeg");
//   textureBlur.colorSpace = THREE.SRGBColorSpace;
//   //snow
//   const textureSnow = textureLoader.load("snow.jpeg");
//   textureSnow.colorSpace = THREE.SRGBColorSpace;
//   //snowbump
//   const textureSnowbump = textureLoader.load("snowbump.jpeg");
//   textureSnowbump.colorSpace = THREE.SRGBColorSpace;
//   // *material
//   let materialBlur = new THREE.MeshMatcapMaterial({
//     matcap: textureBlur,
//   });
//   let geometry_scrolling = new THREE.BoxGeometry(0.2, 0.2, 0.2);
//   let mesh_scrolling = new THREE.Mesh(geometry_scrolling, materialBlur);

//   for (let index = 0; index < 300; index++) {
//     let random = new THREE.Vector3().randomDirection();
//     let clone = mesh_scrolling.clone();
//     clone.position.copy(random);
//     clone.rotation.x = Math.random();
//     clone.rotation.y = Math.random();
//     scene.add(clone);
//   }
// const scenes = [
//   {
//     background: bgTexture_blur,
//     matcap: textureBlur,
//   },
//   {
//     background: bgTexture_snow,
//     matcap: textureSnow,
//   },
//   {
//     background: bgTexture_snowbump,
//     matcap: textureSnowbump,
//   },
// ];

// todo replicating amazing midwarm.com look with threejs

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

//todo setting()
const params = {
  progress: 0, //*0.09
  exposure: 0.68, //!2//*2.05
  bloomStrength: 3, //3//1.5//!1//*0.79
  bloomThreshold: 0.15, //0.01//0.05//!0.05//*0
  bloomRadius: 0, //0.27//0.8//!0.8//*3
};
// post-processing GUI
gui.add(params, "progress", 0, 3, 0.01).onChange(() => {
  holoEffect.uniforms.progress.value = params.progress;
});
gui.add(params, "exposure", 0, 3, 0.01).onChange(() => {
  renderer.toneMappingExposure = params.exposure;
});
gui.add(params, "bloomStrength", 0, 3, 0.01).onChange((val) => {
  bloomPass.strength = val;
});
gui.add(params, "bloomThreshold", 0, 3, 0.01).onChange((val) => {
  bloomPass.threshold = val;
});
gui.add(params, "bloomRadius", 0, 3, 0.01).onChange((val) => {
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
  });
});

//scroll based camera animation
//curve from blender
const begin_point = new THREE.Vector3(0, 0, 0);
const b = new THREE.Vector3(0, -0.142024, 0.86075);
const c = new THREE.Vector3(0, -1.58378, 0.86075);
const d = new THREE.Vector3(0, -1.58378, -0.744549);
const e = new THREE.Vector3(0.886572, -0.529361, -0.744549);
const f = new THREE.Vector3(0.886572, -0.525057, 0.374426);
const g = new THREE.Vector3(-0.20658, -1.23087, 0.374426);
const h = new THREE.Vector3(-0.185061, -2.20352, -0.124809);
const i = new THREE.Vector3(0.921002, -2.07441, -0.124809);
const j = new THREE.Vector3(0.908091, -1.34277, -0.228099);
const end_point = new THREE.Vector3(-0.060253, -0.357211, -0.064556);
//const end_point =new THREE.Vector3(-0.088651, -0.381501, -0.06975)
//isline ismesh DIFFERENCE
const blender_curve = new THREE.CatmullRomCurve3([
  begin_point,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  end_point,
  begin_point,
]);

/**
 * GPT
 */
const gpt_geometry = new THREE.TubeGeometry(blender_curve, 200, 0.01, 2, true);
const gpt_material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe:true 
});
const gpt_tubeMesh = new THREE.Mesh(gpt_geometry, gpt_material);
// gpt_tubeMesh.rotation.x = Math.PI * 0.5;
// gpt_tubeMesh.rotation.z = Math.PI;
// gpt_tubeMesh.rotation.y = Math.PI;

scene.add(gpt_tubeMesh);
/**
 * GPT
 */
const blender_points = blender_curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(blender_points);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

let cameraProgress = 0;

document.addEventListener(
  "mousewheel",
  (event) => {
    cameraProgress += event.deltaY / 1000;
  },
  false
);

//VARIABLES
const position = new THREE.Vector3(); //camera position on curve
const cameraTarget = new THREE.Object3D(); // where camera will look at
const looptime = 50; //looptime (speed of roller coaster)

function updateCamera() {
  // const time = clock.getElapsedTime();
  const time = cameraProgress;
  const t = (time % looptime) / looptime;
  const t2 = ((time + 0.01) % looptime) / looptime;

  console.log(gpt_tubeMesh.rotation );

  const pos = gpt_tubeMesh.geometry.parameters.path.getPointAt(t);
  const pos2 = gpt_tubeMesh.geometry.parameters.path.getPointAt(t2);

  camera.position.set(
    pos.x,
    pos.y + 0.004,
    pos.z
  );
  cameraTarget.position.set(
    pos2.x,
    pos2.y + 0.004,
    pos2.z
  );

  camera.lookAt(cameraTarget.position);
}


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
  }

  //scroll
  updateCamera();

  // Update mixer
  if (mixer !== null) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // go through each point
  // for(const point of points)
  // {
  //     const screenPosition = point.position.clone()
  //     screenPosition.project(camera)

  //     const translateX = screenPosition.x * sizes.width * 0.5
  //     const translateY = -screenPosition.y * sizes.height * 0.5
  //     point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
  // }

  // Render
  renderer.render(scene, camera);

  //todo humanmodel.userData.shader.uniforms.uTime.value = time

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
  composer.render(scene, camera);
};
tick();

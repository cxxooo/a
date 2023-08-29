// walking on the sphere surface
// physics - distanceConstraint - force the bodies to keep a distance between each other
// set pinkballs replaces the sphere

import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MMDPhysics } from 'three/addons/animation/MMDPhysics.js'
import firefliesVertexShader from './shader/fireflies/vertex.glsl'
import firefliesFragmentShader from './shader/fireflies/fragment.glsl'
import CANNON from 'cannon'
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

//todo
// function initPost(){
//   const renderScene = new RenderPass(scene, camera)

//     const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
//     bloomPass.threshold = params.bloomThreshold
//     bloomPass.strength = params.bloomStrength
//     bloomPass.radius = params.bloomRadius

//     const composer = new EffectComposer(renderer)
//     composer.addPass(renderScene)
//     composer.addPass(bloomPass) 
// }

// function setting() {
//   const params = {
//     exposure: 2,
//     bloomStrength: 1.5,
//     bloomThreshold: 0,
//     bloomRadius: 0
//   }
// }
















/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

// Debug
const debugObject = {}
const gui = new dat.GUI({
  width: 400
})
const adjustNum = 20.0
const adjustStep = 0.01
//physics
debugObject.createSphere = () => {
  createSphere(
    Math.random() * 0.5,
    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    }
  )
}
debugObject.createBox = () => {
  createBox(
    Math.random(),
    Math.random(),
    Math.random(),
    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    }
  )
}
debugObject.reset = () => {
  for (const object of objectToUpdate) {
    // Remove body
    object.body.removeEventListener('collide', playHitSound)
    world.removeBody(object.body)

    // Remove mesh
    scene.remove(object.mesh)
  }
  objectToUpdate.splice(0, objectToUpdate.length)
}
gui.add(debugObject, 'reset')
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')




















/**
 * Center of Gravity
 */
scene.add(new THREE.AxesHelper(5))




















/**
 * Loaders
 */
// sound
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

// Texture loader
const textureLoader = new THREE.TextureLoader()
// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')
// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
// environment
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])
// bake texture pinkball
const bakedTexture = textureLoader.load('baked_adjust.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace
// bake texture crossing
const xTexture = textureLoader.load('bake_x_0820_solidify.jpg')
xTexture.flipY = false
xTexture.colorSpace = THREE.SRGBColorSpace
// bake texture weave crossing
const weaveXTexture = textureLoader.load('baked_gradient_ps.jpg')
weaveXTexture.flipY = false
weaveXTexture.colorSpace = THREE.SRGBColorSpace
// bake reflection small reflective spheres in torusKnot scene from blender
const torusKnotSphereTexture = textureLoader.load('bake_sphere_reflection.jpg')
torusKnotSphereTexture.flipY = false
torusKnotSphereTexture.colorSpace = THREE.SRGBColorSpace
// bake reflection small reflective spheres in torusKnot scene from blender (adjuestment: black white)
const torusKnotSphereTexture_blackwhite = textureLoader.load('bake_sphere_reflection_blackWhite.jpg')
torusKnotSphereTexture_blackwhite.flipY = false
torusKnotSphereTexture_blackwhite.colorSpace = THREE.SRGBColorSpace




















/**
 * Material
 */
//Bake material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// tube transparent material
const tubeTransparentMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// floor material
const floorSphereMeshMaterial = new THREE.MeshBasicMaterial({
  color: 0x91989F
  // transparent: true,
  // alphy: 0.1
})
floorSphereMeshMaterial.wireframe = true
floorSphereMeshMaterial.transparent = true
floorSphereMeshMaterial.opacity = 0.1

// weave x crossing material
const crossingBakedMaterial = new THREE.MeshBasicMaterial({
  map: weaveXTexture,
  alpha: 0.2
})

// crossing material
const xMaterial = new THREE.MeshBasicMaterial({ map: xTexture })
const normalMaterial = new THREE.MeshNormalMaterial()

// reflective sphere from torusKnot blender scene
const reflectiveSphereMaterial = new THREE.MeshBasicMaterial({ map: torusKnotSphereTexture })

// reflective sphere from torusKnot blender scene (adjustment: black white)
const reflectiveSphereMaterial_blackwhite = new THREE.MeshBasicMaterial({ map: torusKnotSphereTexture_blackwhite })

// tube material
const tubeWireFrameMaterial = new THREE.MeshBasicMaterial({
  color: 0x91989F
  // transparent: true,
  // alphy: 0.1
})
tubeWireFrameMaterial.wireframe = true
tubeWireFrameMaterial.transparent = true
tubeWireFrameMaterial.opacity = 0.2
// crossing material
const crossingMaterial = new THREE.MeshBasicMaterial({
  //color:0xD0104C
  color: 0xF53733
})

// geometry material
const parametersGeo = { materialColor: '#ffeded' }
const materialGeo = new THREE.MeshToonMaterial({ color: parametersGeo.materialColor })
//const materialGeo = new THREE.MeshNormalMaterial
materialGeo.shininess = 100
materialGeo.specular = new THREE.Color(0x1188ff)
materialGeo.metalness = 1
materialGeo.roughness = 0




















// /**
//  * Physics
//  */
// world
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
//world.gravity.set(0, 0, 0)
// material
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7
  }
)
world.addContactMaterial(concretePlasticContactMaterial)

//planet
const planetRadius = 0.7
const planetPositionX = 0
const planetPositionY = 0
const planetPositionZ = 0
const planetPosition = new CANNON.Vec3(planetPositionX, planetPositionY, planetPositionZ)
const planetShape = new CANNON.Sphere(planetRadius)
const planetBody = new CANNON.Body()
planetBody.position = planetPosition
planetBody.material = concreteMaterial
planetBody.mass = 0
planetBody.addShape(planetShape)
planetBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
world.addBody(planetBody)
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(planetRadius, 10),
  floorSphereMeshMaterial
)
planet.position.set(planetPositionX, planetPositionY, planetPositionZ)
planet.receiveShadow = true
//planet.rotation.x = - Math.PI * 0.5
scene.add(planet)




















/**
 * Objects
 */

//Meshes
const torusKnotGeometryMesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.2, 64, 60),
  materialGeo
)
torusKnotGeometryMesh.position.set(0, -1, 0)
const torusKnotGeometryMeshScaleNumber = 0.1
torusKnotGeometryMesh.scale.set(torusKnotGeometryMeshScaleNumber, torusKnotGeometryMeshScaleNumber, torusKnotGeometryMeshScaleNumber)
scene.add(torusKnotGeometryMesh)
// GUI
gui
  .addColor(parametersGeo, 'materialColor')
  .onChange(() => {
    materialGeo.color.set(parametersGeo.materialColor)
  })
  .name('geometryColor')
gui
  .add(torusKnotGeometryMesh.position, 'x')
  .min(-adjustNum)
  .max(adjustNum)
  .step(adjustStep)
  .name('torusKnotGeometryMeshX')
gui
  .add(torusKnotGeometryMesh.position, 'y')
  .min(-adjustNum)
  .max(adjustNum)
  .step(adjustStep)
  .name('torusKnotGeometryMeshY')
gui
  .add(torusKnotGeometryMesh.position, 'z')
  .min(-adjustNum)
  .max(adjustNum)
  .step(adjustStep)
  .name('torusKnotGeometryMeshZ')
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





















/**
 * Model
 */
let mixer = null
// static pinkball
gltfLoader.load(
  '230817_pinkball_static_test.glb',
  //'230817_pinkball_surface_test.glb',
  //'230816_pinkball_test_orbit_ani.glb',
  //'230816_pinkball_test_xani.glb',
  //'230815_pinkball_test_trans_tube.glb',
  //'230815_pinkball_test.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = bakedMaterial
    })

    //Get each objects
    const floorSphereMesh = gltf.scene.children.find(child => child.name === 'Sphere')
    floorSphereMesh.visible = false
    // Apply materials
    floorSphereMesh.material = floorSphereMeshMaterial

    scene.add(gltf.scene)
  }
)
// pinkball animation
gltfLoader.load(
  '230817_pinkball_ani_test.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = bakedMaterial
    })

    //Get each object
    const orbitPinkBall = gltf.scene.children.find(child => child.name === 'pinkball_top_animation')

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()
    scene.add(gltf.scene)
  }
)
// weave crossing
gltfLoader.load(
  'crossing_weave_x.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = crossingBakedMaterial
    })

    //Get each object
    const weaveXCrossing = gltf.scene.children.find(child => child.name === 'weaveCross')
    weaveXCrossing.visible = false
    // mixer = new THREE.AnimationMixer(gltf.scene)
    // const action = mixer.clipAction(gltf.animations[0])
    // action.play()
    scene.add(gltf.scene)
  }
)
// TorusKnot from blender
gltfLoader.load(
  '230826cup.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
      //child.material = reflectiveSphereMaterial
      child.material = reflectiveSphereMaterial_blackwhite
    })

    // Get each object
    const crossingInTube = gltf.scene.children.find(child => child.name === 'weaveCross_enter_in')
    const crossingEntrance = gltf.scene.children.find(child => child.name === 'weaveCross_enter')
    const torusKnotInBlender = gltf.scene.children.find(child => child.name === 'tube')
    crossingEntrance.visible = false
    crossingInTube.visible = false
    //apply materials
    torusKnotInBlender.material = tubeWireFrameMaterial
    // crossingEntrance.material = crossingMaterial

    scene.add(gltf.scene)
  }
)
// crossing control from blender
gltfLoader.load(
  '230826crossing_control.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = crossingMaterial
    })
    scene.add(gltf.scene)
  }
)
// locomotion path from blender
gltfLoader.load(
  '230827path.glb',
  (gltf) => {
    gltf.scene.traverse((child) => {
    })
    scene.add(gltf.scene)
  }
)

// //! pmremGenerator
// const pmremGenertor = new THREE.PMREMGenerator(renderer)
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
//     humanModel.material = new THREE.MeshBasicMaterial({
//       color: 0xff6600
//     })
//     // scene add
//     scene.add(gltf.scene)
//   }
// )

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
// test geo material
// const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
// directionalLight.position.set(1, 1, 0)
// scene.add(directionalLight)
// physical material

// ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
// scene.add(ambientLight)
// //directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)
























/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)
const positionArrayXadjust = -0.5
const positionArrayYadjust = 0.5
const positionArrayZadjust = -0.4
for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() + positionArrayXadjust) * 1
  positionArray[i * 3 + 1] = (Math.random() + positionArrayYadjust) * 1
  positionArray[i * 3 + 2] = (Math.random() + positionArrayZadjust) * 1
  scaleArray[i] = Math.random()
}
firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms:
  {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 250 }
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
})
gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')
// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)




















/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})




















/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 0
camera.position.z = 1
scene.add(camera)
// Debug
// gui.add(camera.position, 'x').min(-adjustNum).max(adjustNum).step(adjustStep).name('cameraX')
// gui.add(camera.position, 'y').min(-adjustNum).max(adjustNum).step(adjustStep).name('cameraY')
// gui.add(camera.position, 'z').min(-adjustNum).max(adjustNum).step(adjustStep).name('cameraZ')

// work Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// pointer lock controls
//const controls = new PointerLockControls(camera, document.body)
//add event listener to show/hide a ui (eg the game's menu)
// controls.addEventListener('lock', function(){
//   menu.style.display = 'none'
// })
// controls.addEventListener('unlock', function(){
//   menu.style.display = 'block'
// })


// // control crossing
// let moveForward = false
// let moveBackward = false
// let moveLeft = false
// let moveRight = false
// let jump = false

//const crossControls = new PointerLockControls(camera, renderer.domElement)
//controls.addEventListener()

// let moveRate = 9
// let turnRate = 5

// function updatePosition(offset){
//   position.x += offset;
//   position.y -= offset;
// }

// window.addEventListener(
//   "keydown",
//   (event) => {
//     if (event.defaultPrevented){
//       return;
//     }

//     switch(event.code){
//       case "keyS":
//         case"ArrowDown":
//         updatePosition(-moveRate);
//         break;
//         case "KeyW":
//       case "ArrowUp":
//         // Handle "forward"
//         updatePosition(moveRate);
//         break;
//       case "KeyA":
//       case "ArrowLeft":
//         // Handle "turn left"
//         angle -= turnRate;
//         break;
//       case "KeyD":
//       case "ArrowRight":
//         // Handle "turn right"
//         angle += turnRate;
//         break;
//     }
//     refresh();
//     if(event.code!=="Tab"){
//       event.preventDefault()
//     }
//   },
//   true,
// )




















/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = '#060505'
//debugObject.clearColor = '#1c1c1c'
renderer.setClearColor(debugObject.clearColor)
gui
  .addColor(debugObject, 'clearColor')
  .onChange(() => {
    renderer.setClearColor(debugObject.clearColor)
  })
  .name('backgroundColor')




















/**
* Unils
*/
const sphereShapeScale = 0.5
const objectToUpdate = []
const sphereBeginPosition = new CANNON.Vec3(0, 3, 0)
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})

//------------------
//專門存sphere的數組
let spheres = []
//---------------------------
const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
  )
  mesh.castShadow = true
  mesh.scale.set(radius, radius, radius)
  mesh.position.copy(position)
  scene.add(mesh)

  //Cannon.js body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    // begin position
    //position: new CANNON.Vec3(0, 3, 0),
    position: sphereBeginPosition,
    shape,
    material: plasticMaterial
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)

  world.addBody(body)

  // Save in objects to update
  objectToUpdate.push({
    mesh,
    body
  })

  //----------------------------
  spheres.push({
    mesh,
    body
  })
  //spheres.add(body)

  //console.log(objectToUpdate)
}

createSphere(sphereShapeScale, { x: 0, y: 3, z: 0 })
createSphere(sphereShapeScale, sphereBeginPosition)
//console.log(objectToUpdate)

// box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshMatcapMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(width, height, depth)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // cannon.js body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: plasticMaterial
  })

  body.applyLocalForce(new CANNON.Vec3((Math.random() - 1) * 5, (Math.random() - 1) * 5, (Math.random() - 1) * 5), new CANNON.Vec3(0, 0, 0))
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  // save in objects to update
  objectToUpdate.push({
    mesh,
    body
  })
}

// const sphereMaterial = new THREE.MeshStandardMaterial({
//   metalness: 0.3,
//   roughness: 0.4,
//   envMap: environmentMapTexture
// })

// todo replicating amazing midwarm.com look with threejs
// import {useState} from 'react'
// const [userData, setUserData] = useState({})

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

//todo setting()
const params = {
  exposure: 2,
  bloomStrength: 1.5,//3
  bloomThreshold: 0.05,//0.01
  bloomRadius: 0.8//0.27
}


//todo initPost()
const renderScene = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
bloomPass.threshold = params.bloomThreshold
bloomPass.strength = params.bloomStrength
bloomPass.radius = params.bloomRadius
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)
//todo composer resize
composer.setSize(sizes.width, sizes.height)

//todo define 
let envMap, m
const humanScale = 0.6
let exportHumanModel;
// define humanModel
let humanModel

//! pmremGenerator
const pmremGenertor = new THREE.PMREMGenerator(renderer)
pmremGenertor.compileEquirectangularShader();



new THREE.TextureLoader().load('env.jpg', (texture) => {
  envMap = pmremGenertor.fromEquirectangular(texture).texture;
  //envMap.mapping = THREE.EquirectangularReflectionMapping;
  console.log(envMap);
  //console.log(envMapTextureLoader)
  pmremGenertor.dispose()

  // !shader human yuri
  gltfLoader.load(
    'shadertest_yuri_human.glb',
    (gltf) => {
      gltf.scene.traverse((child) => {
      })
      const humanModelObject = gltf.scene
      exportHumanModel = humanModelObject
      // get human model
      humanModel = gltf.scene.children.find(child =>
        child => child.name === 'HG_Body')
      humanModel.scale.set(humanScale, humanScale, humanScale)
      humanModel.geometry.center()
      // apply material
      //humanModel.material = humanModelMaterial
      m = new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.28
      })
      m.envMap = envMap
      m.onBeforeCompile = (shader) => {
        //m.userData.shader = shader
        shader.uniforms.uTime = { value: 0 };

        shader.fragmentShader = `
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
      `+ shader.fragmentShader;
        //! userData
        m.userData.shader = shader;
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
    
          reflectVec = rotate(reflectVec, vec3(0.0, 1.0, 0.0), uTime*0.05);

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
        )

      }
      humanModel.material = m
      // scene add
      scene.add(humanModelObject)
    }
  )
}
)

// print humanModel
console.log("humanModel = "  + humanModel)

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
const clock = new THREE.Clock()
let previousTime = 0
const time = 0

const tick = () => {
 // exportHumanModel.rotation.y +=0.01

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update physics
  // world.step(a fixed time, how much time passed since the last step, how much iterations the world can apply to catch up with a potential delay)
  world.step(1 / 60, deltaTime, 3)

  //------------------
  for (const object of spheres) {
    let x = 1 / object.body.position.x
    //不能有xyz達到0
    object.body.applyLocalForce(new CANNON.Vec3(-10 * object.body.position.x, -10 * object.body.position.y, -10 * object.body.position.z), new CANNON.Vec3(0, 0, 0))
    object.mesh.quaternion.copy(object.body.quaternion)
  }
  for (const object of objectToUpdate) {
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }

  // Update Material
  firefliesMaterial.uniforms.uTime.value = elapsedTime

  //m.userData.shader.uniforms.uTime.value = elapsedTime
  //!export model //console.log(exportHumanModel)


  // if m.userData exists, update shader uniforms
  if (m && m.userData && m.userData.shader && m.userData.shader.uniforms) {
    console.log("m.userData = " + m.userData)
    console.log("m.userData.shader = " + m.userData.shader)
    console.log("m.userData.shader.uniforms = " + m.userData.shader.uniforms)

    humanModel.userData.shader.uniforms.uTime.value = elapsedTime+0.05
  } 


  // Update mixer
  if (mixer !== null) {
    mixer.update(deltaTime)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  //todo humanmodel.userData.shader.uniforms.uTime.value = time
  //time += 0.05

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
  composer.render(scene, camera)
}
tick()


/*

// player controller
class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }
    get animations() {
    return this._animations;
  }
};

class BasicCharacterController {
    constructor(params) {
      this._Init(params);
    }
  
    _Init(params) {
      this._params = params;
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
      this._velocity = new THREE.Vector3(0, 0, 0);
  
      this._animations = {};
      this._input = new BasicCharacterControllerInput();
      this._stateMachine = new CharacterFSM(
          new BasicCharacterControllerProxy(this._animations));
  
      this._LoadModels();
    }
  
    _LoadModels() {
      const loader = new FBXLoader();
      loader.setPath('./resources/zombie/');
      loader.load('mremireh_o_desbiens.fbx', (fbx) => {
        fbx.scale.setScalar(0.1);
        fbx.traverse(c => {
          c.castShadow = true;
        });
  
        this._target = fbx;
        this._params.scene.add(this._target);
  
        this._mixer = new THREE.AnimationMixer(this._target);
  
        this._manager = new THREE.LoadingManager();
        this._manager.onLoad = () => {
          this._stateMachine.SetState('idle');
        };
  
        const _OnLoad = (animName, anim) => {
          const clip = anim.animations[0];
          const action = this._mixer.clipAction(clip);
    
          this._animations[animName] = {
            clip: clip,
            action: action,
          };
        };
  
        const loader = new FBXLoader(this._manager);
        loader.setPath('./resources/zombie/');
        loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
        loader.load('run.fbx', (a) => { _OnLoad('run', a); });
        loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
        loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });
      });
    }
  
    Update(timeInSeconds) {
      if (!this._target) {
        return;
      }
  
      this._stateMachine.Update(timeInSeconds, this._input);
  
      const velocity = this._velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
          Math.abs(frameDecceleration.z), Math.abs(velocity.z));
  
      velocity.add(frameDecceleration);
  
      const controlObject = this._target;
      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject.quaternion.clone();
  
      const acc = this._acceleration.clone();
      if (this._input._keys.shift) {
        acc.multiplyScalar(2.0);
      }
  
      if (this._stateMachine._currentState.Name == 'dance') {
        acc.multiplyScalar(0.0);
      }
  
      if (this._input._keys.forward) {
        velocity.z += acc.z * timeInSeconds;
      }
      if (this._input._keys.backward) {
        velocity.z -= acc.z * timeInSeconds;
      }
      if (this._input._keys.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._input._keys.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
  
      controlObject.quaternion.copy(_R);
  
      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.position);
  
      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();
  
      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();
  
      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);
  
      controlObject.position.add(forward);
      controlObject.position.add(sideways);
  
      oldPosition.copy(controlObject.position);
  
      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }
    }
  };
  
  class BasicCharacterControllerInput {
    constructor() {
      this._Init();    
    }
  
    _Init() {
      this._keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false,
      };
      document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
      document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }
  
    _onKeyDown(event) {
      switch (event.keyCode) {
        case 87: // w
          this._keys.forward = true;
          break;
        case 65: // a
          this._keys.left = true;
          break;
        case 83: // s
          this._keys.backward = true;
          break;
        case 68: // d
          this._keys.right = true;
          break;
        case 32: // SPACE
          this._keys.space = true;
          break;
        case 16: // SHIFT
          this._keys.shift = true;
          break;
      }
    }
  
    _onKeyUp(event) {
      switch(event.keyCode) {
        case 87: // w
          this._keys.forward = false;
          break;
        case 65: // a
          this._keys.left = false;
          break;
        case 83: // s
          this._keys.backward = false;
          break;
        case 68: // d
          this._keys.right = false;
          break;
        case 32: // SPACE
          this._keys.space = false;
          break;
        case 16: // SHIFT
          this._keys.shift = false;
          break;
      }
    }
  };
  
  
  class FiniteStateMachine {
    constructor() {
      this._states = {};
      this._currentState = null;
    }
  
    _AddState(name, type) {
      this._states[name] = type;
    }
  
    SetState(name) {
      const prevState = this._currentState;
      
      if (prevState) {
        if (prevState.Name == name) {
          return;
        }
        prevState.Exit();
      }
  
      const state = new this._states[name](this);
  
      this._currentState = state;
      state.Enter(prevState);
    }
  
    Update(timeElapsed, input) {
      if (this._currentState) {
        this._currentState.Update(timeElapsed, input);
      }
    }
  };
  
  
  class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
      super();
      this._proxy = proxy;
      this._Init();
    }
  
    _Init() {
      this._AddState('idle', IdleState);
      this._AddState('walk', WalkState);
      this._AddState('run', RunState);
      this._AddState('dance', DanceState);
    }
  };
  
  
  class State {
    constructor(parent) {
      this._parent = parent;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
  };
  
  
  class DanceState extends State {
    constructor(parent) {
      super(parent);
  
      this._FinishedCallback = () => {
        this._Finished();
      }
    }
  
    get Name() {
      return 'dance';
    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations['dance'].action;
      const mixer = curAction.getMixer();
      mixer.addEventListener('finished', this._FinishedCallback);
  
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
        curAction.reset();  
        curAction.setLoop(THREE.LoopOnce, 1);
        curAction.clampWhenFinished = true;
        curAction.crossFadeFrom(prevAction, 0.2, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    _Finished() {
      this._Cleanup();
      this._parent.SetState('idle');
    }
  
    _Cleanup() {
      const action = this._parent._proxy._animations['dance'].action;
      
      action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }
  
    Exit() {
      this._Cleanup();
    }
  
    Update(_) {
    }
  };
  
  
  class WalkState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'walk';
    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations['walk'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
        curAction.enabled = true;
  
        if (prevState.Name == 'run') {
          const ratio = curAction.getClip().duration / prevAction.getClip().duration;
          curAction.time = prevAction.time * ratio;
        } else {
          curAction.time = 0.0;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
        }
  
        curAction.crossFadeFrom(prevAction, 0.5, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(timeElapsed, input) {
      if (input._keys.forward || input._keys.backward) {
        if (input._keys.shift) {
          this._parent.SetState('run');
        }
        return;
      }
  
      this._parent.SetState('idle');
    }
  };
  
  
  class RunState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'run';
    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations['run'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
        curAction.enabled = true;
  
        if (prevState.Name == 'walk') {
          const ratio = curAction.getClip().duration / prevAction.getClip().duration;
          curAction.time = prevAction.time * ratio;
        } else {
          curAction.time = 0.0;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
        }
  
        curAction.crossFadeFrom(prevAction, 0.5, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(timeElapsed, input) {
      if (input._keys.forward || input._keys.backward) {
        if (!input._keys.shift) {
          this._parent.SetState('walk');
        }
        return;
      }
  
      this._parent.SetState('idle');
    }
  };
  
  
  class IdleState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'idle';
    }
  
    Enter(prevState) {
      const idleAction = this._parent._proxy._animations['idle'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        idleAction.time = 0.0;
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1.0);
        idleAction.setEffectiveWeight(1.0);
        idleAction.crossFadeFrom(prevAction, 0.5, true);
        idleAction.play();
      } else {
        idleAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (input._keys.forward || input._keys.backward) {
        this._parent.SetState('walk');
      } else if (input._keys.space) {
        this._parent.SetState('dance');
      }
    }
  };
  
  
  class CharacterControllerDemo {
    constructor() {
      this._Initialize();
    }
  
    _Initialize() {
      this._threejs = new THREE.WebGLRenderer({
        antialias: true,
      });
      this._threejs.outputEncoding = THREE.sRGBEncoding;
      this._threejs.shadowMap.enabled = true;
      this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);
  
      document.body.appendChild(this._threejs.domElement);
  
      window.addEventListener('resize', () => {
        this._OnWindowResize();
      }, false);
  
      const fov = 60;
      const aspect = 1920 / 1080;
      const near = 1.0;
      const far = 1000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(25, 10, 25);
  
      this._scene = new THREE.Scene();
  
      let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
      light.position.set(-100, 100, 100);
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      light.shadow.bias = -0.001;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 500.0;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 500.0;
      light.shadow.camera.left = 50;
      light.shadow.camera.right = -50;
      light.shadow.camera.top = 50;
      light.shadow.camera.bottom = -50;
      this._scene.add(light);
  
      light = new THREE.AmbientLight(0xFFFFFF, 0.25);
      this._scene.add(light);
  
      const controls = new OrbitControls(
        this._camera, this._threejs.domElement);
      controls.target.set(0, 10, 0);
      controls.update();
  
      const loader = new THREE.CubeTextureLoader();
      const texture = loader.load([
          './resources/posx.jpg',
          './resources/negx.jpg',
          './resources/posy.jpg',
          './resources/negy.jpg',
          './resources/posz.jpg',
          './resources/negz.jpg',
      ]);
      texture.encoding = THREE.sRGBEncoding;
      this._scene.background = texture;
  
      const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 100, 10, 10),
          new THREE.MeshStandardMaterial({
              color: 0x808080,
            }));
      plane.castShadow = false;
      plane.receiveShadow = true;
      plane.rotation.x = -Math.PI / 2;
      this._scene.add(plane);
  
      this._mixers = [];
      this._previousRAF = null;
  
      this._LoadAnimatedModel();
      this._RAF();
    }
  
    _LoadAnimatedModel() {
      const params = {
        camera: this._camera,
        scene: this._scene,
      }
      this._controls = new BasicCharacterController(params);
    }
  
    _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
      const loader = new FBXLoader();
      loader.setPath(path);
      loader.load(modelFile, (fbx) => {
        fbx.scale.setScalar(0.1);
        fbx.traverse(c => {
          c.castShadow = true;
        });
        fbx.position.copy(offset);
  
        const anim = new FBXLoader();
        anim.setPath(path);
        anim.load(animFile, (anim) => {
          const m = new THREE.AnimationMixer(fbx);
          this._mixers.push(m);
          const idle = m.clipAction(anim.animations[0]);
          idle.play();
        });
        this._scene.add(fbx);
      });
    }
  
    _LoadModel() {
      const loader = new GLTFLoader();
      loader.load('./resources/thing.glb', (gltf) => {
        gltf.scene.traverse(c => {
          c.castShadow = true;
        });
        this._scene.add(gltf.scene);
      });
    }
  
    _OnWindowResize() {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._threejs.setSize(window.innerWidth, window.innerHeight);
    }
  
    _RAF() {
      requestAnimationFrame((t) => {
        if (this._previousRAF === null) {
          this._previousRAF = t;
        }
  
        this._RAF();
  
        this._threejs.render(this._scene, this._camera);
        this._Step(t - this._previousRAF);
        this._previousRAF = t;
      });
    }
  
    _Step(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
      if (this._mixers) {
        this._mixers.map(m => m.update(timeElapsedS));
      }
  
      if (this._controls) {
        this._controls.Update(timeElapsedS);
      }
    }
  }
  
  
  let _APP = null;
  
  window.addEventListener('DOMContentLoaded', () => {
    _APP = new CharacterControllerDemo();
  });
*/
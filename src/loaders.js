import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export {hitSound, playHitSound, textureLoader, dracoLoader, environmentMapTexture, bakedTexture, xTexture, weaveXTexture, torusKnotSphereTexture, torusKnotSphereTexture_blackwhite}
export {gltfLoader} 
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
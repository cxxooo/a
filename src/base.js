import * as dat from 'lil-gui'
import * as THREE from 'three'

export {canvas, scene, gui, adjustNum, adjustStep, debugObject}


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
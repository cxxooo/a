
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
 * Sizes
 */
import { sizes } from "./sizes";

export { camera, controls}


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 0;
  camera.position.z = 1;
  // Debug
  // gui.add(camera.position, 'x').min(-adjustNum).max(adjustNum).step(adjustStep).name('cameraX')
  // gui.add(camera.position, 'y').min(-adjustNum).max(adjustNum).step(adjustStep).name('cameraY')
  // gui.add(camera.position, 'z').min(-adjustNum).max(adjustNum).step(adjustStep).name('cameraZ')
  
  // work Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
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
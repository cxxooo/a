import * as THREE from "three"; 
//import { Light } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
//导入dat.gui
import * as dat from "dat.gui";
//得到字体
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
//console.log(typefaceFont)
//导入动画库
import gsap, { random } from "gsap";
import { AmbientLight, BoxGeometry, BufferGeometry, ConeGeometry, CubeCamera, GreaterStencilFunc, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, PointsMaterial, RepeatWrapping, ShaderMaterial, Sphere, SphereGeometry, SpotLight, Texture } from "three";
//import CANNON, { Material } from "cannon";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { PlaneBufferGeometry } from "three";
import testVertexShader from '../shaders/test/vertex.js'
import testFragmentShader from '../shaders/test/fragment.js'
import CANNON from "cannon"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(15,window.innerWidth/window.innerHeight);
camera.position.set(0,0,40);
camera.lookAt(0,0,0)
scene.add(camera);  //添加到场景中
const renderer = new THREE.WebGLRenderer({
    //alpha :true  //使背景消失
});


renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);  //这个要放在后面
controls.enableDamping = true;
const axeHelper = new THREE.AxesHelper(500);
scene.add(axeHelper);
const clock = new THREE.Clock(); 
const ambientLight = new THREE.AmbientLight(0xffffff,1);
scene.add(ambientLight);
const gui = new dat.GUI();



//------------------------------curveStart------------------------

 var curve0 = new THREE.CubicBezierCurve3(
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( -5, 5, 0 ),
    new THREE.Vector3( 3, 8, 0 ),
    new THREE.Vector3( 5, 3, 0 )
  );

var curve1 = new THREE.CubicBezierCurve3(
    new THREE.Vector3( 5, 3, 0 ),
    new THREE.Vector3( 7, 8, 0 ),
    new THREE.Vector3( 15, 5, 0 ),
    new THREE.Vector3( 10, 0, 0 )
  );

var curve2 = new THREE.CubicBezierCurve3(
    new THREE.Vector3( 10, 0, 0 ),
    new THREE.Vector3( 6, -4, 0 ),
    new THREE.Vector3( 4, -4, 0 ),
    new THREE.Vector3( 0, 0, 0 )
  );
var  curve = new THREE.CurvePath();

curve.curves.push(curve0,curve1,curve2);

var points = curve.getPoints( 50 );

var geometry = new THREE.BufferGeometry().setFromPoints( points );
 
var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
 
// Create the final object to add to the scene
var curveObject = new THREE.Line( geometry, material );
scene.add(curveObject)


//------------------------------curveEnd--------------------------


scene.background = new THREE.Color(0/255, 150/255 ,150/255);
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000})
)

scene.add(cube)


let oldElapsedTime = 0;

var aaa = 0
function renderfun(time){
    

    //update physics world
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime



    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(renderfun)
}
renderfun();

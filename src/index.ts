import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import { InteractiveVoxelPainter } from './interactive_voxelpainter';
import * as THREE from 'three'
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { generateFloor } from './elements';

// Use generateFloor() wherever needed

// create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xe0e0e0 );
scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

// add camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 20;
camera.position.x = 0;

// add renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

// add viewer orbit control
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 80
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// add lights
light()

// add floor
const floorGeometry = new THREE.PlaneGeometry( 200, 200 );
const floorMesh = new THREE.Mesh( floorGeometry, generateFloor() );
floorMesh.receiveShadow = true;
floorMesh.rotation.x = - Math.PI / 2.0;
scene.add( floorMesh );

// add model to scene with animation
var characterControls: CharacterControls
new GLTFLoader().load('models/RobotExpressive.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.rotation.setFromVector3(new THREE.Vector3( 0, Math.PI, 0));
    scene.add(model);

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera,  'Idle')
});

// add control keys
const keysPressed = {  }
const keyDisplayQueue = new KeyDisplay();
var interactiveVoxelPainter: InteractiveVoxelPainter
var isSpaceDown = false
document.addEventListener('keydown', (event) => {
    if (event.code == "Space") {
        keyDisplayQueue.down(event.code);
        orbitControls.enabled = false; // Disable orbit controls when space is pressed
        isSpaceDown = true
        if (!interactiveVoxelPainter) {
            interactiveVoxelPainter = new InteractiveVoxelPainter(camera, scene, floorMesh, isSpaceDown)
            interactiveVoxelPainter.init()
        }
        interactiveVoxelPainter.isSpaceDown = isSpaceDown
        interactiveVoxelPainter.rollOver()
        document.addEventListener('mousemove', interactiveVoxelPainter.onPointerMove.bind(interactiveVoxelPainter));
    } else if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true;
    }
}, false);
document.addEventListener('keyup', (event) => {
    if (event.code == "Space") {
        keyDisplayQueue.up(event.code);
        orbitControls.enabled = true; // Enable orbit controls when space is not pressed
        isSpaceDown = false
        interactiveVoxelPainter.isSpaceDown = isSpaceDown
        document.removeEventListener('mousemove', interactiveVoxelPainter.onPointerMove.bind(interactiveVoxelPainter));
        interactiveVoxelPainter.rollOver()
    } else {
        keyDisplayQueue.up(event.key);
    }
    (keysPressed as any)[event.key.toLowerCase()] = false
}, false);

// add right click
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    // punch only if character is in idle position
    if (characterControls.currentAction == 'Idle') {
        characterControls.punch()
    }
}, false);

// add left click
document.addEventListener('click', (event) => {
    if (isSpaceDown) {
        interactiveVoxelPainter.onPointerDown()
    }
}, false);

const clock = new THREE.Clock();
// animate
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// rezize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition()
}
window.addEventListener('resize', onWindowResize);

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(- 60, 100, - 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}
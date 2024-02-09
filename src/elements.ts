import * as THREE from 'three';

export function generateFloor() {
    let floorMat: THREE.MeshStandardMaterial;
    floorMat = new THREE.MeshStandardMaterial( {
        roughness: 0.8,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 1
    } );
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load( 'textures/hardwood2_diffuse.jpg', function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 10, 24 );
        floorMat.map = map;
        floorMat.needsUpdate = true;

    } );
    textureLoader.load( 'textures/hardwood2_bump.jpg', function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 10, 24 );
        floorMat.bumpMap = map;
        floorMat.needsUpdate = true;

    } );
    textureLoader.load( 'textures/hardwood2_roughness.jpg', function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 10, 24 );
        floorMat.roughnessMap = map;
        floorMat.needsUpdate = true;

    } );
    return floorMat;
}
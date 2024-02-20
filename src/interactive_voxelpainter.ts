import * as THREE from 'three'

export class InteractiveVoxelPainter {

    // let camera, scene, renderer;
    // let plane;
    // let pointer, raycaster, isShiftDown = false;

    camera: THREE.Camera
    scene: THREE.Scene
    plane: THREE.Mesh
    rollOverMesh: THREE.Mesh
    voxel: THREE.Mesh
    pointer: THREE.Vector2 = new THREE.Vector2()
    raycaster: THREE.Raycaster = new THREE.Raycaster()
    isSpaceDown: boolean = false
    objects: THREE.Object3D[] = []

    constructor(camera: THREE.Camera, scene: THREE.Scene, plane: THREE.Mesh, isSpaceDown: boolean) {
        this.camera = camera
        this.scene = scene
        this.plane = plane
        this.objects.push(this.plane)
        this.isSpaceDown = isSpaceDown
    }

    public init() {
        // roll-over helpers
        const rollOverGeo: THREE.BoxGeometry = new THREE.BoxGeometry(3, 3, 3);
        const rollOverMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.rollOverMesh.position.set(0, 1.5, 0);
        this.scene.add(this.rollOverMesh);
    }

    public onPointerMove( event: MouseEvent ) {
        if (!this.isSpaceDown) {
            return
        }
        this.pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects( this.objects, false );

        if ( intersects.length > 0 ) {
            const intersect = intersects[ 0 ];

            this.rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
            this.rollOverMesh.position.floor().setY(1.5);
        }
    }

    // return position of rollOverMesh
    public onPointerDown() {
        return this.rollOverMesh.position
    }

    public rollOver() {
        this.rollOverMesh.visible = this.isSpaceDown
    }
}
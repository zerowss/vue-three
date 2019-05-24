<template>
  <div ref="demo"></div>
</template>
<style>
.label {
  color: red;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
</style>
<script>
import * as THREE from "three"; // 引入three
import OrbitControls from "threejs-orbit-controls";
import imgP4 from "../assets/p4.jpg";
import * as TWEEN from "@tweenjs/tween.js";
import { CSS2DRenderer, CSS2DObject } from "three-css2drender";
export default {
  name: "three-three",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      clock: null,
      mesh: null,
      pos: {},
      labelRenderer: null,
      sphere: null,
      cameraOrtho: null
    };
  },
  methods: {
    init() {
      this.initMesh();
      this.animate();
      window.addEventListener("resize", this.onResize, false);
    },
    initMesh() {
      //场景
      this.scene = new THREE.Scene();
      //相机
      let aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(150, aspect, 1, 2000);
      this.camera.position.set(0, 450, 0);
      this.camera.target = new THREE.Vector3(0, 0, 0);
      this.camera.lookAt(this.camera.target);

      let texture = new THREE.TextureLoader().load(imgP4);
      let sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
      sphereGeometry.scale(-1, 1, 1);
      sphereGeometry.rotateY(-Math.PI / 2);
      let sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture
      });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // let axes = new THREE.AxesHelper(3000);
      // let gridHelper = new THREE.GridHelper(30, 30, 0xf0f0f0, 0xffffff);
      // this.scene.add(axes);
      // this.scene.add(gridHelper);
      this.scene.add(this.sphere); // 向该场景中添加物体

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.sortObjects = false;
      this.renderer.autoClear = false;
      this.$refs.demo.append(this.renderer.domElement);

      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = "absolute";
      this.labelRenderer.domElement.style.top = 0;
      this.$refs.demo.append(this.labelRenderer.domElement);

      // 控制器
      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.target.set(0, 0, 1);
      // this.controls.screenSpacePanning = true;
      // this.controls.maxDistance = 400;
      // this.controls.maxAzimuthAngle = 0;
      // this.controls.maxPolarAngle = 0;
      // this.clock = new THREE.Clock();

      this.pos = { lat: 0, y: this.camera.position.y, fov: this.camera.fov };
      new TWEEN.Tween(this.pos)
        .to({ lat: 90, y: 0, fov: 100 }, 2500)
        .delay(1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          let phi = THREE.Math.degToRad(this.pos.lat);
          this.camera.target.y = -500 * Math.cos(phi);
          this.camera.target.z = -500 * Math.sin(phi);
          this.camera.position.y = this.pos.y;
          this.camera.fov = this.pos.fov;
          this.camera.updateProjectionMatrix();
        })
        .onComplete(() => {
          this.camera.position.set(0, 0, 0);
          this.moveTo();
        })
        .start();
    },
    moveTo() {
      new TWEEN.Tween({ z: this.camera.position.z })
        .to({ z: -160 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(obj => {
          this.camera.position.z = obj.z;
          this.camera.updateProjectionMatrix();
        })
        .onComplete(() => {
          this.createDiv(this.sphere);
        })
        .start();
    },
    animate() {
      // const delta = this.clock.getDelta();
      // this.controls.update(delta); //更新时间
      TWEEN.update();
      this.camera.lookAt(this.camera.target);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate);
    },
    createDiv(mesh) {
      let meshDiv = document.createElement("div");
      meshDiv.className = "label";
      meshDiv.textContent = "进";
      meshDiv.style.marginTop = "-1em";
      meshDiv.onclick = ()=>{
        this.$router.push('/three-three')
      };
      let meshLabel = new CSS2DObject(meshDiv);
      meshLabel.position.set(10, 10, -200);
      mesh.add(meshLabel);
    },
    onResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
  },
  mounted() {
    this.init();
  }
};
</script>



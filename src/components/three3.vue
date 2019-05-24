<template>
  <div ref="demo"></div>
</template>
<style scoped>
#container,
.wrap {
  height: 100%;
  width: 100%;
}
</style>
<script>
import * as THREE from "three" // 引入three
import OrbitControls from 'threejs-orbit-controls'
import imgP3 from "../assets/p3.png"
export default {
  name: "three-three",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      clock: null
    };
  },
  methods: {
    init() {
      this.initMesh()
      this.animate()
    },
    initMesh() {
      //场景
      this.scene = new THREE.Scene()
      //相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1100
      )
      let vector = new THREE.Vector3(0, 0, 0)
      this.camera.position.set(0, 0, 0)
      this.camera.lookAt(vector)

      let texture = new THREE.TextureLoader().load(imgP3)
      let sphereGeometry = new THREE.SphereGeometry(100, 10, 10)
      sphereGeometry.scale(-1, 1, 1)
      let sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        depthTest: false
      })
      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

      let axes = new THREE.AxesHelper(3000)
      let gridHelper = new THREE.GridHelper( 30,30,0xf0f0f0,0xffffff );
      // this.scene.add(axes);
      // this.scene.add(gridHelper);
      this.scene.add(sphere); // 向该场景中添加物体

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.$refs.demo.append(this.renderer.domElement)

      //控制器
      this.controls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      )
      this.controls.target.set(0, 0, 1)
      this.controls.maxDistance = 100
      this.clock = new THREE.Clock();
    },
    animate() {
      const delta = this.clock.getDelta();
      this.controls.update(delta); //更新时间
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted() {
    this.init()
  }
};
</script>



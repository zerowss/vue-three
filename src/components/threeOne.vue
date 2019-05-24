<template>
    <div class="wrap">
        <div id="container" @click="goTo"></div>
    </div>
</template>
<style scoped>
  #container,.wrap{
    height: 100%;
    width: 100%;
  } 
</style>
<script>
  import * as Three from 'three'   // 引入three
  import OrbitControls from 'threejs-orbit-controls'
export default {
  name: 'three-one',
  data () {
    return {
     camera:null,
     scene:null,
     renderer:null,
     mesh:null,
     clock: null,
     controls: null
    }
  },
  methods:{
    goTo() {
      this.$router.push('/three-five');
    },
    init(){
      let container=document.getElementById('container')
      let axes = new Three.AxesHelper(100)
      let gridHelper = new Three.GridHelper( 30,30,0xf0f0f0,0xffffff );

      this.camera=new Three.PerspectiveCamera(70,container.clientWidth/container.clientHeight,0.01,1000)
      this.camera.position.set(10,10,10)
      this.camera.lookAt(0,0,0)

      this.scene=new Three.Scene()
      let geometry=new Three.BoxGeometry(10,10,10)
      let material=new Three.MeshNormalMaterial()
      this.mesh=new Three.Mesh(geometry,material)

      this.scene.add(axes)
      this.scene.add(gridHelper)
      this.scene.add(this.mesh)

      this.renderer=new Three.WebGLRenderer({antialias:true})
      this.renderer.setSize(container.clientWidth,container.clientHeight)
      container.appendChild(this.renderer.domElement)
      
      // 声明轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // an animation loop is required when either //damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;

      // 距离中心点最小距离和最大距离
      this.controls.minDistance = 50;
      this.controls.maxDistance = 100

      // 视角的最大仰角和俯角
      this.controls.minPolarAngle = Math.PI / 12;
      this.controls.maxPolarAngle = Math.PI / 2.5;

      // 自动旋转和速度
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.5

      this.controls.maxPolarAngle = Math.PI;
      // 初始化时钟，计时器
      this.clock = new Three.Clock();
    },
    animate(){
      const delta = this.clock.getDelta();
      this.controls.update(delta); //更新时间
      requestAnimationFrame(this.animate)
      // this.mesh.rotation.x+=0.09
      // this.mesh.rotation.y+=0.1
      this.renderer.render(this.scene,this.camera)
    },
  },
  mounted(){
    this.init()
    this.animate()
  }
}

</script>



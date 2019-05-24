<template>
  <div ref="demo" @click="goTo"></div>
</template>

<script>
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import $ from "jquery";
import OrbitControls from 'threejs-orbit-controls'
export default {
  name: "HelloWorld",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      ww: window.innerWidth,
      wh: window.innerHeight
    };
  },
  mounted() {
    this.init();
    this.animate();
    window.addEventListener("resize", this.onResize, false);
  },
  methods: {
    goTo() {
      this.$router.push('/three-one');
    },
    init() {
      let _self = this;
      //三要素
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(70, this.ww / this.wh, 1, 2000);
      this.camera.position.set(0, 0, 300);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(this.ww, this.wh);
      this.$refs.demo.appendChild(this.renderer.domElement);

      //创建点光源 需要照亮场景
      let light = new THREE.PointLight(0xffe502, 1, 1000);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      //创建方向光 金属感强烈
      let direLight = new THREE.DirectionalLight(0xffe502, 1000);
      direLight.position.set(0, 500, 0);
      direLight.castShadow = true;
      this.scene.add(direLight);

      //创建文字
      let text = new THREE.FontLoader().load(
        "fonts/optimer_bold.typeface.json",
        text => {
          const gem = new THREE.TextGeometry("Hello word", {
            size: 20, //字号大小，一般为大写字母的高度
            height: 10, //文字的厚度
            weight: "normal", //值为'normal'或'bold'，表示是否加粗
            font: text, //字体，默认是'helvetiker'，需对应引用的字体文件
            style: "normal", //值为'normal'或'italics'，表示是否斜体
            bevelThickness: 1, //倒角厚度
            bevelSize: 1, //倒角宽度
            curveSegments: 30, //弧线分段数，使得文字的曲线更加光滑
            bevelEnabled: true //布尔值，是否使用倒角，意为在边缘处斜切
          });
          gem.center();
          const mat = new THREE.MeshPhongMaterial({
            color: 0xffe502,
            specular: 0x009900,
            shininess: 30,
            flatShading: true
          });
          const textObj = new THREE.Mesh(gem, mat);
          textObj.castShadow = true;
          this.scene.add(textObj);
          const t = new TWEEN.Tween(textObj.rotation)
            .to({ y: Math.PI * 2 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .repeat(Infinity)
            // .yoyo(true)
            .start();
        }
      );

      //控制器
      const controls = new OrbitControls(this.camera);
      controls.enableZoom = true;
      controls.minPolarAngle = Math.PI / 2.5;
      controls.maxPolarAngle = Math.PI / 2.5;
      controls.update();
    },
    animate() {
      TWEEN.update();
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    onResize() {
      this.ww = window.innerWidth;
      this.wh = window.innerHeight;

      this.camera.aspect = this.ww / this.wh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.ww, this.wh);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

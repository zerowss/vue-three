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
import * as THREE from "three"; // 引入three
import OrbitControls from "threejs-orbit-controls";
import imgP4 from "../assets/p4.jpg";
import * as TWEEN from "@tweenjs/tween.js";
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
      sign_camera: null,
      sign_scene: null,
      pRadius: 1000,
      clickableObjects: [],
      mouse: new THREE.Vector2(),
      raycaster: null,
      def: {},
      sprites: [],
      lables: []
    };
  },
  methods: {
    init() {
      this.initMesh();
      this.animate();
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
      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // let axes = new THREE.AxesHelper(3000);
      // let gridHelper = new THREE.GridHelper(30, 30, 0xf0f0f0, 0xffffff);
      // this.scene.add(axes);
      // this.scene.add(gridHelper);
      this.scene.add(sphere); // 向该场景中添加物体

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.sortObjects = false;
      this.renderer.autoClear = false;
      this.$refs.demo.append(this.renderer.domElement);

      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 0, 1);
      // this.controls.screenSpacePanning = true;
      // this.controls.maxDistance = 400;
      // this.controls.maxAzimuthAngle = 0;
      // this.controls.maxPolarAngle = 0;
      this.clock = new THREE.Clock();

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
      this.def = {
        lables: [
          { position: { lon: -72.0, lat: 9.0 }, logoUrl: "", text: "蓝窗户" },
          {
            position: { lon: 114.12, lat: 69.48 },
            logoUrl: "",
            text: "一片云彩"
          },
          { position: { lon: 132.48, lat: -12.24 }, logoUrl: "", text: "大海" }
        ],
        sprite: "label", // label,icon
        onClick: () => {}
      };
      this.initLable(this.def.lables, this.def.sprite);
    },
    moveTo() {
      new TWEEN.Tween({ z: this.camera.position.z })
        .to({ z: -160 }, 1500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(obj => {
          this.camera.position.z = obj.z;
          this.camera.updateProjectionMatrix();
        })
        .start();
    },
    animate() {
      const delta = this.clock.getDelta();
      this.controls.update(delta); //更新时间
      TWEEN.update();
      this.camera.lookAt(this.camera.target);
      this.renderer.clear();
      this.addSprites();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.animate);
    },
    initLable(lables, sprite) {
      this.sign_scene = new THREE.Scene();
      this.sign_camera = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2,
        1,
        10
      );
      this.sign_camera.z = 10;
      this.raycaster = new THREE.Raycaster(); //
      if (sprite == "label") {
        for (var i = 0; i < lables.length; i++) {
          this.lables.push(
            this.createLableSprite(
              this.sign_scene,
              lables[i].text,
              lables[i].position
            )
          );
        }
      } else if (sprite == "icon") {
        for (var i = 0; i < lables.length; i++) {
          this.sprites.push(
            this.createSprite(
              lables[i].position,
              lables[i].logoUrl,
              lables[i].text
            )
          );
        }
      }
    },
    addSprites() {
      if (typeof this.sprites != "undefined") {
        for (var i = 0; i < this.sprites.length; i++) {
          var wp = this.geoPosition2World(
            this.sprites[i].pos.lon,
            this.sprites[i].pos.lat
          );
          var sp = this.worldPostion2Screen(wp, this.camera);
          var test = wp.clone();
          test.project(this.camera);
          if (
            test.x > -1 &&
            test.x < 1 &&
            test.y > -1 &&
            test.y < 1 &&
            test.z > -1 &&
            test.z < 1
          ) {
            this.sprites[i].sprite.scale.set(32, 32, 32);
            this.sprites[i].sprite.position.set(sp.x, sp.y, 1);
          } else {
            this.sprites[i].sprite.scale.set(1.0, 1.0, 1.0);
            this.sprites[i].sprite.position.set(0, 0, 0);
          }
        }
      }
      if (typeof this.lables != "undefined") {
        for (var i = 0; i < this.lables.length; i++) {
          var wp = this.geoPosition2World(
            this.lables[i].pos.lon,
            this.lables[i].pos.lat
          );
          var sp = this.worldPostion2Screen(wp, this.camera);
          var test = wp.clone();
          test.project(this.camera);
          if (
            test.x > -1 &&
            test.x < 1 &&
            test.y > -1 &&
            test.y < 1 &&
            test.z > -1 &&
            test.z < 1
          ) {
            var metrics = this.lables[i].context.measureText(
              this.lables[i].name
            );
            var width = metrics.width * 3.5;
            this.lables[i].sprite.scale.set(400, 150, 1.0);
            this.lables[i].sprite.position.set(sp.x + width, sp.y - 40, 1);
          } else {
            this.lables[i].sprite.scale.set(1.0, 1.0, 1.0);
            this.lables[i].sprite.position.set(0, 0, 0);
          }
        }
      }
    },
    // 创建文字标记
    createLableSprite(scene, name, position) {
      var canvas1 = document.createElement("canvas");
      var context1 = canvas1.getContext("2d");
      var metrics = context1.measureText(name);
      var width = metrics.width * 1.5;
      context1.font = "10px 宋体";
      context1.fillStyle = "rgba(0,0,0,0.95)";
      context1.fillRect(0, 0, width + 8, 20 + 8);
      context1.fillStyle = "rgba(0,0,0,0.2)";
      context1.fillRect(2, 2, width + 4, 20 + 4);
      context1.fillStyle = "rgba(255,255,255,0.95)";
      context1.fillText(name, 4, 20);
      var texture1 = new THREE.Texture(canvas1);
      texture1.needsUpdate = true;
      var spriteMaterial = new THREE.SpriteMaterial({ map: texture1 });
      var sprite1 = new THREE.Sprite(spriteMaterial);
      sprite1.scale.set(1.0, 1.0, 1.0);
      sprite1.position.set(0, 0, 0);
      sprite1.name = name;
      var lable = {
        name: name,
        pos: position,
        canvas: canvas1,
        context: context1,
        texture: texture1,
        sprite: sprite1
      };
      this.sign_scene.add(lable.sprite);
      this.clickableObjects.push(lable.sprite);
      return lable;
    },
    // 创建图片标记
    createSprite(position, url, name) {
      const textureLoader = new THREE.TextureLoader();
      const ballMaterial = new THREE.SpriteMaterial({
        map: textureLoader.load(url)
      });
      const sp = {
        pos: position,
        name: name,
        sprite: new THREE.Sprite(ballMaterial)
      };
      sp.sprite.scale.set(32, 32, 1.0);
      sp.sprite.name = name;
      this.sign_scene.add(sp.sprite);
      return sp;
    },
    geoPosition2World(lon, lat) {
      lat = Math.max(-85, Math.min(85, lat));
      let phi = THREE.Math.degToRad(90 - lat);
      let theta = THREE.Math.degToRad(lon);

      let result = {
        x: this.pRadius * Math.sin(phi) * Math.cos(theta),
        y: this.pRadius * Math.cos(phi),
        z: this.pRadius * Math.sin(phi) * Math.sin(theta)
      };
      return new THREE.Vector3(result.x, result.y, result.z);
    },
    worldPostion2Screen(world_vector, camera) {
      let vector = world_vector.clone();
      vector.project(camera);
      let result = {
        x: Math.round(
          ((vector.x + 1) * window.innerWidth) / 2 - window.innerWidth / 2
        ),
        y: Math.round(
          window.innerHeight / 2 - ((-vector.y + 1) * window.innerHeight) / 2
        ),
        z: 0
      };
      return new THREE.Vector3(result.x, result.y, result.z);
    },
    onDocumentMouseClick(event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.sign_camera);
      var intersects = this.raycaster.intersectObjects(this.clickableObjects);
      intersects.forEach(this.def.onClick);
    }
  },
  mounted() {
    this.init();
  }
};
</script>



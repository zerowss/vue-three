# vue-three
从入门到不放弃

***Project setup***
```
yarn install
```

***Compiles and hot-reloads for development***
```
yarn run serve
```

***Compiles and minifies for production***
```
yarn run build
```
### three.js简介

> 什么是WEBGL

WebGL (Web图形库) 是一种JavaScript API，用于在任何兼容的Web浏览器中呈现交互式3D和2D图形，而无需使用插件。WebGL通过引入一个与OpenGL ES 2.0紧密相符合的API，可以在HTML5 元素中使用。
 WebGL给我们提供了一系列的图形接口，能够让我们通过js去使用GPU来进行浏览器图形渲染的工具。

> 什么是THREE.js

Three.js是一款webGL框架。Three.js在WebGL的api接口基础上，又进行的一层封装。Three.js以简单、直观的方式封装了3D图形编程中常用的对象。Three.js在开发中使用了很多图形引擎的高级技巧，极大地提高了性能。另外，由于内置了很多常用对象和极易上手的工具。

> WEBGL与THREE.js的关系

WebGL和Three.js的关系，相当于JavaScript和Jquery的关系。Three.js对WebGL进行封装，简化创建三维动画场景的过程。



------

### 核心模块

#### 四要素

> 场景、相机、渲染器、灯光

- *场景*(scene)

  容器，我们创建的三位空间

  ```javascript
  const scene = new THREE.Scene()
  // 可选择，是否启动雾化效果，参数1是雾的颜色，参数2，3是雾化起始距离和最远距离，是以场景的坐标点(0,0,0)为起始点。让远处的事物逐渐羽化
  scene.fog = new THREE.Fog(0xffffff, 200, 1300);
  ```

  

- *相机*(camera)

  用来观察我们创建的三维空间的,主要介绍透视相机

  - PerspectiveCamera( fov, aspect, near, far )

    ![camera](/public/img/camera.png)

    fov — 相机视锥体垂直视角
    aspect — 相机视锥体宽高比
    near — 相机视锥体近裁剪面
    far — 相机视锥体远裁剪面。

    ```
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    // 设置摄像机位置
    camera.position.set(x,y,z);
    // 设置镜头对准的坐标(点)
    //new THREE.Vecotr3(x,y,z) 用来定义一个点
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    //相机以哪个方向为上方
    camera.up.x = 0;
    ```

    ![](/public/img/802779-20161117002004717-2144750836.png)

  

  

  - 控制器

    用来控制摄像机实现动画效果

    ***OrbitControls***：轨道控制器，以中心点（可自定义其他的点）为圆心，左右拉动场景可以使摄像机围绕着这个中心点旋转，旋转半径在初始化的时候设定。     

    ```
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true; 
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        controls.dampingFactor = 0.25;
        //定义平移时摄像机位置的平移方式。true:则摄像机在屏幕空间中平移。false:摄像机会在与摄像机向上方向垂直的平面中平移。默认值为false。
        controls.screenSpacePanning = false;
        //设置相机距离原点的最小距离z轴
        controls.minDistance = 50;
        //设置相机距离原点的最远距离z轴
        controls.maxDistance = 100
        //设置相机距离原点的最小距离y轴
        controls.minPolarAngle = Math.PI / 12;
        //设置相机距离原点的最远距离y轴,范围是0到Math.PI弧度，默认为Math.PI.
        controls.maxPolarAngle = Math.PI / 2.5;
        // 自动旋转
        controls.autoRotate = true;
        //在目标周围旋转的速度有多快,默认值为2.0，相当于每转60fps 30秒
        controls.autoRotateSpeed = 0.5;
        
        //maxZoom/minZoom 缩小
        //minAzimuthAngle/maxAzimuthAngle x轴
        //panSpeed 平均速度,默认1
        //rotateSpeed 选择速度,默认1
        //zoomSpeed 缩放/移动速度。默认值为1
        //target 控件的焦点
        
    ```

    

     ***FlyControls：***飞行控制器，第一人称视角控制器，一版的PFS射击游戏视角，可以使用asdw进行前后左右操控移动。

​			

- *渲染器(renderer)*

  将观察到的场景渲染到web

  ```javascript
  const renderer = new THREE.WebGLRenderer({antialias: true});//抗锯齿参数：antialias
  renderer.setPixelRatio(window.devicePixelRatio);//解析高分辨率
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //这句话会使得整个场景的内容刷新一次，所以这个方法需要放在requestAnimationFrame中不停地执行。
  render.render(scene, camera);
  ```

- *灯光(lights)*

  - 环境光(AmbientLight)
  - 平行光(DirectionalLight)
  - 点光源(PointLight)
  - 聚光源(SpotLight)

  与光源相伴随的是阴影(不在此深入)

  ```
  //列：平行光
  const sun = new THREE.DirectionalLight(0xffffff);//定义光源
  sun.position.set(-1000, 500, -1000);//光源位置
  sun1.castShadow = true;//是否开启阴影
  scene.add(sun);
  ```

  

#### 其他相关



- 加载器

  用来解析模型、贴图、字体等物体

- 文本模型(TextGeometry)

  TextGeometry（text：String，parameters：Object）

  text - 需要显示的文本。
  parameters - 可包含以下参数的对象。

  - font - THREE.Font的一个实例。
  - 大小 - 浮动。文字大小。默认值为100。
  - 身高 - 漂浮。厚度以挤出文本。默认值为50。
  - curveSegments - 整数。曲线上的点数。默认值为12。
  - bevelEnabled - 布尔值。打开斜角。默认值为False。
  - bevelThickness - 浮动。文字斜角有多深。默认值为10。
  - bevelSize - 浮动。距文本大纲多远是斜角。默认值为8。
  - bevelOffset - 浮动。文本轮廓斜面开始多远。默认值为0。
  - bevelSegments - 整数。斜角段数。默认值为3。

```
var loader = new THREE.FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	var geometry = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
} );
```



- 盒子模型(BoxGeometry)

  BoxGeometry（宽度：浮球，高度：浮球，深度：浮球，widthSegments：整数，heightSegments：整数，depthSegments：整数）

  - 宽度 - 宽度; 也就是说，边缘的长度平行于X轴。可选的; 默认为1. 
  - 身高 - 身高; 也就是说，边缘的长度平行于Y轴。可选的; 默认为1. 
  - 深度 - 深度; 也就是说，边缘的长度平行于Z轴。可选的; 默认值为1. 
  - widthSegments - 沿边宽度的分段矩形面的数量。可选的; 默认为1. 
  - heightSegments - 沿边高的分段矩形面的数量。可选的; 默认为1. 
  - depthSegments - 沿边的深度分割的矩形面的数量。可选的; 默认为1。

```
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
```



- 球(SphereGeometry)

  SphereGeometry（半径：浮球，widthSegments：整数，heightSegments：整数，phiStart：浮球，phiLength：浮球，thetaStart：浮球，thetaLength：浮动）

  - 半径 - 球体半径。默认值为1. 
  - widthSegments - 水平段的数量。最小值为3，默认值为8. 
  - heightSegments - 垂直段数。最小值为2，默认值为6. 
  - phiStart - 指定水平起始角度。默认值为0. 
  - phiLength - 指定水平扫描角度大小。默认值为Math.PI * 2. 
  - thetaStart - 指定垂直起始角度。默认值为0. 
  - thetaLength - 指定垂直扫描角度大小。默认为Math.PI.

```
var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
```



- 添加html元素(CSS2DRenderer)



------

### 参考文献

[three.js官网](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

[中文教程](https://www.techbrood.com/threejs/docs/)

[Tween.js](https://github.com/tweenjs/tween.js)

[相机位置相关](https://www.cnblogs.com/v-weiwang/p/6072235.html)

[例子](https://www.techbrood.com/threejs/examples)


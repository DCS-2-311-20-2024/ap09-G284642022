//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G284642022 菅澤杏
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import {OrbitControls} from 'three/addons';
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  
  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(1,2,3);
  camera.lookAt(0,0,0);

  

  // レンダラの設定
  
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
    document.getElementById("output").appendChild(renderer.domElement);


    //カメラコントロール
  const orbitControls = new OrbitControls(camera,renderer.domElement);

  //照明
  const light = new THREE.PointLight(0xf4a460,800);
 light.position.set(0, 10, 0); 
 scene.add(light);

 // 影の設定
 renderer.shadowMap.enabled = true;  // 影を有効にする

 // 3. テクスチャの読み込み
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('yukagazo.webp');


  //表示
  const wallMaterial = new THREE.MeshLambertMaterial({ color:0xffffff }); 
  const floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, side: THREE.DoubleSide }); 
  const tvFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // 黒いフレーム
  const tvScreenMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, emissive: 0x1111ff });

  // 部屋のサイズ設定
const roomWidth = 7;
const roomHeight = 5;
const roomDepth = 7;

// 床
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  floorMaterial
);


floor.rotation.x = -Math.PI / 2; // 床を水平にする
scene.add(floor);


// 壁（前後左右）
const frontWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomHeight),
  wallMaterial
);
frontWall.position.z = -roomDepth / 2;
frontWall.position.y = roomHeight / 2; // 壁の中央を合わせる
scene.add(frontWall);

const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomHeight),
  wallMaterial
);
backWall.position.z = roomDepth / 2;
backWall.position.y = roomHeight / 2;
backWall.rotation.y = Math.PI;
scene.add(backWall);

const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomDepth, roomHeight),
  wallMaterial
);
leftWall.position.x = -roomWidth / 2;
leftWall.position.y = roomHeight / 2;
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomDepth, roomHeight),
  wallMaterial
);
rightWall.position.x = roomWidth / 2;
rightWall.position.y = roomHeight / 2;
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);



// ソファの座面
const seatGeometry = new THREE.BoxGeometry(2, 0.5, 1);  // 幅4、高さ1、奥行き2
const seatMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });  // 色：茶色
const seat = new THREE.Mesh(seatGeometry, seatMaterial);
seat.position.set(0, 0.5, 0);  // 座面の位置
seat.castShadow = true;  // 影を落とす
seat.receiveShadow = true;  // 影を受ける

// ソファの背もたれ
const backrestGeometry = new THREE.BoxGeometry(2, 0.75, 0.1);  // 幅4、高さ1.5、奥行き0.2
const backrestMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });  // 背もたれの色
const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
backrest.position.set(0, 1.1, 0.55);  // 背もたれの位置

// ソファのアームレスト（左）
const armrestLeftGeometry = new THREE.BoxGeometry(0.25, 0.5, 1);  // 幅0.5、高さ1、奥行き2
const armrestLeftMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const armrestLeft = new THREE.Mesh(armrestLeftGeometry, armrestLeftMaterial);
armrestLeft.position.set(-1.12, 1, 0);  // 左アームレストの位置

// ソファのアームレスト（右）
const armrestRightGeometry = new THREE.BoxGeometry(0.25, 0.5, 1);  // 幅0.5、高さ1、奥行き2
const armrestRightMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const armrestRight = new THREE.Mesh(armrestRightGeometry, armrestRightMaterial);
armrestRight.position.set(1.12, 1, 0);  // 右アームレストの位置

// ソファをシーンに追加
scene.add(seat);
scene.add(backrest);
scene.add(armrestLeft);
scene.add(armrestRight);

// テレビのフレーム
const tvFrame = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1.2, 0.1), // 横2m、縦1.2m、厚さ10cmのフレーム
  tvFrameMaterial
);

// テレビのスクリーン
const tvScreen = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1, 0.05), // 横1.8m、縦1m、厚さ5cmの画面
  tvScreenMaterial
);
tvScreen.position.z = 0.05; // フレームの中に配置
tvFrame.add(tvScreen);

// テレビを壁に取り付ける
tvFrame.position.set(0, 1.5, -roomDepth / 2 + 0.05); // 壁の中央付近に配置
scene.add(tvFrame);

const video = document.createElement('video');
video.src = 'https://youtu.be/baTlMHrNW-0?feature=shared';
video.loop = true;
video.autoplay = true;
video.muted = true;

const videoTexture = new THREE.VideoTexture(video);
tvScreen.material.map = videoTexture;
tvScreen.material.needsUpdate = true;



  // 描画処理
   
  // 描画関数
  function render() {
    orbitControls.update();
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    // WebGL レンダラ
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();
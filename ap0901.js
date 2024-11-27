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
  const light = new THREE.PointLight(0xffffff,1000);
 light.position.set(0, 15, 0); 
 scene.add(light);

  //表示
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xd3d3d3 }); 
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 }); 
  const tvFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // 黒いフレーム
  const tvScreenMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, emissive: 0x1111ff });

  // 部屋のサイズ設定
const roomWidth = 5;
const roomHeight = 3;
const roomDepth = 5;

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
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();
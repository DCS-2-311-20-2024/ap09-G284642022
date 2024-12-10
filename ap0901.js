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
  scene.background = new THREE.Color(0x87CEEB); // 例: 空色


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
 const ambientLight = new THREE.AmbientLight(0x404040, 1); // 環境光
scene.add(ambientLight);


 

 // 3. テクスチャの読み込み
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('yukagazo.webp');
const tableTexture = textureLoader.load('mokume.jpg');
const ballTexture = textureLoader.load('ball.jpg');


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
const seatMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });  // 色：茶色
const seat = new THREE.Mesh(seatGeometry, seatMaterial);
seat.position.set(0, 0.25, 0);  // 座面の位置

// ソファの背もたれ
const backrestGeometry = new THREE.BoxGeometry(2, 0.75, 0.1);  // 幅4、高さ1.5、奥行き0.2
const backrestMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });  // 背もたれの色
const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
backrest.position.set(0, 0.7, 0.55);  // 背もたれの位置

// ソファのアームレスト（左）
const armrestLeftGeometry = new THREE.BoxGeometry(0.25, 0.5, 1);  // 幅0.5、高さ1、奥行き2
const armrestLeftMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
const armrestLeft = new THREE.Mesh(armrestLeftGeometry, armrestLeftMaterial);
armrestLeft.position.set(-1.12, 0.5, 0);  // 左アームレストの位置

// ソファのアームレスト（右）
const armrestRightGeometry = new THREE.BoxGeometry(0.25, 0.5, 1);  // 幅0.5、高さ1、奥行き2
const armrestRightMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
const armrestRight = new THREE.Mesh(armrestRightGeometry, armrestRightMaterial);
armrestRight.position.set(1.12, 0.5, 0);  // 右アームレストの位置

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


// テーブル
const tableTopGeometry = new THREE.BoxGeometry(2.0, 0.4, 0.8); // 幅1.5m、高さ10cm、奥行き0.8m
const tableTopMaterial = new THREE.MeshLambertMaterial({ map: tableTexture });
const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);

// テーブルをソファとテレビの間に配置
tableTop.position.set(0,  0.2, -1.7); // ソファとテレビの間に配置（高さ0.05mで床に接するように）

// テーブルをシーンに追加
scene.add(tableTop);

// ボールの作成 (半径 0.2)
const smallBallRadius = 0.2;
const smallBallGeometry = new THREE.SphereGeometry(smallBallRadius, 32, 32);
const smallBallMaterial = new THREE.MeshLambertMaterial({  map: ballTexture });  // 色：緑
const smallBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial);

// ソファの後ろに配置 (座標はソファの位置を基準に変更)
smallBall.position.set(1.5, 0.2, 1.5);  // ソファの後ろに配置

// シーンに追加
scene.add(smallBall);

// 棚の作成 (長方形のボックス)
const shelfWidth = 4;  // 棚の幅
const shelfHeight = 0.2;  // 棚の高さ (薄い)
const shelfDepth = 0.3;  // 棚の奥行き

const shelfGeometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
const shelfMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });  // 色：茶色
const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);

// 棚を右壁に取り付ける位置を設定
shelf.position.set(roomWidth / 2 - shelfDepth / 2, roomHeight / 2, 0); // 右壁に配置
shelf.rotation.y = -Math.PI / 2;  // 右壁に対して棚を立てる

// シーンに棚を追加
scene.add(shelf);

// 本のサイズと配置のパラメータ
const bookWidth = 0.25;  // 本の幅
const bookHeight = 0.5; // 本の高さ
const bookDepth = 0.15;  // 本の奥行き
const numBooks = 7;     // 本の数

// 本を並べる起点
const startX = roomWidth / 2 - shelfDepth / 2 - bookDepth / 2;
const startY = roomHeight / 2 + shelfHeight / 2 + bookHeight / 2;
const startZ = -1.6; // 棚の中央から配置を開始

// 本の作成と配置
for (let i = 0; i < numBooks; i++) {
  const bookGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
  const bookMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()), // ランダムな色
  });
  const book = new THREE.Mesh(bookGeometry, bookMaterial);

  // 本の位置を設定
  book.position.set(startX, startY, startZ + i * (bookWidth + 0)); // 少し間隔を空ける

  // 本を棚に追加
  scene.add(book);
}






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
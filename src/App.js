import React, { useState } from 'react';
import './App.css';
import { Canvas, useLoader  } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera ,Text } from '@react-three/drei';
import Light from './Light'; // Lightコンポーネントをインポート
import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { TextureLoader, TorusGeometry } from 'three';
import { Physics, useBox, useCylinder } from '@react-three/cannon';
import Ball from './Ball'; // Ballコンポーネントをインポート
import { useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

export default function App() {
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const handleCollide = () => {
    console.log('Ball collided with the box!');
  };
  return (
    <div
      className="App"
      style={{ touchAction: 'none', width: '100vw', height: '100vh' }} // タッチアクションを無効化
    >
      <h1>Ball 9</h1>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 10, 10]} fov={50} rotation={[-1.1, 0, 0]} zoom={0.5}/>
        <Light />
        <Tips />
        <Physics>
          <Ball />
          <Room />
          <CollidableBox position={[0, -5, -6]} rotation={[0, 0, 0]} args={[2, 2, 2]} onCollide={handleCollide}/>
        </Physics>
        
        {/*<OrbitControls enabled={controlsEnabled} />*/}
      </Canvas>
    </div>
  );
}

function Room({ position }) {
  return (
    <>
      {/* 床の左部分 */}
      <Box position={[-3, -1, -7]} rotation={[0, 0, 0]} args={[3.5, 1, 5]} />
      {/* 床の右部分 */}
      <Box position={[3, -1, -7]} rotation={[0, 0, 0]} args={[3.5, 1, 5]} />
      {/* 床の前部分 */}
      <Box position={[0, -1, -8.4]} rotation={[0, 0, 0]} args={[10, 1, 2.5]} />
      {/* 床の後部分 */}
      <Box position={[0, -1, 2.7]} rotation={[0, 0, 0]} args={[10, 1, 15]}/>
      {/* 壁 :) */}
      <Box position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} args={[21, 5, 1]} />
      <Box position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} args={[21, 5, 1]} />
      <Box position={[0, 0, 10]} rotation={[0, Math.PI, 0]} args={[11, 5, 1]} />
      <Box position={[0, 0, -10]} rotation={[0, 0, 0]} args={[11, 5, 1]} />
      {/* 穴 */}
      <Hole position={[0, -1, -6]} rotation={[-Math.PI/2,0,0]} />
      <Box position={[Math.random() * 10 - 5, 0, Math.random() * 10 - 5]} rotation={[0, Math.random() * Math.PI, 0]} args={[2, 1, 1]} color={"darkgray"}/>
      <Box position={[Math.random() * 10 - 5, 0, Math.random() * 10 - 5]} rotation={[0, Math.random() * Math.PI, 0]} args={[2, 1, 1]} color={"darkgray"}/>
      <Box position={[Math.random() * 10 - 5, 0, Math.random() * 10 - 5]} rotation={[0, Math.random() * Math.PI, 0]} args={[2, 1, 1]} color={"darkgray"}/>
    </>
  );
}

function CollidableBox({ position, rotation, args, color, onCollide}) {
  const [ref] = useBox(() => ({
    position,
    rotation,
    args,
    onCollide,
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color || 'pink'} />
    </mesh>
  );
}

function createRingShape(innerRadius, outerRadius, thickness, segments) {
  const shape = new THREE.TorusGeometry((innerRadius + outerRadius) / 2, thickness / 2, segments, 32);
  const vertices = [];
  const positions = shape.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    vertices.push([positions[i], positions[i + 1], positions[i + 2]]);
  }
  
  const index = shape.index.array;
  const faces = [];
  for (let i = 0; i < index.length; i += 3) {
    faces.push([index[i], index[i + 1], index[i + 2]]);
  }

  return { vertices, faces };
}

function Hole({ position, rotation }) {
  const { vertices, faces } = createRingShape(1, 2, 0.2, 32);
  const [ref] = useConvexPolyhedron(() => ({
    position,
    rotation,
    args: [vertices, faces],
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <torusGeometry args={[1.5, 0.5, 30, 100]} />
      <meshStandardMaterial color="lightgray" opacity={1} transparent />
    </mesh>
  );
}
function Box({ position, rotation, args, color}) {
  const [ref] = useBox(() => ({
    position,
    rotation,
    args,
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color || 'lightgray'} />
    </mesh>
  );
}
// Boxコンポーネント
function Tips() {
  return (
    <Text 
    position={[0, 1.25, -9]} 
    rotation={[0, 0, 0]}
    fontSize={0.5} 
    color="white"
  >
    ボールをフリックしてみよう！
  </Text>
  );
}
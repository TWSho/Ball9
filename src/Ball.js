import React, { useRef, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Ball() {
  const [ref, api] = useSphere(() => ({
    mass: 5,
    position: [0, 4, 5],
    args: [0.8],
  }));

  const touchStart = useRef([0, 0]);
  const { camera } = useThree();

  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    touchStart.current = [clientX, clientY];

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('touchend', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    // Optional: Handle pointer move if needed
  };

  const handlePointerUp = (e) => {
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const deltaX = clientX - touchStart.current[0];
    const deltaY = clientY - touchStart.current[1];

    // スワイプの方向をカメラのローカル座標系に変換
    const direction = new THREE.Vector3(deltaX, 0, deltaY).applyQuaternion(camera.quaternion);
    api.velocity.set(direction.x * 0.2, 0, direction.z * 0.2); // スワイプの方向に応じた速度を設定

    // Remove event listeners
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('touchmove', handlePointerMove);
    document.removeEventListener('touchend', handlePointerUp);
  };

  useEffect(() => {
    return () => {
      // Clean up event listeners on component unmount
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  return (
    <mesh
      ref={ref}
      onPointerDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default Ball;

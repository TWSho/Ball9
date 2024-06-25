// Light.js
import React from 'react';

export default function Light() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[-10, 10, 0]} intensity={0.5} />
      <directionalLight position={[10, 10, 0]} intensity={0.5} />

      
    </>
  );
}

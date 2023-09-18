/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Box, Gltf, Line, Loader, OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import useSound from "use-sound";
import legoSfx from "./lego-piece-pressed-105360.mp3";
import bgSfx from "./bg.mp3";
import { useEffect } from "react";

function App() {
  const [play] = useSound(bgSfx);
  useEffect(() => {
    play();
  }, []);
  return (
    <div id="canvas-container">
      <div id="myinfo">
        <a href="https://thinhcorner.com/">My info</a>
      </div>
      <Loader />
      <Canvas>
        <Suspense fallback={null}>
          <Sky sunPosition={[0, 1, 0]} />
          <ambientLight />
          <OrbitControls makeDefault minDistance={1} maxDistance={5} />
          <Gltf
            src="/untitled.gltf"
            scale={0.31}
            position={[-0.47, 0, -0.3]}
            castShadow
            receiveShadow
          />
          <Physics>
            <Wall />
            <Water />
            <PlaySound />
            <Track
              start={new THREE.Vector3(-3.5, 0.1, 0.6)}
              end={new THREE.Vector3(2.7, 0.1, 0.6)}
              speed={2}
            />
            <Track
              start={new THREE.Vector3(3, -0.4, 0.8)}
              end={new THREE.Vector3(3, 1.3, -1.1)}
              support
              speed={6}
            />
            <Track
              start={new THREE.Vector3(3.3, 0.8, -1.3)}
              end={new THREE.Vector3(-2.8, 1.5, -1.3)}
              support
              speed={2}
            />
            <Track
              start={new THREE.Vector3(-3.1, 1.37, -1.6)}
              end={new THREE.Vector3(-3.1, 1.37, -0.6)}
              speed={10}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

function PlaySound() {
  const [play] = useSound(legoSfx);
  return (
    <CuboidCollider
      position={[-3, 0.6, 0.3]}
      args={[0.3, 0.1, 0.3]}
      sensor
      rotation={[0, Math.PI / 2, 0]}
      onIntersectionEnter={play}
    />
  );
}

function Water() {
  // cylinder geometry
  const geom = useMemo(
    () => new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16),
    []
  );
  const mat = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.5,
      }),
    []
  );
  return (
    <>
      {[-0.1, -1.2, 0.4, 1.2, 2].map((e) =>
        Array.from({ length: 40 }).map((_, i) => (
          <RigidBody
            position={[e, 2 + 0.1 * i, -0.3]}
            key={`${e}-${i}`}
            colliders={false}
          >
            <mesh geometry={geom} material={mat} />
            <CylinderCollider args={[0.05, 0.05, 0.1]} />
          </RigidBody>
        ))
      )}
      {[-0.1, -1.2, 0.4, 1.2, 2].map((e) =>
        Array.from({ length: 40 }).map((_, i) => (
          <RigidBody
            position={[e, 4 + 0.1 * i, -1.3]}
            key={`${e}-${i}`}
            colliders={false}
          >
            <mesh geometry={geom} material={mat} />
            <CylinderCollider args={[0.05, 0.05, 0.1]} />
          </RigidBody>
        ))
      )}
    </>
  );
}

function Wall() {
  return (
    <>
      <CuboidCollider
        position={[-2.8, 1.37, -0.6]}
        args={[0.05, 0.4, 0.3]}
        rotation={[0, 0, 0]}
      />
      <CuboidCollider
        position={[3, 1, -1]}
        args={[0.05, 0.1, 0.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <RigidBody position={[3.3, -0.05, 0.8]} type="fixed">
        <Box args={[0.1, 1.5, 1]} material-color="white" />
      </RigidBody>
      <RigidBody position={[2.7, -0.4, 0.8]} type="fixed">
        <Box args={[0.1, 0.8, 1]} material-color="white" />
      </RigidBody>
      <RigidBody position={[3, -0.1, 1]} rotation={[-1.1, 0, 0]} type="fixed">
        <Box args={[0.7, 0.1, 1.5]} material-color="white" />
      </RigidBody>

      <CuboidCollider
        position={[3.3, 0.5, 0]}
        args={[0.05, 1, 1.5]}
        rotation={[Math.PI / 4, 0, 0]}
      />
      <CuboidCollider
        position={[2.7, 1, 0 - 0.2]}
        args={[0.05, 0.5, 0.8]}
        rotation={[Math.PI / 4, 0, 0]}
      />
      <CuboidCollider
        position={[0, 0.8, -1.6]}
        args={[0.05, 1, 3.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CuboidCollider
        position={[-0.1, 0.8, -1]}
        args={[0.05, 1, 2.8]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <CuboidCollider
        position={[-0.5, 0.7, -0.11]}
        args={[0.05, 0.8, 3.2]}
        rotation={[-Math.PI / 5, Math.PI / 2, 0]}
      />
      <CuboidCollider
        position={[-3.4, 1, 0]}
        args={[0.05, 1, 1.5]}
        rotation={[0, 0, 0]}
      />
      <CuboidCollider
        position={[-0.3, 0.85, 0.9]}
        args={[0.05, 1, 3]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </>
  );
}

function Item({ delay, index, pointPaths, angle, support, speed }) {
  const rigidBody = useRef(null);
  let t = delay;

  const up = new THREE.Vector3(0, 1, 0);
  const axis = new THREE.Vector3();
  useFrame(() => {
    rigidBody.current.setNextKinematicTranslation(pointPaths.getPoint(t));

    const tan = pointPaths.getTangent(t);
    axis.crossVectors(up, tan).normalize();
    const radians = Math.acos(up.dot(tan));
    rigidBody.current.setRotation(
      new THREE.Quaternion().setFromAxisAngle(axis, radians)
    );
    t += 0.0002 * speed;
    if (t > 1) {
      t = 0;
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      colliders={"hull"}
      type="kinematicPosition"
      name="water"
    >
      <Box
        args={[0.5, 0.2, 0.05]}
        rotation={[0, angle, 0]}
        material-color="gray"
      />
      {support && index % 2 == 0 && (
        <Box
          args={[0.5, 0.05, 0.1]}
          position={[0.0, 0, 0.05]}
          rotation={[0, angle, 0]}
          material-color="gray"
        />
      )}
    </RigidBody>
  );
}

const MyLine = ({ pointPaths }) => {
  const points = pointPaths.curves.reduce(
    (p, d) => [...p, ...d.getPoints(20)],
    []
  );
  return <Line points={points} />;
};

function Track({ start, end, support = false, speed = 1 }) {
  const pointPaths = new THREE.CurvePath();
  const curve = new THREE.CatmullRomCurve3([
    start,
    end,
    end.clone().setY(end.y - 0.1),
    start.clone().setY(start.y - 0.1),
  ]);
  curve.closed = true;
  pointPaths.add(curve);
  const count = Math.ceil(pointPaths.getLength() / 0.22);
  const frac = 1 / (pointPaths.getLength() / 0.22);
  const line = new THREE.LineCurve3(start.clone().setY(0), end.clone().setY(0));
  const angle = line.getTangentAt().angleTo(new THREE.Vector3(0, 0, 1));
  return (
    <>
      <MyLine pointPaths={pointPaths} />
      {Array.from({ length: count }).map((e, i) => (
        <Item
          delay={frac * i}
          key={i}
          index={i}
          pointPaths={pointPaths}
          angle={angle}
          support={support}
          speed={speed}
        />
      ))}
    </>
  );
}

export default App;

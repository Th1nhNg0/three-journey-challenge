/* eslint-disable react/prop-types */
import { Box, Line, OrbitControls, Plane, Sky, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <Suspense>
          <Stats />
          <Sky />

          <OrbitControls makeDefault />
          <Physics debug>
            <Track
              start={new THREE.Vector3(-5, 3, -5)}
              end={new THREE.Vector3(5, 3, 5)}
            />
            {Array.from({ length: 200 }).map((e, i) => (
              <RigidBody position={[0, 3 + i * 0.1, 0]} key={i}>
                <Box material-color="blue" args={[0.1, 0.1, 0.1]} />
              </RigidBody>
            ))}
            {Array.from({ length: 200 }).map((e, i) => (
              <RigidBody position={[-1, 3 + i * 0.1, 0]} key={i}>
                <Box material-color="blue" args={[0.1, 0.1, 0.1]} />
              </RigidBody>
            ))}
            <RigidBody position={[0, 0, 0]}>
              <Plane
                material-color="gray"
                args={[20, 20]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

function Item({ delay, index, pointPaths }) {
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
    t += 0.0002;
    if (t > 1) {
      t = 0;
    }
  });
  return (
    <RigidBody ref={rigidBody} colliders={"hull"} type="kinematicPosition">
      <Box args={[1, 0.2, 0.05]} rotation={[0, Math.PI / 4, 0]} />
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

function Track({ start, end }) {
  const pointPaths = new THREE.CurvePath();
  const curve = new THREE.CatmullRomCurve3([
    start,
    end,
    end.clone().setY(end.y - 0.1),
    start.clone().setY(start.y - 0.1),
  ]);
  curve.closed = true;
  pointPaths.add(curve);
  const count = Math.ceil(pointPaths.getLength() / 0.25);
  const frac = 1 / (pointPaths.getLength() / 0.25);
  return (
    <>
      <MyLine pointPaths={pointPaths} />
      {Array.from({ length: count }).map((e, i) => (
        <Item delay={frac * i} key={i} index={i} pointPaths={pointPaths} />
      ))}
    </>
  );
}

export default App;

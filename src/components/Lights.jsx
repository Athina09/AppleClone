import { Environment } from "@react-three/drei";

const Lights = () => {
  return (
    <group name="lights">
      <Environment preset="city" />

      <directionalLight
        name="directional-light"
        castShadow
        intensity={0.6}
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
        position={[-2, 5, 2]}
      />
    </group>
  );
};

export default Lights;


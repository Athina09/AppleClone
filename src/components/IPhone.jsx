import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

function IPhone({ item, size, ...props }) {
  const { scene } = useGLTF("/models/scene.glb");
  
  // Clone the scene to avoid reuse issues
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  return <primitive object={clonedScene} {...props} />;
}

export default IPhone;

useGLTF.preload("/models/scene.glb");

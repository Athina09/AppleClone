import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState, Suspense, useRef, useEffect } from "react";
import { yellowImg } from "../utils";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, Center, ContactShadows } from "@react-three/drei";
import { models, sizes } from "../constants";
import * as THREE from "three";

// iPhone model component with color change
function IPhoneModel({ color, isHovered }) {
  const { scene } = useGLTF("/models/scene.glb");
  const groupRef = useRef();
  
  // Auto-rotate animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base rotation
      groupRef.current.rotation.y += delta * 0.5;
      
      // Hover effect - tilt and speed up
      if (isHovered) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          Math.sin(state.clock.elapsedTime * 2) * 0.1,
          0.1
        );
        groupRef.current.rotation.y += delta * 0.8; // Faster rotation on hover
      } else {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0,
          0.1
        );
      }
    }
  });

  // Apply color to the model materials
  useEffect(() => {
    if (scene && color) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Clone material to avoid affecting original
          if (!child.material.userData.isCloned) {
            child.material = child.material.clone();
            child.material.userData.isCloned = true;
          }
          
          // Apply tint color to materials
          const originalColor = child.material.color;
          if (originalColor) {
            child.material.color = new THREE.Color(color).lerp(originalColor, 0.7);
          }
        }
      });
    }
  }, [scene, color]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/scene.glb");

const Model = () => {
  const [size, setSize] = useState("small");
  const [model, setModel] = useState({
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
  });
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    gsap.to("#heading", { y: 0, opacity: 1 });
  }, []);

  // Scale based on size selection - much bigger
  const modelScale = size === "small" ? 15 : 18;

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div 
            className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative bg-zinc rounded-3xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Canvas
              camera={{ position: [0, 0, 4], fov: 50 }}
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
              }}
              dpr={[1, 2]}
            >
              {/* Dynamic lighting based on hover */}
              <ambientLight intensity={isHovered ? 1.5 : 1} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1} 
                intensity={isHovered ? 2 : 1} 
                castShadow
                color={isHovered ? model.color[1] : "#ffffff"}
              />
              <pointLight 
                position={[-10, -10, -10]} 
                intensity={0.5} 
              />
              <directionalLight 
                position={[0, 5, 5]} 
                intensity={isHovered ? 1 : 0.5}
                color={model.color[0]}
              />
              
              <Suspense fallback={null}>
                <Environment preset="city" />
                
                <Center>
                  <group scale={modelScale}>
                    <IPhoneModel 
                      color={model.color[0]} 
                      isHovered={isHovered}
                    />
                  </group>
                </Center>

                {/* Shadow underneath the model */}
                <ContactShadows
                  position={[0, -1.5, 0]}
                  opacity={isHovered ? 0.6 : 0.4}
                  scale={20}
                  blur={isHovered ? 3 : 2}
                  far={6}
                  color={model.color[2]}
                />
              </Suspense>
            </Canvas>

          </div>

          <div className="mx-auto w-full mt-5">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="color-container">
                {models.map((item, i) => (
                  <li
                    key={i}
                    className={`w-6 h-6 rounded-full mx-2 cursor-pointer transition-all duration-300 ${
                      model.title === item.title 
                        ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc' 
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: item.color[0] }}
                    onClick={() => setModel(item)}
                  />
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map(({ label, value }) => (
                  <span
                    key={label}
                    className="size-btn transition-all duration-300"
                    style={{
                      backgroundColor: size === value ? "white" : "transparent",
                      color: size === value ? "black" : "white",
                    }}
                    onClick={() => setSize(value)}
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Controller() {
  const ref = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.5, 0.05)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.3, 0.05)
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
  })
  return (
    <group ref={ref} position={[0, -0.5, 0]} scale={1.4}>
      <mesh castShadow>
        <boxGeometry args={[2.2, 0.35, 1.1]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* grips */}
      <mesh position={[-0.85, -0.25, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0.85, -0.25, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* sticks */}
      <mesh position={[-0.55, 0.22, 0.15]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.55, 0.22, 0.15]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* red logo */}
      <mesh position={[0, 0.2, -0.45]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial color="#FF303B" />
      </mesh>
    </group>
  )
}

function Character() {
  const ref = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.15, 0.03)
  })
  return (
    <group ref={ref} position={[0, -1.2, -2]} scale={1.6}>
      {/* body/hoodie */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.9, 2.2, 16]} />
        <meshStandardMaterial color="#050509" roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#020203" roughness={1} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.12, 1.35, 0.4]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#FF303B" />
      </mesh>
      <mesh position={[0.12, 1.35, 0.4]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#FF303B" />
      </mesh>
    </group>
  )
}

function Eclipse() {
  return (
    <mesh position={[0, 2, -8]}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshBasicMaterial color="#FF303B" transparent opacity={0.15} />
    </mesh>
  )
}

function Particles() {
  const count = 400
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])
  const ref = useRef<THREE.Points>(null)
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#FF4545" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#08090D']} />
        <fog attach="fog" args={['#08090D', 6, 18]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#FF303B" />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#FF4545" />
        <Eclipse />
        <Particles />
        <Character />
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <Controller />
        </Float>
        <Stars radius={50} depth={50} count={800} factor={2} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  )
}

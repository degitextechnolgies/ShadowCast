import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import samuraiImg from '../assets/samurai.svg'

const textureLoader = new THREE.TextureLoader()

const moonCanvas = document.createElement('canvas')
moonCanvas.width = 512
moonCanvas.height = 512
const moonCtx = moonCanvas.getContext('2d')!
moonCtx.fillStyle = '#d90020'
moonCtx.fillRect(0, 0, 512, 512)
moonCtx.fillStyle = '#65000f'
for (let i = 0; i < 40; i++) {
  const x = Math.random() * 512
  const y = Math.random() * 512
  const r = 8 + Math.random() * 40
  moonCtx.beginPath()
  moonCtx.arc(x, y, r, 0, Math.PI * 2)
  moonCtx.fill()
}
const moonDetailTex = new THREE.CanvasTexture(moonCanvas)

function Moon() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.05
    const m = ref.current.material as THREE.Material
    m.opacity = 0.85 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1
  })
  return (
    <mesh ref={ref} position={[1.6, 2.2, -10]} scale={[5.2, 5.2, 5.2]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#ff1025"
        map={moonDetailTex}
        emissive="#ff1025"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function MoonGlow() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.08)
    const m = ref.current.material as THREE.Material
    m.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.9) * 0.1
  })
  return (
    <mesh ref={ref} position={[1.6, 2.2, -9.6]} scale={[6.2, 6.2, 6.2]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#ff1025" transparent opacity={0.35} depthWrite={false} />
    </mesh>
  )
}

function Samurai() {
  const ref = useRef<THREE.Sprite>(null)
  const { pointer } = useThree()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setReady(true)
    img.src = samuraiImg
  }, [])

  useFrame((state) => {
    if (!ref.current || !ready) return
    const time = state.clock.elapsedTime
    ref.current.position.y = -1.0 + Math.sin(time * 1.2) * 0.06
    ref.current.position.x = 1.1 + pointer.x * 0.18
    ref.current.rotation.y = pointer.x * 0.08
  })

  if (!ready) return null
  const tex = textureLoader.load(samuraiImg)
  tex.colorSpace = THREE.SRGBColorSpace
  return (
    <sprite ref={ref} position={[1.1, -1.0, -4]} scale={[4.6, 6.2, 1]}>
      <spriteMaterial map={tex} transparent opacity={1} />
    </sprite>
  )
}

function Temple() {
  return (
    <group position={[2.4, -1.1, -9]} scale={[0.9, 0.9, 0.9]}>
      {[-2.6, -1.3, 0, 1.3, 2.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[2.2, 0.35, 2.2]} />
          <meshStandardMaterial color="#020204" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {[-2.0, -0.7, 0.6, 1.9].map((y, i) => (
        <mesh key={'r' + i} position={[0, y, 0]}>
          <boxGeometry args={[3.0, 0.2, 3.0]} />
          <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.35, 0, 1.2, 8]} />
        <meshStandardMaterial color="#ff1025" emissive="#d90020" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 3.4, 0]} scale={[1, 0.5, 1]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#ff1025" />
      </mesh>
    </group>
  )
}

function ToriiGate() {
  return (
    <group position={[2.6, -2.4, -7.2]} rotation={[0, 0.2, 0]} scale={[0.85, 0.85, 0.85]}>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.5, 3.2, 0.5]} />
          <meshStandardMaterial color="#050507" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[2.2, 0.45, 0.45]} />
        <meshStandardMaterial color="#050507" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[2.6, 0.25, 0.35]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.7, -0.25]}>
        <boxGeometry args={[2.2, 0.1, 0.1]} />
        <meshBasicMaterial color="#ff1025" />
      </mesh>
    </group>
  )
}

function Mountains() {
  return (
    <group position={[0, -1.6, -14]}>
      {[
        { x: -4, w: 7, h: 4.2, color: '#050507', z: 0 },
        { x: 2, w: 6, h: 3.6, color: '#0a080a', z: 0.5 },
        { x: -2, w: 5, h: 3.0, color: '#050507', z: 1 },
      ].map((m, i) => (
        <mesh key={i} position={[m.x, 0, m.z]}>
          <coneGeometry args={[m.w, m.h, 4]} />
          <meshStandardMaterial color={m.color} flatShading />
        </mesh>
      ))}
    </group>
  )
}

const leafCanvas = document.createElement('canvas')
leafCanvas.width = 64
leafCanvas.height = 64
const lc = leafCanvas.getContext('2d')!
lc.fillStyle = '#ff1025'
lc.beginPath()
lc.moveTo(32, 4); lc.bezierCurveTo(48, 4, 60, 28, 32, 60); lc.bezierCurveTo(4, 28, 16, 4, 32, 4)
lc.fill()
const leafTex = new THREE.CanvasTexture(leafCanvas)

function MapleLeaves() {
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])
  const offsets = useMemo(() => new Float32Array(count).map(() => Math.random() * Math.PI * 2), [])
  const speeds = useMemo(() => new Float32Array(count).map(() => 0.4 + Math.random() * 0.8), [])
  const ref = useRef<THREE.Points>(null)
  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i] * 0.016
      if (pos[i * 3 + 1] < -9) pos[i * 3 + 1] = 9
      pos[i * 3] += Math.sin(time * 0.5 + offsets[i]) * 0.005
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={leafTex}
        transparent
        color="#ff303a"
        size={0.14}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function FogLayer({ depth, opacity, scale }: { depth: number; opacity: number; scale: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.x = (state.clock.elapsedTime * 0.03 * scale) % 14 - 7
  })
  return (
    <mesh ref={ref} position={[0, -2.2, depth]} scale={[scale, scale, 1]}>
      <planeGeometry args={[14, 6]} />
      <meshBasicMaterial color="#020204" transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Fog() {
  return (
    <>
      <FogLayer depth={-6} opacity={0.35} scale={1.3} />
      <FogLayer depth={-10} opacity={0.25} scale={1.6} />
      <FogLayer depth={-12} opacity={0.2} scale={1.9} />
    </>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      >
        <color attach="background" args={['#050507']} />
        <fog attach="fog" args={['#050507', 8, 26]} />
        <ambientLight intensity={0.12} />
        <directionalLight position={[3, 6, 4]} intensity={0.9} color="#ff1025" castShadow />
        <pointLight position={[1.6, 2.2, -10]} intensity={2.5} distance={45} decay={1.6} color="#ff1025" />
        <pointLight position={[-3, 1, -5]} intensity={0.8} distance={30} color="#d90020" />
        <MoonGlow />
        <Moon />
        <Mountains />
        <Temple />
        <ToriiGate />
        <Fog />
        <MapleLeaves />
        <Samurai />
        <Stars radius={55} depth={55} count={700} factor={3} saturation={0} speed={0.4} />
      </Canvas>
    </div>
  )
}

import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

/**
 * 3D wireframe torus that lights up at hit and then slowly depulses.
 */
export default function HeroTorus({
  x = 0,
  y = 0,
  scale = 1,
  rotationMs = 6000,
  tracerMs = 5000,
}: {
  x?: number
  y?: number
  scale?: number
  rotationMs?: number
  tracerMs?: number
}) {
  const goalFraction = Math.max(0, Math.min(1, tracerMs / rotationMs))

  const matDim = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(0x67e8f9), wireframe: true, transparent: true, opacity: 0.18 }), [])
  const matHi = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(0x67e8f9), wireframe: true, transparent: true, opacity: 0 }), [])

  // Animate opacity using CSS animation on canvas overlay is complex; R3F handles via onCreated clock
  const onCreated = ({ clock }: { clock: THREE.Clock }) => {
    const update = () => {
      const t = (clock.getElapsedTime() * 1000) % rotationMs
      const frac = t / rotationMs
      if (frac < goalFraction) {
        matHi.opacity = 0
      } else {
        // fade from 1 to ~0.35 between goalFraction..1
        const p = (frac - goalFraction) / (1 - goalFraction)
        matHi.opacity = 1 - p * 0.65
      }
      requestAnimationFrame(update)
    }
    update()
  }

  return (
    <div className="absolute" style={{ left: `${x}px`, top: `${y}px`, transform: `scale(${scale})` }}>
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }} onCreated={onCreated} style={{ width: 160, height: 120 }}>
        <ambientLight intensity={0.5} />
        <group rotation={[0.2, -0.6, 0]}> {/* tilt to look 3D */}
          <mesh material={matDim}>
            <torusGeometry args={[1.2, 0.55, 24, 48]} />
          </mesh>
          <mesh material={matHi}>
            <torusGeometry args={[1.2, 0.55, 24, 48]} />
          </mesh>
        </group>
      </Canvas>
    </div>
  )
}

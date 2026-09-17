import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  interactive?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL is unavailable or failed to initialize, displaying fallback visual.', err);
      return;
    }

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 28;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold our rotating neural skill cosmos
    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    // 1. Central Core Glowing Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cosmosGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(2.4, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: false,
      transparent: true,
      opacity: 0.15,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    cosmosGroup.add(innerSphere);

    // 2. Career Nodes (Floating Beacons in 3D Space)
    const nodeColors = [
      0x38bdf8, // Sky (Data)
      0x818cf8, // Indigo (AI/ML)
      0xec4899, // Pink (GenAI)
      0x10b981, // Emerald (Cloud)
      0xf59e0b, // Amber (FullStack)
      0xa855f7, // Purple (Cybersecurity)
      0x06b6d4, // Cyan (MLOps)
    ];

    const nodeCount = 18;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const radius = 9 + (i % 3) * 2.2;
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodePositions.push(pos);

      const sphereGeo = new THREE.SphereGeometry(i < 7 ? 0.6 : 0.35, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: nodeColors[i % nodeColors.length],
        transparent: true,
        opacity: 0.85,
      });
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.copy(pos);
      cosmosGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // 3. Neural Synapse Connections (Lines between nodes)
    const lineCoords: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Connect to center
      lineCoords.push(0, 0, 0);
      lineCoords.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);

      // Connect to neighbors
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 8.5) {
          lineCoords.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          lineCoords.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(lineCoords, 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.22,
    });
    const neuralLines = new THREE.LineSegments(lineGeo, lineMat);
    cosmosGroup.add(neuralLines);

    // 4. Background Constellation Particles
    const particleCount = 240;
    const particleCoords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 50;
      particleCoords[i + 1] = (Math.random() - 0.5) * 45;
      particleCoords[i + 2] = (Math.random() - 0.5) * 40;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particleCoords, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.6,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.8;
      targetY = (y / rect.height) * 0.8;
    };

    if (interactive) {
      container.addEventListener('mousemove', onMouseMove);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Cosmos rotation
      cosmosGroup.rotation.y = elapsedTime * 0.15 + mouseX;
      cosmosGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15 + mouseY;

      // Subtle pulse on core
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.05;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Orbit particles slowly
      particleCloud.rotation.y = elapsedTime * 0.04;
      particleCloud.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver for responsive resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width || 300;
        const newHeight = entry.contentRect.height || 300;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousemove', onMouseMove);
      }
      resizeObserver.disconnect();
      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[360px] relative pointer-events-auto cursor-grab active:cursor-grabbing"
      aria-label="3D Interactive Neural Career Constellation"
    />
  );
};

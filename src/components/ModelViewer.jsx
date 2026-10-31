import React, { useEffect, useRef, useState } from 'react';
import { fixButterflyMaterials } from '../utils/butterflyMaterial';

export default function ModelViewer({ file, name, playing = true, interactive = false }) {
  const host = useRef(null);
  const playback = useRef(playing);
  const [status, setStatus] = useState('loading');
  useEffect(() => { playback.current = playing; }, [playing]);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    setStatus('loading');
    Promise.all([import('three'), import('three/examples/jsm/loaders/GLTFLoader.js'), import('three/examples/jsm/controls/OrbitControls.js')])
      .then(([THREE, { GLTFLoader }, { OrbitControls }]) => {
        if (cancelled) return;
        const element = host.current;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputEncoding = THREE.sRGBEncoding;
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.set(0, 0.4, 6.5);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enabled = interactive;
        controls.minDistance = 3; controls.maxDistance = 12;
        controls.autoRotate = false;
        scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const light = new THREE.DirectionalLight(0xffffff, 1.8);
        light.position.set(3, 4, 5); scene.add(light);
        let mixer, model, frame;
        let inView = true;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const clock = new THREE.Clock();
        const dispose = root => {
          const resources = new Set();
          root.traverse(child => {
            if (child.geometry) resources.add(child.geometry);
            if (child.skeleton?.boneTexture) resources.add(child.skeleton.boneTexture);
            (child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : []).forEach(material => {
              resources.add(material);
              Object.values(material).forEach(value => { if (value?.isTexture) resources.add(value); });
            });
          });
          resources.forEach(resource => resource.dispose());
        };
        const resize = () => {
          const { width, height } = element.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height; camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(element);
        const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
        visibility.observe(element);
        cleanup = () => {
          cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect();
          mixer?.stopAllAction(); controls.dispose(); dispose(scene);
          renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
        };
        new GLTFLoader().load(`${import.meta.env.BASE_URL}models/${file}`, gltf => {
          if (cancelled) { dispose(gltf.scene); return; }
          fixButterflyMaterials(gltf.scene);
          mixer = new THREE.AnimationMixer(gltf.scene);
          if (gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
          mixer.update(0); gltf.scene.updateMatrixWorld(true);
          const bounds = new THREE.Box3();
          const vertex = new THREE.Vector3();
          gltf.scene.traverse(child => {
            if (!child.isMesh) return;
            child.frustumCulled = false;
            child.skeleton?.update();
            const positions = child.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
              vertex.fromBufferAttribute(positions, i);
              if (child.isSkinnedMesh) child.boneTransform(i, vertex);
              bounds.expandByPoint(vertex.applyMatrix4(child.matrixWorld));
            }
          });
          const size = bounds.getSize(new THREE.Vector3());
          const scale = 2.7 / Math.max(size.x, size.y, size.z);
          const normalized = new THREE.Group(); normalized.add(gltf.scene);
          normalized.scale.setScalar(scale);
          normalized.position.copy(bounds.getCenter(new THREE.Vector3())).multiplyScalar(-scale);
          model = new THREE.Group(); model.add(normalized); scene.add(model);
          model.rotation.y = 0.3;
          setStatus('ready');
        }, undefined, () => { if (!cancelled) setStatus('error'); });
        const render = () => {
          frame = requestAnimationFrame(render);
          const delta = Math.min(clock.getDelta(), 0.05);
          if (document.hidden || !inView) return;
          if (playback.current) {
            mixer?.update(delta);
            if (model && !interactive && !reduced.matches) model.rotation.y += delta * 0.12;
          }
          controls.update(); renderer.render(scene, camera);
        };
        resize(); render();
      }).catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; cleanup(); };
  }, [file, interactive]);

  return <div className="model-viewer" data-status={status}>
    <div ref={host} className="model-viewer-stage" role="img" aria-label={`${name} — 3D model`} />
    {status !== 'ready' && <p role={status === 'error' ? 'alert' : 'status'} className="absolute inset-0 grid place-items-center text-sm text-indigo-500 p-6 text-center pointer-events-none">{status === 'error' ? 'Model ochilmadi. Sahifani yangilab ko‘ring; WebGL yoqilgan bo‘lsin.' : '3D model yuklanmoqda…'}</p>}
  </div>;
}

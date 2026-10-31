import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { fixButterflyMaterials } from '../utils/butterflyMaterial';

export default function ButterflyFlight() {
  const host = useRef(null);
  const [enabled, setEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || failed) return;
    let cancelled = false;
    let cleanup = () => {};
    Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/utils/SkeletonUtils.js'),
    ]).then(([THREE, { GLTFLoader }, { SkeletonUtils }]) => {
      if (cancelled) return;
      const element = host.current;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputEncoding = THREE.sRGBEncoding;
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);
      camera.position.z = 100;
      scene.add(new THREE.AmbientLight(0xffffff, 1.6));
      const light = new THREE.DirectionalLight(0xffffff, 1.8);
      light.position.set(0, 30, 70);
      scene.add(light);
      const butterflies = [];
      const clock = new THREE.Clock();
      let original, frame, elapsed = 0, scroll = 0, pointer = 0, width = 100;
      const mobile = window.matchMedia('(max-width: 640px)');
      const disposeModel = root => {
        const resources = new Set();
        root.traverse(child => {
          if (child.geometry) resources.add(child.geometry);
          if (child.skeleton?.boneTexture) resources.add(child.skeleton.boneTexture);
          const materials = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
          materials.forEach(material => {
            resources.add(material);
            Object.values(material).forEach(value => { if (value?.isTexture) resources.add(value); });
          });
        });
        resources.forEach(resource => resource.dispose());
      };
      const resize = () => {
        width = window.innerWidth / window.innerHeight * 100;
        camera.left = -width / 2; camera.right = width / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      const onScroll = () => { scroll = window.scrollY * 0.008; };
      const onPointer = event => { pointer = event.clientX / window.innerWidth - 0.5; };
      resize(); onScroll();
      window.addEventListener('resize', resize);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onPointer, { passive: true });
      const render = () => {
        frame = requestAnimationFrame(render);
        const delta = Math.min(clock.getDelta(), 0.05);
        if (document.hidden) return;
        elapsed += delta;
        butterflies.forEach(({ pivot, mixer, index }) => {
          pivot.visible = !mobile.matches || index < 2;
          if (!pivot.visible) return;
          mixer.update(delta);
          const speed = 0.5 + index * 0.065;
          const phase = elapsed * speed + index * 1.9;
          const direction = Math.tanh(Math.cos(phase) * 4);
          // Cross the whole screen, then turn smoothly into the return flight.
          pivot.position.set(
            Math.sin(phase) * Math.max(0, width / 2 - 7),
            Math.sin(phase * 1.3 + index * 0.8) * 33 + Math.sin(elapsed * 1.8 + index) * 3,
            index * 0.2,
          );
          pivot.position.y += Math.sin(scroll * 0.3 + index) * 3;
          pivot.rotation.set(
            0.45 + Math.cos(phase * 1.3 + index * 0.8) * 0.2,
            direction * 0.75 + pointer * 0.2,
            -direction * Math.cos(phase * 1.3 + index * 0.8) * 0.4,
          );
        });
        renderer.render(scene, camera);
      };
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointermove', onPointer);
        butterflies.forEach(({ mixer }) => mixer.stopAllAction());
        disposeModel(scene);
        if (original) disposeModel(original);
        renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      };
      new GLTFLoader().load(`${import.meta.env.BASE_URL}models/fantasy_butterfly_animation.glb`, gltf => {
        if (cancelled) { disposeModel(gltf.scene); return; }
        original = gltf.scene;
        fixButterflyMaterials(original);
        const mixer = new THREE.AnimationMixer(original);
        if (gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
        mixer.update(0); original.updateMatrixWorld(true);
        const bounds = new THREE.Box3();
        const vertex = new THREE.Vector3();
        original.traverse(child => {
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
        mixer.stopAllAction();
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        for (let index = 0; index < 5; index++) {
          const copy = SkeletonUtils.clone(original);
          const normalized = new THREE.Group();
          normalized.add(copy);
          const scale = (index === 0 ? 13 : 6 + index * 0.6) / Math.max(size.x, size.y, size.z);
          normalized.scale.setScalar(scale);
          normalized.position.copy(center).multiplyScalar(-scale);
          const pivot = new THREE.Group();
          pivot.add(normalized); scene.add(pivot);
          const animation = new THREE.AnimationMixer(copy);
          if (gltf.animations[0]) {
            const action = animation.clipAction(gltf.animations[0]);
            action.timeScale = 0.8 + index * 0.13;
            action.play(); animation.update(index * 0.37);
          }
          butterflies.push({ pivot, mixer: animation, index });
        }
        element.dataset.ready = 'true';
      }, undefined, error => {
        if (!cancelled) { console.warn('Kapalak modeli yuklanmadi:', error); setFailed(true); }
      });
      render();
    }).catch(error => {
      if (!cancelled) { console.warn('3D animatsiya ochilmadi:', error); setFailed(true); }
    });
    return () => { cancelled = true; cleanup(); };
  }, [enabled, failed]);

  if (failed) return null;
  return <>
    {enabled && <div ref={host} className="butterfly-flight" aria-hidden="true" />}
    <button type="button" className="butterfly-toggle contact-glass" onClick={() => setEnabled(value => !value)} aria-label={enabled ? 'Kapalaklarni yashirish' : 'Kapalaklarni ko‘rsatish'} title={enabled ? 'Kapalaklarni yashirish' : 'Kapalaklarni ko‘rsatish'}>
      {enabled ? <X size={17} /> : <Sparkles size={17} />}
    </button>
  </>;
}

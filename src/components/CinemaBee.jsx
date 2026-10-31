import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function CinemaBee({ embedded = false }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!visible || failed) return;
    let dispose = () => {};
    let cancelled = false;
    Promise.all([import('three'), import('three/examples/jsm/loaders/GLTFLoader.js'), import('gsap')])
      .then(([THREE, { GLTFLoader }, { gsap }]) => {
        if (cancelled) return;
        const element = host.current;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputEncoding = THREE.sRGBEncoding;
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
        camera.position.z = 6;
        const group = new THREE.Group();
        scene.add(group, new THREE.AmbientLight(0xffffff, 1.5));
        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(3, 5, 4);
        scene.add(light);
        let model, mixer, frame, section;
        const pointer = new THREE.Vector2();
        const clock = new THREE.Clock();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const release = object => object.traverse(child => {
          child.geometry?.dispose();
          const materials = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
          materials.forEach(material => {
            Object.values(material).forEach(value => { if (value?.isTexture) value.dispose(); });
            material.dispose();
          });
        });
        const resize = () => {
          const { width, height } = element.getBoundingClientRect();
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const move = event => pointer.set(event.clientX / window.innerWidth * 2 - 1, 1 - event.clientY / window.innerHeight * 2);
        const scroll = () => {
          const sections = [...document.querySelectorAll('[data-bee-section]')];
          const active = sections.filter(item => item.getBoundingClientRect().top < window.innerHeight * 0.6).pop();
          const next = active?.dataset.beeSection || 'banner';
          if (next === section) return;
          section = next;
          gsap.to(group.rotation, { y: next === 'catalog' ? -0.5 : 0.5, duration: reduced.matches ? 0 : 1.6, overwrite: true });
          gsap.to(group.position, { x: next === 'catalog' ? -0.2 : 0.1, y: next === 'footer' ? -0.2 : 0, duration: reduced.matches ? 0 : 1.6, overwrite: true });
        };
        const observer = new ResizeObserver(resize);
        observer.observe(element);
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('scroll', scroll, { passive: true });
        new GLTFLoader().load(`${import.meta.env.BASE_URL}models/demon_bee_full_texture.glb`, gltf => {
          if (cancelled) { release(gltf.scene); return; }
          model = gltf.scene;
          mixer = new THREE.AnimationMixer(model);
          if (gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
          mixer.update(0);
          model.updateMatrixWorld(true);
          // This model is skinned: measure the posed vertices, not the bind pose.
          const bounds = new THREE.Box3();
          const vertex = new THREE.Vector3();
          model.traverse(child => {
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
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = 2.7 / Math.max(size.x, size.y, size.z);
          const normalized = new THREE.Group();
          normalized.add(model);
          normalized.scale.setScalar(scale);
          normalized.position.copy(center.multiplyScalar(-scale));
          const pivot = new THREE.Group();
          pivot.add(normalized);
          model = pivot;
          group.add(model);
          scroll();
        }, undefined, () => { if (!cancelled) setFailed(true); });
        const render = () => {
          frame = requestAnimationFrame(render);
          const delta = Math.min(clock.getDelta(), 0.05);
          if (document.hidden) return;
          if (!reduced.matches) {
            mixer?.update(delta);
            if (model) {
              const blend = 1 - Math.exp(-5 * delta);
              model.rotation.x += (-pointer.y * 0.22 - model.rotation.x) * blend;
              model.rotation.y += (pointer.x * 0.4 - model.rotation.y) * blend;
            }
          }
          renderer.render(scene, camera);
        };
        resize(); render();
        dispose = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener('pointermove', move);
          window.removeEventListener('scroll', scroll);
          gsap.killTweensOf(group.position); gsap.killTweensOf(group.rotation);
          mixer?.stopAllAction();
          release(scene); renderer.dispose(); renderer.forceContextLoss();
          renderer.domElement.remove();
        };
      }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; dispose(); };
  }, [visible, failed]);

  if (failed) return null;
  return <aside className={`cinema-bee ${embedded ? 'cinema-bee-embedded' : ''} ${visible ? '' : 'cinema-bee-collapsed'}`} aria-label="BEKACINEMA 3D hamrohi">
    {visible && <><div ref={host} className="cinema-bee-stage" aria-hidden="true" /><span className="cinema-bee-caption">Kino olamidagi hamrohingiz</span></>}
    <button className="cinema-bee-toggle" onClick={() => setVisible(value => !value)} aria-label={visible ? '3D arini yashirish' : '3D arini ko‘rsatish'} title={visible ? 'Arini yashirish' : '3D hamroh'}>
      {visible ? <X size={15} /> : <Sparkles size={18} />}
    </button>
  </aside>;
}

// The GLB atlas stores an opaque black background around the wing artwork.
// Cut only near-black texels before lighting; keep the blue wing details intact.
export function fixButterflyMaterials(root) {
  const updated = new Set();
  root.traverse(child => {
    const materials = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
    materials.forEach(material => {
      if (material.name !== 'butterflyMAT' || !material.map || updated.has(material)) return;
      updated.add(material);
      material.alphaTest = 0.15;
      material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
          #include <map_fragment>
          #ifdef USE_MAP
            vec3 wingColor = texture2D(map, vUv).rgb;
            if (max(wingColor.r, max(wingColor.g, wingColor.b)) < 0.035) discard;
          #endif
        `);
      };
      material.customProgramCacheKey = () => 'butterfly-wing-cutout-v1';
      material.needsUpdate = true;
    });
  });
}

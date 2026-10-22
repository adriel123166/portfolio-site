# Browser dependencies

`three/three.module.js` and `three/three.core.js` are minified ES modules from Three.js 0.186.1, sourced from the installed Sibol House dependency. Their import relationship is preserved. The MIT license is included in `three/LICENSE`; minification preserves source license notices.

Official source: https://github.com/mrdoob/three.js/tree/r186

These are archived dependencies from the removed portrait. The current homepage does not import or request them. It does not depend on a public CDN or an external avatar-generation service. The local GLTFLoader, its utility imports and RoomEnvironment are from the same Three.js version. The supplied Meshy GLB is loaded with its embedded textures; the corrected model includes separate opaque lens meshes.

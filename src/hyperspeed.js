import * as THREE from 'three';

class HyperspeedBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 20,
      lightPairsPerRoadWay: 40,
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],
      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],
      carLightsLength: [400 * 0.03, 400 * 0.2],
      carLightsRadius: [0.05, 0.14],
      carWidthPercentage: [0.3, 0.5],
      carShiftX: [-0.8, 0.8],
      carFloorSeparation: [0, 5],
      colors: {
        roadColor: 0x0b0f14,
        islandColor: 0x0f1720,
        background: 0x0b0f14,
        shoulderLines: 0x94a3b8,
        brokenLines: 0x94a3b8,
        leftCars: [0x007bff, 0x3390ff, 0x0056cc],
        rightCars: [0x007bff, 0x3390ff, 0x0056cc],
        sticks: 0x007bff,
      },
      ...options
    };

    this.disposed = false;
    this.clock = new THREE.Clock();
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
    this.speedUp = 0;
    this.timeOffset = 0;

    this.init();
  }

  init() {
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true
    });
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 8, -5);

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Setup fog
    const fog = new THREE.Fog(
      this.options.colors.background,
      this.options.length * 0.2,
      this.options.length * 500
    );
    this.scene.fog = fog;

    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far }
    };

    // Create distortion uniforms
    this.distortionUniforms = {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
    };

    // Create road and lights
    this.createRoad();
    this.createCarLights();
    this.createLightSticks();

    // Event listeners
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('mouseout', this.onMouseUp);
    window.addEventListener('resize', this.onWindowResize);

    // Start animation
    this.animate();
  }

  createRoad() {
    const options = this.options;
    const segments = 100;

    // Create road geometry
    const roadGeometry = new THREE.PlaneGeometry(
      options.roadWidth,
      options.length,
      20,
      segments
    );

    // Road material with shader
    const roadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTravelLength: { value: options.length },
        uColor: { value: new THREE.Color(options.colors.roadColor) },
        uLanes: { value: options.lanesPerRoad },
        uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
        uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
        uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
        uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
        uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage },
        ...this.fogUniforms,
        ...this.distortionUniforms
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getRoadFragmentShader(),
      side: THREE.DoubleSide
    });

    // Create road meshes
    this.leftRoad = new THREE.Mesh(roadGeometry, roadMaterial);
    this.leftRoad.rotation.x = -Math.PI / 2;
    this.leftRoad.position.set(
      -(options.islandWidth / 2 + options.roadWidth / 2),
      0,
      -options.length / 2
    );

    this.rightRoad = new THREE.Mesh(roadGeometry, roadMaterial.clone());
    this.rightRoad.rotation.x = -Math.PI / 2;
    this.rightRoad.position.set(
      options.islandWidth / 2 + options.roadWidth / 2,
      0,
      -options.length / 2
    );

    // Create island
    const islandGeometry = new THREE.PlaneGeometry(
      options.islandWidth,
      options.length,
      20,
      segments
    );

    const islandMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTravelLength: { value: options.length },
        uColor: { value: new THREE.Color(options.colors.islandColor) },
        ...this.fogUniforms,
        ...this.distortionUniforms
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getIslandFragmentShader(),
      side: THREE.DoubleSide
    });

    this.island = new THREE.Mesh(islandGeometry, islandMaterial);
    this.island.rotation.x = -Math.PI / 2;
    this.island.position.set(0, 0, -options.length / 2);

    this.scene.add(this.leftRoad);
    this.scene.add(this.rightRoad);
    this.scene.add(this.island);
  }

  createCarLights() {
    const options = this.options;
    
    // Create tube geometry for car lights
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    );
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);

    // Create instanced geometry
    const instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry);
    instancedGeometry.instanceCount = options.lightPairsPerRoadWay * 2;

    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const aOffset = [];
    const aMetrics = [];
    const aColor = [];

    const colors = options.colors.leftCars.map(c => new THREE.Color(c));

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = this.random(options.carLightsRadius);
      const length = this.random(options.carLightsLength);
      const speed = this.random(options.movingAwaySpeed);

      const carLane = i % options.lanesPerRoad;
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

      const carWidth = this.random(options.carWidthPercentage) * laneWidth;
      const carShiftX = this.random(options.carShiftX) * laneWidth;
      laneX += carShiftX;

      const offsetY = this.random(options.carFloorSeparation) + radius * 1.3;
      const offsetZ = -this.random(options.length);

      // Left light
      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
      // Right light
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);

      // Metrics for both lights
      aMetrics.push(radius, length, speed);
      aMetrics.push(radius, length, speed);

      // Color for both lights
      const color = this.pickRandom(colors);
      aColor.push(color.r, color.g, color.b);
      aColor.push(color.r, color.g, color.b);
    }

    instancedGeometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3));
    instancedGeometry.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3));
    instancedGeometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTravelLength: { value: options.length },
        uFade: { value: new THREE.Vector2(0, 1 - options.carLightsFade) },
        ...this.fogUniforms,
        ...this.distortionUniforms
      },
      vertexShader: this.getCarLightsVertexShader(),
      fragmentShader: this.getCarLightsFragmentShader(),
      transparent: true
    });

    this.leftCarLights = new THREE.Mesh(instancedGeometry, material);
    this.leftCarLights.position.x = -(options.roadWidth / 2 + options.islandWidth / 2);
    this.leftCarLights.frustumCulled = false;

    // Create right car lights
    const rightMaterial = material.clone();
    rightMaterial.uniforms.uFade.value = new THREE.Vector2(1, 0 + options.carLightsFade);
    
    this.rightCarLights = new THREE.Mesh(instancedGeometry.clone(), rightMaterial);
    this.rightCarLights.position.x = options.roadWidth / 2 + options.islandWidth / 2;
    this.rightCarLights.frustumCulled = false;

    this.scene.add(this.leftCarLights);
    this.scene.add(this.rightCarLights);
  }

  createLightSticks() {
    const options = this.options;
    const geometry = new THREE.PlaneGeometry(1, 1);
    const instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry);
    const totalSticks = options.totalSideLightSticks;
    instancedGeometry.instanceCount = totalSticks;

    const stickOffset = options.length / (totalSticks - 1);
    const aOffset = [];
    const aColor = [];
    const aMetrics = [];

    const color = new THREE.Color(options.colors.sticks);

    for (let i = 0; i < totalSticks; i++) {
      const width = this.random(options.lightStickWidth);
      const height = this.random(options.lightStickHeight);
      
      aOffset.push((i - 1) * stickOffset * 2 + stickOffset * Math.random());
      aColor.push(color.r, color.g, color.b);
      aMetrics.push(width, height);
    }

    instancedGeometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1));
    instancedGeometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3));
    instancedGeometry.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTravelLength: { value: options.length },
        ...this.fogUniforms,
        ...this.distortionUniforms
      },
      vertexShader: this.getLightSticksVertexShader(),
      fragmentShader: this.getLightSticksFragmentShader(),
      side: THREE.DoubleSide
    });

    this.lightSticks = new THREE.Mesh(instancedGeometry, material);
    this.lightSticks.position.x = -(options.roadWidth + options.islandWidth / 2);
    this.lightSticks.frustumCulled = false;

    this.scene.add(this.lightSticks);
  }

  getVertexShader() {
    return `
      uniform float uTime;
      uniform float uTravelLength;
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      varying vec2 vUv;
      
      float nsin(float val) {
        return sin(val) * 0.5 + 0.5;
      }
      
      vec3 getDistortion(float progress) {
        float getDistortionX = (
          cos(3.14159 * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(3.14159 * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.0) * uAmp.g
        );
        float getDistortionY = (
          -nsin(3.14159 * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(3.14159 * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.0) * uAmp.a
        );
        return vec3(
          getDistortionX - (cos(3.14159 * 0.0125 * uFreq.r + uTime) * uAmp.r + pow(cos(3.14159 * 0.0125 * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.0) * uAmp.g),
          getDistortionY - (-nsin(3.14159 * 0.0125 * uFreq.b + uTime) * uAmp.b + -pow(nsin(3.14159 * 0.0125 * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.0) * uAmp.a),
          0.0
        );
      }
      
      void main() {
        vec3 transformed = position.xyz;
        vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.0) / uTravelLength);
        transformed.x += distortion.x;
        transformed.z += distortion.y;
        transformed.y += -1.0 * distortion.z;
        
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
      }
    `;
  }

  getRoadFragmentShader() {
    return `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uLanes;
      uniform vec3 uBrokenLinesColor;
      uniform vec3 uShoulderLinesColor;
      uniform float uShoulderLinesWidthPercentage;
      uniform float uBrokenLinesWidthPercentage;
      uniform float uBrokenLinesLengthPercentage;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        vec3 color = uColor;
        
        uv.y = mod(uv.y + uTime * 0.05, 1.0);
        float laneWidth = 1.0 / uLanes;
        float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
        float laneEmptySpace = 1.0 - uBrokenLinesLengthPercentage;
        
        float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
        float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
        
        brokenLines = mix(brokenLines, sideLines, uv.x);
        color = mix(color, uBrokenLinesColor, brokenLines * 0.3);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
  }

  getIslandFragmentShader() {
    return `
      uniform vec3 uColor;
      varying vec2 vUv;
      
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `;
  }

  getCarLightsVertexShader() {
    return `
      attribute vec3 aOffset;
      attribute vec3 aMetrics;
      attribute vec3 aColor;
      uniform float uTravelLength;
      uniform float uTime;
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      varying vec2 vUv;
      varying vec3 vColor;
      
      float nsin(float val) {
        return sin(val) * 0.5 + 0.5;
      }
      
      vec3 getDistortion(float progress) {
        float getDistortionX = (
          cos(3.14159 * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(3.14159 * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.0) * uAmp.g
        );
        float getDistortionY = (
          -nsin(3.14159 * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(3.14159 * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.0) * uAmp.a
        );
        return vec3(
          getDistortionX - (cos(3.14159 * 0.0125 * uFreq.r + uTime) * uAmp.r + pow(cos(3.14159 * 0.0125 * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.0) * uAmp.g),
          getDistortionY - (-nsin(3.14159 * 0.0125 * uFreq.b + uTime) * uAmp.b + -pow(nsin(3.14159 * 0.0125 * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.0) * uAmp.a),
          0.0
        );
      }
      
      void main() {
        vec3 transformed = position.xyz;
        float radius = aMetrics.r;
        float myLength = aMetrics.g;
        float speed = aMetrics.b;
        
        transformed.xy *= radius;
        transformed.z *= myLength;
        
        transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
        transformed.xy += aOffset.xy;
        
        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);
        
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
        vColor = aColor;
      }
    `;
  }

  getCarLightsFragmentShader() {
    return `
      varying vec3 vColor;
      varying vec2 vUv;
      uniform vec2 uFade;
      
      void main() {
        vec3 color = vColor;
        float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
        gl_FragColor = vec4(color, alpha);
        if (gl_FragColor.a < 0.0001) discard;
      }
    `;
  }

  getLightSticksVertexShader() {
    return `
      attribute float aOffset;
      attribute vec3 aColor;
      attribute vec2 aMetrics;
      uniform float uTravelLength;
      uniform float uTime;
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      varying vec3 vColor;
      
      float nsin(float val) {
        return sin(val) * 0.5 + 0.5;
      }
      
      vec3 getDistortion(float progress) {
        float getDistortionX = (
          cos(3.14159 * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(3.14159 * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.0) * uAmp.g
        );
        float getDistortionY = (
          -nsin(3.14159 * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(3.14159 * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.0) * uAmp.a
        );
        return vec3(
          getDistortionX - (cos(3.14159 * 0.0125 * uFreq.r + uTime) * uAmp.r + pow(cos(3.14159 * 0.0125 * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.0) * uAmp.g),
          getDistortionY - (-nsin(3.14159 * 0.0125 * uFreq.b + uTime) * uAmp.b + -pow(nsin(3.14159 * 0.0125 * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.0) * uAmp.a),
          0.0
        );
      }
      
      mat4 rotationY(float angle) {
        return mat4(
          cos(angle), 0, sin(angle), 0,
          0, 1.0, 0, 0,
          -sin(angle), 0, cos(angle), 0,
          0, 0, 0, 1
        );
      }
      
      void main() {
        vec3 transformed = position.xyz;
        float width = aMetrics.x;
        float height = aMetrics.y;
        
        transformed.xy *= vec2(width, height);
        float time = mod(uTime * 60.0 * 2.0 + aOffset, uTravelLength);
        
        transformed = (rotationY(3.14159 / 2.0) * vec4(transformed, 1.0)).xyz;
        transformed.z += -uTravelLength + time;
        
        float progress = abs(transformed.z / uTravelLength);
        transformed.xyz += getDistortion(progress);
        
        transformed.y += height / 2.0;
        transformed.x += -width / 2.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vColor = aColor;
      }
    `;
  }

  getLightSticksFragmentShader() {
    return `
      varying vec3 vColor;
      
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;
  }

  onMouseDown() {
    this.fovTarget = this.options.fovSpeedUp;
    this.speedUpTarget = this.options.speedUp;
  }

  onMouseUp() {
    this.fovTarget = this.options.fov;
    this.speedUpTarget = 0;
  }

  onWindowResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
    this.speedUp += this.lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
    this.timeOffset += this.speedUp * delta;

    const time = this.clock.elapsedTime + this.timeOffset;

    // Update uniforms
    if (this.leftRoad) {
      this.leftRoad.material.uniforms.uTime.value = time;
      this.rightRoad.material.uniforms.uTime.value = time;
      this.island.material.uniforms.uTime.value = time;
    }

    if (this.leftCarLights) {
      this.leftCarLights.material.uniforms.uTime.value = time;
      this.rightCarLights.material.uniforms.uTime.value = time;
    }

    if (this.lightSticks) {
      this.lightSticks.material.uniforms.uTime.value = time;
    }

    // Update camera FOV
    const fovChange = this.lerp(this.camera.fov, this.fovTarget, lerpPercentage);
    if (Math.abs(fovChange) > 0.001) {
      this.camera.fov += fovChange * delta * 6;
      this.camera.updateProjectionMatrix();
    }
  }

  animate() {
    if (this.disposed) return;

    const delta = this.clock.getDelta();
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  // Utility functions
  random(base) {
    if (Array.isArray(base)) {
      return Math.random() * (base[1] - base[0]) + base[0];
    }
    return Math.random() * base;
  }

  pickRandom(arr) {
    if (Array.isArray(arr)) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    return arr;
  }

  lerp(current, target, speed = 0.1, limit = 0.001) {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) {
      change = target - current;
    }
    return change;
  }

  dispose() {
    this.disposed = true;
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.clear();
    }

    window.removeEventListener('resize', this.onWindowResize);
    
    if (this.container) {
      this.container.removeEventListener('mousedown', this.onMouseDown);
      this.container.removeEventListener('mouseup', this.onMouseUp);
      this.container.removeEventListener('mouseout', this.onMouseUp);
    }
  }
}

export default HyperspeedBackground;
// Ultimate 3D Portfolio Script - Next Level Enhancement
class UltimatePortfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = null;
        this.objects = [];
        this.projectObjects = [];
        this.particles = [];
        this.currentSection = 'about';
        this.isLoading = true;
        this.clock = new THREE.Clock();
        this.mixer = null;
        this.audioContext = null;
        this.audioAnalyser = null;
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            console.log('🚀 Initializing Ultimate 3D Portfolio...');
            this.checkMobileDevice(); // Check for mobile device first
            this.setupCanvas();
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.setupRaycaster();
            this.setupLights();
            this.createParticleSystem();
            this.createWorld();
            this.createPortfolioSections();
            this.displayProjectsOverview(); // Display project overview for debugging
            this.setupEventListeners();
            this.enhanceNavigation();
            this.setupAudio();
            this.animate();
            
            // Hide loading screen after initialization
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Error initializing Ultimate 3D Portfolio:', error);
            this.hideLoadingScreen();
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        
        // Dynamic background with gradient
        const gradientTexture = this.createGradientTexture();
        this.scene.background = gradientTexture;
        
        // Add atmospheric fog
        this.scene.fog = new THREE.Fog(0x0a0a0a, 30, 200);
    }

    createGradientTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        return new THREE.CanvasTexture(canvas);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 15, 30);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false, // Better performance
            logarithmicDepthBuffer: false // Better performance for this scene
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Enhanced performance settings
        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaFactor = 2.2;
        
        const container = document.getElementById('canvas-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        
        // Enhanced smoothness settings
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06; // Further optimized for ultra-smooth movement
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 12;
        this.controls.maxDistance = 100;
        this.controls.maxPolarAngle = Math.PI * 0.75; // Prevent camera from going too low
        this.controls.minPolarAngle = Math.PI * 0.1;  // Prevent camera from going too high
        
        // Smooth auto-rotation
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.15; // Even slower for ultra-smooth experience
        this.controls.enableKeys = false;
        
        // Enhanced responsiveness
        this.controls.zoomSpeed = 0.6;
        this.controls.panSpeed = 0.5;
        this.controls.rotateSpeed = 0.4;
        
        // Enable smooth zoom to cursor
        this.controls.enableZoom = true;
        this.controls.zoomToCursor = true;
        
        // Enable smooth transitions
        this.controls.enableSmooth = true;
        this.controls.smoothTime = 2.5; // Longer for ultra-smooth transitions
        this.controls.target.set(0, 8, 0);
        this.controls.update();
    }

    setupRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    checkMobileDevice() {
        // Enhanced mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)) ||
                         window.innerWidth <= 768;
        
        if (isMobile && this.shouldShowMobileWarning()) {
            setTimeout(() => {
                this.showMobileWarning();
            }, 500); // Show after a brief delay
        }
        
        console.log('📱 Mobile device detected:', isMobile);
    }

    showMobileWarning() {
        const warning = document.getElementById('mobile-warning');
        if (warning) {
            warning.classList.add('show');
            console.log('⚠️ Mobile warning displayed');
        }
    }

    shouldShowMobileWarning() {
        return !sessionStorage.getItem('mobile-warning-dismissed');
    }

    setupLights() {
        // Enhanced lighting system
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Main directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(30, 30, 20);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Dynamic colored lights
        const colorLights = [
            { color: 0x00d4ff, pos: [20, 15, 20], intensity: 1.5 },
            { color: 0xff6b6b, pos: [-20, 15, -20], intensity: 1.2 },
            { color: 0x4ecdc4, pos: [0, 25, 0], intensity: 1.0 },
            { color: 0xffd700, pos: [15, 10, -15], intensity: 1.3 },
            { color: 0xff9500, pos: [-15, 10, 15], intensity: 1.1 }
        ];

        colorLights.forEach(light => {
            const pointLight = new THREE.PointLight(light.color, light.intensity, 100);
            pointLight.position.set(...light.pos);
            pointLight.castShadow = true;
            this.scene.add(pointLight);
        });

        // Spotlight for dramatic effect
        const spotLight = new THREE.SpotLight(0xffffff, 2);
        spotLight.position.set(0, 50, 0);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.1;
        spotLight.decay = 2;
        spotLight.distance = 100;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    createParticleSystem() {
        // Advanced particle system
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in a large sphere
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;
            
            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
            
            // Random colors
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Random sizes
            sizes[i] = Math.random() * 3 + 1;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    float alpha = 1.0 - r * 2.0;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
        
        // Store for animation
        this.particleVelocities = velocities;
    }

    createWorld() {
        this.createEnhancedGround();
        this.createSkybox();
        this.createFloatingIslands();
    }

    createEnhancedGround() {
        // Create a more sophisticated ground with waves
        const groundGeometry = new THREE.PlaneGeometry(150, 150, 64, 64);
        const positions = groundGeometry.attributes.position;
        
        // Add wave effect to ground
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            const y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
            positions.setY(i, y);
        }
        
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createSkybox() {
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x0a0a0a,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }

    createFloatingIslands() {
        const islandPositions = [
            { x: 0, y: 8, z: 0 },    // Center - About
            { x: -30, y: 12, z: -15 }, // Skills
            { x: 30, y: 10, z: -15 },  // Projects
            { x: 0, y: 15, z: -40 },   // Journey
            { x: 0, y: 8, z: 35 }      // Contact
        ];

        islandPositions.forEach((pos, index) => {
            const islandGeometry = new THREE.CylinderGeometry(8, 12, 3, 8);
            const islandMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x2d3436,
                shininess: 50
            });
            const island = new THREE.Mesh(islandGeometry, islandMaterial);
            island.position.set(pos.x, pos.y, pos.z);
            island.castShadow = true;
            island.receiveShadow = true;
            this.scene.add(island);
        });
    }

    createPortfolioSections() {
        this.createAboutSection();
        this.createSkillsSection();
        this.createProjectsSection();
        this.createJourneySection();
        this.createContactSection();
    }    createAboutSection() {
        // Load and display enhanced user's photo with improved method
        const textureLoader = new THREE.TextureLoader();
        
        // First try: Simple direct texture loading
        textureLoader.load(
            'photos/abk.png',
            (texture) => {
                console.log('✅ Profile photo loaded successfully');
                
                // Simple circular photo without complex masking
                const photoGeometry = new THREE.CircleGeometry(2.5, 64);
                const photoMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    alphaTest: 0.1
                });
                
                const photo = new THREE.Mesh(photoGeometry, photoMaterial);
                photo.position.set(0, 18, 0);
                photo.castShadow = true;
                photo.receiveShadow = true;
                photo.userData = {
                    type: 'profile',
                    title: 'Mohammed Saqhib',
                    description: 'Hi, I\'m Saqhib – Let\'s Explore Data Together! Aspiring Data Professional based in Bengaluru with expertise in Data Engineering, Analytics, Machine Learning, and Data Science.',
                    originalY: 18,
                    floatSpeed: 0.008,
                    rotationSpeed: 0.003
                };
                
                // Add enhanced glow effect
                const glowGroup = new THREE.Group();
                
                // Inner glow ring
                const innerGlowGeometry = new THREE.RingGeometry(2.6, 3.2, 32);
                const innerGlowMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00d4ff,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide
                });
                const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
                
                // Outer glow ring
                const outerGlowGeometry = new THREE.RingGeometry(3.3, 4.0, 32);
                const outerGlowMaterial = new THREE.MeshBasicMaterial({
                    color: 0x4ecdc4,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
                
                glowGroup.add(innerGlow);
                glowGroup.add(outerGlow);
                glowGroup.position.copy(photo.position);
                glowGroup.userData = {
                    type: 'profile-glow',
                    rotationSpeed: -0.001
                };
                
                // Add floating particles around profile
                this.createProfileParticles(photo.position);
                
                this.scene.add(photo);
                this.scene.add(glowGroup);
                this.objects.push(photo);
                this.objects.push(glowGroup);
                
                // Smooth entrance animation
                photo.scale.set(0, 0, 0);
                gsap.to(photo.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)",
                    delay: 0.5
                });
                
                glowGroup.scale.set(0, 0, 0);
                gsap.to(glowGroup.scale, {
                    x: 1, y: 1, z: 1,
                    duration: 2,
                    ease: "power2.out",
                    delay: 0.8
                });
            },
            (progress) => {
                console.log('📸 Loading profile photo:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.warn('⚠️ Could not load profile photo:', error);
                console.log('🔄 Trying fallback avatar...');
                this.createFallbackAvatar();
            }
        );

        // Main avatar representation (positioned lower)
        const avatarGeometry = new THREE.SphereGeometry(2, 32, 32);
        const avatarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
        avatar.position.set(0, 10, 0);
        avatar.castShadow = true;
        avatar.userData = { 
            type: 'about',
            title: 'Mohammed Saqhib',
            description: 'Hi, I\'m Saqhib – Let\'s Explore Data Together! Aspiring Data Professional based in Bengaluru with expertise in Data Engineering, Analytics, Machine Learning, and Data Science. Currently pursuing internships and building real-world projects to transform complex datasets into actionable insights.'
        };
        this.scene.add(avatar);
        this.objects.push(avatar);

        // Orbiting info spheres (adjusted for lower avatar position)
        const infoSpheres = [
            { text: 'Data Analysis', angle: 0, color: 0xff6b6b },
            { text: 'Data Visualization', angle: Math.PI / 2, color: 0x4ecdc4 },
            { text: 'Data Engineering', angle: Math.PI, color: 0xffd700 },
            { text: 'Machine Learning', angle: 3 * Math.PI / 2, color: 0xff9500 }
        ];

        infoSpheres.forEach((info, index) => {
            const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const sphereMaterial = new THREE.MeshPhongMaterial({ 
                color: info.color,
                shininess: 100
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            const radius = 5;
            sphere.position.set(
                Math.cos(info.angle) * radius,
                10, // Adjusted to match lower avatar position
                Math.sin(info.angle) * radius
            );
            sphere.castShadow = true;
            sphere.userData = { 
                type: 'info',
                title: info.text,
                description: `Expertise in ${info.text}`,
                orbitAngle: info.angle,
                orbitRadius: radius,
                orbitSpeed: 0.01
            };
            this.scene.add(sphere);
            this.objects.push(sphere);
        });
    }

    createFallbackAvatar() {
        console.log('🔄 Creating fallback avatar...');
        
        // Try the secondary photo method first
        this.createVisibleProfilePhoto();
        
        // Enhanced fallback avatar if photo doesn't load
        const fallbackGeometry = new THREE.SphereGeometry(2.5, 64, 64);
        const fallbackMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
            emissive: 0x002266,
            emissiveIntensity: 0.2
        });
        const fallback = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
        fallback.position.set(0, 14, 0); // Position below the photo
        fallback.castShadow = true;
        fallback.receiveShadow = true;
        fallback.userData = {
            type: 'profile-fallback',
            title: 'Mohammed Saqhib',
            description: 'Data Science Enthusiast & Tech Explorer',
            originalY: 14,
            floatSpeed: 0.008,
            rotationSpeed: 0.005
        };
        
        // Add wireframe overlay
        const wireGeometry = new THREE.SphereGeometry(2.6, 16, 16);
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x4ecdc4,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
        wireframe.position.copy(fallback.position);
        wireframe.userData = {
            type: 'profile-wireframe',
            rotationSpeed: -0.01
        };
        
        this.scene.add(fallback);
        this.scene.add(wireframe);
        this.objects.push(fallback);
        this.objects.push(wireframe);
        
        // Smooth entrance animation
        fallback.scale.set(0, 0, 0);
        gsap.to(fallback.scale, {
            x: 1, y: 1, z: 1,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
        });
        
        // Add floating particles around fallback avatar
        this.createProfileParticles(fallback.position);
        
        console.log('✅ Fallback avatar created');
    }

    createProfileParticles(centerPosition) {
        // Create floating particles around the profile
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.TetrahedronGeometry(0.1, 0);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.5 + i * 0.1, 0.7, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 6 + Math.random() * 2;
            
            particle.position.set(
                centerPosition.x + Math.cos(angle) * radius,
                centerPosition.y + (Math.random() - 0.5) * 4,
                centerPosition.z + Math.sin(angle) * radius
            );
            
            particle.userData = {
                type: 'profile-particle',
                orbitAngle: angle,
                orbitRadius: radius,
                orbitSpeed: 0.005 + Math.random() * 0.005,
                orbitCenter: centerPosition.clone(),
                verticalOffset: (Math.random() - 0.5) * 2,
                verticalSpeed: 0.01 + Math.random() * 0.01
            };
            
            this.scene.add(particle);
            this.objects.push(particle);
        }
    }

    createSkillsSection() {
        const skills = [
            { name: 'SQL', level: 1.0, color: 0x336791, pos: [-35, 15, -15] },
            { name: 'Python', level: 0.88, color: 0x3776ab, pos: [-30, 15, -20] },
            { name: 'Jupyter', level: 0.85, color: 0xf37626, pos: [-25, 15, -15] },
            { name: 'Machine Learning', level: 0.85, color: 0xff6b6b, pos: [-35, 15, -10] },
            { name: 'Deep Learning', level: 0.82, color: 0x4ecdc4, pos: [-30, 15, -10] },
            { name: 'Data Science', level: 0.88, color: 0x00d4ff, pos: [-25, 15, -20] },
            { name: 'Tableau', level: 0.85, color: 0xe97627, pos: [-35, 15, -5] },
            { name: 'Power BI', level: 0.9, color: 0xf2c811, pos: [-30, 15, -5] },
            { name: 'Azure', level: 0.82, color: 0x0078d4, pos: [-25, 15, -10] },
            { name: 'Excel', level: 0.88, color: 0x217346, pos: [-35, 18, -15] },
            { name: 'AWS', level: 0.8, color: 0xff9900, pos: [-30, 18, -15] }
        ];

        skills.forEach((skill, index) => {
            // Create skill representation as a tower
            const height = skill.level * 6;
            const geometry = new THREE.CylinderGeometry(0.8, 1.2, height, 8);
            const material = new THREE.MeshPhongMaterial({ 
                color: skill.color,
                shininess: 100
            });
            const tower = new THREE.Mesh(geometry, material);
            tower.position.set(skill.pos[0], skill.pos[1] + height/2, skill.pos[2]);
            tower.castShadow = true;
            tower.userData = { 
                type: 'skill',
                title: skill.name,
                description: `Proficiency: ${(skill.level * 100).toFixed(0)}% - ${this.getSkillDescription(skill.name)}`,
                level: skill.level
            };
            this.scene.add(tower);
            this.objects.push(tower);

            // Add floating skill particles
            for (let i = 0; i < 10; i++) {
                const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const particleMaterial = new THREE.MeshBasicMaterial({ 
                    color: skill.color,
                    transparent: true,
                    opacity: 0.6
                });
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.position.set(
                    skill.pos[0] + (Math.random() - 0.5) * 4,
                    skill.pos[1] + Math.random() * height,
                    skill.pos[2] + (Math.random() - 0.5) * 4
                );
                particle.userData = { 
                    type: 'skill-particle',
                    skillIndex: index,
                    floatSpeed: Math.random() * 0.02 + 0.01
                };
                this.scene.add(particle);
                this.objects.push(particle);
            }
        });
    }

    getSkillDescription(skillName) {
        const descriptions = {
            'SQL': 'Database querying, joins, optimization',
            'Python': 'Data manipulation, analysis, automation',
            'Jupyter': 'Interactive computing, data exploration',
            'Machine Learning': 'Regression, classification, clustering',
            'Deep Learning': 'Neural networks, image processing',
            'Data Science': 'Statistical analysis, hypothesis testing',
            'Tableau': 'Interactive dashboards, data storytelling',
            'Power BI': 'Business intelligence, DAX, reporting',
            'Azure': 'Cloud computing, data solutions, AI services',
            'Excel': 'Advanced formulas, pivot tables, data models',
            'AWS': 'Cloud infrastructure, S3, Lambda, EC2'
        };
        return descriptions[skillName] || 'Expert level proficiency';
    }

    createProjectsSection() {
        const projects = [
            {
                name: 'BookStoreApp',
                description: 'Full-stack bookstore application with user authentication, inventory management, and payment processing. Features include customer registration, book catalog management, shopping cart functionality, and secure payment integration.',
                tech: ['Python', 'CSS3', 'Bootstrap', 'JavaScript', 'Git'],
                color: 0x06d6a0,
                pos: [40, 12, -20],
                github: 'https://github.com/Mohammed-Saqhib/Mohammed-Saqhib-BCA-V-Sem-FSD-PROJECT',
                demo: null,
                category: 'Web Development'
            },
            {
                name: 'Automatically-fill-a-Google-form',
                description: 'Automated Google Form filling system with intelligent data processing and validation capabilities. This tool streamlines form submission processes using automation techniques and data validation algorithms.',
                tech: ['Python', 'Selenium', 'Data Processing', 'Automation'],
                color: 0x7209b7,
                pos: [20, 12, -10],
                github: 'https://github.com/Mohammed-Saqhib/Automatically-fill-a-Google-form',
                demo: null,
                category: 'Data Science'
            },
            {
                name: "100 Day's of Python Coding",
                description: 'Comprehensive Python learning journey with 100 practical projects covering all aspects of Python programming. Includes data structures, algorithms, web development, automation, and GUI applications.',
                tech: ['Python', 'Data Structures', 'Algorithms', 'Automation'],
                color: 0xf72585,
                pos: [45, 12, -5],
                github: 'https://github.com/Mohammed-Saqhib/100-days-of-python',
                demo: null,
                category: 'Programming'
            },
            {
                name: 'Portfolio Website',
                description: 'Personal portfolio website showcasing projects, skills, and professional experience. Features responsive design, 3D interactive elements, and modern web technologies.',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'Three.js'],
                color: 0x4facfe,
                pos: [15, 12, -25],
                github: 'https://github.com/Mohammed-Saqhib/Portfolio',
                demo: 'https://mohammed-saqhib.github.io/Portfolio/',
                category: 'Web Development'
            },
            {
                name: 'Advanced Stock Prediction Dashboard',
                description: 'Advanced ML model using ensemble methods for stock market prediction with real-time data visualization and technical indicators. Features include time series analysis, volatility prediction, and interactive charts.',
                tech: ['Python', 'Machine Learning', 'Pandas', 'Plotly'],
                color: 0x667eea,
                pos: [35, 15, -30],
                github: 'https://github.com/Mohammed-Saqhib/Advanced-Stock-Prediction-Analysis-Dashboard',
                demo: null,
                category: 'Machine Learning'
            },
            {
                name: 'Carpooling Simulation System',
                description: 'Smart carpooling simulation system with route optimization and user matching algorithms. Implements geographic algorithms for efficient ride sharing and cost optimization.',
                tech: ['Python', 'Simulation', 'Algorithms', 'Optimization'],
                color: 0x4ecdc4,
                pos: [25, 15, -5],
                github: 'https://github.com/Mohammed-Saqhib/Carpooling-Simulation',
                demo: null,
                category: 'Data Science'
            },
            {
                name: 'Kritya Fashion Demo',
                description: 'Modern e-commerce platform for fashion retail with responsive design and user-friendly interface. Features product catalog, shopping cart, user authentication, and payment integration.',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'React'],
                color: 0xffd700,
                pos: [50, 15, -15],
                github: 'https://github.com/Mohammed-Saqhib/kritya-fashion-demo-1',
                demo: null,
                category: 'Web Development'
            },
            {
                name: 'Kritya Fashion',
                description: 'Fashion e-commerce platform with modern design and enhanced user experience. Includes advanced search functionality, wishlist features, and mobile-optimized interface.',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js'],
                color: 0xffa500,
                pos: [10, 15, -15],
                github: 'https://github.com/Mohammed-Saqhib/kritya-fashion-demo',
                demo: null,
                category: 'Web Development'
            },
            {
                name: 'Netflix Household Verify',
                description: 'Advanced analytics system for Netflix household verification and viewing pattern analysis using machine learning. Implements user behavior analysis and verification algorithms.',
                tech: ['Python', 'JavaScript', 'Machine Learning', 'Analytics'],
                color: 0x38f9d7,
                pos: [30, 18, -35],
                github: 'https://github.com/Mohammed-Saqhib/Netflix-Household-Verify',
                demo: null,
                category: 'Web Development'
            },
            {
                name: 'TTS Phoneme Model',
                description: 'Text-to-Speech system with advanced phoneme modeling for natural language processing and speech synthesis. Features deep learning models for voice generation and audio processing.',
                tech: ['Python', 'Deep Learning', 'NLP', 'Audio Processing'],
                color: 0xff6b6b,
                pos: [45, 18, -25],
                github: 'https://github.com/Mohammed-Saqhib/TTS-phoneme-model',
                demo: null,
                category: 'AI & NLP'
            },
            {
                name: 'Facial Recognition Attendance System',
                description: 'AI-powered attendance management system using computer vision and facial recognition with 99.5% accuracy. Features real-time face detection, recognition, and attendance tracking.',
                tech: ['Python', 'OpenCV', 'Deep Learning', 'Computer Vision'],
                color: 0xf093fb,
                pos: [15, 18, -5],
                github: 'https://github.com/Mohammed-Saqhib/Facial-Recognition-Attendance-Management-System',
                demo: null,
                category: 'AI & NLP'
            },
            {
                name: 'Fraud Detection System',
                description: 'Real-time fraud detection system using deep learning and anomaly detection with 99.2% accuracy. Implements advanced machine learning algorithms for financial security.',
                tech: ['Python', 'Machine Learning', 'Anomaly Detection', 'Security'],
                color: 0x764ba2,
                pos: [55, 18, -10],
                github: 'https://github.com/Mohammed-Saqhib/fraud-detection-system',
                demo: null,
                category: 'Machine Learning'
            },
            {
                name: 'Aeginix',
                description: 'Comprehensive software solution with modern architecture and advanced functionality for enterprise applications. Features scalable design and robust backend systems.',
                tech: ['Python', 'JavaScript', 'Web Development', 'Backend'],
                color: 0x8b5cf6,
                pos: [20, 21, -30],
                github: 'https://github.com/Mohammed-Saqhib/Aeginix',
                demo: null,
                category: 'Web Development'
            },
            {
                name: 'AI CSV Dashboard Generator',
                description: 'Intelligent dashboard generator that creates interactive visualizations from CSV data using AI algorithms. Features automated chart generation, data insights, and custom dashboard creation.',
                tech: ['Python', 'AI', 'Data Visualization', 'Streamlit'],
                color: 0x43e97b,
                pos: [40, 21, -5],
                github: 'https://github.com/Mohammed-Saqhib/Mohammed-Saqhib-AI-CSV-Dashboard-Generator',
                demo: null,
                category: 'AI & NLP'
            },
            {
                name: 'Indian Contact Scraper',
                description: 'Web scraping tool for extracting and organizing Indian contact information with data validation and export features. Implements efficient scraping algorithms and data processing.',
                tech: ['Python', 'Web Scraping', 'Data Processing', 'BeautifulSoup'],
                color: 0x00d4ff,
                pos: [10, 21, -20],
                github: 'https://github.com/Mohammed-Saqhib/Indian-Contact-Scraper',
                demo: null,
                category: 'Data Science'
            },
            {
                name: 'Hill Climb Gesture Controller',
                description: 'Computer vision-based gesture controller for Hill Climb Racing game using hand tracking and motion detection. Features real-time gesture recognition and game control.',
                tech: ['Python', 'Computer Vision', 'OpenCV', 'Game Control'],
                color: 0xff9500,
                pos: [50, 21, -25],
                github: 'https://github.com/Mohammed-Saqhib/Hill-Climb-Gesture-Controller',
                demo: null,
                category: 'AI & NLP'
            },
            {
                name: 'Formula1 DataHub',
                description: 'Interactive F1 data visualization platform with race analytics, driver statistics, and predictive race outcomes. Features comprehensive F1 data analysis and interactive dashboards.',
                tech: ['Python', 'Data Analysis', 'Visualization', 'Sports Analytics'],
                color: 0xff4757,
                pos: [25, 24, -15],
                github: 'https://github.com/Mohammed-Saqhib/Formula1-DataHub',
                demo: null,
                category: 'Data Science'
            }
        ];

        projects.forEach((project, index) => {
            // Create project representation as a complex structure
            const group = new THREE.Group();
            
            // Main project body
            const mainGeometry = new THREE.BoxGeometry(4, 3, 2);
            const mainMaterial = new THREE.MeshPhongMaterial({ 
                color: project.color,
                shininess: 100
            });
            const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
            mainMesh.castShadow = true;
            group.add(mainMesh);
            
            // Add tech stack indicators as floating spheres
            project.tech.forEach((tech, techIndex) => {
                const techGeometry = new THREE.SphereGeometry(0.3, 8, 8);
                const techMaterial = new THREE.MeshPhongMaterial({ 
                    color: new THREE.Color().setHSL(techIndex * 0.2, 0.8, 0.6),
                    shininess: 100
                });
                const techMesh = new THREE.Mesh(techGeometry, techMaterial);
                techMesh.position.set(
                    (techIndex - 2) * 0.8,
                    2 + Math.sin(techIndex) * 0.5,
                    Math.cos(techIndex) * 0.5
                );
                techMesh.castShadow = true;
                techMesh.userData = { 
                    type: 'tech-indicator',
                    techName: tech,
                    floatSpeed: 0.01 + techIndex * 0.005
                };
                group.add(techMesh);
            });
            
            // Add project info pillar
            const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
            const pillarMaterial = new THREE.MeshPhongMaterial({ 
                color: project.color,
                shininess: 100,
                transparent: true,
                opacity: 0.7
            });
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(0, -4.5, 0);
            pillar.castShadow = true;
            group.add(pillar);
            
            group.position.set(...project.pos);
            group.userData = { 
                type: 'project',
                title: project.name,
                name: project.name, // Add name as fallback
                description: project.description,
                tech: project.tech,
                github: project.github,
                demo: project.demo,
                category: project.category,
                originalPosition: [...project.pos]
            };
            
            this.scene.add(group);
            this.objects.push(group);
            this.projectObjects.push(group);
        });
        
        // Add project count display
        console.log(`🎯 Created ${projects.length} interactive projects in 3D space`);
        console.log('📋 Project names:', projects.map(p => p.name));
        console.log('🔗 Project GitHub links:', projects.map(p => `${p.name}: ${p.github}`));
        console.log('📝 Project descriptions:', projects.map(p => `${p.name}: ${p.description.substring(0, 50)}...`));
        console.log('🛠️ Project technologies:', projects.map(p => `${p.name}: [${p.tech.join(', ')}]`));
        this.createProjectCounter(projects.length);
        
        // Debug: Verify project objects have proper userData
        console.log('🔍 Verifying project objects userData:');
        this.projectObjects.forEach((proj, index) => {
            const data = proj.userData || {};
            console.log(`${index + 1}. "${data.title}" - Type: ${data.type} - Has description: ${!!data.description}`);
        });
    }

    createProjectCounter(count) {
        // Create a floating text display for project count
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#00d4ff';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillText(`${count} Projects`, canvas.width / 2, canvas.height / 2 - 20);
        
        context.fillStyle = '#ffffff';
        context.font = '24px Arial';
        context.fillText('Navigate to explore all', canvas.width / 2, canvas.height / 2 + 20);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            alphaTest: 0.1
        });
        
        const geometry = new THREE.PlaneGeometry(8, 4);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(30, 25, -15);
        mesh.userData = { 
            type: 'project-counter',
            title: 'Project Counter',
            description: `Total of ${count} interactive projects available in this 3D portfolio. Use mouse/touch to navigate around the projects section to find all of them!`,
            floatSpeed: 0.01,
            originalY: 25
        };
        
        this.scene.add(mesh);
        this.objects.push(mesh);
    }

    createJourneySection() {
        const journeyPoints = [
            { 
                year: '2024', 
                event: 'Data Science and AI Intern – Ioncure Tech',
                description: 'Role: Data Science Intern (Jun - Aug 2024), Location: Bengaluru, India',
                pos: [-5, 18, -40],
                color: 0xffd700
            },
            { 
                year: '2024', 
                event: 'Data Mapping Intern – Singularium Technologies',
                description: 'Role: Data Engineering Intern (Oct - Nov 2024), Location: Bengaluru, India',
                pos: [0, 18, -40],
                color: 0x00d4ff
            },
            { 
                year: '2024', 
                event: 'Associate Intern – COSMIC365.AI',
                description: 'Role: Data Analysis Intern (Nov - Dec 2024), Location: Bengaluru, India',
                pos: [5, 18, -40],
                color: 0x4ecdc4
            },
            { 
                year: '2025', 
                event: 'Machine Learning Intern – Quantiota',
                description: 'Role: ML Engineer Intern (Jan 2025 - Mar 2025), Location: Bengaluru, India',
                pos: [-5, 20, -35],
                color: 0xff6b6b
            },
            { 
                year: '2025', 
                event: 'Current: Aspiring Data Professional',
                description: 'Continuing journey in Data Science and Analytics, based in Bengaluru',
                pos: [5, 20, -35],
                color: 0xff9500
            }
        ];

        // Create journey path
        const pathPoints = journeyPoints.map(point => new THREE.Vector3(...point.pos));
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const pathMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00d4ff,
            linewidth: 3
        });
        const path = new THREE.Line(pathGeometry, pathMaterial);
        this.scene.add(path);

        journeyPoints.forEach((point, index) => {
            const geometry = new THREE.ConeGeometry(1, 3, 8);
            const material = new THREE.MeshPhongMaterial({ 
                color: point.color,
                shininess: 100
            });
            const cone = new THREE.Mesh(geometry, material);
            cone.position.set(...point.pos);
            cone.castShadow = true;
            cone.userData = { 
                type: 'journey',
                title: `${point.year} - ${point.event}`,
                description: point.description,
                year: point.year
            };
            this.scene.add(cone);
            this.objects.push(cone);

            // Add floating year text representation
            const textGeometry = new THREE.RingGeometry(0.5, 1, 8);
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: point.color,
                transparent: true,
                opacity: 0.7
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(point.pos[0], point.pos[1] + 4, point.pos[2]);
            textMesh.userData = { 
                type: 'journey-text',
                parentIndex: index,
                rotationSpeed: 0.02
            };
            this.scene.add(textMesh);
            this.objects.push(textMesh);
        });
    }

    createContactSection() {
        const contactCenter = new THREE.Vector3(0, 12, 35);
        
        // Main contact hub
        const hubGeometry = new THREE.OctahedronGeometry(3);
        const hubMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.position.copy(contactCenter);
        hub.castShadow = true;
        hub.userData = { 
            type: 'contact',
            title: 'Contact Me',
            description: 'Let\'s connect and create something amazing together! Based in Bengaluru, Karnataka, India. Email: msaqhib76@gmail.com, Phone: +91 6239121164'
        };
        this.scene.add(hub);
        this.objects.push(hub);

        // Contact method satellites
        const contactMethods = [
            { name: 'Email', icon: '📧', color: 0x00d4ff, angle: 0, url: 'mailto:msaqhib76@gmail.com' },
            { name: 'LinkedIn', icon: '💼', color: 0x0077b5, angle: Math.PI / 2, url: 'http://www.linkedin.com/in/mohammed-saqhib-87b8b325a' },
            { name: 'GitHub', icon: '🐙', color: 0x333333, angle: Math.PI, url: 'https://github.com/Mohammed-Saqhib' }
        ];

        contactMethods.forEach((method, index) => {
            const satelliteGeometry = new THREE.SphereGeometry(1, 16, 16);
            const satelliteMaterial = new THREE.MeshPhongMaterial({ 
                color: method.color,
                shininess: 100
            });
            const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
            const radius = 8;
            satellite.position.set(
                contactCenter.x + Math.cos(method.angle) * radius,
                contactCenter.y,
                contactCenter.z + Math.sin(method.angle) * radius
            );
            satellite.castShadow = true;
            satellite.userData = { 
                type: 'contact-method',
                title: method.name,
                description: `Connect with me on ${method.name}`,
                url: method.url,
                orbitAngle: method.angle,
                orbitRadius: radius,
                orbitSpeed: 0.015,
                orbitCenter: contactCenter
            };
            this.scene.add(satellite);
            this.objects.push(satellite);
        });
    }

    setupAudio() {
        // Add ambient background music (optional)
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioAnalyser = this.audioContext.createAnalyser();
            this.audioAnalyser.fftSize = 256;
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.renderer.domElement.addEventListener('dblclick', (event) => this.onDoubleClick(event));
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Keyboard controls
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        
        // Touch events for mobile
        this.renderer.domElement.addEventListener('touchstart', (event) => this.onTouchStart(event));
        this.renderer.domElement.addEventListener('touchmove', (event) => this.onTouchMove(event));
    }

    onMouseClick(event) {
        event.preventDefault();
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const userData = object.userData || object.parent.userData;
            
            if (userData) {
                this.showInfoPanel(userData);
                this.animateClickedObject(intersects[0].object);
                
                // Show floating text above the clicked object
                const position = object.position || object.parent.position;
                this.showFloatingText(userData.title || userData.name || 'Object', position);
                
                // Special handling for different types
                if (userData.type === 'project') {
                    this.showProjectDetails(userData);
                    this.showFloatingText(`📂 ${userData.title}`, position);
                    console.log(`🎯 Project clicked: ${userData.title}`);
                } else if (userData.type === 'contact-method') {
                    console.log(`📞 Contact clicked: ${userData.title}`);
                    this.showFloatingText(`Ready to connect via ${userData.title}?`, position);
                    
                    // Show confirmation dialog before opening
                    this.showContactConfirmation(userData);
                } else if (userData.type === 'skill') {
                    console.log(`💡 Skill clicked: ${userData.title}`);
                } else if (userData.type === 'journey') {
                    console.log(`📅 Journey clicked: ${userData.title}`);
                }
            }
        }
    }

    onDoubleClick(event) {
        event.preventDefault();
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const userData = object.userData || object.parent.userData;
            
            if (userData && userData.type === 'project') {
                // Open project links on double click
                if (userData.github) {
                    window.open(userData.github, '_blank');
                }
            } else if (userData && userData.type === 'contact-method') {
                // Open contact links on double click
                if (userData.url) {
                    window.open(userData.url, '_blank');
                }
            }
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update particle system based on mouse position
        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value = performance.now() * 0.001;
        }
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'Digit1':
                this.focusOnSection('about');
                this.showNavigationFloatingText('About Me - Data Professional');
                break;
            case 'Digit2':
                this.focusOnSection('skills');
                this.showNavigationFloatingText('Technical Skills & Expertise');
                break;
            case 'Digit3':
                this.focusOnSection('projects');
                this.showNavigationFloatingText('17 Interactive Projects');
                break;
            case 'Digit4':
                this.focusOnSection('journey');
                this.showNavigationFloatingText('Professional Journey');
                break;
            case 'Digit5':
                this.focusOnSection('contact');
                this.showNavigationFloatingText('Contact Information');
                break;
            case 'Space':
                event.preventDefault();
                this.controls.autoRotate = !this.controls.autoRotate;
                this.showFloatingText(
                    this.controls.autoRotate ? 'Auto-rotation ON' : 'Auto-rotation OFF',
                    this.camera.position
                );
                break;
            case 'KeyH':
                // Help
                this.showNavigationFloatingText('Controls: 1-5 for sections, Space for auto-rotate, H for help, D for debug');
                break;
            case 'KeyD':
                // Debug
                this.debugObjects();
                this.showFloatingText('Debug info in console', this.camera.position);
                break;
            case 'KeyW':
            case 'KeyA':
            case 'KeyS':
            case 'KeyD':
                // WASD movement
                this.handleWASDMovement(event.code);
                break;
        }
    }
    
    handleWASDMovement(keyCode) {
        const moveSpeed = 2;
        const direction = new THREE.Vector3();
        
        switch (keyCode) {
            case 'KeyW':
                this.camera.getWorldDirection(direction);
                this.camera.position.add(direction.multiplyScalar(moveSpeed));
                break;
            case 'KeyS':
                this.camera.getWorldDirection(direction);
                this.camera.position.add(direction.multiplyScalar(-moveSpeed));
                break;
            case 'KeyA':
                direction.set(-moveSpeed, 0, 0);
                direction.applyQuaternion(this.camera.quaternion);
                this.camera.position.add(direction);
                break;
            case 'KeyD':
                direction.set(moveSpeed, 0, 0);
                direction.applyQuaternion(this.camera.quaternion);
                this.camera.position.add(direction);
                break;
        }
    }
    
    debugObjects() {
        console.log('🔍 Debug: Interactive Objects in Scene');
        console.log(`Total objects: ${this.objects.length}`);
        console.log(`Project objects: ${this.projectObjects.length}`);
        
        this.objects.forEach((obj, index) => {
            const userData = obj.userData || {};
            console.log(`${index + 1}. ${userData.type || 'unknown'}: ${userData.title || userData.name || 'unnamed'}`);
        });
        
        console.log('📊 Projects Details:');
        this.projectObjects.forEach((proj, index) => {
            const data = proj.userData || {};
            console.log(`${index + 1}. "${data.title}" - ${data.description?.substring(0, 50)}...`);
        });
    }

    animateClickedObject(object) {
        // Enhanced click animation
        const originalScale = object.scale.clone();
        
        gsap.timeline()
            .to(object.scale, {
                x: originalScale.x * 1.3,
                y: originalScale.y * 1.3,
                z: originalScale.z * 1.3,
                duration: 0.15,
                ease: "power2.out"
            })
            .to(object.scale, {
                x: originalScale.x,
                y: originalScale.y,
                z: originalScale.z,
                duration: 0.15,
                ease: "power2.in"
            });
        
        // Add rotation animation
        gsap.to(object.rotation, {
            y: object.rotation.y + Math.PI * 2,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }

    showInfoPanel(data) {
        const panel = document.getElementById('info-panel');
        
        if (!panel || !data) {
            console.warn('⚠️ Info panel element not found or no data provided');
            return;
        }
        
        // Enhanced data handling with better fallbacks
        const title = data.title || data.name || 'Interactive Element';
        let description = data.description;
        const type = data.type || 'Unknown';
        const tech = data.tech || [];
        
        // Provide better fallbacks based on the type
        if (!description) {
            switch (type) {
                case 'project':
                    description = `This is one of my featured projects showcasing modern development techniques. Click to view detailed information and explore the source code.`;
                    break;
                case 'skill':
                    description = `A key technology in my toolkit. Click to learn more about my experience with ${title}.`;
                    break;
                case 'contact-method':
                    description = `Connect with me via ${title}. Click to initiate contact.`;
                    break;
                case 'journey':
                    description = `A milestone in my professional journey. Click to learn more about this experience.`;
                    break;
                default:
                    description = `Interactive element in my 3D portfolio. Click to explore more details.`;
            }
        }
        
        console.log('📋 Showing info panel:', { title, description, type, tech });
        
        // Enhanced panel content with better styling
        panel.innerHTML = `
            <h3 style="color: #00d4ff; margin-bottom: 0.8rem; font-size: 1.3rem;">${title}</h3>
            <p style="line-height: 1.6; margin-bottom: 1rem;">${description}</p>
            <div class="skills">
                <span class="skill-tag" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; margin-right: 0.5rem; font-size: 0.8rem;">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                ${tech.length > 0 ? tech.map(techItem => `<span class="skill-tag" style="background: rgba(0, 212, 255, 0.2); color: #00d4ff; padding: 0.3rem 0.8rem; border-radius: 15px; margin: 0.2rem; display: inline-block; font-size: 0.8rem;">${techItem}</span>`).join('') : ''}
                ${data.url ? `<span class="skill-tag" style="background: rgba(67, 233, 123, 0.2); color: #43e97b; padding: 0.3rem 0.8rem; border-radius: 15px; margin-left: 0.5rem; font-size: 0.8rem;">🔗 Interactive</span>` : ''}
                ${data.github ? `<span class="skill-tag" style="background: rgba(255, 107, 107, 0.2); color: #ff6b6b; padding: 0.3rem 0.8rem; border-radius: 15px; margin-left: 0.5rem; font-size: 0.8rem;">🐙 GitHub</span>` : ''}
            </div>
            <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px; font-size: 0.9rem; opacity: 0.8;">
                💡 Tip: ${type === 'project' ? 'Click for detailed view, double-click GitHub links to open repositories' : 'Explore this interactive element to learn more'}
            </div>
        `;
        panel.classList.add('active');
        
        // Auto-hide after 8 seconds (increased for better readability)
        setTimeout(() => {
            panel.classList.remove('active');
        }, 8000);
    }

    showProjectDetails(data) {
        const card = document.getElementById('project-card');
        
        if (!card || !data) {
            console.error('❌ Project card element not found or no data provided');
            return;
        }
        
        // Ensure all required data is available with comprehensive fallbacks
        const title = data.title || data.name || 'Project';
        const description = data.description || 'This is an innovative project showcasing advanced development techniques and modern technologies.';
        const tech = data.tech || ['JavaScript', 'HTML5', 'CSS3'];
        const github = data.github || '#';
        const demo = data.demo || null;
        const category = data.category || 'Development';
        
        console.log('📋 Showing project details:', { title, description, tech, github, category });
        
        card.innerHTML = `
            <div class="project-card-content" id="project-content">
                <button class="close-btn" onclick="closeProjectCard()">×</button>
                <h3>${title}</h3>
                <div class="project-category">
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 500;">${category}</span>
                </div>
                <p style="margin-top: 1rem; line-height: 1.6;">${description}</p>
                <div class="project-tech">
                    <h4>🛠️ Technologies Used:</h4>
                    <div class="tech-tags">
                        ${tech.map(techItem => `<span class="skill-tag" style="background: rgba(0, 212, 255, 0.2); color: #00d4ff; padding: 0.3rem 0.8rem; border-radius: 15px; margin: 0.2rem; display: inline-block; font-size: 0.9rem;">${techItem}</span>`).join('')}
                    </div>
                </div>
                <div class="project-links" style="margin-top: 1.5rem;">
                    <a href="${github}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.8rem 1.5rem; border-radius: 10px; text-decoration: none; margin-right: 1rem; display: inline-block; transition: transform 0.3s ease;">🐙 GitHub Repository</a>
                    ${demo ? `<a href="${demo}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; padding: 0.8rem 1.5rem; border-radius: 10px; text-decoration: none; display: inline-block; transition: transform 0.3s ease;">🌐 Live Demo</a>` : ''}
                </div>
                <div class="project-note" style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                    <p><strong>💡 About this project:</strong> This is one of my 17 featured projects showcasing expertise in ${tech.slice(0, 3).join(', ')}. Each project demonstrates practical application of modern development practices and cutting-edge technologies.</p>
                </div>
                <div class="project-stats" style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: space-between;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.2rem; color: #00d4ff;">⭐</div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">Featured</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.2rem; color: #43e97b;">${tech.length}</div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">Technologies</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.2rem; color: #f093fb;">2024</div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">Latest</div>
                    </div>
                </div>
                <div class="view-all-projects" style="margin-top: 1.5rem; text-align: center;">
                    <a href="https://github.com/Mohammed-Saqhib?tab=repositories" target="_blank" rel="noopener noreferrer" class="btn-view-all" style="background: linear-gradient(135deg, #ff6b6b, #ffa500); color: white; padding: 0.8rem 2rem; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 500; transition: transform 0.3s ease;">🚀 View All Projects →</a>
                </div>
            </div>
        `;
        card.classList.add('active');
        
        // Add enhanced interaction effects
        const links = card.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px) scale(1.05)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    focusOnSection(section) {
        this.currentSection = section;
        
        let targetPosition = { x: 0, y: 15, z: 30 };
        let targetLookAt = { x: 0, y: 0, z: 0 };
        
        switch (section) {
            case 'about':
                targetPosition = { x: 0, y: 20, z: 35 };
                targetLookAt = { x: 0, y: 15, z: 0 };
                break;
            case 'skills':
                targetPosition = { x: -30, y: 20, z: 5 };
                targetLookAt = { x: -30, y: 12, z: -15 };
                break;
            case 'projects':
                targetPosition = { x: 30, y: 20, z: 5 };
                targetLookAt = { x: 30, y: 10, z: -15 };
                break;
            case 'journey':
                targetPosition = { x: 0, y: 25, z: -20 };
                targetLookAt = { x: 0, y: 18, z: -40 };
                break;
            case 'contact':
                targetPosition = { x: 0, y: 20, z: 55 };
                targetLookAt = { x: 0, y: 12, z: 35 };
                break;
        }
        
        // Enhanced smooth camera transition with easing
        const tl = gsap.timeline();
        
        // Camera position animation
        tl.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2.5,
            ease: "power3.inOut"
        });
        
        // Camera target animation (where it looks)
        tl.to(this.controls.target, {
            x: targetLookAt.x,
            y: targetLookAt.y,
            z: targetLookAt.z,
            duration: 2.5,
            ease: "power3.inOut",
            onUpdate: () => {
                this.controls.update();
            }
        }, 0);
        
        // Add subtle camera shake effect for impact
        tl.to(this.camera.position, {
            x: `+=${Math.random() * 0.5 - 0.25}`,
            y: `+=${Math.random() * 0.5 - 0.25}`,
            z: `+=${Math.random() * 0.5 - 0.25}`,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut"
        }, 0.2);
        
        // Update controls damping for smoother movement
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 0.8;
        this.controls.panSpeed = 0.8;
    }

    closeProjectCard() {
        const card = document.getElementById('project-card');
        if (card) {
            card.classList.remove('active');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    this.isLoading = false;
                    console.log('✨ Ultimate 3D Portfolio loaded successfully!');
                    
                    // Show welcome floating text sequence
                    setTimeout(() => {
                        this.createFloatingText('🎉 Welcome to my 3D Portfolio!', { x: 0, y: 15, z: 0 }, 4000);
                        setTimeout(() => {
                            this.createFloatingText('✨ Click on projects to explore details', { x: 0, y: 14, z: 0 }, 4000);
                        }, 2000);
                        setTimeout(() => {
                            this.createFloatingText('🚀 17 Interactive Projects Available', { x: 0, y: 13, z: 0 }, 4000);
                        }, 4000);
                    }, 1000);
                }
            });
        }
    }

    showFloatingText(text, position) {
        // Create and display floating text above objects
        this.createFloatingText(text, position, 2500);
    }
    
    // Enhanced floating text that appears above objects
    createFloatingText(text, position, duration = 3000) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create gradient background
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
        gradient.addColorStop(0.5, 'rgba(76, 205, 196, 0.8)');
        gradient.addColorStop(1, 'rgba(118, 75, 162, 0.9)');
        
        // Draw enhanced background with rounded corners
        context.fillStyle = gradient;
        this.roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, 25);
        context.fill();
        
        // Draw subtle border
        context.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        context.lineWidth = 3;
        this.roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, 25);
        context.stroke();
        
        // Add inner shadow effect
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';
        context.shadowBlur = 10;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        
        // Draw text with enhanced styling
        context.fillStyle = '#ffffff';
        context.font = 'bold 28px "Poppins", Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 4;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture and material
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        const geometry = new THREE.PlaneGeometry(8, 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.y += 6; // Float higher above the object
        mesh.userData = { 
            type: 'floating-text',
            createdAt: Date.now(),
            duration: duration
        };
        
        // Always face camera
        mesh.lookAt(this.camera.position);
        
        this.scene.add(mesh);
        
        // Enhanced entrance animation
        mesh.scale.set(0, 0, 0);
        mesh.material.opacity = 0;
        
        const tl = gsap.timeline();
        
        // Scale animation
        tl.to(mesh.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)"
        });
        
        // Opacity animation
        tl.to(mesh.material, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        }, 0);
        
        // Floating motion
        tl.to(mesh.position, {
            y: mesh.position.y + 1.5,
            duration: duration / 1000 * 0.8,
            ease: "power1.out"
        }, 0.2);
        
        // Exit animation
        tl.to(mesh.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.4,
            ease: "power2.in"
        }, (duration / 1000) - 0.5);
        
        tl.to(mesh.material, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, (duration / 1000) - 0.4);
        
        // Remove after animation
        setTimeout(() => {
            this.scene.remove(mesh);
            if (mesh.material.map) mesh.material.map.dispose();
            mesh.material.dispose();
            mesh.geometry.dispose();
        }, duration);
        
        return mesh;
    }

    // Helper function for rounded rectangles (cross-browser compatibility)
    roundRect(ctx, x, y, width, height, radius) {
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, width, height, radius);
        } else {
            // Fallback for browsers that don't support roundRect
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
    }

    // Enhanced navigation with floating info
    enhanceNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const section = event.target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (section) {
                    // Show floating text for navigation
                    this.showNavigationFloatingText(this.getSectionDisplayName(section));
                    this.focusOnSection(section);
                }
            });
        });
    }
    
    getSectionDisplayName(section) {
        const sectionNames = {
            'about': 'About Me - Data Professional',
            'skills': 'Technical Skills & Expertise',
            'projects': '17 Interactive Projects',
            'journey': 'Professional Journey',
            'contact': 'Contact Information'
        };
        return sectionNames[section] || section;
    }
    
    showNavigationFloatingText(text) {
        // Create enhanced floating text in the center of the screen
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 900;
        canvas.height = 250;
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create enhanced gradient background
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.95)');
        gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(118, 75, 162, 0.95)');
        
        // Draw enhanced background with rounded corners
        context.fillStyle = gradient;
        this.roundRect(context, 20, 20, canvas.width - 40, canvas.height - 40, 30);
        context.fill();
        
        // Draw glowing border
        context.strokeStyle = '#ffffff';
        context.lineWidth = 6;
        context.shadowColor = 'rgba(255, 255, 255, 0.5)';
        context.shadowBlur = 15;
        this.roundRect(context, 20, 20, canvas.width - 40, canvas.height - 40, 30);
        context.stroke();
        
        // Reset shadow for text
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        
        // Draw main text with enhanced styling
        context.fillStyle = '#ffffff';
        context.font = 'bold 42px "Poppins", Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Add text shadow
        context.shadowColor = 'rgba(0, 0, 0, 0.7)';
        context.shadowBlur = 8;
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Add subtitle glow effect
        context.shadowColor = 'rgba(0, 212, 255, 0.8)';
        context.shadowBlur = 20;
        context.font = 'normal 24px "Poppins", Arial, sans-serif';
        context.fillText('🚀 Navigate Through My 3D World', canvas.width / 2, canvas.height / 2 + 60);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        const geometry = new THREE.PlaneGeometry(25, 7);
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position in front of camera with better positioning
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        mesh.position.copy(this.camera.position).add(cameraDirection.multiplyScalar(18));
        mesh.lookAt(this.camera.position);
        
        // Add to scene
        this.scene.add(mesh);
        
        // Enhanced animation sequence
        const tl = gsap.timeline();
        
        // Initial state
        mesh.scale.set(0, 0, 0);
        mesh.material.opacity = 0;
        mesh.rotation.z = Math.PI * 0.1;
        
        // Entry animation
        tl.to(mesh.scale, {
            x: 1, y: 1, z: 1,
            duration: 1,
            ease: "elastic.out(1, 0.4)"
        });
        
        tl.to(mesh.material, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out"
        }, 0);
        
        tl.to(mesh.rotation, {
            z: 0,
            duration: 1.2,
            ease: "power3.out"
        }, 0);
        
        // Floating motion
        tl.to(mesh.position, {
            y: mesh.position.y + 1,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        }, 0.5);
        
        // Exit animation
        tl.to(mesh.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.8,
            ease: "power3.in"
        }, 3.5);
        
        tl.to(mesh.material, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.in"
        }, 3.3);
        
        // Remove after animation
        setTimeout(() => {
            this.scene.remove(mesh);
            geometry.dispose();
            material.dispose();
            texture.dispose();
        }, 5000);
    }

    setupCanvas() {
        // Add roundRect polyfill for older browsers
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                if (typeof radius === 'number') {
                    radius = { tl: radius, tr: radius, br: radius, bl: radius };
                } else {
                    radius = { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
                }
                
                this.beginPath();
                this.moveTo(x + radius.tl, y);
                this.lineTo(x + width - radius.tr, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                this.lineTo(x + width, y + height - radius.br);
                this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                this.lineTo(x + radius.bl, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                this.lineTo(x, y + radius.tl);
                this.quadraticCurveTo(x, y, x + radius.tl, y);
                this.closePath();
            };
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value = elapsedTime;
            this.particleSystem.rotation.y = elapsedTime * 0.05;
            
            // Update particle positions
            const positions = this.particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += this.particleVelocities[i];
                positions[i + 1] += this.particleVelocities[i + 1];
                positions[i + 2] += this.particleVelocities[i + 2];
                
                // Reset particles that go too far
                if (Math.abs(positions[i]) > 100) positions[i] = -positions[i];
                if (Math.abs(positions[i + 1]) > 100) positions[i + 1] = -positions[i + 1];
                if (Math.abs(positions[i + 2]) > 100) positions[i + 2] = -positions[i + 2];
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Animate objects with enhanced smoothness
        this.objects.forEach((obj, index) => {
            if (obj.userData.type === 'skill') {
                obj.rotation.y += 0.01;
                obj.position.y += Math.sin(elapsedTime * 2 + index) * 0.01;
            } else if (obj.userData.type === 'project') {
                obj.rotation.y += 0.02;
                obj.position.y += Math.cos(elapsedTime * 1.5 + index) * 0.015;
            } else if (obj.userData.type === 'journey') {
                obj.rotation.y += 0.015;
                obj.position.y += Math.sin(elapsedTime * 1.2 + index) * 0.02;
            } else if (obj.userData.type === 'info' || obj.userData.type === 'contact-method') {
                // Orbital motion
                if (obj.userData.orbitAngle !== undefined) {
                    obj.userData.orbitAngle += obj.userData.orbitSpeed;
                    const center = obj.userData.orbitCenter || new THREE.Vector3(0, 12, 0);
                    obj.position.x = center.x + Math.cos(obj.userData.orbitAngle) * obj.userData.orbitRadius;
                    obj.position.z = center.z + Math.sin(obj.userData.orbitAngle) * obj.userData.orbitRadius;
                }
            } else if (obj.userData.type === 'skill-particle') {
                obj.position.y += Math.sin(elapsedTime * 3 + index) * obj.userData.floatSpeed;
                obj.rotation.x += 0.05;
                obj.rotation.z += 0.03;
            } else if (obj.userData.type === 'journey-text') {
                obj.rotation.z += obj.userData.rotationSpeed;
            } else if (obj.userData.type === 'project-counter') {
                // Gentle floating animation for project counter
                obj.position.y = obj.userData.originalY + Math.sin(elapsedTime * 1.5) * 0.5;
                obj.rotation.y += 0.01;
            } else if (obj.userData.type === 'profile' || obj.userData.type === 'profile-fallback' || obj.userData.type === 'profile-visible' || obj.userData.type === 'profile-placeholder') {
                // Enhanced floating animation for all profile elements
                if (obj.userData.originalY !== undefined) {
                    obj.position.y = obj.userData.originalY + Math.sin(elapsedTime * obj.userData.floatSpeed * 100) * 0.3;
                    if (obj.userData.rotationSpeed) {
                        obj.rotation.y += obj.userData.rotationSpeed;
                    }
                    
                    // Subtle breathing effect
                    const breathScale = 1 + Math.sin(elapsedTime * 2) * 0.02;
                    obj.scale.set(breathScale, breathScale, breathScale);
                } else {
                    // For elements without originalY, add gentle floating
                    obj.position.y += Math.sin(elapsedTime * 1.5) * 0.005;
                }
            } else if (obj.userData.type === 'profile-glow') {
                // Gentle rotation and pulsing for glow
                obj.rotation.z += obj.userData.rotationSpeed;
                const glowPulse = 1 + Math.sin(elapsedTime * 3) * 0.1;
                obj.scale.set(glowPulse, glowPulse, glowPulse);
                
                // Update glow opacity
                obj.children.forEach(child => {
                    if (child.material) {
                        const baseOpacity = child.material.userData.baseOpacity || child.material.opacity;
                        child.material.userData.baseOpacity = baseOpacity;
                        child.material.opacity = baseOpacity * (0.8 + Math.sin(elapsedTime * 4) * 0.2);
                    }
                });
            } else if (obj.userData.type === 'profile-wireframe') {
                obj.rotation.y += obj.userData.rotationSpeed;
                obj.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
            } else if (obj.userData.type === 'profile-particle') {
                // Enhanced orbital motion for profile particles
                if (obj.userData.orbitAngle !== undefined) {
                    obj.userData.orbitAngle += obj.userData.orbitSpeed;
                    const center = obj.userData.orbitCenter;
                    const verticalMotion = Math.sin(elapsedTime * obj.userData.verticalSpeed * 100) * obj.userData.verticalOffset;
                    
                    obj.position.x = center.x + Math.cos(obj.userData.orbitAngle) * obj.userData.orbitRadius;
                    obj.position.y = center.y + verticalMotion;
                    obj.position.z = center.z + Math.sin(obj.userData.orbitAngle) * obj.userData.orbitRadius;
                    
                    // Particle rotation
                    obj.rotation.x += 0.02;
                    obj.rotation.y += 0.03;
                    
                    // Twinkling effect
                    if (obj.material) {
                        obj.material.opacity = 0.6 + Math.sin(elapsedTime * 10 + index) * 0.3;
                    }
                }
            }
        });

        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    showContactConfirmation(contactData) {
        // Create confirmation dialog overlay
        const confirmationOverlay = document.createElement('div');
        confirmationOverlay.id = 'contact-confirmation';
        confirmationOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        const confirmationBox = document.createElement('div');
        confirmationBox.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #00d4ff;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            color: white;
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.3);
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            min-width: 300px;
        `;

        // Add CSS animation for the dialog
        if (!document.getElementById('confirmation-styles')) {
            const style = document.createElement('style');
            style.id = 'confirmation-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: scale(0.7) translateY(-50px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        confirmationBox.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">${this.getContactIcon(contactData.title)}</div>
            <h3 style="margin: 0 0 10px 0; color: #00d4ff;">Connect via ${contactData.title}</h3>
            <p style="margin: 0 0 20px 0; color: #ccc; font-size: 0.9em;">
                ${this.getContactDescription(contactData.title)}
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="confirm-contact" style="
                    background: linear-gradient(45deg, #00d4ff, #0099cc);
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
                ">Yes, Connect</button>
                <button id="cancel-contact" style="
                    background: linear-gradient(45deg, #666, #444);
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        confirmationOverlay.appendChild(confirmationBox);
        document.body.appendChild(confirmationOverlay);

        // Add hover effects
        const confirmBtn = confirmationBox.querySelector('#confirm-contact');
        const cancelBtn = confirmationBox.querySelector('#cancel-contact');

        confirmBtn.addEventListener('mouseenter', () => {
            confirmBtn.style.transform = 'scale(1.05)';
            confirmBtn.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.6)';
        });

        confirmBtn.addEventListener('mouseleave', () => {
            confirmBtn.style.transform = 'scale(1)';
            confirmBtn.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.4)';
        });

        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.transform = 'scale(1.05)';
        });

        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.transform = 'scale(1)';
        });

        // Handle confirmation
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(confirmationOverlay);
            if (contactData.url) {
                window.open(contactData.url, '_blank');
                this.showFloatingText(`Opening ${contactData.title}...`, this.camera.position);
            }
        });

        // Handle cancellation
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(confirmationOverlay);
            this.showFloatingText('Contact cancelled', this.camera.position);
        });

        // Handle clicking outside the dialog
        confirmationOverlay.addEventListener('click', (e) => {
            if (e.target === confirmationOverlay) {
                document.body.removeChild(confirmationOverlay);
                this.showFloatingText('Contact cancelled', this.camera.position);
            }
        });

        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(confirmationOverlay);
                this.showFloatingText('Contact cancelled', this.camera.position);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    getContactIcon(contactType) {
        const icons = {
            'Email': '📧',
            'LinkedIn': '💼', 
            'GitHub': '🐙',
            'WhatsApp': '📱'
        };
        return icons[contactType] || '📞';
    }

    getContactDescription(contactType) {
        const descriptions = {
            'Email': 'Open your email client to send me a message',
            'LinkedIn': 'Visit my LinkedIn profile to connect professionally',
            'GitHub': 'Check out my code repositories and projects',
            'WhatsApp': 'Send me a message on WhatsApp'
        };
        return descriptions[contactType] || 'Open this contact method';
    }

    // Secondary method to ensure photo visibility
    createVisibleProfilePhoto() {
        console.log('🔄 Creating visible profile photo with alternative method...');
        
        // Create photo with plane geometry for better visibility
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'photos/abk.png',
            (texture) => {
                console.log('✅ Secondary photo method: Profile photo loaded');
                
                // Use plane geometry for guaranteed visibility
                const photoGeometry = new THREE.PlaneGeometry(5, 5);
                const photoMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    opacity: 1.0
                });
                
                const photo = new THREE.Mesh(photoGeometry, photoMaterial);
                photo.position.set(0, 18, 0);
                photo.userData = {
                    type: 'profile-visible',
                    title: 'Mohammed Saqhib - Profile Photo',
                    description: 'Visible profile photo using plane geometry'
                };
                
                // Add bright border for visibility testing
                const borderGeometry = new THREE.PlaneGeometry(5.2, 5.2);
                const borderMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00d4ff,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                const border = new THREE.Mesh(borderGeometry, borderMaterial);
                border.position.set(0, 18, -0.1);
                
                this.scene.add(photo);
                this.scene.add(border);
                this.objects.push(photo);
                this.objects.push(border);
                
                console.log('✅ Visible profile photo created and added to scene');
            },
            undefined,
            (error) => {
                console.error('❌ Secondary photo method also failed:', error);
                // Create a text placeholder
                this.createProfileTextPlaceholder();
            }
        );
    }

    createProfileTextPlaceholder() {
        console.log('📝 Creating text placeholder for profile');
        
        // Create text canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // Draw background
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(0, 0, 512, 512);
        
        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('MOHAMMED', 256, 200);
        ctx.fillText('SAQHIB', 256, 280);
        ctx.font = '24px Arial';
        ctx.fillText('Data Professional', 256, 320);
        
        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(5, 5);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const placeholder = new THREE.Mesh(geometry, material);
        placeholder.position.set(0, 18, 0);
        placeholder.userData = {
            type: 'profile-placeholder',
            title: 'Mohammed Saqhib - Text Placeholder'
        };
        
        this.scene.add(placeholder);
        this.objects.push(placeholder);
        
        console.log('✅ Text placeholder created');
    }

    // Enhanced project information display
    displayProjectsOverview() {
        const projectCategories = {
            'AI & NLP': ['AI CSV Dashboard Generator', 'TTS Phoneme Model', 'Facial Recognition Attendance System', 'Hill Climb Gesture Controller'],
            'Data Science': ['Automatically-fill-a-Google-form', 'Carpooling Simulation System', 'Indian Contact Scraper', 'Formula1 DataHub'],
            'Web Development': ['BookStoreApp', 'Portfolio Website', 'Kritya Fashion Demo', 'Kritya Fashion', 'Netflix Household Verify', 'Aeginix'],
            'Machine Learning': ['Advanced Stock Prediction Dashboard', 'Fraud Detection System'],
            'Programming': ["100 Day's of Python Coding"]
        };

        console.log('📊 Projects Overview:');
        Object.entries(projectCategories).forEach(([category, projects]) => {
            console.log(`${category}: ${projects.length} projects`);
            projects.forEach(project => console.log(`  - ${project}`));
        });

        // Show total count
        const totalProjects = Object.values(projectCategories).flat().length;
        console.log(`🎯 Total Projects: ${totalProjects}`);
    }
}

// Global functions for navigation
function focusOnSection(section) {
    if (window.ultimatePortfolio3D) {
        window.ultimatePortfolio3D.focusOnSection(section);
    }
}

function focusOnSectionWithInfo(section) {
    if (window.ultimatePortfolio3D) {
        window.ultimatePortfolio3D.focusOnSection(section);
        
        // Show section info in floating text and info panel
        const sectionInfo = {
            'about': {
                title: 'About Me',
                description: 'Aspiring Data Professional based in Bengaluru with expertise in Data Engineering, Analytics, Machine Learning, and Data Science. Currently pursuing internships and building real-world projects.',
                type: 'section'
            },
            'skills': {
                title: 'Technical Skills',
                description: 'Comprehensive expertise in Python, SQL, Machine Learning, Data Science, Power BI, Tableau, and cloud technologies. 11+ core technical skills with hands-on experience.',
                type: 'section'
            },
            'projects': {
                title: 'Projects Portfolio - 17 Interactive Projects',
                description: 'Comprehensive collection of 17+ interactive projects spanning Data Science, Machine Learning, AI & NLP, and Web Development. Each project demonstrates real-world problem-solving skills with detailed descriptions, tech stacks, and GitHub repositories. Categories include: AI & NLP (4 projects), Data Science (4 projects), Machine Learning (2 projects), Web Development (5 projects), and Programming (2 projects). All projects feature modern technologies like Python, JavaScript, React, Machine Learning libraries, and more.',
                type: 'section'
            },
            'journey': {
                title: 'Professional Journey',
                description: 'Career progression through 4 internships in Data Science, Machine Learning, and Analytics. Based in Bengaluru, Karnataka, India.',
                type: 'section'
            },
            'contact': {
                title: 'Connect With Me',
                description: 'Get in touch for collaboration opportunities. Available via Email, LinkedIn, GitHub, and WhatsApp. Located in Bengaluru, Karnataka, India.',
                type: 'section'
            }
        };
        
        const info = sectionInfo[section];
        if (info) {
            window.ultimatePortfolio3D.showInfoPanel(info);
            // Also show floating text
            const targetPosition = getTargetPosition(section);
            window.ultimatePortfolio3D.createFloatingText(info.title, targetPosition, 3000);
        }
    }
}

function getTargetPosition(section) {
    switch (section) {
        case 'about': return new THREE.Vector3(0, 15, 0);
        case 'skills': return new THREE.Vector3(-30, 15, -15);
        case 'projects': return new THREE.Vector3(30, 15, -15);
        case 'journey': return new THREE.Vector3(0, 20, -40);
        case 'contact': return new THREE.Vector3(0, 15, 35);
        default: return new THREE.Vector3(0, 15, 0);
    }
}

function closeProjectCard() {
    if (window.ultimatePortfolio3D) {
        window.ultimatePortfolio3D.closeProjectCard();
    }
}

// Initialize the ultimate portfolio
window.ultimatePortfolio3D = new UltimatePortfolio3D();

// Enhanced navigation with floating info
window.ultimatePortfolio3D.enhanceNavigation();
window.ultimatePortfolio3D.enhanceNavigation();
